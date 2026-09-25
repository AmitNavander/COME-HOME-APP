import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Sparkles, PenLine, Library, User } from 'lucide-react';
import TabBar, { type TabItem } from '../ui/TabBar';
import { hub, useHubTab, type TabId } from '../store/hub';
import { usePlayer } from '../store/player';
import { useReducedMotion } from '../lib/motion';
import JournalTab from '../journal/Journal';

// Lazy-load hub tabs (§12) — each panel is its own chunk.
const HomeTab = lazy(() => import('../manifestation/JourneyToday'));
const ManifestTab = lazy(() => import('../manifestation/ManifestWorkspace'));
const SupportTab = lazy(() => import('./tabs/SupportTab'));
const SleepTab = lazy(() => import('./tabs/SleepTab'));
const LibraryTab = lazy(() => import('./tabs/LibraryTab'));
const ProfileTab = lazy(() => import('./tabs/ProfileTab'));
const AffirmationPractice = lazy(() => import('../affirmations/AffirmationPractice'));

const TABS: TabItem[] = [
  { id: 'home', label: 'Today', Icon: Home },
  { id: 'manifest', label: 'Manifest', Icon: Sparkles },
  { id: 'library', label: 'Meditate', Icon: Library },
  { id: 'journal', label: 'Journal', Icon: PenLine },
  { id: 'profile', label: 'You', Icon: User },
];

/** Returning-user hub (§6). Bottom tab bar; content scrolls above it. */
export default function Hub() {
  const tab = useHubTab();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [tab]);
  const reduce = useReducedMotion();
  const { active, collapsed } = usePlayer();
  const [immersive, setImmersive] = useState(false);
  const setManifestImmersive = useCallback((value: boolean) => setImmersive(value), []);
  useEffect(() => { if (tab !== 'manifest') setImmersive(false); }, [tab]);
  // Base clears the floating nav (Phase 7); add room when the mini-player is
  // docked above it (Phase A).
  const padBottom = immersive ? 24 : active && collapsed ? 168 : 104;
  return (
    <div style={{ minHeight: '100%', paddingBottom: padBottom }}>
      <Suspense fallback={<div className="screen" />}>
        <motion.div
          key={tab}
          className="min-h-full"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.001 : 0.42, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {tab === 'home' && <HomeTab />}
          {tab === 'manifest' && <ManifestTab onImmersiveChange={setManifestImmersive} />}
          {tab === 'journal' && <JournalTab />}
          {tab === 'affirmations' && <AffirmationPractice />}
          {tab === 'support' && <SupportTab />}
          {tab === 'sleep' && <SleepTab />}
          {tab === 'library' && <LibraryTab />}
          {tab === 'profile' && <ProfileTab />}
        </motion.div>
      </Suspense>
      {!immersive && <TabBar items={TABS} active={tab} onChange={(id) => hub.setTab(id as TabId)} />}
    </div>
  );
}
