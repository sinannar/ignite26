# ignite26

A keyboard-driven website for presenting Microsoft Ignite 2026 announcements.
Static [Astro](https://astro.build) + React, deployed to GitHub Pages.

## Run locally

Requires Node.js 22.12+.

```sh
npm ci
npm run dev      # dev server
npm run check    # type-check
npm run build    # static build into dist/
npm run preview  # serve the build
```

## Add content

All content lives in `src/data/announcements.ts` (types in `src/data/types.ts`):

1. Define **sections** (id, title, summary, accent colour).
2. Add **announcements** with `section` set to a section id, plus the problem,
   what was announced, why it matters, status, source links and presenter notes.

Slides are generated in order: title → each section divider → its announcements.

## Controls

`→`/`Space` next · `←` previous · `G` map · `N` notes · `F` fullscreen · `?` help.
Slides deep-link as `#/<n>`.

## Deploy

Set the repository's Pages source to **GitHub Actions**. Pushes to `main` build
and publish via `.github/workflows/deploy.yml`; pull requests only build.
