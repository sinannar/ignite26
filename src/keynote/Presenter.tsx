import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { chapters } from '../deck/content';
import type { Slide } from '../deck/timeline';
import { Chip, cx } from './ui';
import { SceneView, chapterOf } from './scenes';
import { useKeys } from './keys';
import { formatCode, join, leave, sendCtl, useLink } from './link';
import { useDeck } from './useDeck';

const noop = () => {};

/** A live, scaled-down render of a slide. */
function Thumb({ slide, accent }: { slide: Slide | undefined; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 1920);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="pv-thumb" ref={ref} style={{ ['--accent' as string]: accent }}>
      {slide
        ? <div className="pv-thumb-in" style={{ transform: `scale(${scale})` }}><SceneView slide={slide} onStart={noop} onChapter={noop} onAnnouncement={noop} /></div>
        : <div className="pv-end">End of deck</div>}
    </div>
  );
}

/** What is revealed at this exact step, in a few words. */
function stepText(s: Slide): string | null {
  const sc = s.scene;
  switch (sc.kind) {
    case 'chapter': return s.step === 1 ? sc.chapter.tagline : sc.chapter.points[s.step - 2]?.name ?? null;
    case 'intro': return s.step === 1 ? 'The problem' : 'What was announced';
    case 'visual': {
      const v = sc.a.visuals[sc.v];
      if (v.kind === 'flow') return v.steps[s.step - 1]?.label ?? null;
      if (v.kind === 'grid') return v.groups[s.step - 1]?.title ?? null;
      if (v.kind === 'stats') return v.items[s.step - 1]?.label ?? null;
      return s.step === 1 ? v.from.join(' + ') : v.to.name;
    }
    case 'recap': return chapters[s.step - 1]?.title ?? null;
    default: return null;
  }
}

