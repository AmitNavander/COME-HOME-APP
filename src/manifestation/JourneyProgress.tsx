import { useJourney } from './journeyStore';
import { hub } from '../store/hub';
import { foundationDays } from './foundationDays';
import './journey.css';
import { waterDays as courseDays, waterPrefix } from './waterCourse';

export default function JourneyProgress() {
  const { data } = useJourney();
  const waterDays = Array.from({length: 21}, (_, i) => i).filter(i => data.answers[`water:${i}:saved`] === '1').length;
  const waterCompleted = courseDays.filter((_, i) => data.answers[waterPrefix(i) + 'completed'] === '1').length;
  return <section className="journey-card">
    <div className="eyebrow">Manifestation progress</div><h2 className="serif">Your practice, at your pace.</h2>
    {data.goal && <p>{data.goal}</p>}
    <progress max={7} value={data.completed.length} aria-label="Foundation days completed" />
    <p>{data.completed.length} of 7 foundation days complete · {waterCompleted} of 21 Water days complete</p>
    {waterDays > 0 && <p>{waterDays} previous workbook days preserved</p>}
    <ul>{foundationDays.map((day, i) => <li key={day.title}>Day {i + 1} · {day.title} — {data.completed.includes(i) ? 'Complete' : data.answers[String(i)] ? 'Draft saved' : 'Not started'}</li>)}</ul>
    <button className="journey-button" onClick={() => hub.setTab('manifest')}>Return to my manifestation →</button>
  </section>;
}
