---
name: update-presentation
description: Update the Ignite 2026 presentation from Book-of-News-style markdown in news/. Use when asked to add, change, remove or reorder announcements or chapters, import new or edited markdown, or refresh the slides.
---

# Update the presentation from markdown

`news/*.md` is the **source of facts**. The slides are **authored** in
`src/deck/content.ts`: short, presentable, one idea per scene. Do not paste
markdown paragraphs into slides. Read the source, then write the deck content.

## The source file: `news/book of news.md`

The path contains spaces: always quote it (`"news/book of news.md"`). Structure:

| Source | Meaning | Becomes |
|---|---|---|
| `# Azure`, `# Foundry`, `# GitHub` | Chapter (3 today). **No** learn-more link. | `chapters[]` entry; `title` must equal the heading |
| Paragraphs under a `#` | Chapter intro | `tagline` (one sentence), `points[]` (named items the intro lists, with GA/Preview), `takeaway` |
| `## Title` | Sub-chapter = one announcement. **Always** has a learn-more link. | `announcements[]` entry; `source` must equal the heading text exactly |
| First paragraph of a `##` | The headline claim | `announced`, `title` |
| Following paragraphs | Detail and rationale | `problem`, `why`, `whatsNew`, visuals (never copied verbatim) |
| `Heading` line + bullets, or `### Heading` + bullets | Groups of updates | `grid` visual groups |
| `- Label: text` / `- Label. text` bullets | Individual capabilities | `Item`s: `name` = label, `note` = a short clause, `status` from "now generally available" / "in preview" |
| `- [Learn more…](url)` | Source link(s) | `links[]` (the source has one or two per `##`; drop empty/duplicate) |

Other `*.md` files under `news/` are also read (ignore files starting with `_`), using the same structure.

### Known quirks in the current file (re-check each time; fix in the deck, report to the user)

- Some links are malformed (`hhttps://…`) or empty; the validator warns. Use the corrected URL in `content.ts` and ask the user to fix the source.
- Counts can disagree with lists (Cosmos DB says "seven updates", lists six). Don't put the number on a slide; add a note.
- Availability is sometimes per-product (MAI-Code-2-Flash: GA in GitHub, private preview in Foundry) or ambiguous. Put detail in `note`, or omit the chip, rather than guess.
- The same item can appear under several headings (Microsoft-Decision-1.1 has its own `##` and a bullet in the Foundry models `##`). Give it one full treatment and a short mention elsewhere.
- Chapter intros can mention products with no `##` of their own (the GitHub intro names the Copilot app and Copilot code review). Show them in the chapter's `points[]` only; don't invent announcement slides for them.
- Benchmarks and competitor comparisons: quote only what the source states, name the index, and note the source in `footnote`/`notes`.

## Workflow

1. Read all of `news/`. Run `npm run validate`: it lists `#`/`##` headings with no matching chapter or
   announcement, chapters with no source heading, and malformed or empty source links. Compare the source
   against `src/deck/content.ts` to find new, changed and removed items (text changes count, not just headings).
2. For each **chapter** (`#`, order = order in the source): keep `chapters[]` current: `tagline` (one sentence),
   `points[]` (what the intro lists, with GA/Preview chips), `takeaway` (one line),
   `accent`. Chapter intros have no "learn more" link.
3. For each **announcement** (`##`): write one `Announcement` entry (see
   `src/deck/types.ts`):
   - `name` (product), `title` (headline claim, ≤ 60 chars),
   - `problem` (≤ 110), `announced` (≤ 120), `why` (≤ 130): one sentence each,
   - `statuses` and per-item `status`: `GA`, `Preview` or `Private preview`, only
     as the source states,
   - `visuals`: pick the right shape (below), `whatsNew` (≤ 5 short items) when the
     visual doesn't already list everything,
   - `links` from the source's learn-more links (fix obvious typos, drop empty ones),
   - `notes`: presenter talking points, plus anything to verify (count mismatches,
     ambiguous availability, broken links),
   - `highlight: true` for the few announcements that belong in the 5-minute tour.
4. Run `npm run validate`, then `npm run check && npm run build`. Fix errors; read warnings
   (length targets, uncovered headings).
5. Preview with `npm run dev` and look at the new slides (`#/a/<n>` deep links;
   `P` opens the presenter window). Check nothing overflows a 1920×1080 stage.
6. Tell the user what changed and list every fact you were unsure about.

## Choosing a visual

| Kind | Use when | Constraints |
|---|---|---|
| `flow` | A process or lifecycle | 3–5 steps; label ≤ 3 words, detail ≤ 100 chars |
| `grid` | A set of updates that group naturally (Build / Run / Protect) | ≤ 6 groups, ≤ 3 items each; 4 groups lay out 2×2 |
| `stats` | Numbers the source actually states | 2–3 items; add the benchmark name in `footnote` |
| `converge` | Several capabilities combine into one | 2–5 inputs → one output |

An announcement may have several visuals; each becomes its own scene and each reveals step by step.

## Rules

- Never invent announcements, availability, dates, numbers or comparisons. Everything on a slide
  must be traceable to the source text. If the source is ambiguous, leave the chip off and note it.
- Keep wording short and plain; no marketing filler. A slide should be readable from the back of a room.
- Use `Preview` vs `GA` exactly as the source says ("now generally available" / "in preview").
- Do not hand-edit `dist/` or `.astro/`. Do not change the UI code for a content change.
- To reorder, move entries in `content.ts`; to drop an item, delete its entry (and keep the source in `news/`).
