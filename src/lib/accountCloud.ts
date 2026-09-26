import { useSyncExternalStore } from 'react';
import { get, set } from 'idb-keyval';
import { supabase } from './supabase';
import { getAuthState, getAuthUser, subscribeAuth } from './auth';
import { createAccountIdentityTracker } from './accountIdentity';
import { getJournal, replaceJournal, type JournalEntry, type ProgrammeProgress } from './storage';
import { getJourneySnapshot, hydrateJourney, type JourneyData } from '../manifestation/journeyStore';
import { getProgrammeProgress, hydrateProgrammeProgress } from '../store/programme';
import { getFavorites, hydrateFavorites } from '../store/favorites';

type AccountRow = {
  user_id: string;
  manifestation: unknown;
  programme_progress: unknown;
  favorites: unknown;
  journal: unknown;
  updated_at: string;
};

export type CloudPhase = 'signed-out' | 'off' | 'syncing' | 'saved' | 'error';
export type CloudSnapshot = { phase: CloudPhase; enabled: boolean; message: string; updatedAt: string | null };

const ENABLED_PREFIX = 'come-home:account-cloud:v1:';
const ACTIVE_ACCOUNT_KEY = 'come-home:active-cloud-account:v1';
const GUEST_SNAPSHOT_KEY = 'come-home:guest-device-snapshot:v1';
let snapshot: CloudSnapshot = { phase: 'signed-out', enabled: false, message: 'Sign in to save across devices.', updatedAt: null };
const listeners = new Set<() => void>();
let started = false;
let applying = false;
let timer: number | undefined;

const emit = (next: CloudSnapshot) => { snapshot = next; listeners.forEach(listener => listener()); };
const enabledKey = (userId: string) => `${ENABLED_PREFIX}${userId}`;
export const isAccountCloudEnabled = (userId: string): boolean => localStorage.getItem(enabledKey(userId)) === '1';

function validJourney(value: unknown): JourneyData {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const answers = raw.answers && typeof raw.answers === 'object'
    ? Object.fromEntries(Object.entries(raw.answers as Record<string, unknown>).filter(([, answer]) => typeof answer === 'string')) as Record<string, string>
    : {};
  return {
    goal: typeof raw.goal === 'string' ? raw.goal : '',
    why: typeof raw.why === 'string' ? raw.why : '',
    answers,
    completed: Array.isArray(raw.completed) ? [...new Set(raw.completed.filter(day => Number.isInteger(day) && Number(day) >= 0 && Number(day) < 7) as number[])] : [],
  };
}

function validProgrammes(value: unknown): ProgrammeProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).flatMap(([key, days]) =>
    Array.isArray(days) ? [[key, [...new Set(days.filter(day => Number.isInteger(day) && Number(day) >= 0) as number[])] as number[]]] : [],
  ));
}

function validFavorites(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string') as string[])] : [];
}

function validJournal(value: unknown): JournalEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!item || typeof item !== 'object') return [];
    const entry = item as Record<string, unknown>;
    if (typeof entry.id !== 'string' || typeof entry.ts !== 'number' || typeof entry.text !== 'string') return [];
    return [{ id: entry.id, ts: entry.ts, text: entry.text, ...(typeof entry.prompt === 'string' ? { prompt: entry.prompt } : {}) }];
  }).sort((a, b) => b.ts - a.ts).slice(0, 500);
}

async function localPayload(userId: string) {
  return {
    user_id: userId,
    manifestation: getJourneySnapshot(),
    programme_progress: getProgrammeProgress(),
    favorites: getFavorites(),
    journal: await getJournal(),
  };
}

type DeviceSnapshot = Omit<Awaited<ReturnType<typeof localPayload>>, 'user_id'>;

async function captureGuest(): Promise<void> {
  const { user_id: _userId, ...device } = await localPayload('guest');
  await set(GUEST_SNAPSHOT_KEY, device);
}

async function restoreGuest(): Promise<void> {
  const guest = await get<DeviceSnapshot>(GUEST_SNAPSHOT_KEY);
  if (!guest) return;
  applying = true;
  try {
    hydrateJourney(validJourney(guest.manifestation));
    hydrateProgrammeProgress(validProgrammes(guest.programme_progress));
    hydrateFavorites(validFavorites(guest.favorites));
    await replaceJournal(validJournal(guest.journal));
  } finally { applying = false; }
}

async function pushLocal(userId: string): Promise<void> {
  const { data, error } = await supabase.from('account_app_state').upsert(await localPayload(userId), { onConflict: 'user_id' }).select('updated_at').single();
  if (error) throw error;
  emit({ phase: 'saved', enabled: true, message: 'Saved privately to your account.', updatedAt: data.updated_at as string });
}

async function applyRow(row: AccountRow): Promise<void> {
  applying = true;
  try {
    hydrateJourney(validJourney(row.manifestation));
    hydrateProgrammeProgress(validProgrammes(row.programme_progress));
    hydrateFavorites(validFavorites(row.favorites));
    await replaceJournal(validJournal(row.journal));
  } finally {
    applying = false;
  }
}

