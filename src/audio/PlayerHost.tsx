import { useEffect } from 'react';
import { createPracticeTimer, practiceDuration } from '../session/practiceTimer';
import MiniPlayer from './MiniPlayer';
import SleepMini from './SleepMini';
import { audio } from '../lib/audio';
import { player, usePlayer } from '../store/player';
import { app, useView } from '../store/app';
import { session, useSessionState } from '../store/session';

/**
 * Global player host (Phase A). Mounted once in <App>, so the mini-player and the
 * natural-close handler live above every view and outlast any screen. When the
 * guided track finishes on its own, we surface the gentle close (§6.6) wherever
 * the user is — expanding back into the session if they'd minimised it.
 */
export default function PlayerHost() {
  const { path, step } = useSessionState();
  const { active } = usePlayer();
  const view = useView();
  const timing = (view === 'session' || active) && (step === 'support' || step === 'music');
  useEffect(() => {
    if (!timing) return;
    const clock = createPracticeTimer({
      target: practiceDuration(path),
      elapsed: () => session.practiceSeconds,
      advance: session.advancePractice,
      now: () => Date.now(),
      volume: level => audio.setVolume(level),
      finish: () => {
        audio.pause();
        session.go('checkin');
        player.end();
        app.setView('session');
      },
    });
    const offPlay = audio.on('play', () => clock.play());
    const offPause = audio.on('pause', () => clock.pause());
    const offTime = audio.on('timeupdate', () => clock.tick());
    if (!audio.paused) clock.play();
    const interval = window.setInterval(() => clock.tick(), 250);
    const onVisible = () => clock.tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      offPlay(); offPause(); offTime();
      document.removeEventListener('visibilitychange', onVisible);
      clock.dispose();
    };
  }, [timing, path]);

  useEffect(() => {
    const off = audio.on('ended', () => {
      if (!player.active) return; // a session owns the audio → this is a real finish
      app.setView('session'); // in case it was collapsed over the hub
      session.go('checkin'); // "how do you feel now?" — no streak, no score
      player.end();
    });
    return off;
  }, []);

  return (
    <>
      <MiniPlayer />
      <SleepMini />
    </>
  );
}
