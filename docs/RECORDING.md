# Filming the site: vertical 9:16 reel

This matches the reference page's style: **phone held upright**, laptop in a **dark room**, the screen and the glowing keyboard are the only light, and the site **scrolls by itself**.

## 1. Prepare the laptop

1. Run the production version (much smoother than `npm run dev`):
   ```bash
   npm run build && npm start
   ```
2. Open Chrome → **http://localhost:3000/?record=1**
3. Browser zoom **100%** (Ctrl/Cmd + 0).
4. **Full screen** so there's no address bar or tabs: **F11** (Windows), **Cmd + Ctrl + F** (Mac).
5. Screen brightness **100%**. Turn off Night Light / Night Shift / True Tone (they tint colours).
6. Turn on Do Not Disturb, plug in the charger.
7. Keyboard backlight **on**. If it's RGB, set a slow colour-cycle effect; it gives the colourful glow you see in the reference reels.

## 2. Record mode

`?record=1` hides the cursor and scrollbar, waits for the loader to finish, then scrolls the page by itself. It has two modes.

### A. Section timeline (recommended)

Used automatically when any element on the page has `data-record-time`. Every marked element is a **stop**, in page order, and gets a fixed number of seconds, the **same on every screen size**. A laptop recording and a phone recording line up exactly, so you can edit them side by side.

| Attribute | Meaning |
|---|---|
| `data-record-time="2.5"` | seconds to scroll from the previous stop to this one |
| `data-record-hold="5"` | seconds to stay still once it arrives |
| `data-record-align="center"` | where the element sits on screen when it arrives: `top` (default), `center`, `bottom` |
| `data-record-offset="-36"` | extra pixels added to that scroll position (negative = the element sits lower) |
| `data-record-label="FAQ"` | the name printed in the console |
| `…-mobile` version of any of them | used below 768 px wide, e.g. `data-record-hold-mobile="2"` |

- **Change timings in the page, not in code:** edit the numbers on the sections in `site/components/*`. A stop can be a whole `<section>` or an invisible marker `<div>` (e.g. the start and end of a pinned scroll video).
- **Smooth:** the scroll follows one smooth curve through all the stops. It only comes to rest at holds, at the start and at the end. There are no sudden starts or stops.
- **Same total on every screen:** a shorter `hold-mobile` gives its spare seconds to the next move. Example: the collection holds 5 s on a laptop, and on a phone it holds 2 s, then takes 3 s longer to scroll on. The next section still starts at the same second on both.
- **Clock starts after the loader**, so a slower phone doesn't shift anything. Custom loaders: put `data-loader` on the overlay; record mode waits until it's gone. Give the loader a fixed length (e.g. exactly 2.5 s) so every device reaches the hero at the same moment.
- **`&at=` and loaders:** a loader that supports it (using `lib/atTime.ts`, like `components/patterns/StartLightsLoader.tsx`) freezes on its first frame and plays at the set time. With a loader that doesn't, the page loads normally and then waits on the hero until the set time.
- **Hold events:** during a hold the stop element receives a `record:hold` event (`detail.duration` in seconds), then `record:holdend`. Sections can use it to play something while the page stands still (e.g. a card that steps through four models, or a size picker that plays its demo).
- **Console:** opening `?record=1` prints the whole plan (`console.table`: section, starts, arrives, hold), then `[record] 13.50 s → Collection (hold)` as each move begins, then `[record] done at 41.01 s`.
- `record.duration`, `record.speed` and `delay` are ignored in this mode (use a hold on the first stop instead).

Example timeline (41 s):

| Stop | Move (s) | Hold (s) | Starts at |
|---|---|---|---|
| Hero | 0 | 3 | 0 |
| Anatomy (plate full screen) | 1.5 | | 3.0 |
| Anatomy: all 5 parts | 7 | | 4.5 |
| Two hundred and eleven parts | 2 | | 11.5 |
| Collection | 1.5 | 5 (phone 2) | 13.5 |
| Configurator | 5 (phone 8) | | 20.0 (phone 17.0) |
| Hand finished + atelier | 4 | | 25.0 |
| Figures · Look closer · Boutiques · FAQ | 2.5 each | | 29.0 · 31.5 · 34.0 · 36.5 |
| Footer | 1 | 1 | 39.0 → done 41.0 |

### B. Constant speed (sites without `data-record-time`)

Scrolls the whole page at a steady speed. By default it takes `site/site.ts` → `record.duration`.

