import { announcements, chapters, event } from './content';
import type { Announcement, Chapter } from './types';

export type Mode = 'a' | 'h'; // all announcements | highlights

export type Scene =
  | { kind: 'title' }
  | { kind: 'map' }
  | { kind: 'highlights' }
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
  /** Announcement or chapter name; empty on the title and recap. */
  name: string;
  /** What this scene is, e.g. "Why it matters". */
  part: string;
  /** Short chip text for the map. */
  short: string;
  notes: string;
  chapterId?: string;
  announcementId?: string;
}

const VISUAL_SHORT = { flow: 'How it works', grid: 'What’s included', stats: 'Numbers', converge: 'Brings together' } as const;

function stepsOf(s: Scene): number {
  switch (s.kind) {
    case 'title': case 'map': case 'highlights': return 1;
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
  type Entry = Omit<Slide, 'step' | 'steps'>;
  const scenes: Entry[] = [
    { scene: { kind: 'title' }, label: event.name, name: '', part: 'Title', short: 'Title', notes: 'Open on the title. Choose Highlights for a short tour, or All announcements for the full walkthrough.' },
  ];
  scenes.push(mode === 'a'
    ? { scene: { kind: 'map' }, label: 'The map', name: '', part: 'The map', short: 'The map', notes: 'Six sections, every announcement. Press 1–6 to jump to a section.' }
    : { scene: { kind: 'highlights' }, label: 'Highlights', name: '', part: 'Highlights', short: 'Highlights', notes: 'The moments that matter most. Walk them in order.' });
  for (const chapter of chapters) {
    scenes.push({ scene: { kind: 'chapter', chapter }, label: chapter.title, name: '', part: 'Chapter overview', short: 'Chapter', notes: chapter.tagline, chapterId: chapter.id });
    for (const a of announcements.filter((x) => x.chapter === chapter.id && (mode === 'a' || x.highlight))) {
      const base = { chapterId: chapter.id, announcementId: a.id };
      scenes.push({ scene: { kind: 'intro', a }, label: `${a.name}: ${a.title}`, name: a.name, part: 'Overview', short: 'Overview', notes: a.notes, ...base });
      a.visuals.forEach((_, v) => scenes.push({ scene: { kind: 'visual', a, v }, label: `${a.name}: ${a.visuals[v].title}`, name: a.name, part: a.visuals[v].title, short: VISUAL_SHORT[a.visuals[v].kind], notes: a.notes, ...base }));
      scenes.push({ scene: { kind: 'why', a }, label: `${a.name}: why it matters`, name: a.name, part: 'Why it matters', short: 'Why it matters', notes: a.notes, ...base });
    }
  }
  scenes.push({ scene: { kind: 'recap' }, label: 'Recap', name: '', part: 'Takeaways', short: 'Takeaways', notes: 'One takeaway per chapter.' });

  return scenes.flatMap((s) => {
    const steps = stepsOf(s.scene);
    return Array.from({ length: steps }, (_, i) => ({ ...s, step: i + 1, steps }));
  });
}
