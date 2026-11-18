import type { Announcement, Section } from './types';

export const event = {
  name: 'Microsoft Ignite 2026',
  subtitle: 'Announcements walkthrough',
};

// TODO: replace the placeholder sections/announcements using the Book of News.
export const sections: Section[] = [
  { id: 'ai', title: 'AI & agents', summary: 'TODO: section summary', accent: '#4f9dff' },
  { id: 'security', title: 'Security', summary: 'TODO: section summary', accent: '#ff8a4f' },
  { id: 'platform', title: 'Azure & platform', summary: 'TODO: section summary', accent: '#5fd68a' },
];

export const announcements: Announcement[] = [
  {
    id: 'example-announcement',
    section: 'ai',
    title: 'Example announcement',
    tagline: 'Replace me with a real announcement.',
    problem: 'The problem this solves.',
    announced: 'What was announced.',
    whyItMatters: 'Why the audience should care.',
    status: 'Preview',
    links: [{ label: 'Book of News', url: 'https://news.microsoft.com/' }],
    notes: 'Presenter notes go here.',
  },
];
