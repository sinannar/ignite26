import { announcements, chapters, event } from './content';
import type { Announcement, Chapter } from './types';

export type Mode = 'a' | 'h'; // all announcements | highlights

export type Scene =
  | { kind: 'title' }
  | { kind: 'chapter'; chapter: Chapter }
  | { kind: 'intro'; a: Announcement }
  | { kind: 'visual'; a: Announcement; v: number }
  | { kind: 'why'; a: Announcement }
  | { kind: 'recap' };

export interface Slide {
  scene: Scene;
  /** 1..steps: number of reveal steps showing. */
  step: number;
  steps: number;
  label: string;
  notes: string;
  chapterId?: string;
  announcementId?: string;
}

function stepsOf(s: Scene): number {
  switch (s.kind) {
    case 'title': return 1;
    case 'chapter': return 1 + s.chapter.points.length;
    case 'intro': return 2;
    case 'visual': {
      const v = s.a.visuals[s.v];
      return v.kind === 'flow' ? v.steps.length : v.kind === 'grid' ? v.groups.length : v.kind === 'stats' ? v.items.length : 2;
    }
    case 'why': return 1;
    case 'recap': return chapters.length;
  }
}

export function buildTimeline(mode: Mode): Slide[] {
  const scenes: { scene: Scene; label: string; notes: string; chapterId?: string; announcementId?: string }[] = [
    { scene: { kind: 'title' }, label: event.name, notes: 'Open on the title. Choose Highlights for a short tour, or All announcements for the full walkthrough.' },
  ];
  for (const chapter of chapters) {
    scenes.push({ scene: { kind: 'chapter', chapter }, label: chapter.title, notes: chapter.tagline, chapterId: chapter.id });
    for (const a of announcements.filter((x) => x.chapter === chapter.id && (mode === 'a' || x.highlight))) {
      const base = { chapterId: chapter.id, announcementId: a.id };
      scenes.push({ scene: { kind: 'intro', a }, label: `${a.name}: ${a.title}`, notes: a.notes, ...base });
      a.visuals.forEach((_, v) => scenes.push({ scene: { kind: 'visual', a, v }, label: `${a.name}: ${a.visuals[v].title}`, notes: a.notes, ...base }));
      scenes.push({ scene: { kind: 'why', a }, label: `${a.name}: why it matters`, notes: a.notes, ...base });
    }
  }
  scenes.push({ scene: { kind: 'recap' }, label: 'Recap', notes: 'One takeaway per chapter.' });

  return scenes.flatMap((s) => {
    const steps = stepsOf(s.scene);
    return Array.from({ length: steps }, (_, i) => ({ ...s, step: i + 1, steps }));
  });
}
