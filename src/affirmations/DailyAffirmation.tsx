import { useAuth } from '../lib/auth';
import { draftKey, readDraft, dateKey, validAffirmation, type AffirmationDraft } from '../lib/practiceDraft';
import { useEffect, useState } from 'react';
import { affirmationForDate } from './affirmations';
import { hub } from '../store/hub';

export default function DailyAffirmation() {
  const { user } = useAuth();
  const saved = readDraft<AffirmationDraft | null>(draftKey(user.id, 'affirmation'), null, v => validAffirmation(v) && v.day === dateKey());
  const complete = validAffirmation(saved) && saved.completed;
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
    <button className="journey-button" onClick={() => hub.setTab('affirmations')}>{complete ? "Practised today · Repeat again" : "Practise this affirmation"}</button>
    {complete && <p role="status">You made time for your words today. Tomorrow brings a new affirmation.</p>}
  </section>;
}
