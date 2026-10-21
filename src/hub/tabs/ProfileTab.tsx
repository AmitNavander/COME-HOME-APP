import PracticeReminder from '../../manifestation/PracticeReminder';
import { profileNavigation, useProfilePage } from '../../store/profile';
import { nav } from '../../nav/history';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, ChartNoAxesCombined, Compass, ShieldCheck, SlidersHorizontal, Sparkles, CircleHelp, Download } from 'lucide-react';
import ReflectionTrail from '../../journey/ReflectionTrail';
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
  const page = useProfilePage();
  const prefs = usePrefs();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [presence, setPresence] = useState<string[]>([]);
  const [reminderDenied, setReminderDenied] = useState(false);
  useProgrammeProgress();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page]);
  const pages = [
    { id: 'progress' as const, title: 'My Progress', subtitle: 'Your practice and reflections', Icon: ChartNoAxesCombined },
    { id: 'journeys' as const, title: 'My Journeys', subtitle: 'Meditation programmes', Icon: Compass },
    { id: 'preferences' as const, title: 'Preferences', subtitle: 'Atmosphere and reminders', Icon: SlidersHorizontal },
    { id: 'plans' as const, title: 'Plans & Access', subtitle: 'Explore Come Home Plus', Icon: Sparkles },
    { id: 'help' as const, title: 'Help & Information', subtitle: 'Support, privacy and terms', Icon: CircleHelp },
    { id: 'account' as const, title: 'Privacy & Account', subtitle: 'Sign-in and account controls', Icon: ShieldCheck },
    { id: 'export' as const, title: 'Export My Journey', subtitle: 'Download a personal copy', Icon: Download },
  ];
  const currentPage = pages.find(item => item.id === page);

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
      <div className="profile-page">
        {page === 'overview' ? <>
          <header className="profile-header"><div className="eyebrow">You</div><h1>Your Space</h1><p>{user.isGuest ? 'Make your practice your own.' : `Welcome, ${user.name?.split(' ')[0] || 'back'}.`}</p></header>
          <nav className="profile-navigation" aria-label="Your settings">{pages.map(({ id, title, subtitle, Icon }) => <button key={id} onClick={() => profileNavigation.open(id)}><span className="profile-nav-icon"><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span><span className="profile-nav-label"><strong>{title}</strong><small>{subtitle}</small></span><ChevronRight size={18} aria-hidden="true" /></button>)}</nav>
        </> : <>
          <button className="profile-back" onClick={() => nav.parent('hub:profile')}><ArrowLeft size={18} aria-hidden="true" />Back to You</button>
          <header className="profile-header"><div className="eyebrow">Your Space</div><h1>{currentPage?.title}</h1><p>{currentPage?.subtitle}</p></header>
          <div className="profile-content">
          {page === 'progress' && <section>
            <JourneyProgress />
            <div className="mt-5"><ReflectionTrail history={history} reflections={reflections} journal={journal} presence={presence} /></div>
          </section>}

          {page === 'journeys' && <section>
            <div className="profile-programmes">{PROGRAMMES.map(p => <ProgrammeCard key={p.id} p={p} />)}</div>
          </section>}

          {page === 'preferences' && <section>
            <div className="glass" style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
              <Row label="Reminder While App Is Open" last={!prefs.reminder.enabled}><Switch on={prefs.reminder.enabled} label="Daily reminder" onToggle={toggleReminder} /></Row>
              {prefs.reminder.enabled && <Row label="Around"><input type="time" aria-label="Reminder time" value={prefs.reminder.time} onChange={e => prefsStore.setReminder({ enabled: true, time: e.target.value })} className="glass px-3 py-2" style={{ color: 'var(--ink)', colorScheme: 'dark', borderRadius: 'var(--radius-card)' }} /></Row>}
              <Row label="Atmosphere" last><ThemeChoice value={prefs.theme} onChange={prefsStore.setTheme} /></Row>
            </div>
            <p className="journey-muted">{reminderDenied ? 'Notifications are off in your device settings.' : 'This reminder works while the app is open. For reminders when it is closed, add a calendar reminder below.'}</p>
            <h2>Calendar Reminder</h2><PracticeReminder standalone compact title="A moment for myself" action="Take a moment to pause and reflect." location="Come Home" />
            <button className="journey-button" onClick={() => app.setView('onboarding')}>Change my starting path</button>
          </section>}

          {page === 'plans' && <section><Plans /></section>}
          {page === 'help' && <section><InformationLinks /></section>}

          {page === 'account' && <section>

            <AccountSection />
          </section>}
          {page === 'export' && <JourneyExport standalone />}
          </div>
        </>}
      </div>
    </div>
  );
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
        <section className="profile-device-copy"><h4>Use This Device’s Journey</h4><p>This replaces the account copy with the journey currently on this device.</p>{movingDevice ? <div className="flex gap-2"><button className="journey-button" disabled={busy} onClick={() => void runCloudAction(() => enableAccountCloud('device'))}>Confirm and save</button><button className="journey-button" disabled={busy} onClick={() => setMovingDevice(false)}>Cancel</button></div> : <button className="journey-button" disabled={busy} onClick={() => setMovingDevice(true)}>Choose device copy</button>}</section>
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
  return <button role="switch" aria-checked={on} aria-label={label} onClick={onToggle} style={{ width: 46, height: 44, borderRadius: 'var(--radius-card)', background: 'transparent', position: 'relative' }}><span aria-hidden style={{ position: 'absolute', inset: '8px 0', borderRadius: 999, background: on ? 'var(--gold)' : 'var(--hairline)' }} /><span style={{ position: 'absolute', top: 11, left: on ? 21 : 3, width: 22, height: 22, borderRadius: 999, background: '#10222b', transition: 'left .3s var(--ease-calm)' }} /></button>;
}

function Row({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
  return <div className="profile-setting-row" style={{ borderBottom: last ? 'none' : '1px solid var(--hairline)', minHeight: 56 }}><span style={{ color: 'var(--ink)', fontSize: 'var(--t-md)' }}>{label}</span>{children}</div>;
}

function ThemeChoice({ value, onChange }: { value: Theme; onChange: (theme: Theme) => void }) {
  return <div className="flex gap-1">{(['still', 'warm'] as Theme[]).map(theme => <button key={theme} onClick={() => onChange(theme)} aria-pressed={value === theme} style={{ minHeight: 44, padding: '8px 12px', borderRadius: 'var(--radius-card)', fontSize: 'var(--t-xs)', color: value === theme ? 'var(--gold)' : 'var(--ink-muted)', border: `1px solid ${value === theme ? 'var(--gold)' : 'var(--hairline)'}` }}>{theme === 'still' ? 'Still' : 'Warm'}</button>)}</div>;
}
