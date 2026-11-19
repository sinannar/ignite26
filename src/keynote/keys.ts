import { useEffect } from 'react';
import type { useDeck } from './useDeck';

export function useKeys(d: ReturnType<typeof useDeck>, extra: (e: KeyboardEvent) => boolean | void) {
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
