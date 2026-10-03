import { useState } from 'react';
import SaveFeedback from './SaveFeedback';
import { RESUME_KEY } from './practiceProgress';
import PracticeReminder from './PracticeReminder';
import { foundationDays } from './foundationDays';
import { getJourneySnapshot, useJourney } from './journeyStore';
import { useAuth } from '../lib/auth';
import { useAccountCloud } from '../lib/accountCloud';

export default function FoundationSession({ day, onClose }: { day: number; onClose: () => void }) {
  const { data, save } = useJourney();
  const { user } = useAuth();
  const cloud = useAccountCloud();
  const lesson = foundationDays[day];
  const [reflection, setReflection] = useState(data.answers[String(day)] || '');
  const [evening, setEvening] = useState(data.answers[`evening:${day}`] || '');
  const [action, setAction] = useState(data.answers[`action:${day}`] || '');
  const [phase, setPhase] = useState(() => data.answers[`foundation-phase:${day}`] || 'practice');
  const [message, setMessage] = useState('');
  function change(key: string, value: string) {
    try { const latest = getJourneySnapshot(); save({ ...latest, answers: { ...latest.answers, [key]: value, [RESUME_KEY]: JSON.stringify({ kind: 'foundation', day }) } }); setMessage('Draft saved on this device.'); }
    catch { setMessage('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  function selectPhase(next: string) { setPhase(next); change(`foundation-phase:${day}`, next); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function persist(complete: boolean, close = false) {
    try {
      save({ ...data, answers: { ...data.answers, [RESUME_KEY]: JSON.stringify({ kind: 'foundation', day }), [day]: reflection, [`evening:${day}`]: evening, [`action:${day}`]: action }, completed: complete ? [...new Set([...data.completed, day])] : data.completed });
      setMessage(complete ? 'Day completed and saved on this device. Return to Manifest for your next practice.' : 'Draft saved on this device. You can return to this day later.');
      if (close) onClose();
    } catch { setMessage('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  return <div className="screen"><main className="journey-page">
    <button className="journey-button" onClick={() => persist(false, true)}>← Save and return to Manifest</button>
    <div className="eyebrow">Free foundation · Day {day + 1} of 7 · About {lesson.minutes} minutes</div>
    <h1 className="serif">{lesson.title}</h1>
    <p className="journey-muted">A self-guided written practice. Move gently and adapt any step that does not feel right for you.</p>
    <nav aria-label="Practice stages">{[['practice', '1. Practise now'], ['action', '2. Action today'], ['evening', '3. Evening review']].map(([key, label]) => <button type="button" className="journey-button" aria-pressed={phase === key} key={key} onClick={() => selectPhase(key)}>{label}</button>)}</nav>
    <SaveFeedback message={message} />
    <div hidden={phase !== 'practice'}>
    <section className="journey-card"><h2 className="serif">Begin here</h2><p>{lesson.teaching}</p></section>
    <section className="journey-card journey-hero"><h2 className="serif">Your practice</h2><ol>{lesson.practice.map((step, i) => <li className="journey-row" key={step}><span className="journey-number">{i + 1}</span><span>{step}</span></li>)}</ol><p>You can pause or stop at any time.</p></section>
    <section className="journey-card"><div className="eyebrow">Affirmation</div><p className="serif journey-quote">{lesson.affirmation}</p></section>
    </div>
    <form onSubmit={e => { e.preventDefault(); persist(true); }}>
      <div hidden={phase !== 'practice'}><section className="journey-card"><h2 className="serif">Reflect</h2><p>Write a few honest sentences. Notice what you felt, what mattered and what you want to do next. You may leave a question blank.</p><label className="journey-label">{lesson.prompt}<textarea maxLength={8000} value={reflection} onChange={e => { setReflection(e.target.value); change(String(day), e.target.value); }} /></label></section>
      <button className="journey-button" type="button" onClick={() => persist(false)}>Save reflection</button><button type="button" className="journey-button journey-primary" onClick={() => selectPhase("action")}>Next: choose my action →</button></div>
      <div hidden={phase !== 'action'}><section className="journey-card"><h2 className="serif">Carry it into life</h2><p>{lesson.action}</p><label className="journey-label">My next action<textarea maxLength={4000} value={action} onChange={e => { setAction(e.target.value); change(`action:${day}`, e.target.value); }} /></label><PracticeReminder day={day} title={lesson.title} action={action.trim() || lesson.action} /></section>
      <button className="journey-button" type="button" onClick={() => persist(false)}>Save my action for later</button><p>Take your action when you are ready. Return to the evening review afterward.</p><button type="button" className="journey-button" onClick={() => selectPhase("evening")}>Open evening review →</button></div>
      <div hidden={phase !== 'evening'}><section className="journey-card"><h2 className="serif">Return this evening</h2><label className="journey-label">{lesson.evening}<textarea maxLength={8000} value={evening} onChange={e => { setEvening(e.target.value); change(`evening:${day}`, e.target.value); }} /></label></section>
      <PracticeReminder day={day} title="Foundation · Evening reflection" action={lesson.evening} prompt="Return for a quiet evening reflection and save what you noticed." location={`Manifest → Foundation → Day ${day + 1}`} label="Remind me to return this evening" />
      <p>Writing is optional. Mark complete when you have finished the practice, not when you have achieved an outcome.</p>
      <button className="journey-button" type="button" onClick={() => persist(false)}>Save draft</button>
      <button className="journey-button" type="submit">{data.completed.includes(day) ? 'Save completed day' : 'Mark day complete'}</button>
      {data.completed.includes(day) && <p role="status">{day < 6 ? `Next time: ${foundationDays[day + 1].title}. Return when you are ready.` : "Your foundation is complete. Choose a deeper journey when you are ready."}</p>}
      </div>
      <SaveFeedback message={message} />
    </form>
    <p className="journey-muted">{!user.isGuest && cloud.enabled ? 'Your saved writing follows your private account.' : 'Your saved writing stays on this device. Turn on account saving from You if you want it across devices.'}</p>
  </main></div>;
}

