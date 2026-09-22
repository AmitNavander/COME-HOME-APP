import { useEffect, useState } from 'react';
import { app } from '../store/app';
import { useJourney } from './journeyStore';
import './journey.css';
import FoundationSession from './FoundationSession';
import { foundationDays, nextFoundationDay } from './foundationDays';
import WaterWorkbook from './WaterWorkbook';
import VisionBoard from './VisionBoard';
import WaterCourse from './WaterCourse';
import GoalWorkflow from './GoalWorkflow';
import Plans, { PremiumPreview } from '../membership/Plans';
import { useAuth } from '../lib/auth';
import { useAccountCloud } from '../lib/accountCloud';

const waterDays = ['Sacred Initiation', 'Water of Clarity', 'Release', 'Emotional Healing', 'Gratitude', 'Forgiveness', 'Purification Ceremony', 'Intention', 'Voice Imprinting', 'Belief', 'Visualization', 'Embodied Feeling', 'Aligned Action', 'Prosperity Flow', 'Receiving', 'Trust', 'Surrender', 'Expansion', 'Synchronicity', 'Integration', 'Become'];

export default function ManifestWorkspace({ onImmersiveChange }: { onImmersiveChange?: (immersive: boolean) => void }) {
  const { data } = useJourney();
  const { user } = useAuth();
  const cloud = useAccountCloud();
  const [selected, setSelected] = useState<number | null>(null);
  const nextDay = nextFoundationDay(data.completed);
  useEffect(() => {
    onImmersiveChange?.(selected !== null);
    return () => onImmersiveChange?.(false);
  }, [selected, onImmersiveChange]);
  if (selected !== null) return <FoundationSession key={selected} day={selected} onClose={() => setSelected(null)} />;
  return <div className="screen"><main className="journey-page">
    <div className="eyebrow">Manifest</div><h1 className="serif">What are you ready to create?</h1>
    <p>Start with one small practice. Return each day to build on it.</p>
    <details className="journey-disclosure"><summary>New here? Your manifestation guide</summary><ManifestGuide /></details>
    <section className="journey-card"><div className="eyebrow">Free · seven-day reflection journey</div><h2 className="serif">Your next practice</h2>
      <p>A teaching, practice, affirmation, action and evening reflection each day. Begin at your pace; there is no missed-day penalty.</p>
      <progress aria-label="Foundation progress" max={7} value={data.completed.length} /><p>{data.completed.length} of 7 completed</p>
      {nextDay !== null ? <button className="journey-button journey-primary" onClick={() => setSelected(nextDay)}>Continue day {nextDay + 1} · {foundationDays[nextDay].title}</button> : <p role="status">Your foundation week is complete. Revisit any day below.</p>}
      <details className="journey-disclosure"><summary>View all 7 foundation days</summary>{foundationDays.map(({title, minutes}, i) => <button className="journey-row" key={title} onClick={() => setSelected(i)}><span className="journey-number">{i + 1}</span><span>Day {i + 1} · {title}<small>{minutes} min · {data.completed.includes(i) ? 'Completed' : data.answers[String(i)] ? 'Draft saved' : 'Ready when you are'}</small></span><span aria-hidden>{data.completed.includes(i) ? '✓' : '→'}</span></button>)}</details>
    </section>
    <h2 className="serif">Go deeper</h2>
    <details className="journey-disclosure"><summary>My goal plan <small>Define · visualize · act · review</small></summary><PremiumPreview><GoalWorkflow /></PremiumPreview></details>
    <details className="journey-disclosure"><summary>Manifesting Through Water™ <small>Your complete 21-day written workshop</small></summary><PremiumPreview><WaterCourse /><details><summary>Previous workbook entries</summary><WaterWorkbook titles={waterDays} /></details></PremiumPreview></details>
    <details className="journey-disclosure"><summary>My vision board <small>Create your vision and phone wallpaper</small></summary><PremiumPreview><VisionBoard /></PremiumPreview></details>
    <details className="journey-disclosure"><summary>More resources and plans</summary><button className="journey-button" onClick={() => app.setView('manifestation')}>Open foundation practice library</button><Plans /></details>
    <p className="journey-muted">{!user.isGuest && cloud.enabled ? 'Your saved journey follows your private account.' : 'Your saved journey stays on this device, including on shared devices. Turn on private account saving from You to use it across devices.'} Practices support reflection and action, not guaranteed outcomes.</p>
  </main></div>;
}

function ManifestGuide() {
  return <div>
    <h2 className="serif">From a wish to a daily practice</h2>
    <p>Manifestation here combines reflection, visualization and practical action. You do not need experience or special equipment. Start with the free foundation; the goal plan and Water workshop are optional deeper journeys.</p>
    <ol className="water-steps">
      <li><strong>Choose one direction.</strong> Open My goal plan. Write what you want, why it matters, your starting point and a realistic review date. Example: “Over the next four weeks, I will send two considered job applications each week.” Choose actions within your control.</li>
      <li><strong>Prepare your space and your plan.</strong> Set aside a comfortable daily time, somewhere to sit and a way to write. Name a likely obstacle and your response: “If I feel overwhelmed, I will spend five minutes on one application.”</li>
      <li><strong>Visualize the process.</strong> Settle with ordinary breathing. Picture yourself beginning the next action, meeting the obstacle and using your response. Then imagine how progress might feel. If images do not come easily, describe the scene in words. No special feeling is required.</li>
      <li><strong>Take one real step.</strong> Choose a small action and a time to do it. Use the Act step to record whether it happened, was adapted or is still planned. Visualization supports preparation; the action is part of the practice.</li>
      <li><strong>Return and review.</strong> In the evening, note what actually happened, what you learned and your next step. At your review date, compare with your starting point. Continue, adjust the plan or acknowledge progress; external results are not guaranteed.</li>
    </ol>
    <h3 className="serif">Choose your daily journey</h3>
    <p><strong>Foundation:</strong> seven introductory days. Use the next-practice button, read the teaching, follow the practice and save your reflection.</p>
    <p><strong>Water workshop:</strong> 21 complete written days in three weeks: Clear Lake, Flowing River and Ocean. Open the workshop, review preparation and begin day 1. Each day includes a teaching, ceremony, journal prompts, action, reminder, evening integration, milestone and evidence tracker. Read one section and do it before continuing. Allow around 25–35 minutes, split into shorter sittings if needed.</p>
    <p><strong>Vision board:</strong> optional images and words that remind you of your direction. Create it whenever you are ready; it is not required to begin.</p>
    <h3 className="serif">Save and return</h3>
    <p>Use each exercise’s Save button before changing tabs or leaving. Return to the same browser and device. Closing a section here keeps its current draft while you stay on this screen. Mark a day complete after your chosen practice and review. You can repeat days or pause without a missed-day penalty.</p>
    <p>Stuck? Make the action smaller, write one honest sentence or revisit a day. You can adapt or skip an uncomfortable exercise. Progress means noticing, learning and acting, not forcing a result.</p>
  </div>;
}
