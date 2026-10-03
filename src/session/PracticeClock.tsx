import { useEffect } from 'react';
import { audioControls, useAudio } from '../audio/audioStore';
import { session, useSessionState } from '../store/session';
import { player } from '../store/player';
export default function PracticeClock() {
  const { path, practiceSeconds } = useSessionState();
  const { playing } = useAudio();
  const target = path === 'more-15' ? 900 : path === 'stay-5' ? 300 : 120;
  useEffect(() => {
    if (!playing) return;
    let last = Date.now();
    const timer = window.setInterval(() => { const now = Date.now(); session.advancePractice((now - last) / 1000); last = now; }, 1000);
    return () => clearInterval(timer);
  }, [playing]);
  const left = Math.max(0, Math.ceil(target - practiceSeconds));
  return <section className="journey-card" aria-label="Practice timer">
    <p>{left ? `Practice time remaining: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'Your suggested sitting time is complete.'}</p>
    <p className="journey-muted">{target / 60}-minute sitting · The player below controls the longer background music. Pause music to pause this timer.</p>
    <button className="journey-button journey-primary" onClick={() => { audioControls.pause(); player.end(); session.go('checkin'); }}>Finish and reflect</button>
    {!left && <p>You may finish now or keep listening for as long as you like.</p>}
  </section>;
}
