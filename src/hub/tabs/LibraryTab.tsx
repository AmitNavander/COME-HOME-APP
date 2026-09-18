import { Timer, Wind, Heart } from 'lucide-react';
import Reveal from '../../ui/Reveal';
import PracticeCard from '../../ui/PracticeCard';
import { openTool } from '../../store/tool';
import { openSanctuary } from '../../sanctuary/Sanctuary';
import { useFavorites } from '../../store/favorites';
import { LIBRARY_ITEMS } from '../../data/library';
import { PATHS } from '../../data/paths';
import MeditationCollection, { beginMeditation } from '../MeditationCollection';

// The full catalogue remains available behind a single browse entry.
export default function LibraryTab() {
  const favs = useFavorites();

  const savedCount = LIBRARY_ITEMS.filter((l) => favs.has(`lib:${l.id}`)).length + PATHS.filter((p) => favs.has(`path:${p.id}`)).length;

  return (
    <div className="screen">
      <div className="mx-auto w-full max-w-md pt-6 pb-10">
        <Reveal delay={0.05}>
          <div className="eyebrow">Meditate</div>
          <h1 className="serif" style={{ fontSize: 'var(--t-2xl)', marginTop: 8, marginBottom: 20 }}>
            Find what you need.
          </h1>
        </Reveal>

        <section className="journey-card"><h2 className="serif">Take a moment for yourself.</h2><p>A simple practice with on-screen prompts and music.</p><button className="journey-button journey-primary" onClick={beginMeditation}>Begin meditation</button></section>
        <details className="journey-disclosure"><summary>Browse all practices <small>Meditation · sleep · emotional support · programmes</small></summary><MeditationCollection /></details>

        {/* Sanctuary — the saved collection lives in its own calm view. */}
        <Reveal delay={0.1}>
          <button
            onClick={openSanctuary}
            className="glass glass-gold flex w-full items-center gap-3 px-5 py-4 text-left transition-transform duration-300 active:scale-[0.99]"
            style={{ borderRadius: 'var(--radius-card)', transitionTimingFunction: 'var(--ease-calm)' }}
          >
            <span className="grid shrink-0 place-items-center" style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(232,201,155,0.14)' }}>
              <Heart size={18} strokeWidth={1.6} color="var(--gold)" fill="var(--gold)" />
            </span>
            <span className="flex-1">
              <span className="serif" style={{ display: 'block', color: 'var(--ink)', fontSize: 'var(--t-lg)' }}>
                Sanctuary
              </span>
              <span className="eyebrow" style={{ display: 'block', marginTop: 2, color: 'var(--gold)' }}>
                {savedCount > 0 ? `${savedCount} saved` : 'Your saved sessions'}
              </span>
            </span>
            <span aria-hidden style={{ color: 'var(--ink-muted)' }}>→</span>
          </button>
        </Reveal>

        {/* Self-directed practices — no content, no narrator (§Phase2). */}
        <Reveal delay={0.2}>
          <div className="eyebrow" style={{ marginTop: 24, marginBottom: 10 }}>
            Practices
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PracticeCard Icon={Timer} title="Quiet Timer" sub="Silent · your pace" onClick={() => openTool('timer')} />
            <PracticeCard Icon={Wind} title="Breathe" sub="Guided · visual" onClick={() => openTool('breathe')} />
          </div>
        </Reveal>


      </div>
    </div>
  );
}
