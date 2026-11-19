import { useEffect, useMemo, useRef, useState } from 'react';
import { announcements, chapters, event } from '../deck/content';
import { buildTimeline } from '../deck/timeline';
import type { Announcement, Item, Visual } from '../deck/types';

const STATUS_CLASS = (s: string) => `st st-${s.toLowerCase().replace(/\s+/g, '-')}`;

const itemLine = (i: Item) => [i.name, i.status && `(${i.status})`, i.note && `— ${i.note}`].filter(Boolean).join(' ');

/** Plain-language bullets for what a visual shows, so the speaker knows what the audience sees. */
function visualPoints(v: Visual): { title: string; lines: string[] } {
  switch (v.kind) {
    case 'flow': return { title: v.title, lines: v.steps.map((s, i) => `${i + 1}. ${s.label}${s.detail ? ` — ${s.detail}` : ''}`) };
    case 'grid': return { title: v.title, lines: v.groups.flatMap((g) => [`${g.title}:`, ...g.items.map((i) => `   • ${itemLine(i)}`)]) };
    case 'stats': return { title: v.title, lines: [...v.items.map((s) => `${s.value} — ${s.label}`), ...(v.footnote ? [`Note: ${v.footnote}`] : [])] };
    case 'converge': return { title: v.title, lines: [`${v.from.join(' + ')}  →  ${itemLine(v.to)}`] };
  }
}

function useFollow() {
  // Follows the main deck when it is open in the same browser (BroadcastChannel is same-device only).
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const t = { a: buildTimeline('a'), h: buildTimeline('h') };
    const ch = new BroadcastChannel('ignite26-deck');
    ch.onmessage = (e: MessageEvent<{ mode: 'a' | 'h'; index: number }>) => {
      const s = t[e.data.mode]?.[e.data.index];
      setId(s?.announcementId ?? (s?.chapterId ? `chapter:${s.chapterId}` : null));
    };
    return () => ch.close();
  }, []);
  return id;
}

function useWakeLock() {
  const [on, setOn] = useState(false);
  const lock = useRef<{ release: () => Promise<void> } | null>(null);
  const toggle = async () => {
    try {
      if (on) { await lock.current?.release(); lock.current = null; setOn(false); return; }
      const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
      if (!nav.wakeLock) return;
      lock.current = await nav.wakeLock.request('screen');
      setOn(true);
    } catch { setOn(false); }
  };
  useEffect(() => () => { void lock.current?.release(); }, []);
  return { on, toggle, supported: typeof navigator !== 'undefined' && 'wakeLock' in navigator };
}

function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage may be blocked */ } }

