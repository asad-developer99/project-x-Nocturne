# Motion menu — every section moves in its own way

`DESIGN-MENU.md` makes every site *look* different. This menu makes every section *move* differently. In Round 0, give **every section one motion code** from this list in the **Motion map** of `site/DESIGN.md`.

**Rules**
- **One code per section, no code used twice on the same site.** Small supporting touches inside a section (a caption fading, a price counting) are fine; the code is the section's *main* move, the one a viewer would describe.
- **"Just fade in" is not a motion.** A plain fade/slide-up (`data-reveal`) may support a section but never be its code.
- The nav, loader and footer count as sections and get a code too.
- **The hero and signature must not repeat any earlier site's hero or signature**: check every row of `docs/SITES-LOG.md` (Hero, Signature and Motion columns), not just yesterday's.
- **No portal heroes:** the hero must not be a "shape grows to full screen" opening (a window, arch, plate, card or doorway expanding to fill the screen). M28 and M5 are for mid-page moments and loaders, not the hero.
- Every motion must work in the three engine modes:
  - `?static=1` / reduced motion → show the **final state** (nothing hidden, nothing mid-way).
  - `?record=1` → it must play **without hover or clicks**: either driven by scroll (`scrub`) or auto-playing while on screen.
  - Phone (375px) → use the **phone fallback** column; never pin sideways content on phones unless the column says so.
- Motion feel comes from `DESIGN.md` (slow and warm, bright and snappy …): pick eases and durations to match. No bounce unless the look is candy/playful.

**GSAP basics used below:** `gsap` + `ScrollTrigger` from `@/lib/gsap`; wrap each component's code in `gsap.context()` inside `useEffect` and start it with `onSiteReady()` from `@/lib/loading` (like `components/engine/Animations.tsx`). "Scrub" = `scrollTrigger: { scrub: true }` (tied to the scrollbar). "Once" = `scrollTrigger: { start: "top 80%", once: true }` (plays when it enters). Use `gsap.matchMedia()` for the phone fallback.

---

## A. Reveals (how a block or image arrives)

| Code | Name | Looks like | Use when | GSAP notes | Phone fallback |
|---|---|---|---|---|---|
| M1 | **Curtain reveal in mask** | A solid panel (accent or bg colour) slides off the image/heading, uncovering it, like a curtain pulled aside | Big editorial photos, section openers | Wrapper `overflow:hidden`; a child `::before`-like div animates `xPercent: 0 → 101` (or `yPercent`) while the image does `scale 1.15 → 1`. Once, `power4.inOut`, 1.2 s | Same, vertical direction only |
| M5 | **Circle / mask wipe** | The section appears through a growing circle (or arch, or diamond) from one point | Colour-band sections, a big "reveal" moment, loader exits | Animate `clip-path: circle(0% at 50% 50%) → circle(75% …)`; scrub over ~80vh or once 1.2 s. Any shape works: `inset()`, `polygon()`, an arch via `ellipse()` | Once, not scrubbed; start from the centre |
| M13 | **Image scale-down inside mask** | The photo starts zoomed in and settles to size inside a fixed frame while the frame opens slightly | Product and food close-ups, arch/rounded frames | Frame: `clip-path: inset(12% round 24px) → inset(0% round 24px)`; image: `scale 1.35 → 1`. Scrub from "top bottom" to "center center" | Scale only (1.2 → 1), no clip |
| M16 | **Blinds / slice reveal** | The image appears in 5–8 vertical (or horizontal) strips, one after another, like window blinds opening | Fashion, architecture, a bold "new collection" block | Render the image N times inside strips with `background-position` offsets (or use N masks); stagger `scaleY 0 → 1` from `transformOrigin: top`, stagger 0.06, once | 3 strips instead of 8 |
| M17 | **Pixel / grid dissolve** | A grid of small squares flips away in a wave, revealing the photo underneath | Tech, gaming, electronics | Absolutely positioned grid of ~12×8 cells over the image; `opacity`/`scale → 0` with `stagger: { grid: "auto", from: "start", amount: 0.8 }`, once | 6×4 cells |
| M18 | **Clip-path corner grow** | The block grows out from one corner like a sheet being unfolded | Cards that should feel "delivered", offer tiles | `clip-path: polygon()` from a tiny triangle at a corner to the full rectangle, `power3.out`, once, stagger 0.12 across tiles | Same, less stagger |
| M19 | **Focus pull (blur to sharp)** | Image starts soft and slightly dark, sharpens like a lens focusing. Hero version: a fogged window wiped clear in a curved sweep (a mask moving over a pre-blurred copy) | Moody photography, luxury, cafés, perfume, steamy/rainy windows | `filter: blur(14px) brightness(.7) → blur(0) brightness(1)` + tiny `scale 1.05 → 1`; scrub over 60vh. Keep blur ≤ 16px (performance) | Once, 0.8 s, blur 8px |

