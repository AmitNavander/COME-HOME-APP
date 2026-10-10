import { practiceDuration } from './practiceTimer';
import { audioControls } from '../audio/audioStore';
import { session, useSessionState } from '../store/session';
import { player } from '../store/player';
export default function PracticeClock() {
  const { path, practiceSeconds } = useSessionState();
  const target = practiceDuration(path);
  const left = Math.max(0, Math.ceil(target - practiceSeconds));
  return <section className="journey-card" aria-label="Practice timer">
    <p>{left ? `Practice time remaining: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'Your practice is complete.'}</p>
    <p className="journey-muted">{target / 60}-minute practice · Pause the music to pause your countdown.</p>
    <button className="journey-button journey-primary" onClick={() => { audioControls.pause(); player.end(); session.go('checkin'); }}>Finish and reflect</button>
  </section>;
}