export default function SpeakerNotes() {
  const [highlightsOnly, setHighlightsOnly] = useState(() => read('sn-hl', false));
  const [size, setSize] = useState(() => read('sn-size', 1));
  const [done, setDone] = useState<string[]>(() => read('sn-done', []));
  const [q, setQ] = useState('');
  const current = useFollow();
  const wake = useWakeLock();

  useEffect(() => write('sn-hl', highlightsOnly), [highlightsOnly]);
  useEffect(() => write('sn-size', size), [size]);
  useEffect(() => write('sn-done', done), [done]);

  const needle = q.trim().toLowerCase();
  const match = (a: Announcement) => !needle || `${a.name} ${a.title} ${a.problem} ${a.announced} ${a.why} ${a.notes}`.toLowerCase().includes(needle);
  const list = useMemo(() => announcements.filter((a) => (!highlightsOnly || a.highlight) && match(a)), [highlightsOnly, needle]);
  const hlCount = announcements.filter((a) => a.highlight).length;

  useEffect(() => {
    if (!current) return;
    document.getElementById(current)?.scrollIntoView({ block: 'start' });
  }, [current]);

  const toggleDone = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <div className="sn" style={{ fontSize: `${size * 100}%` }}>
      <header className="sn-top">
        <div className="sn-row">
          <strong className="sn-title">Speaker notes</strong>
          <span className="sn-sp" />
          <button onClick={() => setSize((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))} aria-label="Smaller text">A−</button>
          <button onClick={() => setSize((s) => Math.min(1.6, +(s + 0.1).toFixed(2)))} aria-label="Larger text">A+</button>
          {wake.supported && <button className={wake.on ? 'on' : ''} onClick={wake.toggle} aria-pressed={wake.on}>{wake.on ? 'Awake ✓' : 'Awake'}</button>}
        </div>
        <nav className="sn-chips" aria-label="Jump to section">
          <a href="#open">Open</a>
          {chapters.map((c, i) => <a key={c.id} href={`#chapter:${c.id}`} style={{ ['--c' as string]: c.accent }}><i />{i + 1}. {c.title}</a>)}
          <a href="#close">Close</a>
        </nav>
        <div className="sn-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes" aria-label="Search notes" />
          <button className={highlightsOnly ? 'on' : ''} onClick={() => setHighlightsOnly((v) => !v)} aria-pressed={highlightsOnly}>
            Highlights ({hlCount})
          </button>
        </div>
      </header>

      <main>
        <section id="open" className="sn-card">
          <h2>Open</h2>
          <p className="say">Welcome to {event.name}. Today I will walk you through what was announced across {chapters.map((c) => c.title).join(', ')}.</p>
          <p className="muted">Title slide → choose <b>Highlights</b> for the short tour ({hlCount} moments) or <b>All announcements</b> ({announcements.length}). Press <kbd>M</kbd> for the map.</p>
        </section>

        {chapters.map((c, ci) => {
          const items = list.filter((a) => a.chapter === c.id);
          const showChapter = !needle || items.length > 0;
          if (!showChapter || (highlightsOnly && items.length === 0)) return null;
          return (
            <div key={c.id} style={{ ['--c' as string]: c.accent }}>
              <section id={`chapter:${c.id}`} className={`sn-chapter ${current === `chapter:${c.id}` ? 'now' : ''}`}>
                <small>Section {ci + 1} of {chapters.length} · key <kbd>{ci + 1}</kbd></small>
                <h2>{c.title}</h2>
                <p className="say">{c.tagline}</p>
                <ul className="pts">
                  {c.points.map((p) => <li key={p.name}><b>{p.name}</b>{p.status && <span className={STATUS_CLASS(p.status)}>{p.status}</span>}{p.note && <span className="muted"> — {p.note}</span>}</li>)}
                </ul>
              </section>

              {items.map((a) => (
                <article key={a.id} id={a.id} className={`sn-card ${current === a.id ? 'now' : ''} ${done.includes(a.id) ? 'done' : ''}`}>
                  <div className="sn-head">
                    <div>
                      <small>{c.title} · {a.name}</small>
                      <h3>{a.title}</h3>
                    </div>
                    <button className="sn-done" onClick={() => toggleDone(a.id)} aria-pressed={done.includes(a.id)}>{done.includes(a.id) ? '✓ Covered' : 'Mark covered'}</button>
                  </div>
                  <div className="sn-meta">
                    {a.highlight && <span className="st st-hl">✦ Highlight</span>}
                    {a.statuses.map((s) => <span key={s} className={STATUS_CLASS(s)}>{s}</span>)}
                  </div>

                  <h4>Say</h4>
                  <ol className="say-list">
                    <li><b>The problem.</b> {a.problem}</li>
                    <li><b>What was announced.</b> {a.announced}</li>
                    <li><b>Why it matters.</b> {a.why}</li>
                  </ol>

                  {a.visuals.map((v) => {
                    const vp = visualPoints(v);
                    return (
                      <details key={v.title} className="sn-vis">
                        <summary>On screen: {vp.title}</summary>
                        <ul>{vp.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
                      </details>
                    );
                  })}

                  {a.whatsNew && a.whatsNew.length > 0 && (
                    <details className="sn-vis"><summary>Also in this announcement</summary><ul>{a.whatsNew.map((i) => <li key={i.name}>{itemLine(i)}</li>)}</ul></details>
                  )}

                  <div className="careful"><b>Watch out / source notes</b><p>{a.notes}</p></div>

                  {a.links.length > 0 && (
                    <p className="links">{a.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}</p>
                  )}
                </article>
              ))}
            </div>
          );
        })}

        <section id="close" className="sn-card">
          <h2>Close</h2>
          <p className="muted">Recap slide: one takeaway per section.</p>
          <ul className="pts">
            {chapters.map((c) => <li key={c.id} style={{ ['--c' as string]: c.accent }}><i className="dot" /><b>{c.title}.</b> {c.takeaway}</li>)}
          </ul>
        </section>

        {list.length === 0 && <p className="muted pad">No announcements match.</p>}
      </main>
    </div>
  );
}
