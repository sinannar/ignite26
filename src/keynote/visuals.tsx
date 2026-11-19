import type { Visual } from '../deck/types';
import { Chip, Reveal, cx } from './ui';

export function VisualView({ visual, step }: { visual: Visual; step: number }) {
  switch (visual.kind) {
    case 'flow':
      return (
        <div className="flow" style={{ gridTemplateColumns: `repeat(${visual.steps.length}, 1fr)` }}>
          {visual.steps.map((s, i) => (
            <Reveal key={i} on={i < step} className={cx('flow-node', i === step - 1 && 'now')}>
              <span className="flow-n">{i + 1}</span>
              <h3>{s.label}</h3>
              {s.detail && <p>{s.detail}</p>}
            </Reveal>
          ))}
        </div>
      );
    case 'grid': {
      const cols = visual.groups.length === 4 ? 2 : Math.min(visual.groups.length, 3);
      return (
        <div className="vgrid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {visual.groups.map((g, i) => (
            <Reveal key={g.title} on={i < step} className={cx('vgroup', i === step - 1 && 'now')}>
              <h3>{g.title}</h3>
              {g.items.map((it) => (
                <div className="vitem" key={it.name}>
                  <div className="vitem-head"><strong>{it.name}</strong><Chip status={it.status} /></div>
                  {it.note && <p>{it.note}</p>}
                </div>
              ))}
            </Reveal>
          ))}
        </div>
      );
    }
    case 'stats':
      return (
        <div className="stats">
          <div className="stats-row">
            {visual.items.map((s, i) => (
              <Reveal key={s.label} on={i < step} className="stat">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </Reveal>
            ))}
          </div>
          {visual.footnote && <p className="footnote">{visual.footnote}</p>}
        </div>
      );
    case 'converge':
      return (
        <div className="converge">
          <div className="converge-from">
            {visual.from.map((f, i) => (
              <Reveal key={f} on={step >= 1} delay={i * 90} className="pill">{f}</Reveal>
            ))}
          </div>
          <Reveal on={step >= 2} className="converge-arrow">→</Reveal>
          <Reveal on={step >= 2} className="converge-to">
            <h3>{visual.to.name}</h3>
            {visual.to.note && <p>{visual.to.note}</p>}
            <Chip status={visual.to.status} />
          </Reveal>
        </div>
      );
  }
}
