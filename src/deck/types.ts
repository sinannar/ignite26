export type Status = 'GA' | 'Preview' | 'Private preview';

/** A single capability, shown with an optional availability chip. */
export interface Item {
  name: string;
  status?: Status;
  /** One short clause. Keep it under ~90 characters. */
  note?: string;
}

export interface Chapter {
  id: string;
  title: string;
  /** One sentence: the story of this chapter. */
  tagline: string;
  /** Revealed one at a time on the chapter scene. */
  points: Item[];
  /** One line on the closing recap. */
  takeaway: string;
  accent: string;
}

/** Visuals are declarative; each one reveals step by step. */
export type Visual =
  | { kind: 'flow'; title: string; steps: { label: string; detail?: string }[] }
  | { kind: 'grid'; title: string; groups: { title: string; items: Item[] }[] }
  | { kind: 'stats'; title: string; items: { value: string; label: string }[]; footnote?: string }
  | { kind: 'converge'; title: string; from: string[]; to: Item };

export interface Announcement {
  id: string;
  chapter: string;
  /** Exact `##` heading in news/*.md this slide set is based on. */
  source: string;
  /** Product or feature name (small, above the headline). */
  name: string;
  /** The headline claim. Short and specific. */
  title: string;
  problem: string;
  announced: string;
  why: string;
  /** Availability chips shown with the announcement. */
  statuses: Status[];
  /** Included in the Highlights tour. */
  highlight?: boolean;
  /** One or more visual scenes. */
  visuals: Visual[];
  /** Short list shown beside "why it matters". Omit when the visual already lists everything. */
  whatsNew?: Item[];
  links: { label: string; url: string }[];
  /** Presenter notes: talking points drawn from the source, plus anything to verify. */
  notes: string;
}
