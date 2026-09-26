import { useSyncExternalStore } from 'react';
import { Capacitor } from '@capacitor/core';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { prefsStore } from '../store/prefs';
import { app } from '../store/app';
import { markFirstRunDone } from './storage';

/**
 * Auth + profile layer. Come Home stays local-first: signing in with Google is
 * optional and additive. When signed out we surface a local guest so every screen
 * keeps working; when signed in we mirror the account's display name into prefs so
 * the rest of the app (which reads prefs.name) needs no changes.
 *
 * Backend: a Postgres trigger (handle_new_user) creates the public.profiles row on
 * signup, so there's no client-side insert on the happy path — we only read/update.
 */

/** The public.profiles row (backend user record). */
export type Profile = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  onboarded: boolean;
};

/** What screens consume — a signed-in account or a local guest. */
export type AuthUser = {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  onboarded: boolean;
  isGuest: boolean;
};

const GUEST: AuthUser = { id: 'local-guest', name: '', email: null, avatarUrl: null, onboarded: true, isGuest: true };

type AuthState = { user: AuthUser; loading: boolean; recoveringPassword: boolean };

let session: Session | null = null;
let profile: Profile | null = null;
let recoveringPassword = false;
// Stable snapshot for useSyncExternalStore — recomputed only on real changes.
let snapshot: AuthState = { user: GUEST, loading: isSupabaseConfigured, recoveringPassword };

const listeners = new Set<() => void>();

function recompute(loading: boolean) {
  const user: AuthUser = session
    ? {
        id: session.user.id,
        name: profile?.display_name ?? metaName(session) ?? '',
        email: profile?.email ?? session.user.email ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        onboarded: profile?.onboarded ?? false,
        isGuest: false,
      }
    : GUEST;
  snapshot = { user, loading, recoveringPassword };
  // Bridge the signed-in name into local prefs so existing screens show it.
  if (user.name && user.name !== prefsStore.get().name) prefsStore.setName(user.name);
  listeners.forEach((l) => l());
}

function metaName(s: Session): string | null {
  const m = s.user.user_metadata ?? {};
  return (m.full_name as string) ?? (m.name as string) ?? null;
}

async function loadProfile(userId: string): Promise<void> {
  const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
  if (data) {
    profile = data as Profile;
    return;
  }
  // Fallback for accounts created before the signup trigger existed: create the row
  // client-side (RLS allows own insert). New Google signups never hit this.
  const s = session;
  if (!s) return;
  const row = {
    user_id: userId,
    display_name: metaName(s),
    avatar_url: (s.user.user_metadata?.avatar_url as string) ?? null,
    email: s.user.email ?? null,
  };
  const { data: created } = await supabase.from('profiles').insert(row).select('*').maybeSingle();
  profile = (created as Profile) ?? { ...row, onboarded: false };
}

// One-time boot: hydrate the session, then track changes.
let started = false;
function start() {
  if (started) return;
  started = true;
  if (!isSupabaseConfigured) {
    recompute(false);
    return;
  }
  supabase.auth.getSession().then(async ({ data }) => {
    session = data.session;
    if (session) await loadProfile(session.user.id);
    routeInIfSignedIn();
    recompute(false);
  });
  supabase.auth.onAuthStateChange((event, s) => {
    session = s;
    if (event === 'PASSWORD_RECOVERY') recoveringPassword = true;
    profile = s ? profile : null;
    // Supabase advises keeping this callback synchronous. Defer profile queries so
    // they cannot contend with the auth client's internal session lock.
    window.setTimeout(() => {
      void (async () => {
        if (s && session?.user.id === s.user.id) await loadProfile(s.user.id);
        if (session !== s) return;
        if (!recoveringPassword) routeInIfSignedIn();
        recompute(false);
      })();
    }, 0);
  });
}
start();

// A signed-in user must never be stranded on the login screen (e.g. after the
// Google redirect returns, or if a persisted session outlived the first-run flag).
function routeInIfSignedIn() {
  if (session && app.view === 'first-run') {
    markFirstRunDone();
    app.setView('hub');
  }
}

// ---- actions ----

export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Backend not configured');
  // Web: full-page redirect back to the app origin. Native (Capacitor) needs a deep
  // link back into the app — see STUBBED.md §Google auth (native seam).
  const redirectTo = Capacitor.isNativePlatform()
    ? 'com.comehome.app://auth-callback'
    : window.location.origin;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, queryParams: { prompt: 'select_account' } },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) throw error;
}

/**
 * Manual sign-up (email + password). The name is stored in user metadata so the
 * handle_new_user trigger writes it into profiles.display_name. Returns
 * needsConfirmation=true when the project has email confirmation on (no session
 * yet) — the caller then asks the user to confirm before logging in.
 */
export async function signUpWithEmail(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ needsConfirmation: boolean }> {
  const fullName = [input.firstName, input.lastName].map((s) => s.trim()).filter(Boolean).join(' ');
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { full_name: fullName, first_name: input.firstName.trim(), last_name: input.lastName.trim() },
    },
  });
  if (error) throw error;
  return { needsConfirmation: !data.session };
}

/** Manual log-in (email + password). onAuthStateChange handles the session. */
export async function signInWithEmail(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

/** Send a recovery link back to this exact deployment (preview or production). */
export async function requestPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
}

/** Complete a recovery session created by the emailed Supabase link. */
export async function updateRecoveredPassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  recoveringPassword = false;
  routeInIfSignedIn();
  recompute(false);
}

/** Permanently remove the signed-in account through the authenticated Edge Function. */
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.functions.invoke('delete-account', { body: {} });
  if (error) throw error;
  recoveringPassword = false;
  session = null;
  profile = null;
  await supabase.auth.signOut({ scope: 'local' });
  recompute(false);
}

// ---- reactive read ----

export function useAuth(): AuthState {
  return useSyncExternalStore(
    subscribeAuth,
    () => snapshot,
    () => snapshot,
  );
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Non-reactive snapshot (for the documented authSeam). */
export function getAuthUser(): AuthUser {
  return snapshot.user;
}

export function getAuthState(): AuthState {
  return snapshot;
}

/**
 * Legacy Supabase session hook kept for the previous seam's shape. Prefer useAuth().
 */
export function useSession(): { session: Session | null; loading: boolean } {
  const { loading } = useAuth();
  return { session, loading };
}
