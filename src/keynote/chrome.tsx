import { useEffect, useMemo, useRef, useState } from 'react';
import { announcements, chapters } from '../deck/content';
import type { Slide } from '../deck/timeline';
import { cx } from './ui';
import type { useDeck } from './useDeck';

type Deck = ReturnType<typeof useDeck>;

const PATHS: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  map: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  back: 'M19 12H5M11 6l-6 6 6 6',
  next: 'M5 12h14M13 6l6 6-6 6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  compass: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  present: 'M3 4h18v12H3zM12 16v4M8 20h8',
  notes: 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4',
  full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  black: 'M5 5h14v14H5z',
  reset: 'M4 12a8 8 0 108-8H7M7 1v6h6',
  keys: 'M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M8 14h8',
  hide: 'M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9 9 0 0121 12a13 13 0 01-3 3.7M6.6 6.6A13 13 0 003 12s3.5 6 9 6a8 8 0 003-.6',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5',
  pin: 'M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10zM12 12a2 2 0 100-4 2 2 0 000 4z',
  close: 'M5 5l14 14M19 5L5 19',
};

export function Icon({ name, size = 18 }: { name: keyof typeof PATHS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

const chapterIndex = (id?: string) => chapters.findIndex((c) => c.id === id);

/* ---------- bottom bar ---------- */

export function Bar({ d, accent, onMap, onMenu, menuOpen }: { d: Deck; accent: string; onMap: () => void; onMenu: () => void; menuOpen: boolean }) {
  const s = d.slide;
  const ci = chapterIndex(s.chapterId);
  const chapter = chapters[ci];

  // Progress bar: one segment per chapter, sized by how many steps it has.
  const segments = useMemo(() => {
    const t = d.timeline;
    const total = t.length;
    const out: { color: string; w: number }[] = [];
    let run = 0;
    let cur: string | undefined;
    const flush = () => { if (run) out.push({ color: chapters.find((c) => c.id === cur)?.accent ?? '#5b6475', w: (run / total) * 100 }); run = 0; };
    t.forEach((x) => { if (x.chapterId !== cur) { flush(); cur = x.chapterId; } run++; });
    flush();
    return out;
  }, [d.timeline]);
  const pct = ((d.index + 1) / (d.last + 1)) * 100;

  return (
    <nav className="bar2" aria-label="Presentation controls">
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={d.last} aria-valuenow={d.index}>
        {segments.map((g, i) => <span key={i} style={{ width: `${g.w}%`, background: g.color }} />)}
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="bar2-row">
        <button className="b-ghost" onClick={() => d.jump(d.mode, 0)}><Icon name="home" /> <span>Home</span></button>
        <span className="b-sep" />
        <div className="crumbs">
          {chapter && <span className="crumb"><i className="dot" style={{ background: accent }} />{ci + 1}. {chapter.title}</span>}
          {chapter && <span className="slash">/</span>}
          <span className="here">{s.name ? <><b>{s.name}</b> · {s.part}</> : <b>{s.part}</b>}</span>
          <span className="count">{d.index + 1} / {d.last + 1}</span>
        </div>
        <span className="spacer" />
        {s.steps > 1 && (
          <span className="dots" aria-hidden="true">
            {Array.from({ length: s.steps }, (_, i) => <i key={i} className={cx(i + 1 === s.step && 'on', i + 1 < s.step && 'past')} />)}
          </span>
        )}
        <button className="b-ghost" onClick={d.prev} disabled={d.index === 0}><Icon name="back" /> <span>Back</span></button>
        <button className="b-next" onClick={d.next} disabled={d.index === d.last}>
          <b>Next</b>{s.steps > 1 && <small>Step {s.step} of {s.steps}</small>}<Icon name="next" />
        </button>
        <button className="b-ghost" onClick={onMap}><Icon name="map" /> <span>Map</span></button>
        <button className={cx('b-ghost', 'b-icon', menuOpen && 'open')} onClick={onMenu} aria-label="More controls" aria-expanded={menuOpen}><Icon name="more" /></button>
      </div>
    </nav>
  );
}

/* ---------- ⋯ menu ---------- */

export interface MenuItem { icon: keyof typeof PATHS; label: string; key?: string; run: () => void }

export function Menu({ groups, onClose }: { groups: MenuItem[][]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node) && !(e.target as Element).closest('.b-icon')) onClose(); };
    window.addEventListener('mousedown', down);
    return () => window.removeEventListener('mousedown', down);
  }, [onClose]);
  return (
    <div className="menu" role="menu" ref={ref}>
      {groups.map((g, i) => (
        <div className="menu-group" key={i}>
          {g.map((m) => (
            <button key={m.label} role="menuitem" onClick={() => { onClose(); m.run(); }}>
              <Icon name={m.icon} /> <span>{m.label}</span>{m.key && <kbd>{m.key}</kbd>}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- map ---------- */

interface Part { short: string; index: number }

export function MapDialog({ d, onClose, onExplore }: { d: Deck; onClose: () => void; onExplore: () => void }) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  const all = d.timelines.a;
  const hi = d.timelines.h;

  // First slide index of each scene, per announcement (all-announcements timeline).
  const parts = useMemo(() => {
    const map = new Map<string, Part[]>();
    all.forEach((s, i) => {
      if (!s.announcementId || s.step !== 1) return;
      const list = map.get(s.announcementId) ?? [];
      list.push({ short: s.short, index: i });
      map.set(s.announcementId, list);
    });
    return map;
  }, [all]);

  const cur = d.slide;
  const here = d.mode === 'a' ? d.index - (cur.step - 1) : (() => { const i = all.findIndex((s) => s.scene === cur.scene && s.step === 1); return i; })();
  const needle = q.trim().toLowerCase();
  const match = (text: string) => !needle || text.toLowerCase().includes(needle);
  const visible = (a: (typeof announcements)[number]) => match(`${a.name} ${a.title} ${a.announced} ${a.statuses.join(' ')}`);
  const firstMatch = needle ? announcements.find(visible) : undefined;
  const total = announcements.length;

  const goAll = (i: number) => { d.jump('a', i); onClose(); };
  const goHi = (i: number) => { d.jump('h', i); onClose(); };
  const recapIndex = all.findIndex((s) => s.scene.kind === 'recap');
  const isHere = (a: string) => cur.announcementId === a;

  const highlightStrip = useMemo(() => {
    const out: { label: string; index: number }[] = [];
    let n = 0;
    hi.forEach((s, i) => {
      if (s.step !== 1) return;
      if (s.scene.kind === 'intro') out.push({ label: `${++n}. ${s.name}`, index: i });
      else if (s.scene.kind === 'recap') out.push({ label: 'Recap', index: i });
    });
    return out;
  }, [hi]);

  return (
    <div className="map" role="dialog" aria-modal="true" aria-label="Map">
      <header className="map-head">
        <div>
          <h2>Map</h2>
          <p>{total} announcements in {chapters.length} sections. Type to search, then press Enter to open the first match.</p>
        </div>
        <label className="search">
          <Icon name="search" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search announcements and scenes"
            onKeyDown={(e) => { if (e.key === 'Enter' && firstMatch) { const p = parts.get(firstMatch.id); if (p) goAll(p[0].index); } }} />
        </label>
        <button className="map-x" onClick={onClose} aria-label="Close map"><Icon name="close" /></button>
      </header>

      <div className="map-body">
        <div className="tiles">
          <button onClick={() => goAll(0)}><Icon name="home" size={22} /><b>Home</b></button>
          <button onClick={() => d.mode !== 'a' ? (d.setMode('a'), onClose()) : onClose()}>
            <Icon name="map" size={22} /><span><b>Announcements</b><small>{chapters.length} sections, all {total}</small></span>
          </button>
          <button onClick={() => { d.setMode('h'); onClose(); }}>
            <Icon name="spark" size={22} /><span><b>Highlights</b><small>{announcements.filter((a) => a.highlight).length} announcements, the short tour</small></span>
          </button>
          <button onClick={onExplore}>
            <Icon name="compass" size={22} /><span><b>Explore</b><small>Browse cards for all {total}</small></span>
          </button>
        </div>

        <div className="cols" style={{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }}>
          {chapters.map((c, ci) => {
            const items = announcements.filter((a) => a.chapter === c.id);
            return (
              <section key={c.id} style={{ ['--accent' as string]: c.accent }}>
                <h3><small>{String(ci + 1).padStart(2, '0')}</small>{c.title}</h3>
                <ul>
                  {items.map((a) => {
                    const p = parts.get(a.id) ?? [];
                    const show = visible(a);
                    const open = !!a.highlight || isHere(a.id);
                    return (
                      <li key={a.id} className={cx(!show && 'dim', a.highlight && 'hl', isHere(a.id) && 'cur')} hidden={needle !== '' && !show}>
                        <button className="m-title" onClick={() => goAll(p[0]?.index ?? 0)}>{a.name}</button>
                        {open && (
                          <div className="m-chips">
                            {p.map((x) => (
                              <button key={x.index} className={cx('m-chip', here === x.index && 'on')} onClick={() => goAll(x.index)}>{x.short}</button>
                            ))}
                          </div>
                        )}
                        {isHere(a.id) && <span className="you"><Icon name="pin" size={13} /> You are here</span>}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="wrap">
          <h4>Wrap-up</h4>
          <button className={cx('m-pill', cur.scene.kind === 'recap' && 'on')} onClick={() => goAll(recapIndex)}>The takeaways</button>
        </div>

        <div className="wrap">
          <h4><Icon name="spark" size={16} /> Highlights</h4>
          <div className="strip">
            {highlightStrip.map((x) => <button key={x.index} className="m-pill" onClick={() => goHi(x.index)}>{x.label}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { Slide };
