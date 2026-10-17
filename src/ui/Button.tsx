import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost';

/**
 * One clear primary action per screen (§2). `primary` = gold, means "safe / go".
 * `ghost` = the low-pressure exit that every screen must have (§2).
 * Min height 44px tap target (§10). Calm easing, no bounce (§2).
 */
export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: { variant?: Variant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    'inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 text-sm leading-normal select-none font-medium transition-[background-color,opacity] duration-150';
  const styles: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'var(--gold)',
          color: '#11242d',
          borderRadius: 12,
          border: '1px solid var(--gold)',
        }
      : { color: 'var(--ink-muted)', background: 'transparent', borderRadius: 12 };
  return (
    <button
      className={`${base} ${variant === 'ghost' ? 'hover:opacity-80' : 'hover:brightness-[1.04]'} ${className}`}
      style={{ transitionTimingFunction: 'var(--ease-calm)', ...styles }}
      {...rest}
    >
      {children}
    </button>
  );
}
