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
}

export function SceneView({ slide, onStart }: Props) {
  const { scene, step } = slide;
  switch (scene.kind) {
    case 'title':
      return (
        <div className="scene scene-title">
          <div className="orbs" aria-hidden><i /><i /><i /></div>
          <p className="kicker">{event.subtitle}</p>
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
          <h1 className="headline">Three takeaways</h1>
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
