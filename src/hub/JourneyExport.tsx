import { useEffect, useRef, useState } from 'react';
import { exportJourney } from '../lib/journeyExport';

export default function JourneyExport() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const url = useRef<string | null>(null);
  useEffect(() => () => { if (url.current) URL.revokeObjectURL(url.current); }, []);
  async function download() {
    if (busy) return;
    setBusy(true); setStatus('');
    try {
      const content = await exportJourney();
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url.current; a.download = `come-home-personal-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setStatus('Export prepared. Check your downloads and keep the file somewhere private.');
    } catch { setStatus('Could not export your data. Nothing has been deleted. Please try again.'); }
    finally { setBusy(false); }
  }
  return <details className="journey-disclosure"><summary>Keep a copy of my journey</summary>
    <p>Download your saved workshop writing, goals, journal, programme progress and vision board images from this browser. Save any open draft first.</p>
    <p>This readable file includes private writing and images from this device, including any shared-device entries. Store it privately. It never includes your password or sign-in tokens. Signed-in users can separately enable private account saving.</p>
    <button type="button" className="journey-button" disabled={busy} onClick={download}>{busy ? 'Preparing your copy…' : 'Download my data'}</button><p role="status">{status}</p>
  </details>;
}
