import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useView } from '../store/app';

/** Updates wait for consent so a journal draft or practice is never reloaded automatically. */
export default function AppUpdate() {
  const view = useView();
  const [later, setLater] = useState(false);
  const [error, setError] = useState(false);
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();
  if (!needRefresh || later || view !== 'hub') return null;
  return <aside aria-label="App update" className="glass glass-strong" style={{ position: 'fixed', zIndex: 100, top: 'max(12px, env(safe-area-inset-top))', left: '50%', transform: 'translateX(-50%)', width: 'min(92vw, 420px)', padding: 18, borderRadius: 20 }}>
    <strong>A fresh version of COME HOME is ready</strong>
    <p className="journey-muted">Finish and save your work before updating. This reloads the app.</p>
    <div className="flex gap-2">
      <button className="journey-button journey-primary" onClick={() => { setError(false); void updateServiceWorker(true).catch(() => setError(true)); }}>Update now</button>
      <button className="journey-button" onClick={() => setLater(true)}>Later</button>
    </div>
    {error && <p role="status">Could not update. Check your connection and try again.</p>}
  </aside>;
}
