# Design menu — make every site look different

The engine is the same every day. **The design is not.** Before building, pick **one option from each menu** below and write the choices into `site/DESIGN.md` (Round 0 in `CLAUDE.md`).

**Uniqueness rule:** compare with the last 3 rows in `docs/SITES-LOG.md`. The new site must differ in **at least 6 of the 8 choices** (look, palette, type pair, nav, hero, section shape, card style, signature moment). Never reuse the same type pair two days in a row. **The hero and the signature moment must not repeat any earlier site's** (check every row of `docs/SITES-LOG.md`), and **the hero must not be a "shape grows to full screen / portal" opening** (window, arch, plate, card or doorway expanding to fill the screen).

**Motion:** how each section *moves* is picked separately from `docs/MOTION-MENU.md` (one code per section, no repeats, no plain fades) and written as the Motion map in `site/DESIGN.md`.

---

## 1. Look (overall art direction)

| # | Look | Feels like | Good for |
|---|---|---|---|
| L1 | **Dark luxury** | black, gold, serif caps, slow | cars, watches, jewellery, hotels |
| L2 | **Warm editorial** | cream paper, big serif, photos with white space | restaurants, cafés, fashion, interiors |
| L3 | **Candy playful** | saturated flat colour blocks, rounded, bouncy type | ice cream, drinks, snacks, kids |
| L4 | **Neon sport / tech** | near-black, one neon colour, wide/techno type | bikes, gyms, gaming, gadgets, EVs |
| L5 | **Clean white minimal** | white/grey, product floats, lots of air | electronics, skincare, streetwear |
| L6 | **Indian festive heritage** | maroon/red + gold, arches, script accents | sarees, jewellery, weddings, sweets |
| L7 | **Street / brutalist** | huge condensed caps, hard edges, stickers | sneakers, streetwear, music |
| L8 | **Soft pastel beauty** | blush, lilac, soft shadows, rounded | skincare, perfume, salons |
| L9 | **Organic nature** | deep greens, sand, texture, calm | tea, travel, wellness, farms |
| L10 | **Bold colour-block retail** | one loud brand colour filling whole sections | fashion stores (Emango red), sale campaigns |

## 2. Palettes (copy into `site/site.ts` → theme)

| Name | bg | surface | text | muted | accent |
|---|---|---|---|---|---|
| Gold noir | `#0b0907` | `#16120e` | `#ede3d1` | `#a89c8a` | `#c9a063` |
| Rose noir | `#0a0909` | `#151313` | `#f3ebe7` | `#a8998f` | `#d4a59a` |
| Cream editorial | `#f6f1e9` | `#ffffff` | `#1d1a16` | `#6b645b` | `#8b5e34` |
| Candy cocoa | `#7a4a2b` | `#8a5634` | `#fff8ef` | `#f1d9bf` | `#ffd23f` |
| Neon lime | `#0a0a0a` | `#141414` | `#f5f5f5` | `#9a9a9a` | `#c6ff00` |
| Racing red | `#0b0b0c` | `#151517` | `#f4f4f5` | `#a1a1aa` | `#e0262c` |
| Maroon gold | `#2a0b10` | `#3a1218` | `#f7e9d7` | `#cdb49a` | `#d4a24c` |
| Retail red | `#c8102e` | `#a50d26` | `#fff5f5` | `#ffd1d6` | `#111111` |
| Clean white | `#f5f5f4` | `#ffffff` | `#111111` | `#6b6b6b` | `#111111` |
| Blush | `#fbf1ef` | `#ffffff` | `#2b1d1f` | `#7d6a6c` | `#c86b7a` |
| Forest sand | `#12201a` | `#1a2c24` | `#efe8d8` | `#a9b3a1` | `#d8b77a` |
| Ocean | `#06141f` | `#0c2130` | `#e8f1f6` | `#8fa6b5` | `#3fc1ff` |
| Sunset orange | `#fff6ee` | `#ffffff` | `#1f140c` | `#6e5c4d` | `#f26a1b` |

