import type { ReactNode } from 'react';
import type { Status } from '../deck/types';

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

export function Chip({ status }: { status?: Status }) {
  if (!status) return null;
  return <span className={`chip chip-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>;
}

/** Fades/slides in when `on` is true. */
export function Reveal({ on, children, className, delay = 0 }: { on: boolean; children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={cx('rv', on && 'on', className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
