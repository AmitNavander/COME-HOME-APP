import { hub } from '../store/hub';
import { openTool } from '../store/tool';
import { usePrefs } from '../store/prefs';
import { useJourney } from './journeyStore';
import './journey.css';
import { foundationDays, nextFoundationDay } from './foundationDays';
import { beginMeditation } from '../hub/MeditationCollection';
import { programme } from '../store/programme';
import { dailyKey, localDay, nextStage, readDay, readPlan } from './goalWorkflow';

export default function JourneyToday() {
  const prefs = usePrefs();
  const { data } = useJourney();
  const nextDay = nextFoundationDay(data.completed);
  const plan = readPlan(data.answers, data.goal, data.why);
  const practice = readDay(data.answers[dailyKey(plan.id, localDay())]);
  const next = ['Define your goal', 'Prepare for obstacles', 'Rehearse your next step', 'Take your planned action', 'Review your progress'][nextStage(plan, practice)];
  const items = [
    ['Arrive', 'Let’s be here right now.', () => openTool('breathe')],
    ['Align', 'Set today’s intention', () => hub.setTab('manifest')],
    ['Experience', 'Explore your meditation practice', () => hub.setTab('library')],
    ['Act', 'Choose one inspired action', () => hub.setTab('manifest')],
    ['Receive', 'Write your evening reflection', () => hub.setTab('journal')],
  ] as const;
  return <div className="screen"><main className="journey-page">
    <div className="eyebrow">COME HOME</div>
    <p className="journey-muted">Meditate • Heal • Manifest • Become</p>
    <h1 className="serif">Welcome home{prefs.name ? `, ${prefs.name.split(' ')[0]}` : ''}.</h1>
    <p>Come home to yourself before you step into the world.</p>
    <section className="journey-card"><div className="eyebrow">Make room to meditate</div><h2 className="serif">Let’s be here right now.</h2><button className="journey-button" onClick={beginMeditation}>Begin meditation</button><button className="journey-button" onClick={() => hub.setTab('library')}>Browse all practices</button><button className="journey-button" onClick={() => programme.open('seven-days-home')}>Seven Days Home</button></section>
    <button className="journey-card journey-wide" onClick={() => hub.setTab('manifest')}><div className="eyebrow">Your next manifestation step</div><h2 className="serif">{next}</h2><p>{plan.goal || 'Create a clear goal and a plan you can act on.'}</p>{practice.action && <p>Action: {practice.action} · {practice.status}</p>}</button>
    <section className="journey-card journey-hero">
      <div className="eyebrow">Today’s journey</div>
      <h2 className="serif">Everything you seek begins within.</h2>
      {items.map(([label, title, action], i) => <button className="journey-row" onClick={action} key={label}>
        <span className="journey-number">0{i + 1}</span><span><small>{label}</small><span>{title}</span></span><span aria-hidden>→</span>
      </button>)}
    </section>
    <section className="journey-card"><div className="eyebrow">Today’s affirmation</div><p className="serif journey-quote">I align with what matters, act with clarity, and allow life to meet me there.</p></section>
    <button className="journey-card journey-wide" onClick={() => hub.setTab('manifest')}><div className="eyebrow">My manifestation</div><h2 className="serif">{data.goal || 'What are you ready to create?'}</h2><p>{data.completed.length} of 7 days completed</p><p>{nextDay === null ? 'Foundation complete · Revisit your journey →' : `Continue day ${nextDay + 1} · ${foundationDays[nextDay].title} →`}</p></button>
    <div className="journey-grid"><button className="journey-button" onClick={() => hub.setTab('support')}>I need support now</button><button className="journey-button" onClick={() => hub.setTab('sleep')}>Help me rest</button></div>
  </main></div>;
}
