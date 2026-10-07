import SaveFeedback from './SaveFeedback';
import { RESUME_KEY, nextWaterStep, waterSteps } from './practiceProgress';
import PracticeReminder from './PracticeReminder';
import { useEffect, useRef, useState } from 'react';
import { getJourneySnapshot, useJourney } from './journeyStore';
import { nextWaterDay, waterAnswers, waterDays, waterPrefix, waterWeeks } from './waterCourse';
import { waterGuides } from './waterGuide';

export default function WaterCourse({ initialDay = null }: { initialDay?: number | null }) {
  const { data } = useJourney();
  const [selected, setSelected] = useState<number | null>(initialDay);
  const completed = waterDays.filter((_, i) => data.answers[waterPrefix(i) + 'completed'] === '1').length;
  const next = nextWaterDay(data.answers);
  if (selected !== null) return <WaterLesson key={selected} day={selected} onClose={() => setSelected(null)} />;
  return <section>
    <p>A 21-Day Sacred Transformation Journey</p>
    <p>With Amit C. Navander · 21 days</p>
    <details className="journey-disclosure"><summary>About this workshop</summary><p>Master Facilitator: Amit C. Navander<br />Reiki Grandmaster · Family Constellation · Master of Rescripting Astropsychology</p>
    <p>Read, pause and practice—one day at a time. Each day contains the teaching and instructions you need to work through the exercises without audio or a facilitator.</p>
    <p className="journey-muted">Expanded self-guided edition based on Amit’s curriculum, with safety and factual edits. This is an adapted edition, not the original manuscript word for word.</p>
    <p>Allow about 25–35 minutes for reading, practice, writing and action, plus a brief evening return. These are flexible planning estimates; split a day into smaller sittings whenever you need.</p>
    </details>
    <details><summary>Before you begin</summary>
      <p>Water is used as a spiritual symbol and reminder for reflection and action. These practices do not establish that water stores intentions, rewrites DNA, treats trauma or guarantees health or financial outcomes.</p>
      <p>Use a clean food-safe glass and fresh drinking water. A simple quiet space is enough; special vessels, crystals and purchases are not required. Keep ink, oils, decorative objects and used ritual water separate from drinking water.</p>
      <p>All sipping is optional. Drink normally, follow any prescribed fluid limits, breathe comfortably and stop if distressed. You may skip any exercise. These practices do not replace medical or mental-health care.</p>
    </details>
    <PracticeReminder title="Return to the Water workshop" action="Continue the next unfinished Water day, or finish your saved practice." prompt="Make a little space for your Water workshop. Continue at your own pace." location="Manifest → Manifesting Through Water" label="Remind me to return to the workshop" />
    <p>{completed} of 21 days marked complete</p>
    <progress aria-label="Water course progress" max={21} value={completed} />
    {next === null ? <p role="status">You have completed the written journey. Revisit any day at your pace.</p> : <button className="journey-button" onClick={() => setSelected(next)}>Continue Water day {next + 1} · {waterDays[next].title}</button>}
    {waterWeeks.map((week, w) => <details className="journey-disclosure" key={week.title}>
      <summary>Week {w + 1} · {week.title}<small>{week.theme}</small></summary><p>{week.law}</p>
      {waterDays.slice(w * 7, w * 7 + 7).map((day, offset) => {
        const i = w * 7 + offset;
        const prefix = waterPrefix(i);
        return <button className="journey-row" key={day.title} onClick={() => setSelected(i)}><span>Day {i + 1} · {day.title}<small>{data.answers[prefix + 'completed'] === '1' ? 'Complete · revisit' : data.answers[prefix + 'saved'] === '1' ? 'Draft saved' : 'Ready when you are'}</small></span><span aria-hidden="true">→</span></button>;
      })}
    </details>)}
  </section>;
}

