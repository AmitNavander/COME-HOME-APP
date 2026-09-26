import DailyAffirmation from '../affirmations/DailyAffirmation';
import { hub } from '../store/hub';
import { usePrefs } from '../store/prefs';
import { useJourney } from './journeyStore';
import { foundationDays, nextFoundationDay } from './foundationDays';
import { dailyKey, localDay, nextStage, readDay, readPlan } from './goalWorkflow';
import './journey.css';

export default function JourneyToday() {
  const prefs = usePrefs();
  const { data } = useJourney();
  const foundation = nextFoundationDay(data.completed);
  const plan = readPlan(data.answers, data.goal, data.why);
  const practice = readDay(data.answers[dailyKey(plan.id, localDay())]);
  const next = ['Define your goal', 'Prepare for obstacles', 'Rehearse your next step', 'Take your planned action', 'Review your progress'][nextStage(plan, practice)];
  return <div className="screen"><main className="journey-page">
    <div className="eyebrow">COME HOME · Today</div><h1 className="serif">Welcome home{prefs.name ? `, ${prefs.name.split(' ')[0]}` : ''}.</h1>
    <DailyAffirmation />
    <p>Repeat your daily affirmation above, or choose a focused path below.</p>
    <section className="journey-card"><div className="eyebrow">Meditate</div><h2 className="serif">A place to pause and rest.</h2><p>Breathing, meditation, sleep and emotional support.</p><button className="journey-button journey-primary" onClick={() => hub.setTab('library')}>Meditate →</button></section>
    <section className="journey-card"><div className="eyebrow">Manifest</div><h2 className="serif">A direction for what matters.</h2><p>Explore intention, visualization and practical action.</p><p>{foundation === null ? 'Foundation complete. Revisit any day.' : `Foundation: day ${foundation + 1} · ${foundationDays[foundation].title}`}</p><button className="journey-button journey-primary" onClick={() => hub.setTab('manifest')}>Open Manifest</button>{plan.id && <p className="journey-muted">Your next plan step: {next}</p>}</section>

  </main></div>;
}
