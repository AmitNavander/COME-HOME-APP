import { useEffect, useState } from 'react';
import { affirmationForDate, affirmations } from './affirmations';
import { openGuidedJournal } from '../journal/context';
import { hub } from '../store/hub';
import PracticeReminder from '../manifestation/PracticeReminder';

import { useAuth } from '../lib/auth';
import { draftKey, readDraft, writeDraft, dateKey, validAffirmation } from '../lib/practiceDraft';

const themes = [...new Set(affirmations.map(item => item.theme))];
export default function AffirmationPractice() {
  const { user } = useAuth();
  const [day, setDay] = useState(dateKey);
  useEffect(() => { const refresh = () => setDay(dateKey()); const timer = window.setInterval(refresh, 30000); window.addEventListener('focus', refresh); return () => { clearInterval(timer); window.removeEventListener('focus', refresh); }; }, []);
  return <Practice key={`${user.id}:${day}`} owner={user.id} day={day} />;
}
function Practice({ owner, day }: { owner: string; day: string }) {
  const [daily] = useState(() => affirmationForDate());
  const key = draftKey(owner, 'affirmation');
  const [saved] = useState(() => readDraft(key, { day, chosen: daily.text, count: 0, completed: false }, v => validAffirmation(v) && v.day === day));
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(saved.completed);
  function update(text: string, repetitions: number) {
    const finished = completed || repetitions === 3;
    setChosen(text); setCount(repetitions); setCompleted(finished);
    try { writeDraft(key, { day, chosen: text, count: repetitions, completed: finished }); setError(''); }
    catch { setError('Progress could not be saved on this device. Keep this page open and try again.'); }
  }
  const [chosen, setChosen] = useState(saved.chosen);
  const [theme, setTheme] = useState(daily.theme);
  const [count, setCount] = useState(saved.count);
  const choose = (text: string) => { update(text, 0); };
  return <div className="screen"><main className="journey-page">
    <button className="journey-button" onClick={() => hub.setTab('home')}>← Back to Today</button>
    <div className="eyebrow">Affirmations · Free</div>
    <h1 className="serif">Words to return to.</h1>
    <p>One affirmation. Three slow repetitions. One small action.</p>
    {error && <p role="alert">{error}</p>}{completed && <p role="status">Your affirmation practice is complete for today. Tomorrow brings new words to practise.</p>}
    <section className="journey-card daily-affirmation">
      <p className="serif daily-affirmation-text">{chosen}</p>
      <ol className="water-steps"><li>Settle into a comfortable position and breathe naturally.</li><li>Read the words aloud or silently. Pause between repetitions and notice how they feel.</li><li>Choose one way to live these words today. You do not need to force belief or a particular feeling.</li></ol>
      <p role="status" aria-live="polite">{count} of 3 repetitions</p>
      {count < 3 ? <button className="journey-button journey-primary" onClick={() => update(chosen, Math.min(3, count + 1))}>{count === 0 ? 'I’ve said it once' : 'I’ve repeated it again'}</button> : <><p>Your pause is complete. What is one kind, practical step you can take now?</p><button className="journey-button journey-primary" onClick={() => openGuidedJournal('affirmation', chosen)}>Reflect on these words</button><button className="journey-button" onClick={() => update(chosen, 0)}>Repeat again</button></>}
    </section>
    <details className="journey-disclosure"><summary>Choose words for what you need</summary>
      <label className="journey-label">Theme<select value={theme} onChange={e => setTheme(e.target.value)}>{themes.map(t => <option key={t}>{t}</option>)}</select></label>
      {affirmations.filter(item => item.theme === theme).map(item => <button key={item.text} className="journey-row" aria-pressed={chosen === item.text} onClick={() => choose(item.text)}>{item.text}{chosen === item.text ? ' ✓' : ''}</button>)}
      <button className="journey-button" onClick={() => choose(daily.text)}>Use today’s affirmation</button>
    </details>
    <PracticeReminder title="My affirmation practice" action={`Repeat slowly: ${chosen}`} prompt="Pause, repeat your words and choose one small action." location="Today → Practise this affirmation" label="Remind me to practise" />
  </main></div>;
}
