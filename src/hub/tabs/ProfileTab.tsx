import { useEffect, useState } from 'react';
import { Heart, PenLine, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import Reveal from '../../ui/Reveal';
import ReflectionTrail from '../../journey/ReflectionTrail';
import { openSanctuary } from '../../sanctuary/Sanctuary';
import { openJournal } from '../../journal/Journal';
import { usePrefs, prefsStore } from '../../store/prefs';
import { deleteAccount, requestPasswordReset, signInWithGoogle, signOut, useAuth } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';
import GoogleButton from '../../ui/GoogleButton';
import { reminders } from '../../lib/reminders';
import { getHistory, getReflections, getJournal, getPresence, type HistoryEntry, type Reflection, type JournalEntry, type Theme } from '../../lib/storage';
import { programme, useProgrammeProgress } from '../../store/programme';
import { PROGRAMMES, type Programme } from '../../data/programmes';
import JourneyProgress from '../../manifestation/JourneyProgress';
import Plans from '../../membership/Plans';
import JourneyExport from '../JourneyExport';
import { app } from '../../store/app';
import InformationLinks from '../../information/InformationLinks';
import { disableAccountCloud, enableAccountCloud, refreshAccountCloud, useAccountCloud } from '../../lib/accountCloud';

/** A calm overview first. Detail stays one tap away in clearly named sections. */
export default function ProfileTab() {
  const prefs = usePrefs();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [presence, setPresence] = useState<string[]>([]);
  const [reminderDenied, setReminderDenied] = useState(false);
  useProgrammeProgress();

  useEffect(() => {
    getHistory().then(setHistory);
    getReflections().then(setReflections);
    getJournal().then(setJournal);
    getPresence().then(setPresence);
  }, []);

  const toggleReminder = async () => {
    if (!prefs.reminder.enabled) {
      const ok = await reminders.requestPermission();
      if (!ok) return setReminderDenied(true);
      setReminderDenied(false);
    }
    prefsStore.setReminder({ enabled: !prefs.reminder.enabled, time: prefs.reminder.time });
  };

  return (
    <div className="screen">
      <div className="mx-auto w-full max-w-md pt-6 pb-10">
        <Reveal delay={0.04}>
          <div className="eyebrow">You</div>
          <h1 className="serif" style={{ fontSize: 'var(--t-2xl)', marginTop: 8 }}>Your space</h1>
          <p style={{ color: 'var(--ink-muted)', marginTop: 8, lineHeight: 1.55 }}>
            {user.isGuest ? 'Your practice is saved on this device.' : `Welcome, ${user.name?.split(' ')[0] || 'back'}. Your account and journey are here.`}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <QuickAction icon={<PenLine size={19} />} title="Journal" detail={journal[0] ? `Last written ${new Date(journal[0].ts).toLocaleDateString()}` : 'Write freely'} onClick={openJournal} />
            <QuickAction icon={<Heart size={19} fill="currentColor" />} title="Sanctuary" detail="Saved practices" onClick={openSanctuary} />
          </div>
        </Reveal>

        <div className="mt-6 flex flex-col gap-3">
          <ProfileSection title="My progress" subtitle="Manifestation and monthly reflection">
            <JourneyProgress />
            <div className="mt-5"><ReflectionTrail history={history} reflections={reflections} journal={journal} presence={presence} /></div>
          </ProfileSection>

          <ProfileSection title="My journeys" subtitle="Meditation programmes at your pace">
            <div className="grid grid-cols-2 gap-3">{PROGRAMMES.map(p => <ProgrammeCard key={p.id} p={p} />)}</div>
          </ProfileSection>

          <ProfileSection title="Preferences" subtitle="Reminder, atmosphere and starting path" icon={<SlidersHorizontal size={17} />}>
            <div className="glass" style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
              <Row label="Gentle daily reminder" last={!prefs.reminder.enabled}><Switch on={prefs.reminder.enabled} label="Daily reminder" onToggle={toggleReminder} /></Row>
              {prefs.reminder.enabled && <Row label="Around"><input type="time" aria-label="Reminder time" value={prefs.reminder.time} onChange={e => prefsStore.setReminder({ enabled: true, time: e.target.value })} className="glass px-3 py-2" style={{ color: 'var(--ink)', colorScheme: 'dark', borderRadius: 10 }} /></Row>}
              <Row label="Atmosphere" last><ThemeChoice value={prefs.theme} onChange={prefsStore.setTheme} /></Row>
            </div>
            <p className="journey-muted">{reminderDenied ? 'Notifications are off in your device settings.' : 'A gentle invitation, never a streak or pressure.'}</p>
            <button className="journey-button" onClick={() => app.setView('onboarding')}>Change my starting path</button>
          </ProfileSection>

          <ProfileSection title="Plans and access" subtitle="What is included in Free and COME HOME+"><Plans /></ProfileSection>
          <ProfileSection title="Help & information" subtitle="Help, privacy and terms"><InformationLinks /></ProfileSection>

          <ProfileSection title="Privacy and account" subtitle="Cloud saving, export and account controls" icon={<ShieldCheck size={17} />}>
            <JourneyExport />
            <AccountSection />
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, title, detail, onClick }: { icon: React.ReactNode; title: string; detail: string; onClick: () => void }) {
  return <button onClick={onClick} className="glass px-4 py-4 text-left" style={{ borderRadius: 'var(--radius-card)', minHeight: 118 }}>
    <span style={{ color: 'var(--gold)' }}>{icon}</span>
    <span className="serif" style={{ display: 'block', fontSize: 'var(--t-lg)', marginTop: 12 }}>{title}</span>
    <span style={{ display: 'block', color: 'var(--ink-muted)', fontSize: 'var(--t-xs)', marginTop: 4 }}>{detail}</span>
  </button>;
}

function ProfileSection({ title, subtitle, icon, children }: { title: string; subtitle: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <details className="journey-disclosure">
    <summary>{icon && <span style={{ color: 'var(--gold)', marginRight: 8 }}>{icon}</span>}{title}<small>{subtitle}</small></summary>
    <div style={{ marginTop: 14 }}>{children}</div>
  </details>;
}

function AccountSection() {
  const { user, loading } = useAuth();
  const cloud = useAccountCloud();
  const [signingOut, setSigningOut] = useState(false);
  const [movingDevice, setMovingDevice] = useState(false);
  const [deleteStep, setDeleteStep] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  if (!isSupabaseConfigured || loading) return null;
  if (user.isGuest) return <div className="mt-4"><GoogleButton onClick={signInWithGoogle} /><p className="journey-muted">Sign in to keep a private account copy across your devices.</p></div>;

  const sendReset = async () => {
    if (!user.email) return;
    setBusy(true); setStatus('');
    try { await requestPasswordReset(user.email); setStatus('Password-reset email sent.'); }
    catch { setStatus('Could not send the email right now. Please try again.'); }
    finally { setBusy(false); }
  };

  const leaveAccount = async () => {
    setBusy(true); setStatus('');
    try { await signOut(); setSigningOut(false); }
    catch { setStatus('Sign-out could not finish. Please check your connection and try again.'); }
    finally { setBusy(false); }
  };

  const runCloudAction = async (action: () => Promise<void>) => {
    setBusy(true); setStatus('');
    try { await action(); }
    catch { setStatus('That cloud action could not finish. Check the saving status above before continuing.'); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    setBusy(true); setStatus('');
    try { await deleteAccount(); app.setView('first-run'); }
    catch { setStatus('Your account was not deleted. Please check your connection and try again.'); setBusy(false); }
  };

  return <div className="mt-4">
    <div className="glass flex items-center gap-3 px-5 py-4" style={{ borderRadius: 'var(--radius-card)' }}>
      {user.avatarUrl ? <img src={user.avatarUrl} alt="" width={40} height={40} style={{ borderRadius: 999 }} referrerPolicy="no-referrer" /> : <span className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(232,201,155,.14)', color: 'var(--gold)' }}>{(user.name || 'Y')[0].toUpperCase()}</span>}
      <span className="flex-1 overflow-hidden"><strong style={{ display: 'block', color: 'var(--ink)' }}>{user.name || 'Signed in'}</strong><small style={{ color: 'var(--ink-muted)' }}>{user.email}</small></span>
      <button onClick={() => setSigningOut(!signingOut)} style={{ color: 'var(--gold)', fontSize: 'var(--t-sm)' }}>Sign out</button>
    </div>
    {signingOut && <div className="glass mt-2 px-5 py-4" style={{ borderRadius: 'var(--radius-card)' }}><p>Sign out of this device? Your other devices will stay signed in.</p><div className="flex gap-2"><button className="journey-button" disabled={busy || cloud.phase === 'syncing'} onClick={leaveAccount}>{busy ? 'Please wait…' : 'Sign out'}</button><button className="journey-button" disabled={busy} onClick={() => setSigningOut(false)}>Cancel</button></div></div>}

    <div className="glass mt-3 px-5 py-4" style={{ borderRadius: 'var(--radius-card)' }}>
      <div className="eyebrow">Private account saving</div>
      <h3 className="serif" style={{ fontSize: 'var(--t-lg)', marginTop: 5 }}>{cloud.enabled ? 'Your journey follows your account' : 'Keep your journey across devices'}</h3>
      <p className="journey-muted">{cloud.message} Includes manifestation answers, progress, saved practices, journal pages and vision-board cards.</p>
      {cloud.updatedAt && <p className="eyebrow">Last saved {new Date(cloud.updatedAt).toLocaleString()}</p>}
      {!cloud.enabled ? <>
        <button className="journey-button journey-primary" disabled={busy || cloud.phase === 'syncing'} onClick={() => void runCloudAction(() => enableAccountCloud('cloud'))}>{cloud.phase === 'syncing' ? 'Connecting…' : 'Turn on cloud saving'}</button>
        <details className="journey-disclosure" style={{ marginTop: 10 }}><summary>Use this device’s current journey</summary><p>This replaces the account copy with the journey currently on this device.</p>{movingDevice ? <div className="flex gap-2"><button className="journey-button" disabled={busy} onClick={() => void runCloudAction(() => enableAccountCloud('device'))}>Confirm and save</button><button className="journey-button" disabled={busy} onClick={() => setMovingDevice(false)}>Cancel</button></div> : <button className="journey-button" disabled={busy} onClick={() => setMovingDevice(true)}>Choose device copy</button>}</details>
      </> : <div className="flex flex-col gap-2"><button className="journey-button" disabled={busy || cloud.phase === 'syncing'} onClick={() => void runCloudAction(refreshAccountCloud)}>{cloud.phase === 'syncing' ? 'Syncing…' : 'Refresh from cloud'}</button><button className="journey-button" disabled={busy || cloud.phase === 'syncing'} onClick={() => void runCloudAction(disableAccountCloud)}>Use only this device</button></div>}
    </div>

    <div className="glass mt-3 px-5 py-4" style={{ borderRadius: 'var(--radius-card)' }}>
      <div className="eyebrow">Account security</div>
      {user.email && <button className="journey-button" disabled={busy} onClick={sendReset}>Email me a password-reset link</button>}
      {!deleteStep ? <button className="journey-button" disabled={busy} onClick={() => setDeleteStep(true)} style={{ color: '#e7b3a0' }}>Delete my account</button> : <div><p className="journey-muted">This permanently deletes your account and cloud-saved journey. Data already saved in this browser remains on this device.</p><div className="flex gap-2"><button className="journey-button" disabled={busy} onClick={remove} style={{ color: '#e7b3a0' }}>{busy ? 'Deleting…' : 'Delete permanently'}</button><button className="journey-button" disabled={busy} onClick={() => setDeleteStep(false)}>Cancel</button></div></div>}
      {status && <p role="status" className="journey-muted">{status}</p>}
    </div>
  </div>;
}

function ProgrammeCard({ p }: { p: Programme }) {
  const done = new Set(programme.completed(p.id));
  const complete = programme.isComplete(p);
  const next = programme.nextDayIndex(p);
  const soon = !!p.comingSoon;
  const tag = soon ? 'Preparing' : complete ? 'Complete' : done.size ? `Continue · day ${next + 1}` : `${p.days.length} gentle days`;
  return <button onClick={() => programme.open(p.id)} className="glass w-full px-4 py-4 text-left" style={{ minHeight: 126, borderRadius: 'var(--radius-card)', opacity: soon ? .78 : 1 }}><div className="eyebrow" style={{ color: done.size ? 'var(--gold)' : 'var(--ink-muted)' }}>{tag}</div><div className="serif" style={{ fontSize: 'var(--t-lg)', marginTop: 6 }}>{p.title}</div><div style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-sm)', marginTop: 6 }}>{p.blurb}</div></button>;
}

function Switch({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return <button role="switch" aria-checked={on} aria-label={label} onClick={onToggle} style={{ width: 46, height: 28, borderRadius: 999, background: on ? 'var(--gold)' : 'var(--hairline)', position: 'relative' }}><span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 999, background: '#10222b', transition: 'left .3s var(--ease-calm)' }} /></button>;
}

function Row({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
  return <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: last ? 'none' : '1px solid var(--hairline)', minHeight: 56 }}><span style={{ color: 'var(--ink)', fontSize: 'var(--t-md)' }}>{label}</span>{children}</div>;
}

function ThemeChoice({ value, onChange }: { value: Theme; onChange: (theme: Theme) => void }) {
  return <div className="flex gap-1">{(['still', 'warm'] as Theme[]).map(theme => <button key={theme} onClick={() => onChange(theme)} aria-pressed={value === theme} style={{ padding: '6px 10px', borderRadius: 999, fontSize: 'var(--t-xs)', color: value === theme ? 'var(--gold)' : 'var(--ink-muted)', border: `1px solid ${value === theme ? 'var(--gold)' : 'var(--hairline)'}` }}>{theme === 'still' ? 'Still' : 'Warm'}</button>)}</div>;
}
