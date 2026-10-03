# Showreel Kit — playbook for Claude Code

This repo builds **one showcase website per day**. The team films the laptop screen with a phone held **vertically (9:16 Instagram reel)** while the site scrolls itself, and posts it to win clients. Two things matter most:

1. **Every site must look like a different designer made it.** New layout, nav, typography, cards and page flow every day. Only the engine underneath stays the same.
2. It must look **premium and real**: a cinematic moment (scroll video, product spin, colour switch) **plus** real-business sections (products, prices, offers, categories), so a client can picture their own brand.

Desktop (1440×900 and 1920×1080) is the priority; phones (375px) must not break.

## How the kit is organised

| Folder | What | Change per site? |
|---|---|---|
| `components/engine/` | Loader, SmoothScroll (Lenis ↔ GSAP), Animations (data attributes), RecordMode, Cursor, useFramePlayer | **No** |
| `lib/` | gsap setup, frame loading, loader tracker, site types | **No** |
| `components/patterns/` | Library of ready sections (stock + patterns from the reference reels). **Starting points, not templates.** See them live at `/patterns` | No: copy them, then restyle |
| `components/ui/` | SplitText, Magnetic, Button, TiltCard | Rarely |
| `site/` | **Everything about today's site**: `DESIGN.md`, `site.ts` (meta + theme), `fonts.ts`, `site.css`, `content.ts`, `components/`, `Page.tsx` | **Yes, rewritten every day** |
| `archive/` | Finished sites (`npm run archive -- <name>`, `npm run restore -- <name>`). **Local only, not in git** | — |
| `docs/` | `DESIGN-MENU.md` (the variety engine), `MOTION-MENU.md` (a motion code for every section), `SITES-LOG.md` (**local only, not in git**), AI prompts, filming guide | Update the log |

**The repo shows only the current project.** Each day lives in its own folder (a copy of the kit), so old sites stay safe there. In git there is only: today's site (`site/`, `public/images/<slug>/`, `public/frames/<slug>-*`), the engine, the pattern library and the kit docs. No other brand names or images. `.gitignore` keeps `archive/`, `raw/`, `docs/SITES-LOG.md`, `node_modules/`, `.next/`, `.env*` and `.DS_Store` out.

`app/page.tsx` renders the engine + `site/Page.tsx`. `app/layout.tsx` reads `site/site.ts` (colours → CSS variables) and imports `site/fonts.ts` + `site/site.css`.

