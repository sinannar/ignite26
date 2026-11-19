# ignite26

A keyboard-driven website for presenting Microsoft Ignite 2026 announcements.
Static [Astro](https://astro.build) + React, deployed to GitHub Pages.

## Run locally

Requires Node.js 22.12+.

```sh
npm ci
npm run dev       # dev server
npm run validate  # deck content rules + coverage of news/
npm run check     # validate + type-check
npm run build     # validate + static build into dist/
```

## How content works

- `news/*.md` holds the source material (Book of News format: `# Chapter`, `## Announcement`, links).
- `src/deck/content.ts` holds the authored presentation: short headlines, problem / announced / why,
  availability chips, step-by-step visuals (`flow`, `grid`, `stats`, `converge`) and presenter notes.
- `npm run validate` checks length targets, links, and that every `news/` heading has a slide.

To update after the source changes, follow `.agents/skills/update-presentation/SKILL.md`
(works with any coding agent) or edit `content.ts` by hand.

## Presenting

Pick **Highlights** (the short tour) or **All announcements** on the title slide.
`→`/`Space` next · `←` back · `1`–`6` jump to a chapter · `T` Highlights/All ·
`M` map (search, jump to any scene) · `O` Explore (browse everything, with links) · `P` presenter window (notes, next up, timer) ·
`N` notes on screen · `F` fullscreen · `B` black screen · `R` reset scene · `H` hide controls · `?` help. Slides deep-link as `#/a/<n>` or `#/h/<n>`.

## Deploy

Set the repository's Pages source to **GitHub Actions**. Pushes to `main` build
and publish via `.github/workflows/deploy.yml`; pull requests only build.

## Speaker notes

Open `/speaker/` (for example `https://<user>.github.io/<repo>/speaker/`) on a phone or tablet. It is generated from `src/deck/content.ts`, is not linked from the deck and is marked `noindex`. That makes it unlisted, not private, so keep nothing sensitive in the notes. It follows the stage live only when open in the same browser as the deck; on another device, use the section chips, search and "Mark covered".
