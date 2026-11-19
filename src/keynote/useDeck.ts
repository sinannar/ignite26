import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildTimeline, type Mode, type Slide } from '../deck/timeline';
import { chapters } from '../deck/content';

interface DeckState { mode: Mode; index: number }

function parseHash(): DeckState {
  const m = /^#\/([ah])\/(\d+)$/.exec(window.location.hash);
  return m ? { mode: m[1] as Mode, index: Number(m[2]) } : { mode: 'a', index: 0 };
}

/** Deck navigation, deep links (#/a/12) and sync between the stage and presenter windows. */
export function useDeck() {
  const [state, setState] = useState<DeckState>(parseHash);
  const timelines = useMemo(() => ({ a: buildTimeline('a'), h: buildTimeline('h') }), []);
  const timeline = timelines[state.mode];
  const last = timeline.length - 1;
  const index = Math.min(Math.max(state.index, 0), last);
  const slide: Slide = timeline[index];

  const channel = useRef<BroadcastChannel | null>(null);
  const apply = useCallback((next: DeckState, broadcast = true) => {
    setState((cur) => (cur.mode === next.mode && cur.index === next.index ? cur : next));
    if (broadcast) channel.current?.postMessage(next);
  }, []);

  useEffect(() => {
    const ch = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('ignite26-deck');
    channel.current = ch;
    if (ch) ch.onmessage = (e: MessageEvent<DeckState>) => apply(e.data, false);
    const onHash = () => apply(parseHash(), false);
    window.addEventListener('hashchange', onHash);
    return () => { ch?.close(); window.removeEventListener('hashchange', onHash); };
  }, [apply]);

  useEffect(() => {
    const h = `#/${state.mode}/${index}`;
    if (window.location.hash !== h) history.replaceState(null, '', h);
  }, [state.mode, index]);

  const go = useCallback((i: number) => apply({ mode: state.mode, index: Math.min(Math.max(i, 0), last) }), [apply, state.mode, last]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  const start = useCallback((mode: Mode) => apply({ mode, index: 1 }), [apply]);

  /** Switch mode, staying on the same announcement/chapter when possible. */
  const setMode = useCallback((mode: Mode) => {
    const t = timelines[mode];
    let i = slide.announcementId ? t.findIndex((s) => s.announcementId === slide.announcementId) : -1;
    if (i < 0 && slide.chapterId) i = t.findIndex((s) => s.chapterId === slide.chapterId);
    apply({ mode, index: Math.max(i, 0) });
  }, [apply, slide, timelines]);

  const goToAnnouncement = useCallback((id: string) => {
    const i = timelines.a.findIndex((s) => s.announcementId === id);
    if (i >= 0) apply({ mode: 'a', index: i });
  }, [apply, timelines]);

  const goToChapter = useCallback((n: number) => {
    const c = chapters[n];
    const i = c ? timeline.findIndex((s) => s.chapterId === c.id) : -1;
    if (i >= 0) go(i);
  }, [go, timeline]);

  return { mode: state.mode, index, last, slide, timeline, go, next, prev, start, setMode, goToAnnouncement, goToChapter };
}
