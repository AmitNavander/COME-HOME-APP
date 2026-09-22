import { useState } from 'react';
import { useJourney } from './journeyStore';

// Verbatim workbook labels from Manifesting_Through_Water_Premium_Deck.pptx.
const prompts = ["Today's Water Wisdom:", 'What is water teaching me today?', 'What am I releasing?', 'What am I calling in?', 'Evidence, signs & insights:'];
const scales = ['Clarity', 'Self-Trust', 'Gratitude', 'Alignment'];

/** Journal progress is deliberately separate from course completion. */
export default function WaterWorkbook({ titles }: { titles: readonly string[] }) {
  const { data } = useJourney();
  const [day, setDay] = useState<number | null>(null);
  const recorded = titles.filter((_, i) => data.answers[`water:${i}:saved`] === '1').length;
  if (day !== null) return <WaterEntry key={day} day={day} title={titles[day]} onClose={() => setDay(null)} />;
  return <section>
    <p>Your previous workbook entries remain available here.</p>
    <p>{recorded} of 21 journal days recorded. This does not count as course completion.</p>
    <progress aria-label="Water journal days recorded" max={21} value={recorded} />
    <ol>{titles.map((title, i) => <li key={title}><button className="journey-row" onClick={() => setDay(i)}><span>Day {i + 1} · {title}</span><span>{data.answers[`water:${i}:saved`] === '1' ? 'Edit journal' : 'Open journal'} →</span></button></li>)}</ol>
  </section>;
}

function WaterEntry({ day, title, onClose }: { day: number; title: string; onClose: () => void }) {
  const { data, save } = useJourney();
  const prefix = `water:${day}:`;
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(
    [...prompts.map((_, i) => `prompt:${i}`), ...scales.map((_, i) => `scale:${i}`)].map(key => [key, data.answers[prefix + key] || ''])
  ));
  const [status, setStatus] = useState('');
  function persist(close: boolean) {
    try {
      const answers = { ...data.answers };
      for (const [key, value] of Object.entries(values)) answers[prefix + key] = value;
      answers[prefix + 'saved'] = Object.values(values).some(value => value.trim()) ? '1' : '0';
      save({ ...data, answers });
      setStatus('Saved on this device.');
      if (close) onClose();
    } catch { setStatus('Unable to save. Keep this page open and copy your writing before leaving.'); }
  }
  return <form onSubmit={e => { e.preventDefault(); persist(false); }}>
    <h3 className="serif">Day {day + 1} · {title}</h3>
    <p>Manifesting Through Water™ journal</p>
    {prompts.map((prompt, i) => <label className="journey-label" key={prompt}>{prompt}<textarea maxLength={8000} value={values[`prompt:${i}`]} onChange={e => setValues(old => ({ ...old, [`prompt:${i}`]: e.target.value }))} /></label>)}
    <h3 className="serif">Your daily check-in</h3>
    <p>Optional ratings from 1 to 10. These describe your own experience.</p>
    {scales.map((label, i) => <label className="journey-label" key={label}>{label}<select value={values[`scale:${i}`]} onChange={e => setValues(old => ({ ...old, [`scale:${i}`]: e.target.value }))}><option value="">Not recorded</option>{Array.from({ length: 10 }, (_, index) => <option key={index} value={String(index + 1)}>{index + 1}</option>)}</select></label>)}
    <button className="journey-button" type="submit">Save Water journal</button>
    <button className="journey-button" type="button" onClick={() => persist(true)}>Save and return to days</button>
    <p role="status">{status}</p><p className="journey-muted">Use Save before leaving. Entries stay in this browser unless Private account saving is enabled in Profile.</p>
  </form>;
}
