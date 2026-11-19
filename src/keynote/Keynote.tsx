import { useEffect, useState } from 'react';
import { announcements, chapters } from '../deck/content';
import { Chip } from './ui';
import { SceneView, chapterOf } from './scenes';
import { Stage } from './Stage';
import { Bar, MapDialog, Menu, type MenuItem } from './chrome';
import { useDeck } from './useDeck';

type Dialog = 'map' | 'explore' | 'help' | null;

export default function Keynote() {
  const presenter = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('presenter') === '1';
  return presenter ? <Presenter /> : <Main />;
}

function useKeys(d: ReturnType<typeof useDeck>, extra: (e: KeyboardEvent) => boolean | void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') && e.key !== 'Escape') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (extra(e)) { e.preventDefault(); return; }
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); d.next(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); d.prev(); break;
        case 'Home': d.go(0); break;
        case 'End': d.go(d.last); break;
        case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': d.goToChapter(Number(e.key) - 1); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
}

function Main() {
  const d = useDeck();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [menu, setMenu] = useState(false);
  const [notes, setNotes] = useState(false);
  const [black, setBlack] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const toggle = (name: Exclude<Dialog, null>) => setDialog((v) => (v === name ? null : name));
  const fullscreen = () => { if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen?.(); };
  const presenter = () => { window.open(`${window.location.pathname}?presenter=1${window.location.hash}`, 'ignite26-presenter', 'width=1100,height=760'); };
  const toggleMode = () => d.setMode(d.mode === 'h' ? 'a' : 'h');
  const reset = () => { d.go(d.index - (d.slide.step - 1)); setResetKey((k) => k + 1); };

  useKeys(d, (e) => {
    if (black) { if (e.key === 'b' || e.key === 'B' || e.key === 'Escape') setBlack(false); return true; }
    switch (e.key) {
      case 'm': case 'M': toggle('map'); return true;
      case 'o': case 'O': case 'g': case 'G': toggle('explore'); return true;
      case 't': case 'T': toggleMode(); return true;
      case '?': toggle('help'); return true;
      case 'Escape': setDialog(null); setMenu(false); return true;
      case 'f': case 'F': fullscreen(); return true;
      case 'p': case 'P': presenter(); return true;
      case 'n': case 'N': setNotes((v) => !v); return true;
      case 'b': case 'B': setBlack(true); return true;
      case 'r': case 'R': reset(); return true;
      case 'h': case 'H': setHidden((v) => !v); setMenu(false); return true;
    }
    return dialog !== null && ['ArrowRight', 'ArrowLeft', ' ', 'Enter', 'Backspace'].includes(e.key);
  });

  const accent = chapterOf(d.slide.chapterId)?.accent ?? '#3b9cff';
  const hl = d.mode === 'h';

  const groups: MenuItem[][] = [
    [
      { icon: 'spark', label: hl ? 'All announcements' : 'Highlights', key: 'T', run: toggleMode },
      { icon: 'compass', label: 'Explore all announcements', key: 'O', run: () => setDialog('explore') },
    ],
    [
      { icon: 'present', label: 'Presenter window', key: 'P', run: presenter },
      { icon: 'notes', label: notes ? 'Hide presenter notes' : 'Show presenter notes', key: 'N', run: () => setNotes((v) => !v) },
      { icon: 'full', label: 'Fullscreen', key: 'F', run: fullscreen },
      { icon: 'black', label: 'Black screen', key: 'B', run: () => setBlack(true) },
      { icon: 'reset', label: 'Reset this screen', key: 'R', run: reset },
    ],
    [
      { icon: 'keys', label: 'Keys and navigation help', key: '?', run: () => setDialog('help') },
      { icon: 'hide', label: 'Hide these controls', key: 'H', run: () => setHidden(true) },
    ],
  ];

  return (
    <div className="app">
      <Stage accent={accent}>
        <SceneView key={resetKey} slide={d.slide} onStart={d.start} onChapter={d.goToChapter} onAnnouncement={d.goToAnnouncement} />
      </Stage>

      {notes && <aside className="notes-pop" aria-label="Presenter notes"><b>Presenter notes</b><p>{d.slide.notes}</p></aside>}

      {hidden
        ? <button className="show-controls" onClick={() => setHidden(false)} aria-label="Show controls (H)">Show controls</button>
        : <Bar d={d} accent={accent} onMap={() => toggle('map')} onMenu={() => setMenu((v) => !v)} menuOpen={menu} />}
      {menu && !hidden && <Menu groups={groups} onClose={() => setMenu(false)} />}

      {dialog === 'map' && <MapDialog d={d} onClose={() => setDialog(null)} onExplore={() => setDialog('explore')} />}
      {(dialog === 'explore' || dialog === 'help') && (
        <div className="overlay" onClick={() => setDialog(null)}>
          <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setDialog(null)} aria-label="Close">✕</button>
            {dialog === 'help' ? <Help /> : <Explore onPick={(id) => { d.goToAnnouncement(id); setDialog(null); }} />}
          </div>
        </div>
      )}
      {black && <div className="black" onClick={() => setBlack(false)} />}
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
    ['1 – 6', 'Jump to a chapter'], ['T', 'Highlights / All announcements'], ['M', 'Map of every announcement and scene'],
    ['O', 'Explore all announcements'], ['P', 'Open the presenter window (notes, next up, timer)'], ['N', 'Show presenter notes on screen'],
    ['F', 'Fullscreen'], ['B', 'Black screen'], ['R', 'Reset this scene to its first step'], ['H', 'Hide / show the controls'], ['?', 'This help'],
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
