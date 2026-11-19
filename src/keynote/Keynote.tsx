import { useEffect, useState } from 'react';
import { announcements, chapters } from '../deck/content';
import { Chip, cx } from './ui';
import { SceneView, chapterOf } from './scenes';
import { Stage } from './Stage';
import { useDeck } from './useDeck';

type Dialog = 'explore' | 'help' | null;

export default function Keynote() {
  const presenter = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('presenter') === '1';
  return presenter ? <Presenter /> : <Main />;
}

function useKeys(d: ReturnType<typeof useDeck>, extra: (e: KeyboardEvent) => boolean | void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (extra(e)) return;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); d.next(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); d.prev(); break;
        case 'Home': d.go(0); break;
        case 'End': d.go(d.last); break;
        case '1': case '2': case '3': d.goToChapter(Number(e.key) - 1); break;
        case 'h': case 'H': d.setMode('h'); break;
        case 'a': case 'A': d.setMode('a'); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
}

function Main() {
  const d = useDeck();
  const [dialog, setDialog] = useState<Dialog>(null);

  useKeys(d, (e) => {
    switch (e.key) {
      case 'g': case 'G': case 'o': case 'O': setDialog((v) => (v === 'explore' ? null : 'explore')); return true;
      case '?': setDialog((v) => (v === 'help' ? null : 'help')); return true;
      case 'Escape': setDialog(null); return true;
      case 'f': case 'F':
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
        return true;
      case 'p': case 'P':
        window.open(`${window.location.pathname}?presenter=1${window.location.hash}`, 'ignite26-presenter', 'width=1100,height=760');
        return true;
    }
    return dialog !== null && ['ArrowRight', 'ArrowLeft', ' ', 'Enter', 'Backspace'].includes(e.key);
  });

  const accent = chapterOf(d.slide.chapterId)?.accent ?? '#3b9cff';
  const pct = (d.index / Math.max(d.last, 1)) * 100;

  return (
    <div className="app">
      <Stage accent={accent}>
        <SceneView slide={d.slide} onStart={d.start} />
      </Stage>

      <nav className="bar" aria-label="Presentation controls">
        <button onClick={d.prev} disabled={d.index === 0} aria-label="Previous">←</button>
        <button onClick={d.next} disabled={d.index === d.last} aria-label="Next">→</button>
        <div className="bar-track" role="progressbar" aria-valuemin={0} aria-valuemax={d.last} aria-valuenow={d.index}>
          <div style={{ width: `${pct}%`, background: accent }} />
        </div>
        <span className="bar-label">{d.slide.label}</span>
        <button className={cx(d.mode === 'h' && 'active')} onClick={() => d.setMode(d.mode === 'h' ? 'a' : 'h')} title="Toggle Highlights / All (H / A)">
          {d.mode === 'h' ? 'Highlights' : 'All'}
        </button>
        <button onClick={() => setDialog('explore')}>Explore</button>
        <button onClick={() => setDialog('help')} aria-label="Help">?</button>
      </nav>

      {dialog && (
        <div className="overlay" onClick={() => setDialog(null)}>
          <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setDialog(null)} aria-label="Close">✕</button>
            {dialog === 'help' ? <Help /> : <Explore onPick={(id) => { d.goToAnnouncement(id); setDialog(null); }} />}
          </div>
        </div>
      )}
    </div>
  );
}

function Explore({ onPick }: { onPick: (id: string) => void }) {
  return (
    <>
      <h2>Explore all announcements</h2>
      {chapters.map((c) => (
        <section key={c.id} style={{ ['--accent' as string]: c.accent }}>
          <h3 className="ex-chapter">{c.title}</h3>
          <div className="ex-grid">
            {announcements.filter((a) => a.chapter === c.id).map((a) => (
              <article className="ex-card" key={a.id}>
                <button className="ex-open" onClick={() => onPick(a.id)}>
                  <span className="ex-name">{a.name}</span>
                  <strong>{a.title}</strong>
                  <span className="ex-ann">{a.announced}</span>
                </button>
                <div className="ex-foot">
                  {a.statuses.map((s) => <Chip key={s} status={s} />)}
                  {a.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function Help() {
  const rows: [string, string][] = [
    ['→  Space  Enter', 'Next step'], ['←  Backspace', 'Previous step'], ['Home / End', 'First / last slide'],
    ['1 2 3', 'Jump to a chapter'], ['H / A', 'Highlights / All announcements'], ['G or O', 'Explore all announcements'],
    ['P', 'Open the presenter window (notes, next up, timer)'], ['F', 'Fullscreen'], ['?', 'This help'],
  ];
  return (
    <>
      <h2>Keyboard</h2>
      <table className="keys"><tbody>{rows.map(([k, v]) => <tr key={k}><td><kbd>{k}</kbd></td><td>{v}</td></tr>)}</tbody></table>
    </>
  );
}

function Presenter() {
  const d = useDeck();
  const [started] = useState(() => Date.now());
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 1000); return () => clearInterval(t); }, []);
  useKeys(d, () => false);

  const secs = Math.floor((Date.now() - started) / 1000);
  const nextSlide = d.timeline[d.index + 1];
  const accent = chapterOf(d.slide.chapterId)?.accent ?? '#3b9cff';

  return (
    <div className="presenter" style={{ ['--accent' as string]: accent }}>
      <header>
        <span className="timer">{String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}</span>
        <span>Slide {d.index + 1} / {d.last + 1} · step {d.slide.step}/{d.slide.steps}</span>
        <span className="spacer" />
        <button onClick={d.prev} disabled={d.index === 0}>← Back</button>
        <button onClick={d.next} disabled={d.index === d.last}>Next →</button>
      </header>
      <main>
        <p className="kicker">Now</p>
        <h1>{d.slide.label}</h1>
        <p className="notes">{d.slide.notes}</p>
      </main>
      <aside>
        <p className="kicker">Next up</p>
        <p>{nextSlide ? nextSlide.label : 'End of deck'}</p>
      </aside>
    </div>
  );
}
