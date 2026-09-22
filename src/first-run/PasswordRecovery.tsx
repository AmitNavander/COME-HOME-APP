import { useState } from 'react';
import Mark from '../ui/Mark';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { updateRecoveredPassword } from '../lib/auth';

export default function PasswordRecovery() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const save = async () => {
    setMessage('');
    if (password.length < 8) return setMessage('Use at least 8 characters.');
    if (password !== confirm) return setMessage('The passwords do not match.');
    setBusy(true);
    try {
      await updateRecoveredPassword(password);
    } catch {
      setMessage('This recovery link may have expired. Request a new one from the login screen.');
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
        <Reveal delay={0.04}>
          <div className="flex flex-col items-center text-center">
            <Mark size={68} />
            <div className="eyebrow" style={{ marginTop: 18 }}>Account security</div>
            <h1 className="serif" style={{ fontSize: 'var(--t-2xl)', marginTop: 8 }}>Choose a new password</h1>
            <p style={{ color: 'var(--ink-muted)', marginTop: 8 }}>You’ll return to your journey when it is updated.</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="glass glass-strong mt-8" style={{ padding: 20, borderRadius: 'var(--radius-card)' }}>
            <RecoveryField label="New password" value={password} onChange={setPassword} />
            <RecoveryField label="Confirm password" value={confirm} onChange={setConfirm} className="mt-3" />
            {message && <p role="alert" style={{ color: '#e7b3a0', fontSize: 'var(--t-sm)', marginTop: 12 }}>{message}</p>}
            <Button className="mt-4 w-full" disabled={busy} onClick={save}>{busy ? 'Updating…' : 'Update password'}</Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function RecoveryField({ label, value, onChange, className = '' }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return <div className={className}>
    <label className="eyebrow" htmlFor={id} style={{ display: 'block', marginBottom: 6 }}>{label}</label>
    <input id={id} type="password" autoComplete="new-password" value={value} onChange={event => onChange(event.target.value)} className="glass w-full px-4 py-3" style={{ borderRadius: 'var(--radius-chip)', color: 'var(--ink)', fontSize: 'var(--t-md)' }} />
  </div>;
}
