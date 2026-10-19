import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PROGRAMMES } from '../../data/programmes';
import { programme, useProgrammeProgress } from '../../store/programme';
import { player, usePlayer } from '../../store/player';
import { app } from '../../store/app';
import PracticeReminder from '../../manifestation/PracticeReminder';
import { Timer, Wind, Heart, Bell, Library, ArrowUpRight, X } from 'lucide-react';
import Reveal from '../../ui/Reveal';
import PracticeCard from '../../ui/PracticeCard';
import { openTool } from '../../store/tool';
import { openSanctuary } from '../../sanctuary/Sanctuary';
import { useFavorites } from '../../store/favorites';
import { LIBRARY_ITEMS } from '../../data/library';
import { PATHS } from '../../data/paths';
import MeditationCollection, { beginMeditation } from '../MeditationCollection';
import { openGuidedJournal } from '../../journal/context';

// The full catalogue remains available behind a single browse entry.
export default function LibraryTab() {
  const [panel, setPanel] = useState<'reminder' | 'collection' | null>(null);
  const favs = useFavorites();
  const progress = useProgrammeProgress();
  const playback = usePlayer();
  const continuing = PROGRAMMES.find(item => !item.comingSoon && (progress[item.id]?.length ?? 0) > 0 && !programme.isComplete(item));

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

        {playback.active ? <section className="journey-card journey-hero"><h2 className="serif">Your meditation is still open.</h2><p>Return to your current sitting without starting again.</p><button className="journey-button journey-primary" onClick={() => { player.expand(); app.setView('session'); }}>Return to my meditation</button></section> : continuing ? <section className="journey-card journey-hero"><div className="eyebrow">Continue your programme</div><h2 className="serif">{continuing.title}</h2><p>Day {programme.nextDayIndex(continuing) + 1} · {continuing.days[programme.nextDayIndex(continuing)].title}</p><button className="journey-button journey-primary" onClick={() => programme.open(continuing.id)}>Continue programme →</button><p className="journey-muted">Completed days are remembered. An unfinished sitting starts again gently.</p></section> : null}
        <section className="meditate-start">
          <h2>Take a moment for yourself.</h2>
          <p>A feeling, a breath, a little space.</p>
          <div className="meditate-actions">
            <button className="meditate-button meditate-primary" onClick={beginMeditation}>Begin Meditation</button>
            <button className="meditate-button" onClick={() => openGuidedJournal('meditation')}>Reflect on My Meditation</button>
          </div>
        </section>
        <div className="meditate-shortcuts">
          <button className="meditate-navigation" onClick={() => setPanel('collection')}><Library size={22} aria-hidden="true" /><span><strong>Meditation & Rest</strong><small>Explore practices, music and sleep</small></span><ArrowUpRight size={18} aria-hidden="true" /></button>
          <button className="meditate-navigation" onClick={() => setPanel('reminder')}><Bell size={22} aria-hidden="true" /><span><strong>Remind Me to Meditate</strong><small>Make space in your day</small></span><ArrowUpRight size={18} aria-hidden="true" /></button>
        </div>
        {panel && <MeditatePanel panel={panel} onClose={() => setPanel(null)} />}

        {/* Sanctuary — the saved collection lives in its own calm view. */}
        <Reveal delay={0.1}>
          <button
            onClick={openSanctuary}
            className="glass glass-gold flex w-full items-center gap-3 px-5 py-4 text-left transition-transform duration-300 active:scale-[0.99]"
            style={{ borderRadius: 'var(--radius-card)', transitionTimingFunction: 'var(--ease-calm)' }}
          >
            <span className="grid shrink-0 place-items-center" style={{ width: 40, height: 40, borderRadius: 'var(--radius-card)', background: 'rgba(232,201,155,0.14)' }}>
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

function MeditatePanel({ panel, onClose }: { panel: 'reminder' | 'collection'; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const title = panel === 'reminder' ? 'Meditation Reminder' : 'Meditation & Rest';
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = ref.current;
    modal?.showModal();
    return () => { modal?.close(); opener?.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<dialog ref={ref} className="information-dialog meditate-panel" aria-label={title} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <header className="manifest-dialog-toolbar"><h1>{title}</h1><button autoFocus aria-label={`Close ${title}`} onClick={onClose}><X size={20} /></button></header>
    <div className="meditate-panel-body">{panel === 'collection' ? <MeditationCollection onChoose={onClose} /> : <><p className="journey-muted">Choose a time that works for you.</p><PracticeReminder standalone title="Return to meditation" action="Make space for a short sitting, then notice how I feel." prompt="A quiet moment is here when you are ready." location="Meditate" label="Remind Me to Meditate" /></>}</div>
  </dialog>, document.body);
}
