import { useState } from 'react';
import { app } from '../store/app';
import { useJourney } from './journeyStore';
import './journey.css';
import FoundationSession from './FoundationSession';
import { foundationDays, nextFoundationDay } from './foundationDays';
import WaterWorkbook from './WaterWorkbook';
import VisionBoard from './VisionBoard';

const waterDays = ['Sacred Initiation', 'Water of Clarity', 'Release', 'Emotional Healing', 'Gratitude', 'Forgiveness', 'Purification Ceremony', 'Intention', 'Voice Imprinting', 'Belief', 'Visualization', 'Embodied Feeling', 'Aligned Action', 'Prosperity Flow', 'Receiving', 'Trust', 'Surrender', 'Expansion', 'Synchronicity', 'Integration', 'Become'];

export default function ManifestWorkspace() {
  const { data, save } = useJourney();
  const [goal, setGoal] = useState(data.goal);
  const [why, setWhy] = useState(data.why);
  const [selected, setSelected] = useState<number | null>(null);
  const [water, setWater] = useState(false);
  const [message, setMessage] = useState('');
  const persist = (next: typeof data) => {
    try { save(next); setMessage('Saved on this device.'); return true; }
    catch { setMessage('Could not save. Keep this page open and copy your writing before leaving.'); return false; }
  };
  const nextDay = nextFoundationDay(data.completed);
  if (selected !== null) return <FoundationSession key={selected} day={selected} onClose={() => setSelected(null)} />;
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
      <p>A teaching, practice, affirmation, action and evening reflection each day. Begin at your pace; there is no missed-day penalty. Guided audio is not included yet.</p>
      <progress aria-label="Foundation progress" max={7} value={data.completed.length} /><p>{data.completed.length} of 7 completed</p>
      {nextDay !== null ? <button className="journey-button" onClick={() => setSelected(nextDay)}>Continue day {nextDay + 1} · {foundationDays[nextDay].title}</button> : <p role="status">Your foundation week is complete. Revisit any day below.</p>}
      {foundationDays.map(({title, minutes}, i) => <button className="journey-row" key={title} onClick={() => { setSelected(i); setMessage(''); }}><span className="journey-number">{i + 1}</span><span>Day {i + 1} · {title}<small>{minutes} min · {data.completed.includes(i) ? 'Completed' : data.answers[String(i)] ? 'Draft saved' : 'Ready when you are'}</small></span><span aria-hidden>{data.completed.includes(i) ? '✓' : '→'}</span></button>)}
    </section>
    <button className="journey-card journey-wide" onClick={() => app.setView('manifestation')}><div className="eyebrow">Practice library</div><h2 className="serif">Explore the foundation practices →</h2><p>The existing published practice collection.</p></button>
    <section className="journey-card journey-hero"><div className="eyebrow">Signature journey · COME HOME+</div><h2 className="serif">Manifesting Through Water™</h2><p>Purify. Charge. Flow. Receive. Become.</p><p>Water as a mindful anchor for intention, reflection and aligned action.</p><button className="journey-button" aria-expanded={water} onClick={() => setWater(!water)}>{water ? 'Close' : 'Explore'} the 21-day journey</button>
      {water && <WaterWorkbook titles={waterDays} />}
    </section>
    <VisionBoard />
    <p className="journey-muted">Your intention, reflections and vision board stay in this browser, including on shared devices. Cloud sync is not connected. Practices support reflection and action, not guaranteed outcomes.</p>
  </main></div>;
}