function sceneStarts(timeline: Slide[]) {
  return timeline.map((s, i) => (s.step === 1 ? i : -1)).filter((i) => i >= 0);
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Presenter() {
  const d = useDeck();
  const [started, setStarted] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState<'notes' | 'map'>('notes');
  const [black, setBlack] = useState(false);
  const [goto, setGoto] = useState('');
  const send = sendCtl;
  const link = useLink();
  const [codeInput, setCodeInput] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  useEffect(() => { const c = new URLSearchParams(window.location.search).get('join'); if (c) void join(c); }, []);
  const toggleBlack = () => { send({ type: 'black', on: !black }); setBlack(!black); };
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  useKeys(d, (e) => {
    if (e.key === 'n' || e.key === 'N') { setTab('notes'); return true; }
    if (e.key === 'g' || e.key === 'G' || e.key === 'm' || e.key === 'M') { setTab('map'); return true; }
    if (e.key === 'b' || e.key === 'B' || e.key === '.') { toggleBlack(); return true; }
    if (e.key === 'r' || e.key === 'R') { send({ type: 'reset' }); d.go(d.index - (d.slide.step - 1)); return true; }
    if (e.key === 'Escape' && black) { toggleBlack(); return true; }
    return false;
  });

  const s = d.slide;
  const next = d.timeline[d.index + 1];
  const accent = chapterOf(s.chapterId)?.accent ?? '#3b9cff';
  const nextAccent = chapterOf(next?.chapterId)?.accent ?? accent;
  const secs = Math.floor((now - started) / 1000);
  const clock = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const ci = chapters.findIndex((c) => c.id === s.chapterId);

  const starts = useMemo(() => sceneStarts(d.timeline), [d.timeline]);
  const curStart = d.index - (s.step - 1);
  const prevScene = [...starts].reverse().find((i) => i < curStart);
  const nextScene = starts.find((i) => i > d.index);

  const sameScene = next && next.scene === s.scene;
  const revealed = next ? stepText(next) : null;

  return (
    <div className="pv" style={{ ['--accent' as string]: accent }}>
      <header className="pv-top">
        <strong>Presenter view</strong>
        <span className="pv-crumb">
          {ci >= 0 && <><i className="dot" style={{ background: accent }} />{ci + 1}. {chapters[ci].title} <em>/</em> </>}
          <b>{s.name ? `${s.name} · ${s.part}` : s.part}</b> <span className="pv-count">{d.index + 1} of {d.last + 1}</span>
        </span>
        <span className="pv-sp" />
        <span className="pv-link-wrap">
          <button className={cx('pv-pill', link.state === 'connected' && 'ok')} onClick={() => setShowJoin((v) => !v)}>
            {link.role === 'guest' ? (link.state === 'connected' ? `● Linked ${formatCode(link.code ?? '')}` : link.state === 'error' ? '⚠ Link failed' : `Linking… ${link.via ?? ''}`) : '○ Link to deck'}
          </button>
          {(showJoin || (link.role === 'guest' && link.state === 'error')) && (
            <form className="pv-join" onSubmit={(e) => { e.preventDefault(); void join(codeInput); setShowJoin(false); }}>
              <input autoFocus value={codeInput} onChange={(e) => setCodeInput(e.target.value.toUpperCase())} placeholder="XXXX-XXXX" maxLength={9} aria-label="Pairing code" />
              <button type="submit">Connect</button>
              {link.role === 'guest' && <button type="button" onClick={() => { leave(); setShowJoin(false); }}>Disconnect</button>}
              {link.error && <p>{link.error}</p>}
              <p className="pv-hint">On the deck press <kbd>D</kbd> to get a code or QR. Works over the internet, no account needed.</p>
            </form>
          )}
        </span>
        <span className="pv-elapsed">Elapsed <b>{pad(Math.floor(secs / 60))}:{pad(secs % 60)}</b></span>
        <button onClick={() => setStarted(Date.now())}>Restart timer</button>
        <span className="pv-clock">{clock}</span>
      </header>

      <div className="pv-body">
        <section className="pv-left">
          <Thumb slide={s} accent={accent} />
          <div className="pv-cap"><span>Now on screen</span><span>{s.name || s.part}</span></div>
          <div className="pv-step">
            <span className="pv-dots">{Array.from({ length: s.steps }, (_, i) => <i key={i} className={cx(i + 1 === s.step && 'on')} />)}</span>
            Step {s.step} of {s.steps}
          </div>

          <div className="pv-next-card">
            <small>When you press next</small>
            {next ? (
              <>
                <h3>{sameScene ? `Reveals step ${next.step} of ${next.steps} on this screen` : `Moves to ${next.label}`}</h3>
                {revealed && sameScene && <p>“{revealed}”</p>}
                <p className="pv-muted">Back returns to {d.timeline[d.index - 1]?.label ?? 'the start'}</p>
              </>
            ) : <h3>End of deck</h3>}
          </div>

          <Thumb slide={next} accent={nextAccent} />
          <div className="pv-cap"><span>After Next</span><span>{next ? (next.name || next.part) : ''}</span></div>

          <div className="pv-controls">
            <button onClick={d.prev} disabled={d.index === 0}>← Back</button>
            <button className="pv-next" onClick={d.next} disabled={d.index === d.last}>Next →</button>
            <span className="pv-sep" />
            <button onClick={() => prevScene !== undefined && d.go(prevScene)} disabled={prevScene === undefined}>« Screen</button>
            <button onClick={() => nextScene !== undefined && d.go(nextScene)} disabled={nextScene === undefined}>Screen »</button>
            <span className="pv-sep" />
            <button onClick={() => d.jump(d.mode, 0)}>Home</button>
            <button className={cx(black && 'pv-on')} onClick={toggleBlack} aria-pressed={black}>{black ? 'Show screen' : 'Black screen'} <kbd>B</kbd></button>
            <button onClick={() => { send({ type: 'reset' }); d.go(d.index - (s.step - 1)); }}>Reset scene <kbd>R</kbd></button>
            <form className="pv-goto" onSubmit={(e) => { e.preventDefault(); const n = Number(goto); if (n >= 1 && n <= d.last + 1) d.go(n - 1); setGoto(''); }}>
              <input value={goto} onChange={(e) => setGoto(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder={`Go to 1–${d.last + 1}`} aria-label="Go to slide number" />
            </form>
            <button onClick={() => d.setMode(d.mode === 'h' ? 'a' : 'h')}>{d.mode === 'h' ? 'Highlights' : 'All'} ⇄</button>
          </div>
        </section>

        <aside className="pv-right">
          <div className="pv-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'notes'} className={cx(tab === 'notes' && 'on')} onClick={() => setTab('notes')}>Notes <kbd>N</kbd></button>
            <button role="tab" aria-selected={tab === 'map'} className={cx(tab === 'map' && 'on')} onClick={() => setTab('map')}>Map <kbd>G</kbd></button>
          </div>
          <div className="pv-scroll">{tab === 'notes' ? <Notes slide={s} next={next} /> : <PMap d={d} />}</div>
          <p className="pv-keys">Keys drive the keynote window: → or Space next, ← back, Home, 1–6 chapters, N notes, G map, B black screen, R reset scene.</p>
        </aside>
      </div>
    </div>
  );
}

function Notes({ slide, next }: { slide: Slide; next?: Slide }) {
  const sc = slide.scene;
  const a = sc.kind === 'intro' || sc.kind === 'visual' || sc.kind === 'why' ? sc.a : undefined;
  const visualLines: { text: string; on: boolean }[] = [];
  if (sc.kind === 'visual') {
    const v = sc.a.visuals[sc.v];
    if (v.kind === 'flow') v.steps.forEach((x, i) => visualLines.push({ text: `${x.label}${x.detail ? ` — ${x.detail}` : ''}`, on: i + 1 === slide.step }));
    else if (v.kind === 'grid') v.groups.forEach((g, i) => visualLines.push({ text: `${g.title}: ${g.items.map((x) => x.name).join(', ')}`, on: i + 1 === slide.step }));
    else if (v.kind === 'stats') v.items.forEach((x, i) => visualLines.push({ text: `${x.value} — ${x.label}`, on: i + 1 === slide.step }));
    else visualLines.push({ text: `${v.from.join(' + ')} → ${v.to.name}`, on: true });
  }
  return (
    <div className="pv-notes">
      <h2>{a ? a.name : slide.part}</h2>
      {a && (
        <>
          <h4>Key talking points</h4>
          <ul>
            <li><b>Problem:</b> {a.problem}</li>
            <li><b>Announced:</b> {a.announced}</li>
            <li><b>Why it matters:</b> {a.why}</li>
            <li><b>Status:</b> {a.statuses.map((x) => x).join(', ')}</li>
          </ul>
        </>
      )}
      {sc.kind === 'chapter' && (
        <>
          <h4>Section intro</h4>
          <p>{sc.chapter.tagline}</p>
          <ul>{sc.chapter.points.map((p, i) => <li key={p.name} className={cx(i + 2 === slide.step && 'hot')}>{p.name}{p.status && <> <Chip status={p.status} /></>}{p.note && <span className="pv-muted"> — {p.note}</span>}</li>)}</ul>
        </>
      )}
      {sc.kind === 'recap' && <ul>{chapters.map((c, i) => <li key={c.id} className={cx(i + 1 === slide.step && 'hot')}><b>{c.title}:</b> {c.takeaway}</li>)}</ul>}
      {visualLines.length > 0 && (
        <>
          <h4>During this screen</h4>
          <ol>{visualLines.map((l, i) => <li key={i} className={cx(l.on && 'hot')}>{l.text}</li>)}</ol>
        </>
      )}
      {a && <><h4>Watch out</h4><p>{a.notes}</p></>}
      {!a && sc.kind !== 'chapter' && sc.kind !== 'recap' && <p>{slide.notes}</p>}
      {next && <><h4>Transition</h4><p className="pv-italic">Next: {next.label}</p></>}
    </div>
  );
}

function PMap({ d }: { d: ReturnType<typeof useDeck> }) {
  // One row per screen (scene) in the current tour, grouped by section.
  const rows = useMemo(() => {
    const out: { n: number; index: number; label: string; group: string; color: string }[] = [];
    let n = 0;
    d.timeline.forEach((s, index) => {
      if (s.step !== 1) return;
      const c = chapters.find((x) => x.id === s.chapterId);
      const ci = chapters.findIndex((x) => x.id === s.chapterId);
      const kind = s.scene.kind;
      const label = kind === 'chapter' ? `${s.label} · Section intro` : kind === 'intro' ? s.name : s.name ? `${s.name} · ${s.short}` : s.part;
      out.push({
        n: ++n, index, label,
        group: c ? `${ci + 1}. ${c.title}` : kind === 'recap' ? 'Wrap-up' : 'Start',
        color: c?.accent ?? '#c9a7ff',
      });
    });
    return out;
  }, [d.timeline]);

  const curStart = d.index - (d.slide.step - 1);
  const groups: { name: string; color: string; items: typeof rows }[] = [];
  rows.forEach((r) => {
    const g = groups[groups.length - 1];
    if (g && g.name === r.group) g.items.push(r);
    else groups.push({ name: r.group, color: r.color, items: [r] });
  });

  return (
    <div className="pv-map">
      {groups.map((g) => (
        <div key={g.name}>
          <h4 style={{ ['--accent' as string]: g.color }}><i className="dot" style={{ background: g.color }} />{g.name}</h4>
          {g.items.map((r) => {
            const here = r.index === curStart;
            return (
              <button key={r.index} className={cx('pv-link', here && 'on')} onClick={() => d.go(r.index)} ref={(el) => { if (here && el) el.scrollIntoView({ block: 'nearest' }); }}>
                <span className="pv-n">{r.n}</span><span className="pv-l">{r.label}</span>{here && <em>On screen</em>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