| Want | Use |
|---|---|
| Whole page in exactly 30 s | `?record=1&duration=30` |
| Fixed speed instead | `?record=1&speed=200` |
| More time on the loader | `?record=1&delay=4` |

### Keys (both modes)

| Key | Does |
|---|---|
| **R** | start / pause / resume |
| **T** | stop and jump back to the top |
| **+ / −** | faster / slower (constant speed only) |

To see the loader again, reload the page (or use a new Incognito window).

## Filming laptop + phone together

To film the laptop and a phone side by side in one shot, both running the site in sync:

1. **Sync the clocks:** on both devices turn on *Set time automatically* (Mac: System Settings → General → Date & Time; iPhone/Android: Settings → Date & time).
2. **Put both on the same network.** Find the laptop's IP address (Mac: System Settings → Wi-Fi → Details), then on the phone open `http://<laptop-ip>:3000`.
3. **Pick a start time about 1 minute ahead**, e.g. `18:55:00`, and open on **both** devices:
   ```
   http://localhost:3000/?record=1&at=18:55:00        (laptop)
   http://<laptop-ip>:3000/?record=1&at=18:55:00      (phone)
   ```
4. On load, each device shows the **loader's first frame, frozen** (e.g. the brand name on a still background). Behind it, it preloads every scroll-video frame, every image and the fonts. Nothing moves and there's no countdown.
5. At exactly 18:55:00 both play the **full loader intro** (the same animation a normal load plays), then the hero, then the section timeline, just like a normal fresh load. The loader always takes the **same fixed time (2.5 s)** on every device, however early the assets finished, so both stay in sync.
   - Measured with `at=`: laptop and phone finished the loader 23 ms apart and started scrolling 5.6 s after the set time (2.5 s loader + 3 s hero hold).
6. **Not loaded in time?** That device keeps its loader waiting on its last step until everything is in, then opens, and the console warns `[record] assets not ready at start time`. It will then be behind the other device, so pick a start time further ahead or use a faster network, and film again.
7. Start the camera **before** the start time. If the time has already passed when a page loads, that device plays straight away, so reload both with a new time.
8. Use the 24-hour clock (`HH:MM` or `HH:MM:SS`). It uses each device's own local time.

## 3. Set up the shot (phone vertical)

- **Dark room.** Lights off, curtains closed. Only the screen and keyboard glow.
- Put the phone on a small tripod, **vertical**, about **40–60 cm** from the laptop, a little **above and to one side**, so the camera looks down at the screen at ~20–30°.
- Frame it so the **screen fills the top ~60%** of the video and the **keyboard glow shows in the bottom ~30%**. Leave a little space at the very top for the text.
- Alternative look (like the TV reel): the site on a big TV / monitor on a table, filmed from the side in a normal-lit room.

## 4. Phone camera settings

- **4K, 30 fps.** Main (1×) lens. Avoid the wide lens: it bends the screen.
- **Tap and hold on the screen** to lock focus + exposure (AE/AF lock), then drag the brightness slider **down a little** so the screen isn't blown out white.
- If you see flicker or rolling bands: use Pro/Manual mode, shutter **1/50** or **1/60**.
- If you see wavy rainbow lines (moiré): move the phone slightly back, or tap-focus a tiny bit off the screen.
- Start recording, **then** press F5 on the laptop to reload `?record=1`. Stop 2 s after the footer appears.

## 5. Edit (CapCut / Instagram editor)

- **Length:** 18–40 s. Cut the dead seconds at the start.
- **Top text** for the whole reel, left-aligned, bold, with a short coloured bar before it, e.g. **"Your brand deserves a website like this"**. Keep the same style on every reel so the page is recognisable.
- **Trending song** (pick from Instagram's trending audio when posting).
- Optional: speed ramp the slow parts to 1.5×, keep the hero and signature moment at normal speed.
- **Caption / pinned comment hook:** e.g. *Comment "SITE" and I'll send you the details* / *DM "WEBSITE" to get one for your brand*.
- Post as a Reel **and** share it to your Story with a "Check it out 🔥" sticker, like the reference page.

## 6. Quick checklist

- [ ] `npm run build && npm start`, full screen, zoom 100%, brightness 100%
- [ ] Dark room, keyboard backlight on, phone vertical on tripod
- [ ] 4K 30 fps, exposure locked and lowered a bit
- [ ] Reload `?record=1` (two devices: `&at=HH:MM:SS` on both), let it run to the footer
- [ ] Edit: top text, trending song, 18–40 s, hook in caption
