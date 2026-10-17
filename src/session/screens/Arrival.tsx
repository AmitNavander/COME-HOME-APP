import { useState } from 'react';
import Button from '../../ui/Button';
import Reveal from '../../ui/Reveal';
import GradientIcon from '../../ui/GradientIcon';
import { session, type Emotion } from '../../store/session';
import { FEELINGS } from '../../data/feelings';
import { saveLastArrival } from '../../lib/storage';
import { FEELING_FLOWS, flowTrackSrc } from '../../data/flows';
import { audioControls, SESSION_AUDIO } from '../../audio/audioStore';

/** §6.2 Arrival — meet the person where they are. The six felt-states as the same
 *  tiles the Support grid uses; tap one or several, then Begin (§task2). */
export default function Arrival({ onExit }: { onExit: () => void }) {
  const [selected, setSelected] = useState<Emotion[]>([]);
  const toggle = (id: Emotion) =>
    setSelected((s) => (s.includes(id) ? [] : [id]));

  // Start audio inside the button gesture so mobile autoplay policies allow it.
  const begin = () => {
    const primary = selected[0] ?? null;
    if (primary) saveLastArrival(primary);
    const practice = FEELING_FLOWS.find((entry) => entry.id === primary)?.practice;
    const music = practice ? { title: practice.title, src: flowTrackSrc(practice.track) } : null;
    audioControls.stop();
    audioControls.ensureLoaded(music?.src ?? SESSION_AUDIO.musicTrack, { loop: !!music });
    session.beginMeditation(primary, music);
    void audioControls.play();
  };

  return (
    <div className="screen">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <Reveal delay={0.05}>
          <h2 className="serif" style={{ fontSize: 'var(--t-xl)' }}>
            How are you arriving today?
          </h2>
          <p style={{ color: 'var(--ink-muted)', marginTop: 6, fontSize: 'var(--t-md)' }}>
            Choose a feeling to begin a meditation for this moment, or skip to a grounding practice.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-8">
          <div className="grid grid-cols-2 gap-3">
            {FEELINGS.map((f) => {
              const on = selected.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggle(f.id)}
                  aria-pressed={on}
                  className={`glass ${on ? 'glass-gold' : ''} flex flex-col items-center justify-center gap-2 px-3 py-4 text-center transition-transform duration-300 active:scale-[0.98]`}
                  style={{ minHeight: 88, borderRadius: 'var(--radius-card)', transitionTimingFunction: 'var(--ease-calm)' }}
                >
                  <GradientIcon name={f.icon} size={24} />
                  <span style={{ color: 'var(--ink)', fontSize: 'var(--t-sm)', lineHeight: 1.25 }}>{f.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.5} className="mt-8 flex flex-col items-center gap-4">
          <Button onClick={begin}>{selected.length ? "Begin Meditation" : "Skip and Begin"}</Button>
          <Button variant="ghost" onClick={onExit}>
            Browse meditations
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