Rules: one accent. `muted` must be readable (contrast ≥ 4.5:1 on bg). A section can flip to its own colour (e.g. a red band on a white site) — that's a design choice, write it in DESIGN.md.

## 3. Type pairs

Install: `npm i <package>` → import in `site/fonts.ts` → use the family name in `site/site.ts`.

| # | Headings | Body | Mood |
|---|---|---|---|
| T1 | Cormorant Garamond `@fontsource/cormorant-garamond` | Inter `@fontsource-variable/inter` | classic luxury |
| T2 | Playfair Display `@fontsource-variable/playfair-display` | DM Sans `@fontsource-variable/dm-sans` | editorial, fashion |
| T3 | Instrument Serif `@fontsource/instrument-serif` | Instrument Sans `@fontsource-variable/instrument-sans` | modern editorial |
| T4 | Bodoni Moda `@fontsource-variable/bodoni-moda` | Manrope `@fontsource-variable/manrope` | high fashion, perfume |
| T5 | Italiana `@fontsource/italiana` + Pinyon Script `@fontsource/pinyon-script` accents | Figtree `@fontsource-variable/figtree` | romantic, bridal, saree |
| T6 | Fraunces `@fontsource-variable/fraunces` | Outfit `@fontsource-variable/outfit` | warm, food, café |
| T7 | Anton `@fontsource/anton` | Space Grotesk `@fontsource-variable/space-grotesk` | sport, loud |
| T8 | Bebas Neue `@fontsource/bebas-neue` | Inter Tight `@fontsource-variable/inter-tight` | streetwear, cinema |
| T9 | Orbitron `@fontsource-variable/orbitron` or Michroma `@fontsource/michroma` | Sora `@fontsource-variable/sora` | tech, bikes, EV |
| T10 | Unbounded `@fontsource-variable/unbounded` | Plus Jakarta Sans `@fontsource-variable/plus-jakarta-sans` | playful tech, startups |
| T11 | Bricolage Grotesque `@fontsource-variable/bricolage-grotesque` | Onest `@fontsource-variable/onest` | friendly modern |
| T12 | Fredoka `@fontsource-variable/fredoka` or Lilita One `@fontsource/lilita-one` | Nunito `@fontsource-variable/nunito` | candy, kids, ice cream |
| T13 | Syne `@fontsource-variable/syne` | Inter `@fontsource-variable/inter` | creative studio, art |
| T14 | Cinzel `@fontsource-variable/cinzel` | EB Garamond `@fontsource-variable/eb-garamond` | heritage, temples, wine |
| T15 | Big Shoulders Display `@fontsource-variable/big-shoulders-display` | Rethink Sans `@fontsource-variable/rethink-sans` | industrial, gyms |
| T16 | Abril Fatface `@fontsource/abril-fatface` | Poppins `@fontsource/poppins` | bold retail, sale |
| T17 | Rozha One `@fontsource/rozha-one` | Baloo 2 `@fontsource-variable/baloo-2` | Indian sweets, festive |
| T18 | Archivo Black `@fontsource/archivo-black` | Archivo `@fontsource-variable/archivo` | clean bold commerce |

A script font (Great Vibes, Pinyon Script, Caveat, Kaushan Script) may be used for **one highlighted word** per heading — never for paragraphs.

## 4. Nav style

| # | Nav | Pattern |
|---|---|---|
| N1 | Transparent bar → solid on scroll | `Nav.tsx` |
| N2 | Floating centre pill, active link filled | `NavPill.tsx` |
| N3 | Split: links left · logo centre · icons right | custom |
| N4 | Minimal: logo + "Menu" button → full-screen menu with big links | custom |
| N5 | Offer ticker on top + shop bar (search, cart count) | `Ticker.tsx` + custom |
| N6 | Left vertical rail (logo rotated, dots) | custom |
| N7 | Bottom floating dock (appears after hero), can say "You are in: <room>" | `FloorDock.tsx` |

