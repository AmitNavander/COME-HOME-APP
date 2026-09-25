import { useEffect, useState } from 'react';
import { affirmationForDate } from './affirmations';
import { hub } from '../store/hub';

export default function DailyAffirmation() {
  const [daily, setDaily] = useState(() => affirmationForDate());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function refresh() {
      const now = new Date();
      const next = affirmationForDate(now);
      setDaily(previous => previous.index === next.index ? previous : next);
      clearTimeout(timer);
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 100);
    }
    function onVisible() { if (document.visibilityState === 'visible') refresh(); }
    refresh();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('focus', refresh); };
  }, []);
  return <section className="journey-card daily-affirmation" aria-labelledby="daily-affirmation-heading">
    <h2 id="daily-affirmation-heading" className="eyebrow">Today’s affirmation</h2>
    <p className="serif daily-affirmation-text">{daily.text}</p>
    <p className="journey-muted">{daily.theme} · Repeat slowly, aloud or within. Let the words guide your day.</p>
    <button className="journey-button" onClick={() => hub.setTab('affirmations')}>Practise this affirmation</button>
  </section>;
}
