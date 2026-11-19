# Repository instructions

A static, keyboard-driven keynote for Microsoft Ignite 2026 announcements
(Astro + React + TypeScript, deployed to GitHub Pages). It is a presentation, not
a document: one idea per scene, step-by-step reveals, a fixed 1920×1080 stage.

## Layout

- `news/book of news.md` (quote the path: it has spaces) — **source of facts**. Structure: `# Chapter`
  (Azure, Foundry, GitHub; no link) → `## Sub-chapter` (one announcement each, with a learn-more link).
  Other `news/**/*.md` files follow the same structure.
- `src/deck/content.ts` — **authored deck content**: chapters, announcements, visuals, notes.
- `src/deck/types.ts` — content schema. `src/deck/timeline.ts` — turns content into slides and steps.
- `src/keynote/` — UI: `Keynote.tsx` (modes, dialogs), `Presenter.tsx` (presenter view at `?presenter=1`, opens in a new tab), `chrome.tsx` (bottom bar, menu, map), `scenes.tsx`, `visuals.tsx`, `Stage.tsx`, `useDeck.ts`.
- `src/pages/speaker.astro` + `src/speaker/` — unlisted, phone-friendly speaker notes at `/speaker/`, generated from `content.ts` (no separate content to maintain). Styled by `src/styles/speaker.css`; `noindex`, not linked from the deck.
- `src/styles/global.css` — all styling (stage coordinates are px on 1920×1080).
- `scripts/validate-deck.ts` — checks content limits, `news/` heading coverage (chapters and sub-chapters) and malformed/empty source links.
- `.agents/skills/` — agent-agnostic skills. Read the matching `SKILL.md` before the task.
- `.github/workflows/deploy.yml` — validate, check, build, publish to Pages from `main`.

## Skills

- `update-presentation` — add or change announcements/chapters from the markdown in `news/`
  (`.agents/skills/update-presentation/SKILL.md`). Use it for any content change.

## Commands

Node 22.12+.

```sh
npm ci
npm run dev        # dev server
npm run validate   # content rules + coverage of news/ headings
npm run check      # validate + astro check
npm run build      # validate + static build into dist/
```

## Conventions

- Content changes go through `news/` → `src/deck/content.ts`; never paste source paragraphs onto slides.
- Chapters (`#`) and announcements (`##`) in `content.ts` must match the source headings exactly
  (`title` / `source`); `npm run validate` enforces this.
- Source quirks (typo'd links, count mismatches, items repeated under two headings) are fixed or caveated in the
  deck and reported to the user, not silently "corrected" in `news/`.
- Do not invent announcement details, availability or figures. Everything must trace to `news/`.
- Keep internal URLs base-aware (`import.meta.env.BASE_URL`); the site deploys under a Pages sub-path.
- Use system fonts and bundled assets only; the site must work offline once loaded.
- Respect `prefers-reduced-motion`. Chips (`GA`/`Preview`) carry text, never colour alone.
- Run `npm run check` and `npm run build` before reporting work as done, and view changed slides
  in a browser (`#/a/<n>`). Report warnings and anything not verified.
- No secrets or private information in the repo; the site and its history are public.
