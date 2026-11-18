export interface Section {
  id: string;
  title: string;
  /** One-line framing shown on the section divider slide. */
  summary: string;
  /** CSS colour used as the section accent. */
  accent: string;
}

export interface Announcement {
  id: string;
  /** Must match a Section id. */
  section: string;
  title: string;
  /** One-line headline. */
  tagline: string;
  /** The problem this addresses. */
  problem: string;
  /** What Microsoft announced. */
  announced: string;
  /** Why it matters to the audience. */
  whyItMatters: string;
  /** Availability, e.g. "Preview", "GA", "Coming 2026". */
  status?: string;
  /** Source links (Book of News, blog, docs). */
  links?: { label: string; url: string }[];
  /** Presenter-only notes. */
  notes?: string;
}