## 5. Hero layout

| # | Hero | Pattern / asset |
|---|---|---|
| H1 | Full-screen scroll video + timed captions | `FrameHero` + hero video |
| H2 | **Fly-through**: outside the store → through the door → inside | `FrameHero` + fly-through video (AI-VIDEO-PROMPTS G) |
| H3 | Colour switcher: product changes colour + glow | `VariantHero` + cut-out images |
| H4 | Split: text left, product right on a flat colour block, flavour pills | custom (Creamsy) |
| H5 | Giant brand word behind a centred product | custom |
| H6 | Wordmark centred over a looping video, bottom offer strip | custom + video |
| H7 | Editorial collage: 3 images at different sizes + serif headline | custom |
| H8 | Product on a pedestal + spec bar underneath | custom + cut-out |

## 6. Section shape (how sections meet)

S1 straight lines · S2 waves (`WaveDivider shape="wave"`) · S3 soft curves / arches (`curve`, `arch`) · S4 torn paper (`torn`) · S5 rounded panels (each section is an inset rounded card) · S6 tilted (`tilt`) · S7 full-colour bands that alternate · S8 **doorways**: each section opens through a lit doorway that grows to full screen (`DoorwayRooms.tsx`)

## 7. Card style

C1 sharp + thin border (luxury) · C2 rounded + soft shadow · C3 **pop-out** product above a white card (`ProductGrid card="pop"`) · C4 tall photo + text below (`card="photo"`) · C5 glass / blurred · C6 **arch-top** images (saree "Six moods") · C7 polaroid · C8 circles (category bubbles)

## 8. Signature moment (pick ONE hero moment + max 2 supporting)

| Moment | Pattern |
|---|---|
| Scroll-scrubbed video | `FrameHero` |
| Exploded parts with labelled callouts | `FrameScrub` + exploded video |
| 360° product spin with specs | `FrameScrub` |
| Colour switch | `VariantHero` |
| Curved drifting gallery | `CurvedGallery` |
| Pinned sideways gallery | `HorizontalGallery` |
| Expanding strips | `ExpandingPanels` |
| Product showcase that swaps by itself | `ProductShowcase` |
| Word-by-word statement | `Statement` |
| Endless big-word marquee | `Marquee` |
| Stacking cards (each card pins and the next slides over) | custom |
| Image reveal through big text (text mask) | custom |
| Walk-through rooms: doorway reveal, the whole page takes each room's light + a dock that says which room you're in | `DoorwayRooms.tsx` + `FloorDock.tsx` |
| Bento whose tiles light up in turn (border beam + spotlight) | `BeamBento.tsx` |

## 9. Section ideas for the rest of the page

Shop-style (clients picture their business): `ProductGrid` (row / grid) · `Bento` offers · category circles · "Shop the look" · new arrivals · bestsellers · `Ticker` offers · store locations · `Faq` · newsletter band · `PolaroidWall` / `Testimonials` · `WordmarkFooter` / `Footer`

Cinematic: `Statement` · `Stats` · `Split` story · `Parallax` band · `Features` · `Cta`

Aim for **9–12 sections**: 1 hero + ~3 cinematic + ~5 shop-style + footer.

## 10. Loader / intro

I1 letters rise then wipe (engine default) · I2 brand pattern fills the screen, then zooms out (e.g. paisley for sarees) · I3 counter 0 → 100 · I4 logo drawn as a line · I5 circle expands from the centre

---

## How "restyle a pattern" works

Patterns in `components/patterns/` are **starting points**. For each one used, copy it into `site/components/`, rename it for the brand (e.g. `FlavourCards.tsx`) and change at least **3** of: layout proportions, type scale/case, card shape, colours used, spacing, image shape, the motion. Two sites using `ProductGrid` must not look alike.
