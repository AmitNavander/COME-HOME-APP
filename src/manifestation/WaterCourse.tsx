import { useEffect, useRef, useState } from 'react';
import { useJourney } from './journeyStore';
import { nextWaterDay, waterAnswers, waterDays, waterPrefix, waterWeeks } from './waterCourse';

export default function WaterCourse() {
  const { data } = useJourney();
  const [selected, setSelected] = useState<number | null>(null);
  const completed = waterDays.filter((_, i) => data.answers[waterPrefix(i) + 'completed'] === '1').length;
  const next = nextWaterDay(data.answers);
  if (selected !== null) return <WaterLesson key={selected} day={selected} onClose={() => setSelected(null)} />;
  return <section>
    <p>A 21-Day Sacred Transformation Journey</p>
    <p>Master Facilitator: Amit C. Navander<br />Reiki Grandmaster · Family Constellation · Master of Rescripting Astropsychology</p>
    <p className="journey-muted">Condensed app adaptation of Amit’s supplied curriculum, with safety and factual edits for review. Written practices are available; guided audio is not yet included.</p>
    <details><summary>Before you begin</summary>
      <p>Water is used as a spiritual symbol and reminder for reflection and action. These practices do not establish that water stores intentions, rewrites DNA, treats trauma or guarantees health or financial outcomes.</p>
      <p>Use a clean food-safe glass and fresh drinking water. A simple quiet space is enough; special vessels, crystals and purchases are not required. Keep ink, oils, decorative objects and used ritual water separate from drinking water.</p>
      <p>All sipping is optional. Drink normally, follow any prescribed fluid limits, breathe comfortably and stop if distressed. You may skip any exercise. These practices do not replace medical or mental-health care.</p>
    </details>
    <p>{completed} of 21 days marked complete</p>
    <progress aria-label="Water course progress" max={21} value={completed} />
    {next === null ? <p role="status">You have completed the written journey. Revisit any day at your pace.</p> : <button className="journey-button" onClick={() => setSelected(next)}>Continue Water day {next + 1} · {waterDays[next].title}</button>}
    {waterWeeks.map((week, w) => <section key={week.title}>
      <h3 className="serif">Week {w + 1} · {week.title}</h3><p>{week.theme} · {week.law}</p>
      {waterDays.slice(w * 7, w * 7 + 7).map((day, offset) => {
        const i = w * 7 + offset;
        const prefix = waterPrefix(i);
        return <button className="journey-row" key={day.title} onClick={() => setSelected(i)}><span>Day {i + 1} · {day.title}<small>{data.answers[prefix + 'completed'] === '1' ? 'Complete · revisit' : data.answers[prefix + 'saved'] === '1' ? 'Draft saved' : 'Ready when you are'}</small></span><span aria-hidden="true">→</span></button>;
      })}
    </section>)}
  </section>;
}

function WaterLesson({ day, onClose }: { day: number; onClose: () => void }) {
  const { data, save } = useJourney();
  const lesson = waterDays[day];
  const prefix = waterPrefix(day);
  const heading = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(
    ['reflection:0', 'reflection:1', 'action', 'evening', 'evidence', 'plan'].map(key => [key, data.answers[prefix + key] || ''])
  ));
  const [status, setStatus] = useState('');
  useEffect(() => { heading.current?.focus(); }, []);
  const done = data.answers[prefix + 'completed'] === '1';
  function persist(complete: boolean, close = false) {
    try {
      save({ ...data, answers: waterAnswers(data.answers, day, values, complete) });
      setStatus(complete ? 'Saved and marked complete on this device.' : 'Draft saved on this device.');
      if (close) onClose();
    } catch { setStatus('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  function field(key: string, label: string) {
    return <label className="journey-label" key={key}>{label}<textarea maxLength={8000} value={values[key]} onChange={e => setValues(old => ({ ...old, [key]: e.target.value }))} /></label>;
  }
  return <form onSubmit={e => { e.preventDefault(); persist(done); }}>
    <button className="journey-button" type="button" onClick={() => persist(done, true)}>Save and return to Water days</button>
    <h3 className="serif" ref={heading} tabIndex={-1}>Day {day + 1} · {lesson.title}</h3>
    <p>{waterWeeks[Math.floor(day / 7)].title} · Written practice · Adapted edition</p>
    <h4>1. Today’s Wisdom From Water</h4><blockquote>{lesson.wisdom}</blockquote><p>{lesson.teaching}</p>
    <h4>2. Sacred Water Ceremony</h4><p>Move at your own pace. Sipping is optional; breathe normally.</p>
    <ol>{lesson.ceremony.map(step => <li key={step}>{step}</li>)}</ol><blockquote>{lesson.declaration}</blockquote>
    <h4>3. Water Reflection Journal</h4><p>Writing is optional. Save before leaving.</p>
    {lesson.prompts.map((prompt, i) => field(`reflection:${i}`, prompt))}
    <h4>4. Aligned Action Challenge</h4><p>{lesson.action}</p>{field('action', 'My action or next step')}
    {day === 20 && field('plan', 'My 90-day plan: priorities, weekly actions and review dates')}
    <h4>5. Water Reminder Practice</h4><p>During an ordinary water break, you may return to these words:</p><blockquote>{lesson.reminder}</blockquote>
    <h4>6. Evening Water Integration</h4><p>{lesson.evening}</p>{field('evening', 'My evening reflection')}
    <h4>7. Daily Milestone</h4><p>{lesson.milestone}</p><p>Marking complete records your participation, not a guaranteed transformation.</p>
    <h4>8. Manifestation Evidence Tracker</h4><p>Note observations, feelings, actions and outcomes, including things that did not change. Coincidences do not establish cause and effect.</p>{field('evidence', 'What I noticed today')}
    <button className="journey-button" type="submit">{done ? 'Save writing' : 'Save draft'}</button>
    <button className="journey-button" type="button" onClick={() => persist(true)}>{done ? 'Save completed day' : 'Save and mark day complete'}</button>
    {done && <button className="journey-button" type="button" onClick={() => persist(false)}>Mark as in progress</button>}
    <button className="journey-button" type="button" onClick={() => persist(done, true)}>Save and return to Water days</button>
    <p role="status">{status}</p><p className="journey-muted">Your writing stays in this browser, including on shared devices. It is not synced to your account.</p>
  </form>;
}