function WaterLesson({ day, onClose }: { day: number; onClose: () => void }) {
  const { data, save } = useJourney();
  const lesson = waterDays[day];
  const guide = waterGuides[day];
  const prefix = waterPrefix(day);
  const heading = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(
    ['reflection:0', 'reflection:1', 'practice', 'action', 'evening', 'evidence', 'plan', 'check:reading', 'check:practice', 'check:journal', 'check:action', 'check:evening', 'check:reminder', 'check:milestone', 'check:evidence'].map(key => [key, data.answers[prefix + key] || ''])
  ));
  const [step, setStep] = useState(() => Math.max(0, Math.min(7, data.answers[prefix + 'place'] !== undefined && Number.isInteger(Number(data.answers[prefix + 'place'])) ? Number(data.answers[prefix + 'place']) : nextWaterStep(values))));
  const [full, setFull] = useState(false);
  const [ceremony, setCeremony] = useState(() => {
    const saved = Number(data.answers[prefix + 'ceremony-place']);
    return Number.isInteger(saved) && saved >= 0 && saved < guide.practice.length ? saved : 0;
  });
  function moveCeremony(next: number) {
    setCeremony(next);
    try { const latest = getJourneySnapshot(); save({ ...latest, answers: { ...latest.answers, [prefix + 'ceremony-place']: String(next) } }); }
    catch { setStatus('Could not save your place.'); }
  }
  const [status, setStatus] = useState('');
  useEffect(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }); }, [step]);
  const done = data.answers[prefix + 'completed'] === '1';
  function persist(complete: boolean, close = false) {
    try {
      save({ ...data, answers: { ...waterAnswers(data.answers, day, values, complete), [RESUME_KEY]: JSON.stringify({ kind: 'water', day }) } });
      setStatus(complete ? 'Day completed and saved on this device. Return to Water days for your next practice.' : 'Draft saved on this device.');
      if (close) onClose();
    } catch { setStatus('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  function continueFrom(step: number) {
    const nextValues = { ...values, [`check:${waterSteps[step][0]}`]: '1' };
    try {
      save({ ...data, answers: { ...waterAnswers(data.answers, day, nextValues, done), [RESUME_KEY]: JSON.stringify({ kind: 'water', day }) } });
      setValues(nextValues);
      setStatus('Step saved.');
      goToStep(Math.min(step + 1, waterSteps.length - 1));
    } catch { setStatus('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  function goToStep(step: number) {
    setStep(step);
    heading.current?.focus();
    try { const latest = getJourneySnapshot(); save({ ...latest, answers: { ...latest.answers, [prefix + 'place']: String(step) } }); } catch { setStatus('Could not save your place.'); }

  }
  function nextButton(step: number) {
    return <button type="button" className="journey-button" onClick={() => continueFrom(step)}>{data.answers[prefix + `check:${waterSteps[step][0]}`] === '1' ? 'Saved · Continue → ' : 'Save step → '}{waterSteps[Math.min(step + 1, waterSteps.length - 1)][1]}</button>;
  }
  function changeValue(key: string, value: string) {
    const next = { ...values, [key]: value }; setValues(next);
    try { const latest = getJourneySnapshot(); save({ ...latest, answers: { ...waterAnswers(latest.answers, day, next, done), [RESUME_KEY]: JSON.stringify({ kind: 'water', day }) } }); setStatus('Draft saved on this device.'); }
    catch { setStatus('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  function field(key: string, label: string) {
    return <label className="journey-label" key={key}>{label}<textarea maxLength={8000} value={values[key]} onChange={e => changeValue(key, e.target.value)} /></label>;
  }
  return <form className="water-lesson" onSubmit={e => { e.preventDefault(); persist(done); }}>
    <button className="journey-button" type="button" onClick={() => persist(done, true)}>Save and return to Water days</button>
    <h3 className="serif" ref={heading} tabIndex={-1}>Day {day + 1} · {lesson.title}</h3>
    <p>{waterWeeks[Math.floor(day / 7)].title} · Self-guided daily workshop</p>
    <section className="practice-next"><p aria-live="polite">Step {step + 1} of 8 · {waterSteps[step][1]}</p><progress aria-label="Current workshop step" max={8} value={step + 1} /><button type="button" className="journey-button" onClick={() => setFull(!full)}>{full ? 'Show one step at a time' : 'Read the full day'}</button><button type="button" className="journey-button" disabled={step === 0} onClick={() => goToStep(step - 1)}>← Previous step</button><SaveFeedback message={status} /></section>
    <aside className="water-pause" hidden={!full && step !== 0}><h4>Before you start</h4><p>{guide.prepare}</p><p>Breathe naturally. Sipping is optional; follow any prescribed fluid limits. Adapt or skip any exercise.</p></aside>
    <section hidden={!full && step !== 0}>
    <h4 id="water-step-0" tabIndex={-1}>1. Today’s Wisdom From Water</h4><p className="journey-muted">Allow 5–10 minutes to read slowly and reflect.</p><blockquote>{lesson.wisdom}</blockquote><details key={`teaching-${full}`} open={full || undefined} className="journey-disclosure"><summary>Read today’s teaching</summary><p>{lesson.teaching}</p>
    {guide.teaching.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</details>
    <p>How does today’s lesson connect with your life right now?</p>
    <p className="journey-muted">Think of one situation, feeling or habit. Pause to reflect; no writing is needed here.</p>
    <button type="button" className="journey-button journey-primary" onClick={() => continueFrom(0)}>Continue to water ceremony →</button>
    </section>
    <section hidden={!full && step !== 1}>
    <h4 id="water-step-1" tabIndex={-1}>2. Sacred Water Ceremony</h4><p className="journey-muted">Allow 5–10 minutes. Follow one step at a time.</p>
    {full ? <ol className="water-steps">{guide.practice.map(instruction => <li key={instruction}>{instruction}</li>)}</ol> : <section aria-label="Ceremony instruction">
      <p className="journey-muted">Instruction {ceremony + 1} of {guide.practice.length}</p>
      <p aria-live="polite">{guide.practice[ceremony]}</p>
      <button className="journey-button" type="button" disabled={ceremony === 0} onClick={() => moveCeremony(ceremony - 1)}>← Back</button>
      {ceremony < guide.practice.length - 1 && <button className="journey-button journey-primary" type="button" onClick={() => moveCeremony(ceremony + 1)}>Next instruction →</button>}
    </section>}
    <div hidden={!full && ceremony < guide.practice.length - 1}>
    <p>Read these words aloud or silently, using a normal, comfortable voice:</p><blockquote>{lesson.declaration}</blockquote>
    <p>To close, set the glass down safely. If you wish, take a comfortable sip of fresh drinking water from a clean glass. Do not drink water used for hand immersion, reflection bowls or offerings. Notice your surroundings before turning to your writing. No special sensation is required.</p>
    {field('practice', 'My practice notes, statements or commitments')}
    {nextButton(1)}
    </div>
    </section>
    <section hidden={!full && step !== 2}>
    <h4 id="water-step-2" tabIndex={-1}>3. Water Reflection Journal</h4><p className="journey-muted">Allow about 5 minutes, or longer if useful.</p><p>A few honest words are enough. You may skip a question.</p><details key={`journal-${full}`} open={full || undefined} className="journey-disclosure"><summary>Help me reflect</summary><p>{guide.journal}</p><p>Begin with “Right now I notice…” if you feel stuck. You can also write privately in a notebook.</p></details>
    {lesson.prompts.map((prompt, i) => field(`reflection:${i}`, prompt))}
    {nextButton(2)}
    </section>
    <section hidden={!full && step !== 3}>
    <h4 id="water-step-3" tabIndex={-1}>4. Aligned Action Challenge</h4><p>{lesson.action}</p><details key={`action-${full}`} open={full || undefined} className="journey-disclosure"><summary>How to take this action</summary><p>{guide.action}</p><p>Choose when to act. Return to note what happened, or what you need to adjust.</p></details>{field('action', 'My action, when I will do it, and what happened')}
    <PracticeReminder day={day} title="Water · Aligned action" action={values.action || lesson.action} location={`Manifest → Manifesting Through Water → Day ${day + 1}`} label="Remind me to take my action" />
    {day === 20 && field('plan', 'My 90-day plan: priorities, weekly actions and review dates')}
    {nextButton(3)}
    </section>
    <section hidden={!full && step !== 4}>
    <h4 id="water-step-4" tabIndex={-1}>5. Water Reminder Practice</h4><p>At one ordinary water break today, pause briefly and return to these words. Use the pause as a reminder of your chosen action, without adding extra drinking or trying to monitor every sip.</p><blockquote>{lesson.reminder}</blockquote>
    {nextButton(4)}
    </section>
    <section hidden={!full && step !== 5}>
    <h4 id="water-step-5" tabIndex={-1}>6. Evening Water Integration</h4><p className="journey-muted">Return for 2–5 minutes before resting.</p><p>{lesson.evening}</p><details key={`evening-${full}`} open={full || undefined} className="journey-disclosure"><summary>Guide my evening reflection</summary><p>{guide.evening}</p></details>{field('evening', 'My evening reflection')}
    <PracticeReminder day={day} title="Water · Evening reflection" action={lesson.evening} prompt="Return for your evening reflection and record what you noticed today." location={`Manifest → Manifesting Through Water → Day ${day + 1}`} label="Remind me to return this evening" />
    {nextButton(5)}
    </section>
    <section hidden={!full && step !== 6}>
    <h4 id="water-step-6" tabIndex={-1}>7. Daily Milestone</h4><p>{lesson.milestone}</p><p>Optional: note what you tried or adapted today.</p>
    <fieldset><legend>My daily practice</legend>{[['reading', 'I read and reflected on the teaching'], ['practice', 'I tried or adapted the ceremony'], ['journal', 'I took time for the reflection'], ['action', 'I took or planned my action'], ['evening', 'I returned for the evening review']].map(([key, label]) => <label className="water-check" key={key}><input type="checkbox" checked={values[`check:${key}`] === '1'} onChange={e => changeValue(`check:${key}`, e.target.checked ? '1' : '0')} />{label}</label>)}</fieldset>
    {nextButton(6)}
    </section>
    <section hidden={!full && step !== 7}>
    <h4 id="water-step-7" tabIndex={-1}>8. Manifestation Evidence Tracker</h4><p>Record your action and what actually happened. Keep your interpretation separate; coincidences do not establish cause and effect.</p>{field('evidence', 'What happened, what I noticed, and what I learned')}
    <p>Save a draft if you are returning later. When you have finished your chosen practices and review, mark the day complete. You can revisit any day; there is no penalty for taking longer.</p>
    <button className="journey-button" type="submit">{done ? 'Save writing' : 'Save draft'}</button>
    <button className="journey-button" type="button" onClick={() => persist(true)}>{done ? 'Save completed day' : 'Save and mark day complete'}</button>
    {done && <p role="status">Your day is complete. {day < 20 ? `Next time: Day ${day + 2} · ${waterDays[day + 1].title}.` : 'You have completed all 21 days. Revisit your action plan whenever you need.'}</p>}
    {done && <button className="journey-button" type="button" onClick={() => persist(false)}>Mark as in progress</button>}
    <button className="journey-button" type="button" onClick={() => persist(done, true)}>Save and return to Water days</button>
    </section>
    <p className="journey-muted">Your writing stays in this browser unless you turn on Private account saving in Profile. On shared devices, sign out when you finish.</p>
  </form>;
}