## B. Text (how headings and copy appear)

| Code | Name | Looks like | Use when | GSAP notes | Phone fallback |
|---|---|---|---|---|---|
| M6 | **Text rise from blur** | Words float up from below while going from blurred to sharp | Soft, premium headlines (beauty, café, hotel) | `<SplitText>` words: `y: 40, filter: blur(10px), opacity: 0 → 0, blur(0), 1`, stagger 0.06, `power2.out`, once | Whole line at once, no stagger |
| M12 | **Split text stagger (letters)** | Each letter pops up out of a mask one after another | Short, loud headings (sport, streetwear, big numbers) | Split into letters, each inside `overflow:hidden`; `yPercent: 110 → 0`, stagger 0.025, `power4.out`. Keep to ≤ 20 letters | Words instead of letters |
| M20 | **Scroll-lit statement** | A long sentence sits on screen in muted colour; words turn bright one by one as you scroll | Manifesto / "about us" statement | Words start at `opacity .2` (or muted colour); a scrubbed timeline brightens them in order across ~120vh; optional pin | Scrub still works; smaller type, no pin |
| M21 | **Typewriter / caret** | Text types itself letter by letter with a blinking caret | Search bars, tech, "today's special", chat-style reviews | Tween a counter and `slice()` the string on update (`gsap.to(obj,{n: text.length, ease: "none"})`), caret = CSS blink. Once | Same (short strings only) |
| M22 | **Scramble / decode** | Letters shuffle through random characters before landing on the real word | Tech, gaming, codes, prices that "compute" | Custom tween: on update, replace unrevealed letters with random chars from a set; reveal left to right. Once, 0.9 s | Same |
| M23 | **Line-by-line mask slide** | Each line of a paragraph slides up from its own hidden line box | Editorial body copy, pull quotes, recipes | Split by lines (wrap lines in spans at build time or measure), each in `overflow:hidden`; `yPercent: 100 → 0`, stagger 0.12. Once | Same, stagger 0.08 |
| M24 | **Outline to fill** | A huge outlined word fills with colour from bottom to top (or left to right) | Wordmarks, footers, big category names | Two stacked copies: outline (`-webkit-text-stroke`) + filled copy with `clip-path: inset(100% 0 0 0) → inset(0)`. Scrub | Same |
| M25 | **Kinetic scale word** | One big word grows from small to screen-filling (or shrinks into place) while the page scrolls | Transitions into a new chapter, "Sale", brand word | Pin ~100vh; `scale 0.2 → 1` (or `1 → 12` flying through the word into the next section). Scrub, `ease: none` | No pin, once, scale 0.6 → 1 |

## C. Numbers & data

| Code | Name | Looks like | Use when | GSAP notes | Phone fallback |
|---|---|---|---|---|---|
| M3 | **Number counter roll** | Digits roll vertically like an odometer/slot machine to the final number | Stats, prices, "since 1998" | Each digit is a column 0–9 in a mask; tween `yPercent` to `-digit*10`, stagger right-to-left. Once, 1.6 s. (Simpler: `data-count` counts, but the roll is the motion) | Same |
| M26 | **Progress fill** | Bars, rings or a liquid level fill to their value as you scroll | Specs, roast levels, ratings, brew timers | `scaleX`/`scaleY 0 → value` from origin, or SVG `stroke-dashoffset` for rings. Scrub (or once) | Once |

## D. Scroll-driven & pinned (the big moments)