async function pullCloud(userId: string, createIfMissing: boolean): Promise<void> {
  emit({ phase: 'syncing', enabled: true, message: 'Syncing your private account…', updatedAt: snapshot.updatedAt });
  const { data, error } = await supabase.from('account_app_state').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data) {
    if (createIfMissing) {
      await pushLocal(userId);
      await (await import('../manifestation/visionBoardStore')).syncVisionBoard('device');
      return;
    }
    emit({ phase: 'off', enabled: false, message: 'No cloud copy exists yet.', updatedAt: null });
    return;
  }
  await applyRow(data as AccountRow);
  await (await import('../manifestation/visionBoardStore')).syncVisionBoard('cloud');
  emit({ phase: 'saved', enabled: true, message: 'This device is using your private cloud copy.', updatedAt: (data as AccountRow).updated_at });
}

async function handleAuth(): Promise<void> {
  const user = getAuthUser();
  if (timer) window.clearTimeout(timer);
  const activeAccount = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  if (user.isGuest) {
    if (activeAccount) {
      await restoreGuest();
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    }
    emit({ phase: 'signed-out', enabled: false, message: 'Sign in to save across devices.', updatedAt: null });
    return;
  }
  if (activeAccount && activeAccount !== user.id) {
    await restoreGuest();
    localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  }
  if (!isAccountCloudEnabled(user.id)) {
    emit({ phase: 'off', enabled: false, message: 'Cloud saving is ready when you choose it.', updatedAt: null });
    return;
  }
  try {
    if (activeAccount !== user.id) await captureGuest();
    await pullCloud(user.id, true);
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, user.id);
  }
  catch { emit({ phase: 'error', enabled: true, message: 'Cloud sync could not connect. Your device copy is still safe.', updatedAt: snapshot.updatedAt }); }
}

export function startAccountCloud(): void {
  if (started) return;
  started = true;
  const identityChanged = createAccountIdentityTracker();
  const onAuth = () => {
    if (identityChanged(getAuthState())) void handleAuth();
  };
  subscribeAuth(onAuth);
  window.addEventListener('come-home:cloud-data-changed', queueAccountCloudSave);
  onAuth();
}

export async function enableAccountCloud(mode: 'cloud' | 'device'): Promise<void> {
  const user = getAuthUser();
  if (user.isGuest) throw new Error('Sign in first');
  localStorage.setItem(enabledKey(user.id), '1');
  if (localStorage.getItem(ACTIVE_ACCOUNT_KEY) !== user.id) await captureGuest();
  emit({ phase: 'syncing', enabled: true, message: mode === 'cloud' ? 'Opening your cloud copy…' : 'Saving this device to your account…', updatedAt: snapshot.updatedAt });
  try {
    if (mode === 'device') {
      await pushLocal(user.id);
      await (await import('../manifestation/visionBoardStore')).syncVisionBoard('device');
    }
    else await pullCloud(user.id, true);
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, user.id);
  } catch (error) {
    emit({ phase: 'error', enabled: true, message: 'Cloud saving could not start. Your device copy is unchanged.', updatedAt: snapshot.updatedAt });
    throw error;
  }
}

export async function disableAccountCloud(): Promise<void> {
  const user = getAuthUser();
  if (!user.isGuest) localStorage.removeItem(enabledKey(user.id));
  if (timer) window.clearTimeout(timer);
  await restoreGuest();
  localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
  emit({ phase: user.isGuest ? 'signed-out' : 'off', enabled: false, message: 'Cloud saving is off on this device.', updatedAt: null });
}

export async function refreshAccountCloud(): Promise<void> {
  const user = getAuthUser();
  if (user.isGuest || !isAccountCloudEnabled(user.id) || localStorage.getItem(ACTIVE_ACCOUNT_KEY) !== user.id) return;
  try { await pullCloud(user.id, true); }
  catch (error) {
    emit({ phase: 'error', enabled: true, message: 'Could not refresh. Your device copy is still safe.', updatedAt: snapshot.updatedAt });
    throw error;
  }
}

export function queueAccountCloudSave(): void {
  if (applying) return;
  const user = getAuthUser();
  if (user.isGuest || !isAccountCloudEnabled(user.id)) return;
  if (timer) window.clearTimeout(timer);
  emit({ phase: 'syncing', enabled: true, message: 'Saving your changes…', updatedAt: snapshot.updatedAt });
  timer = window.setTimeout(() => {
    void pushLocal(user.id).catch(() => emit({ phase: 'error', enabled: true, message: 'Could not save right now. Your device copy is still safe.', updatedAt: snapshot.updatedAt }));
  }, 700);
}

export function useAccountCloud(): CloudSnapshot {
  return useSyncExternalStore(
    listener => (listeners.add(listener), () => listeners.delete(listener)),
    () => snapshot,
    () => snapshot,
  );
}
