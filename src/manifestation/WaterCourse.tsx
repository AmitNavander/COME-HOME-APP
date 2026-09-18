import { useEffect, useRef, useState } from 'react';
import { useJourney } from './journeyStore';
import { nextWaterDay, waterAnswers, waterDays, waterPrefix, waterWeeks } from './waterCourse';
import { waterGuides } from './waterGuide';

export default function WaterCourse() {
  const { data } = useJourney();
  const [selected, setSelected] = useState<number | null>(null);
  const completed = waterDays.filter((_, i) => data.answers[waterPrefix(i) + 'completed'] === '1').length;
  const next = nextWaterDay(data.answers);
  if (selected !== null) return <WaterLesson key={selected} day={selected} onClose={() => setSelected(null)} />;
  return <section>
    <p>A 21-Day Sacred Transformation Journey</p>
    <p>Master Facilitator: Amit C. Navander<br />Reiki Grandmaster · Family Constellation · Master of Rescripting Astropsychology</p>
    <p>Read, pause and practice—one day at a time. Each day contains the teaching and instructions you need to work through the exercises without audio or a facilitator.</p>
    <p className="journey-muted">Expanded self-guided edition based on Amit’s curriculum, with safety and factual edits. This is an adapted edition, not the original manuscript word for word.</p>
    <p>Allow about 25–35 minutes for reading, practice, writing and action, plus a brief evening return. These are flexible planning estimates; split a day into smaller sittings whenever you need.</p>
    <details><summary>Before you begin</summary>
      <p>Water is used as a spiritual symbol and reminder for reflection and action. These practices do not establish that water stores intentions, rewrites DNA, treats trauma or guarantees health or financial outcomes.</p>
      <p>Use a clean food-safe glass and fresh drinking water. A simple quiet space is enough; special vessels, crystals and purchases are not required. Keep ink, oils, decorative objects and used ritual water separate from drinking water.</p>
      <p>All sipping is optional. Drink normally, follow any prescribed fluid limits, breathe comfortably and stop if distressed. You may skip any exercise. These practices do not replace medical or mental-health care.</p>
    </details>
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
    ['reflection:0', 'reflection:1', 'practice', 'action', 'evening', 'evidence', 'plan', 'check:reading', 'check:practice', 'check:journal', 'check:action', 'check:evening'].map(key => [key, data.answers[prefix + key] || ''])
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
  return <form className="water-lesson" onSubmit={e => { e.preventDefault(); persist(done); }}>
    <button className="journey-button" type="button" onClick={() => persist(done, true)}>Save and return to Water days</button>
    <h3 className="serif" ref={heading} tabIndex={-1}>Day {day + 1} · {lesson.title}</h3>
    <p>{waterWeeks[Math.floor(day / 7)].title} · Self-guided daily workshop</p>
    <aside className="water-pause"><h4>Before you start</h4><p>{guide.prepare}</p><p>Read one section, then pause to do it. You do not need to memorize the page or finish in one sitting. Keep your breathing natural. Any sipping is optional, with no extra quantity required; follow any prescribed fluid limits. You can shorten, adapt or skip an exercise.</p><p>Use Save whenever you stop. Come back to this same day for the evening practice; your notes will be here in this browser.</p></aside>
    <h4>1. Today’s Wisdom From Water</h4><p className="journey-muted">Allow 5–10 minutes to read slowly and reflect.</p><blockquote>{lesson.wisdom}</blockquote><p>{lesson.teaching}</p>
    {guide.teaching.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    <p className="water-pause">Pause here. Which sentence feels relevant to your life today? Read it once more before moving to the practice.</p>
    <h4>2. Sacred Water Ceremony</h4><p className="journey-muted">Allow 5–10 minutes. Follow one step at a time.</p>
    <ol className="water-steps">{guide.practice.map(step => <li key={step}>{step}</li>)}</ol>
    <p>Read these words aloud or silently, using a normal, comfortable voice:</p><blockquote>{lesson.declaration}</blockquote>
    <p>To close, set the glass down safely. If you wish, take a comfortable sip of fresh drinking water from a clean glass. Do not drink water used for hand immersion, reflection bowls or offerings. Notice your surroundings before turning to your writing. No special sensation is required.</p>
    {field('practice', 'My practice notes, statements or commitments')}
    <button className="journey-button" type="submit">Save my practice notes</button>
    <h4>3. Water Reflection Journal</h4><p className="journey-muted">Allow about 5 minutes, or longer if useful.</p><p>{guide.journal}</p><p>Use the practice-notes space above for any lists or statements, and the fields below for the questions. A few honest sentences are enough. If you feel stuck, begin with “Right now I notice…” You may keep any response private in a paper notebook or leave it blank.</p>
    {lesson.prompts.map((prompt, i) => field(`reflection:${i}`, prompt))}
    <button className="journey-button" type="submit">Save my reflections</button>
    <h4>4. Aligned Action Challenge</h4><p>{lesson.action}</p><p>{guide.action}</p><p>Before leaving this page, decide what you will do and when. Afterward, return to record what happened. If the action was not possible, write the adjustment you want to try.</p>{field('action', 'My action, when I will do it, and what happened')}
    {day === 20 && field('plan', 'My 90-day plan: priorities, weekly actions and review dates')}
    <h4>5. Water Reminder Practice</h4><p>At one ordinary water break today, pause briefly and return to these words. Use the pause as a reminder of your chosen action, without adding extra drinking or trying to monitor every sip.</p><blockquote>{lesson.reminder}</blockquote>
    <h4>6. Evening Water Integration</h4><p className="journey-muted">Return for 2–5 minutes before resting.</p><p>{lesson.evening}</p><p>{guide.evening}</p>{field('evening', 'My evening reflection')}
    <h4>7. Daily Milestone</h4><p>{lesson.milestone}</p><p>Use this optional checklist to remember where you stopped. It records your participation, not a guaranteed transformation. Adapted or skipped practices can be noted in your journal.</p>
    <fieldset><legend>My daily practice</legend>{[['reading', 'I read and reflected on the teaching'], ['practice', 'I tried or adapted the ceremony'], ['journal', 'I took time for the reflection'], ['action', 'I took or planned my action'], ['evening', 'I returned for the evening review']].map(([key, label]) => <label className="water-check" key={key}><input type="checkbox" checked={values[`check:${key}`] === '1'} onChange={e => setValues(old => ({ ...old, [`check:${key}`]: e.target.checked ? '1' : '0' }))} />{label}</label>)}</fieldset>
    <h4>8. Manifestation Evidence Tracker</h4><p>Write one concrete observation, the action you took and what happened afterward. Then add your interpretation separately. For example: “I sent a message and received a reply. I felt encouraged.” Include things that did not change. Coincidences do not establish cause and effect.</p>{field('evidence', 'What happened, what I noticed, and what I learned')}
    <p>Save a draft if you are returning later. When you have finished your chosen practices and review, mark the day complete. You can revisit any day; there is no penalty for taking longer.</p>
    <button className="journey-button" type="submit">{done ? 'Save writing' : 'Save draft'}</button>
    <button className="journey-button" type="button" onClick={() => persist(true)}>{done ? 'Save completed day' : 'Save and mark day complete'}</button>
    {done && <button className="journey-button" type="button" onClick={() => persist(false)}>Mark as in progress</button>}
    <button className="journey-button" type="button" onClick={() => persist(done, true)}>Save and return to Water days</button>
    <p role="status">{status}</p><p className="journey-muted">Your writing stays in this browser, including on shared devices. It is not synced to your account.</p>
  </form>;
}