| Code | Name | Looks like | Use when | GSAP notes | Phone fallback |
|---|---|---|---|---|---|
| M7 | **Multi-speed parallax** | 3–5 layers (photo, cut-out, text, shapes) move at different speeds, giving depth | Heroes, collages, "stay a while" scenes | `data-parallax` per layer with different values (0.05 → 0.35) or one scrubbed timeline moving layers by different `yPercent` | 2 layers, half the amounts |
| M10 | **Pinned background colour shift** | The section pins; the whole background (and text colour) changes step by step as content changes | Chapters, colourways, room lights, flavours | Pin; scrubbed timeline tweens CSS variables (`--bg`, `--fg`) on the section or `:root`. Keep text contrast at every step | Same colours, no pin: each block sets its colour on enter (`onEnter`) |
| M11 | **Horizontal pinned scroll** | The section pins and its content slides sideways as you scroll down | Product shelves, timelines, galleries | Pin; `x: -(track.scrollWidth - innerWidth)`, `scrub: 1`, `end: "+=" + distance`. Use `invalidateOnRefresh: true` | Native sideways swipe (`overflow-x: auto`, snap), no pin |
| M27 | **Frame-sequence scrub** | A video plays forwards/backwards with the scrollbar | Hero fly-throughs, product spins, pours, explodes | `FrameHero` / `FrameScrub` / `useFramePlayer` from the engine; pin for 200–400vh | Same frames, shorter pin (150vh) |
| M28 | **Grow to full screen** | A small framed image/video (window, arch, card) expands until it fills the screen | Mid-page "step inside" moments. **Never as the hero** (kit rule: no portal heroes) | Pin; tween the frame's `clip-path: inset()` / `border-radius` / width to full viewport, scrub. Content inside stays fixed (no stretch) | Starts wider (80vw), same growth |
| M29 | **Stacking cards** | Cards pin one after another; each new card slides over the last, which shrinks and darkens | Services, features, steps, menus | Each card `position: sticky` (or pin) with increasing `top`; scrub previous card `scale 1 → .92, filter: brightness(.7)` | Sticky still works; smaller offset |
| M30 | **Dial / rotate on scroll** | A dial, badge, plate or product rotates as you scroll, pointing at changing labels | Roast levels, sizes, watch bezels, "choose your…" | Scrub `rotation` on an SVG group; labels switch at set progress points (`onUpdate` with thresholds) | Same, smaller dial |
| M31 | **3D tilt-in from depth** | The block starts tilted back in 3D and swings upright as it enters | Big screenshots, product boards, menu cards | Parent `perspective: 1200px`; `rotationX: 35, y: 120, opacity: 0 → 0, 0, 1`, scrub from "top bottom" to "top 40%" | Flat rise, `rotationX: 12` |

## E. Groups & layout

| Code | Name | Looks like | Use when | GSAP notes | Phone fallback |
|---|---|---|---|---|---|
| M2 | **3D page flip** | Cards or pages turn over like a book or menu page | Menus, catalogues, before/after, recipes | `transformStyle: preserve-3d` on the card; `rotationY: -180 → 0` with `transformOrigin: left center`, back face `backface-visibility: hidden`. Scrub per page or once in sequence | Flip on the X axis (top to bottom), one card at a time |
| M4 | **Stack fan-out** | A tight stack of cards spreads out into a fan or a row | Product ranges, flavours, bags, colourways | Start all cards at the same `x/rotation`; tween to final `x`, `rotation: ±8`, stagger from centre. Scrub over 60vh or once | Stack spreads into a 2×2 grid |
| M32 | **Masonry drift** | Columns of a grid move at different speeds, some up some down, as you scroll | Photo walls, reviews, Instagram grids | Scrub each column `yPercent` with alternating signs (−10 / +10) | Single column, no drift, M23-style reveal per item |
| M33 | **Orbit / carousel ring** | Items circle around a centre (a product, a word) in a slow ring | Ingredients around a product, categories around a logo | Items placed with `rotation` on a parent + counter-rotation on each item; auto `repeat: -1` loop while on screen, or scrub | Ring becomes a slow marquee |
| M34 | **Snap-in tiles (bento assemble)** | Tiles fly in from different sides and lock into a bento grid | Offers, features, "why us" | Each tile `from` a different `x/y/rotation`; once, stagger 0.08, `power3.out`; final state is the plain grid | All tiles rise from below |

## F. Lines, paths & continuous

