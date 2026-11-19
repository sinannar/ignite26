import { Embers } from './Embers';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/** A fixed 1920×1080 canvas scaled to fit its container. */
export function Stage({ children, accent }: { children: ReactNode; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / STAGE_W, el.clientHeight / STAGE_H));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="viewport" ref={ref}>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})`, ['--accent' as string]: accent }}>
        <Embers />
        {children}
      </div>
    </div>
  );
}
