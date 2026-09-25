import { type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../lib/motion';

export type TabItem = { id: string; label: string; Icon: ComponentType<{ size?: number; strokeWidth?: number }> };

/**
 * Persistent section navigation: switching paths remains reachable while reading.
 * The active section lights up gold through aria-current.
 * Portaled to <body> so it's anchored to the viewport, never captured by
 * an ancestor transform/filter.
 */
export default function TabBar({
  items,
  active,
  onChange,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  const reduce = useReducedMotion();

  return createPortal(
    <>
      <div className="tabbar-scrim" aria-hidden />
      <motion.div
        className="tabbar-wrap"
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={reduce ? { duration: 0.2 } : { type: 'spring', bounce: 0, duration: 0.4 }}
      >
        <nav className="tabbar" aria-label="Sections">
          {items.map(({ id, label, Icon }) => {
            const on = id === active;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-current={on ? 'page' : undefined}
                className="tabbar-btn"
                style={{ color: on ? 'var(--gold)' : 'var(--ink-muted)', transitionTimingFunction: 'var(--ease-calm)' }}
              >
                <span className="tabbar-btn-inner">
                  <Icon size={23} strokeWidth={on ? 2 : 1.6} />
                  <span style={{ fontSize: 10, letterSpacing: '0.08em' }}>{label}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </motion.div>
    </>,
    document.body,
  );
}