| Code | Name | Looks like | Use when | GSAP notes | Phone fallback |
|---|---|---|---|---|---|
| M8 | **SVG line draw-on** | A line, map route, signature or icon draws itself as you scroll | Maps, process steps, logos, footers | `getTotalLength()`; set `strokeDasharray = strokeDashoffset = length`, scrub `strokeDashoffset → 0` | Same |
| M9 | **Print-out line by line** | A receipt, ticket or list feeds out downwards, one line at a time, like a printer | Reviews as receipts, orders, specs, menus | Container `clip-path: inset(0 0 100% 0) → inset(0)` stepped with `ease: "steps(N)"`, or lines stagger with tiny `y` + a paper `translateY` feed. Once | Same, fewer lines |
| M14 | **Marquee strip** | An endless strip of words or images slides sideways; scrolling speeds it up or reverses it | Offer tickers, flavour lists, brand values | Pattern `Marquee` / `Ticker`; add `ScrollTrigger` `onUpdate` velocity → `timeScale` for speed-up | Same, slower |
| M35 | **Path-follow object** | An object (a bean, a leaf, a car) travels along a curved path down the page | Linking sections, "the journey" stories | Needs `MotionPathPlugin` (register in the component, not `lib/`); scrub along an SVG path | Hide the object, draw the path only (M8) |

## G. Ambient (always-on life)

| Code | Name | Looks like | Use when | GSAP notes | Phone fallback |
|---|---|---|---|---|---|
| M15 | **Glow / ember particles** | Soft glowing dots drift upward and fade (embers, dust, bubbles, snow) | Warm, magical or night scenes; footers | `<canvas>` with ~40–80 particles and `requestAnimationFrame`, paused when off screen (`IntersectionObserver`) | 20 particles |
| M36 | **Steam / smoke wisps** | Thin curling wisps rise and dissolve above an object | Coffee, tea, food, incense | SVG paths with `feTurbulence` or CSS blurred strokes; loop `y` + `opacity` + `scaleX` with random delays | Same, 2 wisps |
| M37 | **Breathing light / glow pulse** | A soft light behind a product or word slowly brightens and dims | Luxury products, CTAs, "open now" signs | Radial-gradient layer; `opacity`/`scale` yoyo loop, 3–4 s, `sine.inOut` | Same |

## H. Section transitions (Round 3)

A transition is how one section hands over to the next. Pick one per boundary; these may repeat (they are not section codes), but vary them.

| Code | Name | Looks like | GSAP notes |
|---|---|---|---|
| X1 | **Overlap slide** | The next section slides up over the last, which stays pinned and dims | Pin outgoing (`pinSpacing: false`), next has higher `z-index`; scrub outgoing `brightness .6` |
| X2 | **Colour wash** | The page background tweens to the next section's colour before its content arrives | Scrub `--bg` between the two sections' colours |
| X3 | **Edge shape morph** | The dividing edge (wave, torn paper, arch) stretches or flattens as it passes | Scrub the edge SVG path (`attr: { d }`) or `scaleY` |
| X4 | **Zoom-through** | The last element of a section scales up and becomes the next section's background | Scrub `scale` of the element to cover the screen, cross-fade to the next background |
| X5 | **Hard cut on beat** | No tween: the next section is already in place, and its first element starts moving right at the edge | Just careful `start` positions; good after a long pinned moment |

## I. Details (Round 4)

Micro-interactions are not section codes; list the ones used under the Motion map. Ideas: magnetic buttons (`components/ui/Magnetic`), cursor label (`data-cursor`), image tilt (`TiltCard`), link underline draw, button fill wipe, price flip on hover, "added to bag" count bump, nav item sliding pill, hover image preview that follows the cursor. **Each one also needs a hands-free version** (plays by itself once while on screen) so it shows up when filming.

---

## Motion map (copy into `site/DESIGN.md`)

```
## Motion map

| # | Section | Motion | How it plays here | Phone | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | M5 circle wipe | cup rim grows into the page | same | fixed 2.5 s |
| 1 | Nav | M9 print-out | menu links feed out line by line when opened | same | not shown |
| 2 | Hero | M19 focus pull | fogged window wiped clear, then the video scrubs | lighter blur | scrub |
| … | | | | | |

Transitions: 2→3 X2 colour wash · 3→4 X3 torn edge stretches · …
Details: magnetic Menu button · copper underline draw on links · …
```

Checklist before approving: every section has a code · no code appears twice · no section is "fade in" · the hero and signature repeat no earlier site's (every row of the sites log) · the hero is not a shape growing to full screen.
