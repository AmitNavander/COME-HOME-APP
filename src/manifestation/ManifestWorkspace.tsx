import { useState } from 'react';
import { app } from '../store/app';
import { useJourney } from './journeyStore';
import './journey.css';

const days = [
  ['Vision', 'What are you ready to create?'],
  ['Why', 'What would this make possible in your life?'],
  ['Feel', 'How would you like to feel as you move towards this?'],
  ['See', 'Describe an ordinary moment in that lived experience.'],
  ['Align', 'What belief supports you, and what belief needs your attention?'],
  ['Act', 'What is one small, practical action within your control?'],
  ['Notice', 'What changed? Notice effort, learning and opportunities without forcing a result.'],
] as const;
const waterDays = ['Sacred Initiation', 'Water of Clarity', 'Release', 'Emotional Healing', 'Gratitude', 'Forgiveness', 'Purification Ceremony', 'Intention', 'Voice Imprinting', 'Belief', 'Visualization', 'Embodied Feeling', 'Aligned Action', 'Prosperity Flow', 'Receiving', 'Trust', 'Surrender', 'Expansion', 'Synchronicity', 'Integration', 'Become'];

export default function ManifestWorkspace() {
  const { data, save } = useJourney();
  const [goal, setGoal] = useState(data.goal);
  const [why, setWhy] = useState(data.why);
  const [selected, setSelected] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [water, setWater] = useState(false);
  const [message, setMessage] = useState('');
  const persist = (next: typeof data) => {
    try { save(next); setMessage('Saved on this device.'); return true; }
    catch { setMessage('Could not save. Keep this page open and copy your writing before leaving.'); return false; }
  };
  return <div className="screen"><main className="journey-page">
    <div className="eyebrow">Manifest</div><h1 className="serif">What are you ready to create?</h1>
    <p>Awareness → intention → feeling → aligned action → reflection.</p>
    <form className="journey-card" onSubmit={e => { e.preventDefault(); persist({ ...data, goal: goal.trim(), why: why.trim() }); }}>
      <div className="eyebrow">My manifestation</div>
      <label className="journey-label">What are you creating?<input required maxLength={240} value={goal} onChange={e => setGoal(e.target.value)} placeholder="A meaningful intention, in your own words" /></label>
      <label className="journey-label">Why does this matter?<textarea maxLength={4000} value={why} onChange={e => setWhy(e.target.value)} placeholder="What would this make possible?" /></label>
      <button className="journey-button" type="submit">Save intention</button>
    </form>
    <p role="status">{message}</p>
    <section className="journey-card"><div className="eyebrow">Free · seven-day reflection journey</div><h2 className="serif">COME HOME Manifestation Foundations</h2>
      <p>One reflection each day, at your pace. These written exercises follow the agreed manifestation flow; guided audio is not included yet.</p>
      <progress aria-label="Foundation progress" max={7} value={data.completed.length} /><p>{data.completed.length} of 7 completed</p>
      {days.map(([title], i) => <button className="journey-row" key={title} onClick={() => { setSelected(i); setAnswer(data.answers[String(i)] || ''); setMessage(''); }}><span className="journey-number">{i + 1}</span><span>Day {i + 1} · {title}</span><span>{data.completed.includes(i) ? '✓' : '→'}</span></button>)}
    </section>
    {selected !== null && <form className="journey-card" onSubmit={e => { e.preventDefault(); if (persist({ ...data, answers: { ...data.answers, [selected]: answer.trim() }, completed: [...new Set([...data.completed, selected])] })) setSelected(null); }}>
      <h2 className="serif">Day {selected + 1} · {days[selected][0]}</h2><label className="journey-label">{days[selected][1]}<textarea autoFocus required maxLength={8000} value={answer} onChange={e => setAnswer(e.target.value)} /></label>
      <button className="journey-button" type="submit">Save and complete reflection</button>
      <button className="journey-button" type="button" onClick={() => { if (persist({ ...data, answers: { ...data.answers, [selected]: answer } })) setSelected(null); }}>Save draft and close</button>
    </form>}
    <button className="journey-card journey-wide" onClick={() => app.setView('manifestation')}><div className="eyebrow">Practice library</div><h2 className="serif">Explore the foundation practices →</h2><p>The existing published practice collection.</p></button>
    <section className="journey-card journey-hero"><div className="eyebrow">Signature journey · COME HOME+</div><h2 className="serif">Manifesting Through Water™</h2><p>Purify. Charge. Flow. Receive. Become.</p><p>Water as a mindful anchor for intention, reflection and aligned action.</p><button className="journey-button" aria-expanded={water} onClick={() => setWater(!water)}>{water ? 'Close' : 'Explore'} the 21-day journey</button>
      {water && <><p>This is the planned course outline. Full daily lessons, audio and paid enrollment are not yet available. No subscription is activated here.</p><ol>{waterDays.map((title, i) => <li className="journey-row" key={title}>Day {i + 1} · {title}</li>)}</ol></>}
    </section>
    <p className="journey-muted">Your intention and reflections stay in this browser, including on shared devices. Cloud sync and a private image vision board are not yet connected. Practices support reflection and action, not guaranteed outcomes.</p>
  </main></div>;
}
