import { Download, Check } from 'lucide-react';
import { installApp, useInstall } from './install';

export default function InstallApp() {
  const { installed, available, busy, message } = useInstall();
  return <details className="journey-disclosure">
    <summary><span style={{ display: 'inline-block', color: 'var(--gold)', marginRight: 8 }}>{installed ? <Check size={17} /> : <Download size={17} />}</span>
      {installed ? 'COME HOME is on your device' : 'Install COME HOME'}
      <small>Your daily practice, one tap away</small>
    </summary>
    <div style={{ marginTop: 14, lineHeight: 1.65 }}>
      {installed ? <p>Open COME HOME from its icon whenever you want to return.</p> : <>
        <p>Add COME HOME to your home screen. It opens in its own app window, with no app-store download needed.</p>
        {available && <button className="journey-button journey-primary" disabled={busy} onClick={() => void installApp()}>{busy ? 'Opening installation…' : 'Install on this device'}</button>}
        <details className="journey-disclosure" open={!available} style={{ marginTop: 12 }}>
          <summary>iPhone or iPad</summary>
          <ol style={{ paddingLeft: 22, marginTop: 10 }}>
            <li>Open <a href="https://www.come-home.app" style={{ color: 'var(--gold)' }}>come-home.app</a> in Safari.</li>
            <li>Tap Share, then Add to Home Screen.</li>
            <li>Keep Open as Web App enabled if shown, then tap Add.</li>
          </ol>
        </details>
        <details className="journey-disclosure" style={{ marginTop: 10 }}>
          <summary>Android or computer</summary>
          <p>Open come-home.app in Chrome or Edge. Choose Install app or Add to Home screen from the browser menu, then confirm. On a computer, you may also see an install icon beside the address bar.</p>
        </details>
        <p className="journey-muted">Opened from WhatsApp, Instagram or another app? Open the link in Safari or Chrome first. Use a normal browser window, not private browsing.</p>
      </>}
      {message && <p role="status" className="journey-muted">{message}</p>}
      <p className="journey-muted">Sign in with the same account and enable cloud saving to bring your saved journey into the installed app. Internet is needed for sign-in, cloud saving and audio that has not been cached. Installation does not enable reminders automatically; set those within your practices.</p>
    </div>
  </details>;
}
