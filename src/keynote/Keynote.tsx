import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Announcement, Section } from '../data/types';

interface Props {
  event: { name: string; subtitle: string };
  sections: Section[];
  announcements: Announcement[];
}

type Slide =
  | { kind: 'title' }
  | { kind: 'section'; section: Section; count: number }
  | { kind: 'announcement'; section: Section; item: Announcement };

type Dialog = 'map' | 'help' | null;

function buildSlides(sections: Section[], announcements: Announcement[]): Slide[] {
  const slides: Slide[] = [{ kind: 'title' }];
  for (const section of sections) {
    const items = announcements.filter((a) => a.section === section.id);
    slides.push({ kind: 'section', section, count: items.length });
    for (const item of items) slides.push({ kind: 'announcement', section, item });
  }
  return slides;
}

function readHash(max: number): number {
  const n = Number(window.location.hash.replace('#/', ''));
  return Number.isInteger(n) && n >= 0 && n <= max ? n : 0;
}

export default function Keynote({ event, sections, announcements }: Props) {
  const slides = useMemo(() => buildSlides(sections, announcements), [sections, announcements]);
  const last = slides.length - 1;
  const [index, setIndex] = useState(0);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notes, setNotes] = useState(false);

  const go = useCallback((n: number) => setIndex(Math.min(Math.max(n, 0), last)), [last]);

  // Deep links: #/<slide number>
  useEffect(() => {
    setIndex(readHash(last));
    const onHash = () => setIndex(readHash(last));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [last]);
  useEffect(() => {
    if (window.location.hash !== `#/${index}`) history.replaceState(null, '', `#/${index}`);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowRight': case 'PageDown': case ' ': e.preventDefault(); go(index + 1); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); go(index - 1); break;
        case 'Home': go(0); break;
        case 'End': go(last); break;
        case 'g': case 'G': setDialog((d) => (d === 'map' ? null : 'map')); break;
        case '?': setDialog((d) => (d === 'help' ? null : 'help')); break;
        case 'n': case 'N': setNotes((v) => !v); break;
        case 'f': case 'F':
          if (document.fullscreenElement) void document.exitFullscreen();
          else void document.documentElement.requestFullscreen?.();
          break;
        case 'Escape': setDialog(null); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, last]);

  const slide = slides[index];
  const accent = slide.kind === 'title' ? 'var(--accent)' : slide.section.accent;

  return (
    <div className="kn" style={{ ['--accent' as string]: accent }}>
      <main className="kn-stage">
        <div className="kn-slide">
          {slide.kind === 'title' && (
            <>
              <p className="kn-kicker">{event.subtitle}</p>
              <h1>{event.name}</h1>
              <p className="kn-tagline">
                {announcements.length} announcements · {sections.length} sections · press <kbd>→</kbd> to begin
              </p>
            </>
          )}

          {slide.kind === 'section' && (
            <>
              <p className="kn-kicker">Section · {slide.count} announcements</p>
              <h1>{slide.section.title}</h1>
              <p className="kn-tagline">{slide.section.summary}</p>
            </>
          )}

          {slide.kind === 'announcement' && (
            <>
              <p className="kn-kicker">{slide.section.title}</p>
              <h2>
                {slide.item.title}
                {slide.item.status && <span className="kn-badge">{slide.item.status}</span>}
              </h2>
              <p className="kn-tagline">{slide.item.tagline}</p>
              <div className="kn-grid">
                <div className="kn-card"><h3>The problem</h3><p>{slide.item.problem}</p></div>
                <div className="kn-card"><h3>What was announced</h3><p>{slide.item.announced}</p></div>
                <div className="kn-card"><h3>Why it matters</h3><p>{slide.item.whyItMatters}</p></div>
              </div>
              {slide.item.links && slide.item.links.length > 0 && (
                <div className="kn-links">
                  {slide.item.links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>
                  ))}
                </div>
              )}
              {notes && slide.item.notes && <div className="kn-notes"><strong>Notes:</strong> {slide.item.notes}</div>}
            </>
          )}
        </div>
      </main>

      <nav className="kn-bar" aria-label="Presentation controls">
        <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">←</button>
        <button onClick={() => go(index + 1)} disabled={index === last} aria-label="Next slide">→</button>
        <div className="kn-progress" role="progressbar" aria-valuemin={0} aria-valuemax={last} aria-valuenow={index}>
          <div style={{ width: `${(index / Math.max(last, 1)) * 100}%` }} />
        </div>
        <span className="kn-count">{index + 1}/{slides.length}</span>
        <button onClick={() => setDialog('map')}>Map</button>
        <button onClick={() => setDialog('help')}>?</button>
      </nav>

      {dialog && (
        <div className="kn-overlay" onClick={() => setDialog(null)}>
          <div className="kn-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {dialog === 'help' ? (
              <>
                <h2>Keyboard</h2>
                <p><kbd>→</kbd> / <kbd>Space</kbd> next · <kbd>←</kbd> previous · <kbd>Home</kbd>/<kbd>End</kbd></p>
                <p><kbd>G</kbd> map · <kbd>N</kbd> presenter notes · <kbd>F</kbd> fullscreen · <kbd>?</kbd> help · <kbd>Esc</kbd> close</p>
              </>
            ) : (
              <>
                <h2>All announcements</h2>
                {sections.map((s) => (
                  <div key={s.id}>
                    <div className="kn-section-head">{s.title}</div>
                    <ul className="kn-list">
                      {slides.map((sl, i) =>
                        sl.kind === 'announcement' && sl.section.id === s.id ? (
                          <li key={sl.item.id}>
                            <button aria-current={i === index} onClick={() => { go(i); setDialog(null); }}>
                              <span className="kn-dot" style={{ background: s.accent }} />
                              {sl.item.title}
                            </button>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
