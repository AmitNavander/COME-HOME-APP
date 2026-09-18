import PracticeReminder from './PracticeReminder';
import { useEffect, useRef, useState } from 'react';
import { useJourney } from './journeyStore';
import { blankDay, dailyKey, localDay, nextStage, PLAN_KEY, planReady, readDay, readPlan, readReviews, reviewReady } from './goalWorkflow';
import type { DailyPractice, GoalPlan } from './goalWorkflow';

const stages = ['Define', 'Prepare', 'Visualize', 'Act', 'Review'];

export default function GoalWorkflow() {
  const { data, save } = useJourney();
  const [plan, setPlan] = useState(() => readPlan(data.answers, data.goal, data.why));
  const [date, setDate] = useState(localDay);
  const [day, setDay] = useState(() => readDay(data.answers[dailyKey(plan.id, date)]));
  const [stage, setStage] = useState(() => nextStage(plan, day));
  const [status, setStatus] = useState('');
  const [dirty, setDirty] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const savedPlan = readPlan(data.answers, data.goal, data.why);
  const reviews = readReviews(data.answers);
  const pastPractices = Object.entries(data.answers).filter(([key]) => key.startsWith('manifest-daily:v1:')).map(([key, value]) => {
    const parts = key.split(':');
    const id = parts[2];
    const original = id === savedPlan.id ? savedPlan : readPlan({ [PLAN_KEY]: data.answers[`manifest-archive:v1:${id}`] || '' });
    return { key, date: parts[3], goal: original.goal, practice: readDay(value) };
  }).filter(item => item.practice.action || item.practice.scene).sort((a, b) => b.date.localeCompare(a.date));
  useEffect(() => { heading.current?.focus(); }, [stage]);
  // Protect writing on browser reload/close. In-app tab changes still require Save.
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [dirty]);
  function updatePlan(key: keyof GoalPlan, value: string) { setPlan(old => ({ ...old, [key]: value })); setDirty(true); }
  function updateDay(key: keyof DailyPractice, value: string | boolean) { setDay(old => ({ ...old, [key]: value })); setDirty(true); }
  function persist(next?: number, review = false) {
    if (review && !reviewReady(day)) { setStatus('Record the action result, progress, evidence, learning and next step before saving a review.'); return; }
    try {
      const changedGoal = !!savedPlan.id && plan.goal.trim() !== savedPlan.goal.trim();
      const nextPlan = { ...plan, goal: plan.goal.trim(), why: plan.why.trim(), id: !plan.id || changedGoal ? crypto.randomUUID() : plan.id };
      const nextDay = changedGoal ? blankDay() : day;
      const answers: Record<string, string> = { ...data.answers, [PLAN_KEY]: JSON.stringify(nextPlan) };
      if (changedGoal) answers[`manifest-archive:v1:${savedPlan.id}`] = JSON.stringify(savedPlan);
      answers[dailyKey(nextPlan.id, date)] = JSON.stringify(nextDay);
      if (review) {
        // One review per goal/day; later edits update this day's review, not inflate counts.
        const id = `${nextPlan.id}:${date}`;
        answers[`manifest-review:v1:${id}`] = JSON.stringify({ id, at: new Date().toISOString(), plan: nextPlan, day: nextDay });
      }
      save({ ...data, goal: nextPlan.goal, why: nextPlan.why, answers });
      setPlan(nextPlan); setDay(nextDay); setDirty(false);
      setStatus(review ? 'Review saved. Your next step is ready for your next practice.' : 'Saved on this device.');
      if (next !== undefined) setStage(next);
    } catch { setStatus('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  function navigate(to: number) {
    if (to > 0 && !planReady(plan)) { setStatus('Define your goal, reason, measure, starting point, target and review date first.'); return; }
    if (to > 1 && (!plan.obstacle.trim() || !plan.response.trim())) { setStatus('Prepare an obstacle and an if–then response first.'); return; }
    persist(to);
  }
  function planField(key: keyof GoalPlan, label: string, placeholder = '', type = 'text') {
    return <label className="journey-label">{label}<input type={type} required={key !== 'support'} maxLength={1000} value={plan[key]} placeholder={placeholder} onChange={e => updatePlan(key, e.target.value)} /></label>;
  }
  function dayField(key: keyof DailyPractice, label: string, placeholder = '') {
    return <label className="journey-label">{label}<textarea maxLength={5000} value={String(day[key])} placeholder={placeholder} onChange={e => updateDay(key, e.target.value)} /></label>;
  }
  return <section className="journey-card goal-workflow">
    <div className="eyebrow">Your personal manifestation plan</div>
    <h2 className="serif">Turn your intention into a practice.</h2>
    <p>A clear goal, a prepared mind and a next action. Review actual progress and adjust as you learn.</p>
    {plan.reviewDate && plan.reviewDate <= localDay() && <p className="water-pause">Your chosen review date has arrived. Use Review to compare your current progress with your target and decide what to change.</p>}
    <nav className="goal-stages" aria-label="Manifestation steps">{stages.map((label, i) => <button key={label} type="button" aria-current={stage === i ? 'step' : undefined} onClick={() => navigate(i)}>{i + 1}. {label}</button>)}</nav>
    <h3 ref={heading} tabIndex={-1} className="serif">{stage + 1}. {stages[stage]}</h3>
    {plan.goal && stage > 0 && <p><strong>Your goal:</strong> {plan.goal}<br /><small>Starting point: {plan.baseline} · Target: {plan.target} · Review: {plan.reviewDate}</small></p>}
    <form onSubmit={e => { e.preventDefault(); if (stage === 3 && (!day.action.trim() || !day.when)) { setStatus('Choose a specific action and when you will do it.'); return; } if (stage === 4) persist(undefined, true); else navigate(stage + 1); }}>
      {stage === 0 && <>
        <p>Choose one meaningful goal. Describe observable progress and separate what you can do from outcomes that depend on others.</p>
        {planField('goal', 'What are you working toward?', 'Example: finish the first draft of my book')}
        {planField('why', 'Why does this matter to you?')}
        {planField('measure', 'How will you recognize progress?', 'Example: chapters drafted and reviewed')}
        {planField('baseline', 'Where are you starting?', 'Example: 2 chapters drafted')}
        {planField('target', 'What would meaningful progress look like?', 'Example: 6 chapters drafted')}
        {planField('reviewDate', 'When will you review the goal?', '', 'date')}
        <p className="journey-muted">Changing the goal starts a fresh daily practice. Earlier saved writing and reviews are retained.</p>
      </>}
      {stage === 1 && <>
        <p>Prepare for an ordinary difficult day. Find a quiet place, sit comfortably and let your breathing stay natural. You may keep your eyes open throughout.</p>
        {planField('obstacle', 'What is most likely to get in your way?', 'Example: waiting until I have a free hour')}
        {planField('response', 'If that happens, what will you do?', 'If I have only ten minutes, then I will draft one paragraph')}
        {planField('support', 'What support or resource would help? (optional)')}
        <p>Keep the response small, safe and within your influence. A goal involving health or finances may also need qualified support.</p>
      </>}
      {stage === 2 && <>
        <p>Allow about five minutes. Read one step, pause and do it. This is mental rehearsal, not a prediction. If you do not form mental pictures, describe the scene in words.</p>
        <ol className="water-steps">
          <li><strong>Arrive · about 30 seconds.</strong> Feel the chair and the floor. Notice three things around you. Let your breathing be comfortable.</li>
          <li><strong>See a meaningful moment · about one minute.</strong> Imagine observable progress toward “{plan.goal}”. Where are you? What are you doing? What would you see or hear that relates to “{plan.measure}”?</li>
          <li><strong>Meet the feeling · about 30 seconds.</strong> Notice what the scene means to you: “{plan.why}”. No particular emotion is required.</li>
          <li><strong>Rehearse the work · about two minutes.</strong> Picture an ordinary day of taking action. Now imagine “{plan.obstacle}”. Rehearse your response: “{plan.response}”. See yourself beginning the first small step, not only celebrating the result.</li>
          <li><strong>Return · about 30 seconds.</strong> Look around the room. Ask what you can do today. Let the image become one concrete action.</li>
        </ol>
        {dayField('scene', 'What did you rehearse? What action did it suggest?')}
        <label className="water-check"><input type="checkbox" checked={day.visualized} onChange={e => updateDay('visualized', e.target.checked)} />I tried or adapted the visualization</label>
        <p>You can continue to action without visualization if it does not suit you.</p>
      </>}
      {stage === 3 && <>
        <p>Choose one action you control. Give it a time and a clear finish. For example: draft one paragraph after breakfast, rather than become a successful author.</p>
        {dayField('action', 'My next action', 'What exactly will you do? Keep it achievable today.')}
        <label className="journey-label">When will you do it?<input type="datetime-local" required value={day.when} onChange={e => updateDay('when', e.target.value)} /></label>
        <p><strong>If I get stuck:</strong> {plan.response}</p>
        <label className="journey-label">Action status<select value={day.status} onChange={e => updateDay('status', e.target.value)}><option value="planned">Planned</option><option value="done">Done</option><option value="partial">Partly done</option><option value="blocked">Blocked / needs adjustment</option></select></label>
        <p className="journey-muted">This saves your plan; it does not send a notification. Return after acting to record what happened.</p>
      </>}
      {stage === 4 && <>
        <p>Review outcomes separately from participation. Completing a visualization is a practice milestone; it is not proof that the goal has been achieved.</p>
        {dayField('actual', `Where are you now? Measure: ${plan.measure}`, `Starting point: ${plan.baseline}; target: ${plan.target}`)}
        {dayField('evidence', 'What actually happened? What evidence supports this?')}
        {dayField('learning', 'What worked, or what got in the way?')}
        {dayField('next', 'What is the next step or adjustment?')}
        <label className="journey-label">Your assessment<select value={day.outcome} onChange={e => updateDay('outcome', e.target.value)}><option value="ongoing">Still working toward the goal</option><option value="achieved">I achieved my defined goal</option><option value="revise">I need to revise my plan</option></select></label>
        {day.status === 'planned' && <p>Return to Act and record the action result before saving a review. “Blocked” is a valid result.</p>}
      </>}
      <div className="goal-actions"><button type="button" className="journey-button" onClick={() => persist()}>Save draft</button><button className="journey-button" type="submit">{stage === 4 ? 'Save my review' : `Save and continue to ${stages[stage + 1]}`}</button></div>
    </form>
    <PracticeReminder key={`${plan.id}:${stage}`} title={stage === 3 ? 'Take my planned action' : stage === 4 ? 'Review my goal progress' : 'Return to my goal practice'} action={stage === 3 ? day.action || 'Take one small planned action.' : stage === 4 ? day.next || 'Review progress, record evidence and choose the next step.' : 'Continue preparing and rehearsing the next step toward my goal.'} prompt={stage === 4 ? 'Review what happened, what you learned and your next step.' : 'Return to your goal plan and take one manageable next step.'} location="Manifest → My goal plan" label={stage === 3 ? 'Remind me to take action' : stage === 4 ? 'Set my next review reminder' : 'Remind me to continue'} />
    <p role="status">{status}</p>
    <p className="journey-muted">{dirty ? 'You have unsaved changes. ' : ''}Save before changing tabs. Your plan and writing stay in this browser.</p>
    {date !== localDay() && <button className="journey-button" onClick={() => { if (dirty) { setStatus('Save your current writing before opening today.'); return; } const today = localDay(); const next = readDay(data.answers[dailyKey(plan.id, today)]); setDate(today); setDay(next); setStage(nextStage(plan, next)); }}>Open today’s practice</button>}
    <details><summary>Review history · {reviews.length} saved {reviews.length === 1 ? 'day' : 'days'}</summary>{reviews.length === 0 ? <p>Your reviews will appear here after you record an action and its result.</p> : reviews.map(review => <article className="water-pause" key={review.id}><h4>{review.plan.goal}</h4><p>{new Date(review.at).toLocaleDateString()} · {review.day.outcome === 'achieved' ? 'Goal achieved · self-reported' : review.day.outcome === 'revise' ? 'Plan needs adjustment' : 'In progress'}</p><p>Action: {review.day.action} ({review.day.status})</p><p>Progress: {review.day.actual}</p><p>Evidence: {review.day.evidence}</p><p>Learning: {review.day.learning}</p><p>Next: {review.day.next}</p></article>)}</details>
    <details><summary>Saved practice history</summary>{pastPractices.length === 0 ? <p>Your saved rehearsals and actions will appear here.</p> : pastPractices.map(item => <article key={item.key} className="water-pause"><h4>{item.goal || 'Earlier goal'}</h4><p>{item.date}</p><p>Rehearsal: {item.practice.scene || 'Not recorded'}</p><p>Action: {item.practice.action || 'Not recorded'} · {item.practice.status}</p>{item.practice.when && <p>Scheduled: {item.practice.when.replace('T', ' ')}</p>}</article>)}</details>
  </section>;
}
