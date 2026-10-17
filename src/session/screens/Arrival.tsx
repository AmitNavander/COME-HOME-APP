import { useState } from 'react';
import Button from '../../ui/Button';
import Reveal from '../../ui/Reveal';
import GradientIcon from '../../ui/GradientIcon';
import { session, type Emotion } from '../../store/session';
import { FEELINGS } from '../../data/feelings';
import { saveLastArrival } from '../../lib/storage';

/** §6.2 Arrival — meet the person where they are. The six felt-states as the same
 *  tiles the Support grid uses; tap one or several, then Begin (§task2). */
export default function Arrival({ onExit }: { onExit: () => void }) {
  const [selected, setSelected] = useState<Emotion[]>([]);
  const toggle = (id: Emotion) =>
    setSelected((s) => (s.includes(id) ? [] : [id]));

  // Record the optional check-in, then ask which meditation the user wants.
  const begin = () => {
    const primary = selected[0] ?? null;
    if (primary) saveLastArrival(primary);
    session.beginMeditation(primary);
  };

  return (
    <div className="screen">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <Reveal delay={0.05}>
          <h2 className="serif" style={{ fontSize: 'var(--t-xl)' }}>
            How are you arriving today?
          </h2>
          <p style={{ color: 'var(--ink-muted)', marginTop: 6, fontSize: 'var(--t-md)' }}>
            Choose one feeling, or skip this check-in. Next, choose your meditation.
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
          <Button onClick={begin}>{selected.length ? "Choose my meditation" : "Skip check-in and choose"}</Button>
          <Button variant="ghost" onClick={onExit}>
            Browse meditations
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
