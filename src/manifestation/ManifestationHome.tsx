import { useEffect, useMemo, useState } from 'react';
import { Droplets, Sparkles } from 'lucide-react';
import Reveal from '../ui/Reveal';
import ExitButton from '../ui/ExitButton';
import Button from '../ui/Button';
import { nav } from '../nav/history';
import { setDepth } from '../store/water';
import {
  listManifestationPrograms,
  type ManifestationPractice,
  type ManifestationProgramWithPractices,
} from '../data/manifestation';

const FOUNDATION_SLUG = 'come-home-manifestation-foundations';
const WATER_SLUG = 'manifesting-through-water';

const minutes = (seconds: number | null) =>
  seconds ? `${Math.max(1, Math.round(seconds / 60))} min` : 'At your pace';

/** TRANSFORM / Manifestation foundation. This screen is additive: it reuses the
 * existing glass, typography, motion and living-water shell while reading its
 * programme catalogue from the established Come Home Supabase backend. */
export default function ManifestationHome() {
  const [programs, setPrograms] = useState<ManifestationProgramWithPractices[]>([]);
  const [selected, setSelected] = useState<ManifestationPractice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setDepth('checkin');
    let current = true;
    listManifestationPrograms()
      .then((data) => current && setPrograms(data))
      .catch(() => current && setError(true))
      .finally(() => current && setLoading(false));
    return () => {
      current = false;
    };
  }, []);

  const foundation = useMemo(
    () => programs.find((program) => program.slug === FOUNDATION_SLUG),
    [programs],
  );
  const water = useMemo(() => programs.find((program) => program.slug === WATER_SLUG), [programs]);
  const corePractices = foundation?.practices.slice(0, 5) ?? [];

  if (selected) {
    return <PracticeDetail practice={selected} onClose={() => setSelected(null)} />;
  }

  return (
    <div className="screen">
      <ExitButton onExit={() => nav.back()} />
      <div className="mx-auto w-full max-w-md py-10">
        <Reveal delay={0.04}>
          <div className="eyebrow">Transform</div>
          <h1 className="serif" style={{ fontSize: 'var(--t-2xl)', marginTop: 8, lineHeight: 1.06 }}>
            Manifest from within.
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-md)', lineHeight: 1.58, marginTop: 12 }}>
            Begin with clarity. Meet the beliefs beneath the desire. Let feeling and aligned action move together.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div
            className="glass glass-strong glass-gold mt-7 px-5 py-5"
            style={{ borderRadius: 'var(--radius-card)' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="grid shrink-0 place-items-center"
                style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(232,201,155,0.14)' }}
              >
                <Sparkles size={20} strokeWidth={1.45} color="var(--gold)" />
              </span>
              <span>
                <span className="eyebrow" style={{ color: 'var(--gold)', display: 'block' }}>
                  Begin here · five practices
                </span>
                <span className="serif" style={{ display: 'block', fontSize: 'var(--t-lg)', marginTop: 3 }}>
                  {foundation?.title ?? 'Manifestation Foundations'}
                </span>
              </span>
            </div>
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-sm)', lineHeight: 1.55, marginTop: 14 }}>
              {foundation?.description ?? 'A grounded beginning for choosing, believing, feeling and moving with intention.'}
            </p>
          </div>
        </Reveal>

        <div className="mt-4 flex flex-col gap-2.5">
          {loading && [0, 1, 2].map((item) => <PracticeSkeleton key={item} />)}
          {!loading && corePractices.map((practice, index) => (
            <Reveal key={practice.id} delay={0.18 + index * 0.045}>
              <button
                type="button"
                onClick={() => setSelected(practice)}
                className="glass flex w-full items-center gap-4 px-5 py-4 text-left transition-transform duration-300 active:scale-[0.99]"
                style={{ borderRadius: 'var(--radius-card)', transitionTimingFunction: 'var(--ease-calm)' }}
              >
                <span
                  className="grid shrink-0 place-items-center"
                  style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid var(--gold)', color: 'var(--gold)' }}
                >
                  <span className="eyebrow" style={{ color: 'var(--gold)' }}>{index + 1}</span>
                </span>
                <span className="flex-1">
                  <span style={{ color: 'var(--ink)', fontSize: 'var(--t-md)', display: 'block' }}>{practice.title}</span>
                  <span style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-sm)', display: 'block', marginTop: 3 }}>
                    {practice.description}
                  </span>
                </span>
                <span className="eyebrow" style={{ color: 'var(--gold)', whiteSpace: 'nowrap' }}>
                  {minutes(practice.duration_sec)}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {error && (
          <div className="glass mt-4 px-5 py-4" style={{ borderRadius: 'var(--radius-card)' }}>
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-sm)', lineHeight: 1.5 }}>
              The practices could not be reached just now. Your existing meditation experience is still available.
            </p>
          </div>
        )}

        {water && (
          <Reveal delay={0.46}>
            <div className="eyebrow" style={{ marginTop: 30, marginBottom: 10 }}>Go deeper</div>
            <div className="glass px-5 py-5" style={{ borderRadius: 'var(--radius-card)' }}>
              <div className="flex items-center gap-3">
                <Droplets size={22} strokeWidth={1.4} color="var(--gold)" />
                <div>
                  <div className="eyebrow" style={{ color: 'var(--gold)' }}>{water.duration_days} days</div>
                  <div className="serif" style={{ fontSize: 'var(--t-xl)', marginTop: 4 }}>{water.title}</div>
                </div>
              </div>
              <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-sm)', lineHeight: 1.55, marginTop: 12 }}>
                {water.subtitle ?? water.description}
              </p>
              <div className="eyebrow" style={{ marginTop: 15 }}>Purify · Charge · Flow · Receive · Become</div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function PracticeDetail({ practice, onClose }: { practice: ManifestationPractice; onClose: () => void }) {
  return (
    <div className="screen">
      <ExitButton onExit={onClose} label="Back to manifestation" />
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center py-12">
        <Reveal delay={0.04}>
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>
            Practice {practice.day_number ?? ''} · {minutes(practice.duration_sec)}
          </div>
          <h1 className="serif" style={{ fontSize: 'var(--t-2xl)', marginTop: 10, lineHeight: 1.06 }}>
            {practice.title}
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-md)', lineHeight: 1.58, marginTop: 12 }}>
            {practice.description}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="glass glass-gold mt-7 px-6 py-6" style={{ borderRadius: 'var(--radius-card)' }}>
            <div className="eyebrow">Your practice</div>
            <p className="serif" style={{ fontSize: 'var(--t-lg)', lineHeight: 1.55, marginTop: 10 }}>
              {practice.instructions}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.24} className="mt-7 text-center">
          <Button onClick={onClose}>Return to practices</Button>
          <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-xs)', lineHeight: 1.5, marginTop: 12 }}>
            There is no streak to protect. Return when it feels right.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function PracticeSkeleton() {
  return (
    <div className="glass px-5 py-5" style={{ borderRadius: 'var(--radius-card)', opacity: 0.6 }} aria-hidden>
      <div style={{ width: '38%', height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.09)' }} />
      <div style={{ width: '72%', height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', marginTop: 10 }} />
    </div>
  );
}
