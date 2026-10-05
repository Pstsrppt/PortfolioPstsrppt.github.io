# CLAUDE.md

Personal portfolio for Pongsathorn Siriprompitak, used for real job and co-op
applications. Four static pages, no build step, deployed from `main` to
GitHub Pages at
`https://pstsrppt.github.io/PortfolioPstsrppt.github.io/`.

`README.md` (Thai) describes the file layout. This file is the working
agreement: read it before changing anything.

## Hard constraints

- **No build step, no package manager, no framework.** Plain HTML/CSS/JS.
  Three.js r128 comes from a CDN `<script>` tag. Keep it that way.
- **`data.js` is the single source of truth** for personal details (name,
  email, GPA, major, links). Pages read it through `[data-bind]`, `[data-link]`
  and `[data-if]`, handled generically in `site.js`. Never hardcode personal
  data into a page — change `data.js` instead.
- `style.css` styles the three content pages. `index.html` is self-contained:
  its own `<style>` block and the whole 3D world script live inside it.
- Most visitors open this on a phone. Treat mobile as the primary target and
  verify at 360 / 390 / 414 px, not just desktop.

## Content rules

- **Never invent anything about the owner.** No skills, tools, job titles,
  metrics or responsibilities he has not confirmed. If a claim cannot be
  verified, leave it out — this is a real resume, and an overstatement he
  cannot defend in an interview is worse than an omission.
- Prefer concrete, checkable wording over generic filler. Avoid the
  "not just X, but Y" construction and similar AI-flavoured padding; several
  rounds of cleanup have already removed it.
- Thai is the primary language. `resume.html` has an EN toggle driven by
  `data-en` attributes — add one to any new text there.

## Gotchas that have already cost real debugging time

Do not undo these; each fixed a bug that only showed up on the owner's iPhone.

1. **Thai text does not break at spaces.** `body` sets
   `overflow-wrap:break-word`. Any CSS grid track that holds text must be
   `minmax(0,1fr)`, never bare `1fr`, or one long Thai run stretches the whole
   page and creates horizontal scroll.
2. **Canvas text in the 3D world must not rely on `ctx.textAlign`.** Safari
   silently ignored `textAlign='center'`, so every sign drew left-aligned from
   the centre point and ran off its board. `drawBoard()` now sets
   `textAlign='left'` and positions each line manually at
   `-measureText(line).width / 2`. Keep it that way.
3. **Canvas text needs the web fonts loaded first.** Boot races
   `document.fonts.load(...)` against an 8s timeout, then re-renders every sign
   via `fontsReady.then(...)` using the `textBoards` registry. New text signs
   must be created with `board()` and updated with `setBoard()` so they are in
   that registry; calling `drawBoard()` directly bypasses the redraw.
4. **`#world` needs an explicit `z-index:0`.** Without it Safari composited the
   WebGL canvas above the HUD and the moon covered the name.
5. **Camera framing is aspect-ratio driven.** `distMul()` pulls the camera back
   on narrow screens (capped at 5). `syncViewport()` must redirect an in-flight
   tween (`tw.p1` / `tw.l1`), and the render loop re-checks the viewport every
   frame, because Safari's URL bar collapsing mid-flight otherwise froze the
   camera at the wrong distance.
6. **`TOUCH`** = `(hover:none) and (pointer:coarse)`. On touch devices the world
   shows tap wording instead of key names, and the "Save as PDF" button serves
   `resume.pdf` instead of calling `print()`. Keep both paths working.
7. **The resume must stay one A4 page.** `@media print` must stay
   self-contained — print width lands near the 700px breakpoint, so do not rely
   on the screen layout being correct at print time.

## Art direction

The 3D world is deliberately low-poly and flat-shaded. Do not introduce smooth
or photorealistic models, external `.glb` assets, or large textures: they look
pasted-in next to the faceted scenery and hurt load time on phones. Build
characters and props from primitives in code.

Project screenshots are displayed cover-fit and top-aligned, as a full-width
banner on the projects card (21:10) and in the 3D world's mock browser. Export
new ones at **2100 × 1000** and keep the important content in the top centre.

## Workflow

- When changing layout, actually render the result before claiming it works —
  headless Chrome screenshots at mobile widths catch what reasoning does not.
  Chromium cannot reproduce Safari-only bugs, so say so rather than implying
  mobile is verified.
- `resume.pdf` is a **static export**, not generated at runtime. Re-export it
  whenever `resume.html` changes, with headless Chrome:
  `chrome --headless=new --no-pdf-header-footer --print-to-pdf=resume.pdf <resume url>`
- Push to `main` to deploy. GitHub Pages usually publishes in 1–2 minutes but
  has occasionally taken much longer; the CDN also caches for 10 minutes, so a
  stale response does not mean the push failed. Never force-push.
- Commit messages explain **why** the change was needed, not just what moved.
