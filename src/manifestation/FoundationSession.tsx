import { useState } from 'react';
import { foundationDays } from './foundationDays';
import { useJourney } from './journeyStore';

export default function FoundationSession({ day, onClose }: { day: number; onClose: () => void }) {
  const { data, save } = useJourney();
  const lesson = foundationDays[day];
  const [reflection, setReflection] = useState(data.answers[String(day)] || '');
  const [evening, setEvening] = useState(data.answers[`evening:${day}`] || '');
  const [action, setAction] = useState(data.answers[`action:${day}`] || '');
  const [message, setMessage] = useState('');
  function persist(complete: boolean, close = false) {
    try {
      save({ ...data, answers: { ...data.answers, [day]: reflection, [`evening:${day}`]: evening, [`action:${day}`]: action }, completed: complete ? [...new Set([...data.completed, day])] : data.completed });
      setMessage(complete ? 'Day completed. You can return and edit any time.' : 'Draft saved on this device.');
      if (close) onClose();
    } catch { setMessage('Could not save. Keep this page open and copy your writing before leaving.'); }
  }
  return <div className="screen"><main className="journey-page">
    <button className="journey-button" onClick={() => persist(false, true)}>← Save and return to Manifest</button>
    <div className="eyebrow">Free foundation · Day {day + 1} of 7 · About {lesson.minutes} minutes</div>
    <h1 className="serif">{lesson.title}</h1>
    <p className="journey-muted">Development edition · new written content for review. No guided audio yet.</p>
    <section className="journey-card"><h2 className="serif">Begin here</h2><p>{lesson.teaching}</p></section>
    <section className="journey-card journey-hero"><h2 className="serif">Your practice</h2><ol>{lesson.practice.map((step, i) => <li className="journey-row" key={step}><span className="journey-number">{i + 1}</span><span>{step}</span></li>)}</ol><p>You can pause or stop at any time.</p></section>
    <section className="journey-card"><div className="eyebrow">Affirmation</div><p className="serif journey-quote">{lesson.affirmation}</p></section>
    <form onSubmit={e => { e.preventDefault(); persist(true); }}>
      <section className="journey-card"><h2 className="serif">Reflect</h2><label className="journey-label">{lesson.prompt}<textarea maxLength={8000} value={reflection} onChange={e => setReflection(e.target.value)} /></label></section>
      <section className="journey-card"><h2 className="serif">Carry it into life</h2><p>{lesson.action}</p><label className="journey-label">My next action<textarea maxLength={4000} value={action} onChange={e => setAction(e.target.value)} /></label></section>
      <section className="journey-card"><h2 className="serif">Return this evening</h2><label className="journey-label">{lesson.evening}<textarea maxLength={8000} value={evening} onChange={e => setEvening(e.target.value)} /></label></section>
      <p>Writing is optional. Mark complete when you have finished the practice, not when you have achieved an outcome.</p>
      <button className="journey-button" type="button" onClick={() => persist(false)}>Save draft</button>
      <button className="journey-button" type="submit">{data.completed.includes(day) ? 'Save completed day' : 'Mark day complete'}</button>
      <p role="status">{message}</p>
    </form>
    <p className="journey-muted">Stored in this browser only. Use Save before switching tabs or closing the page.</p>
  </main></div>;
}
