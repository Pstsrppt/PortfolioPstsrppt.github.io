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

The world is low-poly and flat-shaded. Scenery, props and signs stay built from
primitives in code — do not replace those with imported assets.

Project screenshots are displayed cover-fit and top-aligned, as a full-width
banner on the projects card (21:10) and in the 3D world's mock browser. Export
new ones at **2100 × 1000** and keep the important content in the top centre.

## Replacing the character with a .glb model

The owner may supply a `.glb` avatar to replace the code-built character. That
is allowed, and only for the character. Everything around it stays faceted, so
a stylised model fits the scene far better than a photoreal one.

**Loading.** `three.min.js` r128 does not include a glTF loader, and cdnjs does
not host r128's `examples/` files — that URL returns 404. Use the non-module
build, which sets `THREE.GLTFLoader` globally and matches this project's plain
`<script>` setup:

    https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js

Do not convert the page to ES modules to get the `jsm` version.

**`buildChar()` must keep producing the same shape**, because `updateHero()`,
`moveChar()`, `turnTo()` and the badminton mini-game drive these fields
directly:

    hero = { c, legL, legR, armL, armR, landed:false }

- `c` — a `THREE.Group` added to `scene`. Origin at the **feet** (y = 0 is the
  ground), facing **+Z**, about **2.0 units tall**; scale the loaded model to
  match. The loop writes `c.position`, `c.rotation.y`, `c.scale` and
  `c.visible`, so the model must survive non-uniform scaling — the landing
  squash sets x/z to 1.18 while y goes to 0.78.
- `legL`, `legR`, `armL`, `armR` — pivot groups animated through
  **`rotation.x`**: legs ±0.7 rad, `armL` ±0.6, `armR` from 2.6 down to −0.8
  for the badminton swing and 2.1 for the ready pose, plus `rotation.z` 0.2
  while playing. Each pivot must sit at the hip or shoulder with the limb
  hanging down its local −Y, otherwise limbs rotate around the wrong point.
  For a skinned model, parent empty groups to the matching bones and expose
  them under these four names.
- The racket is parented to `armR` at `y = -0.56`, i.e. 0.56 units down the
  arm. Keep that distance correct or it floats away from the hand.

**Budget and safety.** The page already ships ~600 KB of Three.js and is mostly
opened on phones over mobile data, after a lot of work to keep it fast. Keep
the `.glb` under roughly 1.5 MB with textures no larger than 1024 px. Load it
asynchronously and never let it block the intro: if the file is slow or fails,
the world must still start, so keep a primitive-built fallback rather than
leaving `hero` null.

Afterwards check walking, turning, the landing drop and the badminton swing —
those are what a model swap breaks silently.

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
