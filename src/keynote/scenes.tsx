import { chapters, event, announcements } from '../deck/content';
import type { Slide } from '../deck/timeline';
import { VisualView } from './visuals';
import { Chip, Reveal, cx } from './ui';

export function chapterOf(id?: string) {
  return chapters.find((c) => c.id === id);
}

interface Props {
  slide: Slide;
  onStart: (mode: 'a' | 'h') => void;
  onChapter: (n: number) => void;
  onAnnouncement: (id: string) => void;
}

export function SceneView({ slide, onStart, onChapter, onAnnouncement }: Props) {
  const { scene, step } = slide;
  switch (scene.kind) {
    case 'title':
      return (
        <div className="scene scene-title">
          <div className="orbs" aria-hidden><i /><i /><i /></div>
          <p className="kicker">{chapters.map((c) => c.title).join(' · ')}</p>
          <h1 className="mega">{event.name}</h1>
          <p className="lede">Every announcement, one idea at a time.</p>
          <div className="start">
            <button className="btn primary" onClick={() => onStart('h')}>
              Highlights <small>{announcements.filter((a) => a.highlight).length} moments</small>
            </button>
            <button className="btn" onClick={() => onStart('a')}>
              All announcements <small>{announcements.length}</small>
            </button>
          </div>
        </div>
      );

    case 'map':
      return (
        <div className="scene scene-map">
          <p className="kicker kick-line">The map</p>
          <h1 className="mega map-h">{chapters.length} sections, {announcements.length} announcements</h1>
          <div className="map-cards">
            {chapters.map((c, i) => {
              const items = announcements.filter((a) => a.chapter === c.id);
              return (
                <button key={c.id} className="map-card" onClick={() => onChapter(i)} style={{ ['--c' as string]: c.accent, animationDelay: `${150 + i * 90}ms` }}>
                  <b className="map-n">{String(i + 1).padStart(2, '0')}</b>
                  <h3>{c.title}</h3>
                  <p>{items.length} announcement{items.length === 1 ? '' : 's'}</p>
                  <ul>{items.filter((a) => a.highlight).map((a) => <li key={a.id}>{a.name}</li>)}</ul>
                  <small>Press <kbd>{i + 1}</kbd> to jump</small>
                </button>
              );
            })}
          </div>
        </div>
      );

    case 'highlights': {
      const hs = announcements.filter((a) => a.highlight);
      const n = hs.length;
      const pts = hs.map((a, i) => ({ a, x: 150 + (i * (1620)) / Math.max(n - 1, 1), y: [330, 190, 400, 230, 380, 210, 340][i % 7] }));
      return (
        <div className="scene scene-hl">
          <p className="kicker center">{event.name}</p>
          <h1 className="mega center">Highlights</h1>
          <p className="lede center">{n} moments that change how you build, run and secure.</p>
          <div className="hl-path">
            <svg viewBox="0 0 1640 520" aria-hidden="true">
              <polyline points={pts.map((p) => `${p.x - 140},${p.y + 40}`).join(' ')} pathLength={1} />
            </svg>
            {pts.map((p, i) => {
              const c = chapterOf(p.a.chapter);
              return (
                <button key={p.a.id} className="hl-node" onClick={() => onAnnouncement(p.a.id)} style={{ left: p.x - 140, top: p.y + 40, ['--c' as string]: c?.accent, animationDelay: `${300 + i * 140}ms` }}>
                  <i />
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  <span>{p.a.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    case 'chapter': {
      const c = scene.chapter;
      return (
        <div className="scene scene-chapter">
          <p className="kicker">Chapter {chapters.indexOf(c) + 1} of {chapters.length}</p>
          <h1 className="mega">{c.title}</h1>
          <p className="lede">{c.tagline}</p>
          <ul className="points">
            {c.points.map((p, i) => (
              <Reveal key={p.name} on={i + 1 < step} className="point">
                <li>
                  <span className="point-name">{p.name}</span>
                  <Chip status={p.status} />
                  {p.note && <span className="point-note">{p.note}</span>}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      );
    }

    case 'intro': {
      const a = scene.a;
      return (
        <div className="scene scene-intro">
          <p className="kicker">{chapterOf(a.chapter)?.title} · {a.name}</p>
          <h1 className="headline">{a.title}</h1>
          <div className="qa">
            <Reveal on={step >= 1}>
              <h4>The problem</h4>
              <p>{a.problem}</p>
            </Reveal>
            <Reveal on={step >= 2}>
              <h4>What was announced</h4>
              <p>{a.announced}</p>
              <div className="chips">{a.statuses.map((s) => <Chip key={s} status={s} />)}</div>
            </Reveal>
          </div>
        </div>
      );
    }

    case 'visual': {
      const a = scene.a;
      const v = a.visuals[scene.v];
      return (
        <div className="scene scene-visual">
          <p className="kicker">{chapterOf(a.chapter)?.title} · {a.name}</p>
          <h2 className="subhead">{v.title}</h2>
          <VisualView visual={v} step={step} />
        </div>
      );
    }

    case 'why': {
      const a = scene.a;
      return (
        <div className={cx('scene scene-why', !a.whatsNew && 'solo')}>
          <p className="kicker">{chapterOf(a.chapter)?.title} · {a.name}</p>
          <div className="why-cols">
            <div className="why-main">
              <h4>Why it matters</h4>
              <p className="why-text">{a.why}</p>
              <div className="links">
                {a.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>
                ))}
              </div>
            </div>
            {a.whatsNew && (
              <div className="why-list">
                <h4>What is new</h4>
                {a.whatsNew.map((it) => (
                  <div className="vitem" key={it.name}>
                    <div className="vitem-head"><strong>{it.name}</strong><Chip status={it.status} /></div>
                    {it.note && <p>{it.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'recap':
      return (
        <div className="scene scene-recap">
          <p className="kicker">Recap</p>
          <h1 className="headline">Takeaways</h1>
          <div className="takeaways">
            {chapters.map((c, i) => (
              <Reveal key={c.id} on={i < step} className="takeaway">
                <span style={{ color: c.accent }}>{c.title}</span>
                <p>{c.takeaway}</p>
              </Reveal>
            ))}
          </div>
        </div>
      );
  }
}