**Engine features you get for free**
- Scroll videos are image sequences: `npm run frames -- raw/<video>.mp4 frames/<slug>-<name>` → `/frames/<slug>-<name>`. Use them with `FrameHero` / `FrameScrub` / `useFramePlayer`.
- Animations by data attribute (`components/engine/Animations.tsx`): `data-reveal`, `data-reveal="stagger"`, `data-split` (with `<SplitText>`), `data-parallax="0.15"`, `data-zoom`, `data-count="850"`.
- `data-cursor="View"` on anything shows a label on the custom cursor.
- Theme tokens as Tailwind colours: `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `text-accent`, `bg-accent`, `text-accent-fg`, `border-line`; classes `font-display`, `eyebrow`, `container-x`, `section-y`, `btn btn-solid|btn-outline`. Override or add styles in `site/site.css`.
- `?static=1` = no motion (layout review) · `?record=1` = auto-scroll for filming.
- Record timeline: put `data-record-time` / `data-record-hold` (+ `-align`, `-offset`, `-mobile`) on sections so `?record=1` gives every section fixed seconds, identical on laptop and phone; `&at=HH:MM:SS` starts two devices together. See `docs/RECORDING.md`.

## Building a new site — Round 0 + 5 rounds

Stop after **every** round, tell the user in plain simple language what to check, and wait for their "ok".

### Round 0 — Design direction (no code yet)
1. **Clear the previous site's assets**: delete the old site's images and frames (`public/images/<old-slug>/`, `public/frames/<old-slug>-*`) and any demo assets, so only the new site's assets exist. The old site stays safe in its own day folder (and in the local `archive/`).
2. **Read the brief** (brand, what it sells, audience, mood, assets in `raw/` and `public/images/`).
3. **Read `docs/SITES-LOG.md`** (what the last sites looked like), **`docs/DESIGN-MENU.md`** and **`docs/MOTION-MENU.md`**.
4. **Pick one option from each menu**: look, palette, type pair, nav, hero, section shape, card style, signature moment, loader. Follow the uniqueness rule (≥ 6 of 8 different from each of the last 3 sites; never the same type pair two days in a row; the hero and signature never repeat any earlier site's, see step 6).
5. **Plan 9–12 sections**: 1 hero + ~3 cinematic + ~5 shop-style + footer. For each: name, pattern it starts from (or "custom"), and *how it will be restyled*.
6. **Plan the motion**: give every section (loader, nav and footer included) **one motion code** from `docs/MOTION-MENU.md`. **No code used twice** on the site, and **"just fade in" is not allowed** as a section's motion. **The hero and signature must not repeat ANY earlier site's hero or signature**: check every row of `docs/SITES-LOG.md` (Hero, Signature and Motion columns), not just yesterday's. **The hero must not be a "shape grows to full screen / portal" opening** (a window, arch, plate, card or doorway that expands to fill the screen). Also note the transitions between sections (X codes) and the planned details (hover, cursor).
7. **Write `site/DESIGN.md`** with: the choices + a one-line reason each, the section plan, the **Motion map** table (section → code → how it plays here → phone → record mode; template at the end of MOTION-MENU.md), and the assets still needed (with prompts from `docs/AI-VIDEO-PROMPTS.md`). Reasons describe *this* site, never old ones.
   - Put the "different from the last sites" comparison table in **`docs/SITES-LOG.md` only** (under "Uniqueness checks"), not in `DESIGN.md`, so old project names never appear in the repo. `DESIGN.md` just says "8 of 8 different, see the sites log".
8. **Ask the user**: approve the direction and the Motion map, and generate any missing assets.

### Round 1 — Structure (build it)
1. **Save the old site first**: `npm run archive -- <day-NN-slug>` (if not already saved), then clear `site/` except `DESIGN.md`.
2. **Assets**: put images in `public/images/<slug>/`. For every video: `npm run frames -- raw/<video>.mp4 frames/<slug>-<name> --zoom 1.2 --max 160` (< 15 MB each). Cut-out product images (transparent PNG/WebP) for pop cards / colour switcher.
3. **Fonts**: `npm i` the chosen pair, import them in `site/fonts.ts`.
4. **Write** `site/site.ts` (meta, theme, record), `site/site.css` (brand-specific styles: buttons, eyebrow, special effects), `site/content.ts` (all text/data), `site/components/*` and `site/Page.tsx`.
   - Copy each pattern you use into `site/components/` under a brand-specific name and **restyle it** (see the end of DESIGN-MENU.md). Import **at most 3 patterns unchanged** from `components/patterns/`.
   - Build the nav and footer for this site too (copy `Nav`, `NavPill`, `Footer` or `WordmarkFooter` and restyle, or make new ones).
   - Never edit `components/engine/` or `components/patterns/` for one site's needs; copy instead.
   - Build the markup the Motion map needs (masks, strips, split text, SVG paths) so motion can be added later without changing the layout. Everything shows in its final state with `?static=1`.
5. **Copy**: short, premium headlines (2–6 words per line). Real-sounding product names; sample prices in the brand's currency (₹ for Indian brands).
6. `npm run check` and `npm run build` must pass.
7. **Ask the user to review with motion off**: `http://localhost:3000/?static=1` on the laptop and at phone size. They check: every section shows, text is readable, nothing is cut or overlapping, it looks like the DESIGN.md direction and **not like the previous site**.

### Round 2 — Big motion (loader, hero, signature, pinned sections)
1. **Loader**: shows the brand, then reveals the site with its Motion map code.
2. **Hero**: build its motion; tune the scroll length / switch timing; captions must have time to be read.
3. **Signature moment**: make it great.
4. **Every pinned or scroll-scrubbed section** in the Motion map (M10, M11, M25, M27–M30 …): build it and tune its scroll length.
5. **Auto-motion for filming**: nobody touches the mouse on camera, so anything that needs hover/click must also play by itself while on screen (like `ExpandingPanels`, `ProductShowcase`, `VariantHero`).
6. **Motion map check** (see below) for the sections done this round.
7. **Ask the user to screen-record a slow scroll** and send it. Fix anything jumpy, too fast, empty-looking or overlapping.

### Round 3 — Section motion + transitions
1. **Every other section** gets its own Motion map code (reveals, text, numbers, groups, lines, ambient). Plain `data-reveal` may support, never replace, the code.
2. **Transitions between sections** (X codes in MOTION-MENU.md): how each section hands over to the next, so the page flows as one film.
3. Supporting motion stays calmer than the signature; one main thing moves at a time.
4. **Motion map check** for the whole page.
5. **Ask the user to screen-record the full page** and send it.

### Round 4 — Details + phone pass
1. **Details**: hover states, cursor labels (`data-cursor`), magnetic buttons, link/button micro-interactions, count bumps. Each one that matters on camera also plays once by itself.
2. **Phone-only pass (375px)**: every section uses its phone fallback from the Motion map; menu opens/closes; no sideways page scroll; nothing cut off; pinned sections have sensible lengths; text ≥ 12px.
3. **Motion map check** at laptop and phone size.
4. **Ask the user to check on a real phone** (or send a phone-size recording).

### Round 5 — Polish, performance, archive (ready to film)
1. Readability (small text ≥ 12px, contrast), headings not breaking badly at 1440px.
2. **Performance**: frames < 15 MB per video, images WebP and sized, no layout jumps, particles/canvas pause off screen, smooth scrolling at 1440 and 1920.
3. `?static=1` still shows every section in its final state.
4. No console errors; `npm run build` passes.
5. Set `meta.record.duration` so the **whole page scrolls in 25–40 s** (reel length). Test: `npm run build && npm start` → `http://localhost:3000/?record=1`.
6. **Add a row to `docs/SITES-LOG.md`** (including the Motion column: loader · hero · signature codes) and run `npm run archive -- <day-NN-slug>`.
7. **Repo check**: run `git ls-files` and confirm the repo only contains the current site's assets, the engine, the pattern library and the kit docs: no other brand names (`git grep -il <old names>`) and no other site's images. Report the file list (grouped by folder) and the total size (`git ls-files -z | xargs -0 du -ch | tail -1`).
8. Report back in plain simple language: the section list, anything skipped, and the filming command (see `docs/RECORDING.md`).

### Motion map check (end of Rounds 2, 3 and 4)
Go through the Motion map in `site/DESIGN.md` section by section and open the page (normal scroll and `?record=1`; phone size in Round 4). For each section confirm: its main move **is** the planned code (not a plain fade), it plays without hover/click, and `?static=1` shows its final state. Fix every section that doesn't match (or, if a better motion was chosen, update the map, still with no code used twice). Report the result as a short table: section · code · ✅ / fixed.

## House style

- Big headings, generous spacing, few words. Never cram.
- One accent colour per site (a section may flip to a colour band on purpose).
- All images in one site share one mood and colour grade.
- Motion is smooth and confident, never bouncy or messy.
- **Prices**: sample prices are fine (it's a concept). Always keep a footer note like "Concept website by <studio>".
- No fake phone numbers, addresses of real people, or legal text.
- Real brand names are OK for concept sites, but never use the brand's real logo file or copy their real website; the design is ours.

## Adding to the pattern library

If you build something on a site that would be useful again (a new nav, hero, card or section), **also** add a clean, generic version to `components/patterns/`, show it on `app/patterns/page.tsx`, and add it to `docs/DESIGN-MENU.md`.

- Pattern demos on `/patterns` use **plain colour placeholders** (the SVG `photo()` / `cutout()` helpers in `app/patterns/page.tsx`) or the current site's images, **never an old site's**. Placeholders are preferred: they never break when a day's images are removed.
- Pattern code and comments stay generic: no brand names (write "first built for a running-shoe site", not the brand).

## Commands

- `npm run dev` / `npm run build && npm start` (use production for filming)
- `npm run frames -- <video> <folder> [--zoom 1.2] [--max 160] [--start s] [--end s] [--reverse]`
- `npm run check`: all images/frames used in `site/` exist
- `npm run archive -- <name>` / `npm run restore -- <name>`
- `/patterns`: pattern catalogue · `?static=1`: no motion · `?record=1`: auto-scroll (`&duration=30` or `&speed=200`)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
