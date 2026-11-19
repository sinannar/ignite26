import { useEffect, useRef } from 'react';

interface P { x: number; y: number; r: number; vy: number; sway: number; phase: number; hue: number; life: number }

const W = 1920;
const H = 1080;
// Warm ember palette: deep red → orange → gold → white-hot.
const COLORS = ['255,92,38', '255,138,63', '255,178,71', '255,214,140', '255,244,220'];

const spawn = (init: boolean): P => ({
  x: Math.random() * W,
  y: init ? Math.random() * H : H + 20,
  r: 0.8 + Math.random() * 2.6,
  vy: 18 + Math.random() * 60,
  sway: 10 + Math.random() * 40,
  phase: Math.random() * Math.PI * 2,
  hue: Math.floor(Math.random() ** 1.6 * COLORS.length),
  life: Math.random(),
});

/** Sparks rising from the bottom of the stage, like embers off a fire. */
export function Embers() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ps = Array.from({ length: 90 }, () => spawn(true));
    let raf = 0;
    let last = performance.now();

    const draw = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of ps) {
        if (!reduce) {
          p.y -= p.vy * dt;
          p.phase += dt * 1.4;
          p.x += Math.sin(p.phase) * p.sway * dt;
          if (p.y < -20) Object.assign(p, spawn(false));
        }
        const rise = 1 - Math.max(0, p.y) / H; // 0 at bottom → 1 at top
        const flicker = 0.65 + 0.35 * Math.sin(t / 140 + p.phase * 3);
        const a = Math.max(0, (1 - rise * 0.9)) * flicker * 1.25;
        const col = COLORS[p.hue];
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `rgba(${col},${a})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="embers" width={W} height={H} aria-hidden="true" />;
}
