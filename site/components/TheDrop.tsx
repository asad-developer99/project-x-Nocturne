"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBlendFramePlayer } from "./useBlendFramePlayer";
import { drop } from "../content";
import { Lines, plain } from "./Rich";

// Signature "The Drop" (Motion map M16 slice reveal, rising). Pinned; the drop frames scrub with the scroll, mapped
// by VIDEO TIME of drop-amber.mp4 (seconds), not frame numbers (the frames are 48 fps: 285 frames over 0–5.92 s).
// Landmarks in the video: fall 0–1.3 s · impact ~1.35 s · crown rising 1.4–2.2 s, full height ~2.2–2.4 s ·
// collapse 2.6–3.0 s · ripples and the rebound jet after.
//   (entering)    the video only fades in at the end of the arrival, the drop already starting to fall (video
//                  0 → 0.15 s), so it never hangs in the air (X5).
//   0 → IMPACT_AT  the fall at normal speed (0.15 → 1.3 s, ~1 s of record time).
//   IMPACT_AT → PEAK_AT  impact → the crown rising to its full height (1.3 → 2.3 s).
//   PEAK_AT → RISE_AT  the crown at full height in slow motion (2.3 → 2.55 s); nothing covers it. The headline is
//                  dimmed from the impact until the strips arrive, so the droplets never fight it.
//   RISE_AT →      the three notes (.drop-strip) rise out of the liquid line, one after another (top → heart → base),
//                  while the crown falls back behind them: each is uncovered from its foot upwards (clip-path),
//                  lifts and comes out of a blur. Laptop: tall strips side by side; phone: wide rows stacked under
//                  the video band (photo left, act / name / time right).
//   0.6 → 0.93 (laptop): each strip opens wide in turn while the drop rebounds and ripples, then the three
//                  settle as equal acts with all their text.
// ?static=1: the crown at full height + the three acts side by side (the CSS default).

/** Length of the frame sequence in video seconds (285 frames at 48 fps). */
const VIDEO_LEN = 284 / 48;
const at = (seconds: number) => seconds / VIDEO_LEN;
/** Scroll progress → video seconds (piecewise linear between these keys). */
const KEYS: [number, number][] = [
  [0, 0.15],
  [0.1, 1.3], // impact
  [0.22, 2.3], // crown at its full height
  [0.34, 2.55], // still at full height (slow motion), the strips start
  [0.59, 3.4], // strips risen, the crown has fallen back
  [1, 5.55],
];
const IMPACT_AT = KEYS[1][0];
const PEAK_AT = KEYS[2][0];
/** Frames (0..1) of the crown at its full height (also the ?static=1 picture). */
export const CROWN_FRAME = at(2.4);
const ENTRY_FRAME = at(KEYS[0][1]);
const PIN_END_FRAME = at(KEYS[KEYS.length - 1][1]);
/** The strips start a little after the full-height crown (the video is still on the crown, before the collapse at
 *  2.6 s), so the crown has well over a second on screen with nothing in front of it. */
const RISE_AT = KEYS[3][0];
const RISEN_AT = KEYS[4][0];
const OPENS = [
  [0.62, 0.7],
  [0.7, 0.78],
  [0.78, 0.86],
] as const;
const SETTLE = [0.87, 0.94] as const;
const WIDE = 2.6;
/** Record-mode hold on the settled acts: the video keeps creeping on by this much over the hold (never a frozen
 *  frame), then hands back to the scroll by fading the extra out over the scroll that follows. */
const DRIFT = 0.03;

const videoAt = (p: number) => {
  const q = Math.min(1, Math.max(0, p));
  for (let i = 1; i < KEYS.length; i++) {
    const [p1, v1] = KEYS[i];
    const [p0, v0] = KEYS[i - 1];
    if (q <= p1) return at(v0 + ((q - p0) / (p1 - p0)) * (v1 - v0));
  }
  return PIN_END_FRAME;
};

export default function TheDrop() {
  const outer = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useBlendFramePlayer(drop.frames, canvas);

  useEffect(() => {
    if (prefersReducedMotion()) {
      player.current.seek(CROWN_FRAME);
      return;
    }
    const root = outer.current!;
    const mm = gsap.matchMedia();

    mm.add({ laptop: "(min-width: 768px)", phone: "(max-width: 767px)" }, (c) => {
      const { laptop } = c.conditions as { laptop: boolean };
      const strips = gsap.utils.toArray<HTMLElement>(".drop-strip", root);
      const texts = strips.map((s) => s.querySelector<HTMLElement>(".strip-text"));

      gsap.set(strips, { clipPath: "inset(100% 0% 0% 0%)", y: 60 });
      gsap.set(".strip-img", { filter: "blur(12px)", scale: 1.12 });
      gsap.set(".strip-copy", { opacity: 0, y: 24 });
      if (laptop) gsap.set(texts, { opacity: 0 });

      // record-mode hold drift on the settled acts, fading out over the scroll that follows (the video climbs much
      // faster there, so it never steps backwards)
      const settleAt = SETTLE[1] + 0.02;
      const drifts = [{ v: 0, at: settleAt, fadeTo: 1.2 }];
      let lastP = 0;
      const apply = (p: number) => {
        lastP = p;
        const extra = drifts.reduce((s, d) => s + d.v * (p <= d.at ? 1 : Math.max(0, 1 - (p - d.at) / (d.fadeTo - d.at))), 0);
        player.current.seek(Math.min(1, videoAt(p) + extra));
      };
      const holdMarkers = [root.querySelector<HTMLElement>(".rec-settled")];
      const onHold = (i: number) => (e: Event) => {
        const hold = (e as CustomEvent<{ duration: number }>).detail?.duration ?? 0.5;
        gsap.to(drifts[i], { v: DRIFT, duration: hold + 0.3, ease: "none", onUpdate: () => apply(lastP) });
      };
      const handlers = holdMarkers.map((m, i) => {
        const h = onHold(i);
        m?.addEventListener("record:hold", h);
        return () => m?.removeEventListener("record:hold", h);
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.25 },
        onUpdate() {
          apply(this.progress());
        },
      });
      tl.to({}, { duration: 1 }, 0);

      // after the pin: the last ripples play while the section scrolls away
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.3,
          onUpdate: (self) => self.progress > 0 && player.current.seek(Math.min(1, PIN_END_FRAME + drifts[0].v + self.progress * (1 - PIN_END_FRAME - drifts[0].v))),
        },
      });

      // X5: while the section scrolls in, the video waits on its first frame and fades in only at the end of the
      // arrival, so the fall starts right as the section lands (the drop never hangs in the air)
      const canvasEl = canvas.current!;
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "top top",
          scrub: 0.3,
          onUpdate: (self) => {
            // phones fade in earlier: their screen is mostly dark here, the glowing surface keeps the arrival moving
            const from = laptop ? 0.55 : 0.2;
            const fade = Math.min(1, Math.max(0, (self.progress - from) / (1 - from)));
            canvasEl.style.opacity = String(fade);
            // the drop starts moving as it fades in (never a still picture)
            if (self.progress < 1) player.current.seek(ENTRY_FRAME * fade);
          },
        },
      });

      // phones: the small drop falls over a mostly dark screen, so the stage settles in from a slight zoom during
      // the fall (the whole picture keeps moving)
      if (!laptop) tl.fromTo(".drop-push", { scale: 1.04 }, { scale: 1, duration: IMPACT_AT, ease: "none" }, 0);

      // the headline steps back from the impact until the crown has fallen (the droplets never fight it), then returns
      tl.to(".drop-title", { opacity: 0.3, duration: 0.05, ease: "power1.inOut" }, IMPACT_AT - 0.02);
      tl.to(".drop-title", { opacity: 1, duration: 0.06, ease: "power1.inOut" }, RISE_AT + 0.02);

      // M16: the three strips rise out of the liquid line, one after another
      strips.forEach((s, i) => {
        const t = RISE_AT + i * 0.07;
        tl.to(s, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.11, ease: "power2.out" }, t);
        tl.to(s.querySelector(".strip-img"), { filter: "blur(0px)", scale: 1, duration: 0.14, ease: "power2.out" }, t);
        tl.to(s.querySelector(".strip-copy"), { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, t + 0.06);
      });

      // laptop: each act opens wide in turn, then the three settle equal with all their text
      if (laptop) {
        OPENS.forEach(([a, b], i) => {
          tl.to(strips[i], { flexGrow: WIDE, duration: b - a - 0.02, ease: "power2.inOut" }, a);
          tl.to(texts[i], { opacity: 1, duration: 0.04 }, a + 0.04);
          if (i > 0) {
            tl.to(strips[i - 1], { flexGrow: 1, duration: b - a - 0.02, ease: "power2.inOut" }, a);
            tl.to(texts[i - 1], { opacity: 0, duration: 0.03 }, a);
          }
        });
        tl.to(strips[2], { flexGrow: 1, duration: SETTLE[1] - SETTLE[0], ease: "power2.inOut" }, SETTLE[0]);
        tl.to(texts, { opacity: 1, duration: 0.04 }, SETTLE[0] + 0.03);
      }
      return () => handlers.forEach((off) => off());
    });

    return () => mm.revert();
  }, [player]);

  return (
    <section ref={outer} id="drop" className="drop-outer pin-outer" style={{ height: "calc(var(--drop-len) + 100vh)" }} data-record-time="1" data-record-label="Drop">
      {/* record-mode stops inside the pin, at the video's landmarks: the fall at normal speed (1 s), impact → the crown
          at its full height slowly (1.5 s, nothing in front of it), the strips risen (1.8 s), the acts settled */}
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `calc(var(--drop-len) * ${IMPACT_AT})` }} data-record-time="1" data-record-label="Drop: impact (the fall)" />
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `calc(var(--drop-len) * ${PEAK_AT})` }} data-record-time="1.2" data-record-label="Drop: crown at full height" />
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `calc(var(--drop-len) * ${RISE_AT})` }} data-record-time="1.2" data-record-label="Drop: crown, slow motion" />
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `calc(var(--drop-len) * ${RISEN_AT})` }} data-record-time="1.8" data-record-label="Drop: acts risen" />
      <div aria-hidden className="rec-settled pointer-events-none absolute left-0 h-px w-px" style={{ top: `calc(var(--drop-len) * ${SETTLE[1]} + 6vh)` }} data-record-time="2.5" data-record-hold="0.4" data-hold-push=".drop-push" data-record-label="Drop: acts settled" />
      <div className="drop-stage pin-stage bg-bg">
        <div className="drop-push absolute inset-0">
        <canvas ref={canvas} className="drop-canvas breathe absolute" />
        <div className="drop-dim pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(13,11,10,0.9)_0%,rgba(13,11,10,0.4)_55%,rgba(13,11,10,0.15)_100%)]" />

        <div className="container-x relative z-[2] flex h-full flex-col pb-[5vh] pt-[6vh] max-lg:pt-[11vh] max-md:pb-[3svh] max-md:pt-[66px]">
          <div className="drop-title flex items-end justify-between gap-8">
            <h2 className="font-display h-lg max-md:text-[30px]" aria-label={plain(drop.title)}>
              <Lines lines={drop.title} />
            </h2>
            <p className="eyebrow mb-3 shrink-0 max-md:hidden">{drop.eyebrow}</p>
          </div>

          {/* the three acts: rise from the liquid line (bottom), open in turn, settle equal */}
          {/* laptop: tall strips side by side; phone: three wide rows in the bottom 55% (photo left, text right) */}
          <div className="drop-strips mt-auto flex h-[58vh] gap-3 max-md:h-[51svh] max-md:flex-col max-md:gap-2">
            {drop.notes.map((n) => (
              <article key={n.id} className="note-strip drop-strip flex-1" data-cursor="Smell">
                <div className="breathe absolute inset-0 max-md:right-[60%]">
                  <img src={n.image} alt={n.name} className="strip-img absolute inset-0 h-full w-full object-cover opacity-80" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(13,11,10,0.95)_0%,rgba(13,11,10,0.55)_45%,transparent_75%)] max-md:left-[40%] max-md:bg-[linear-gradient(90deg,rgba(11,9,8,0.6),#0b0908_30%)]" />
                <div className="strip-copy absolute inset-x-0 bottom-0 p-[clamp(16px,2vw,30px)] max-md:inset-y-0 max-md:left-[40%] max-md:flex max-md:flex-col max-md:justify-center max-md:p-4">
                  <p className="label text-[color:var(--amber-soft)]">{n.act}</p>
                  <h3 className="font-display mt-3 text-[clamp(26px,2.6vw,44px)] max-md:mt-1.5 max-md:text-[21px] max-md:leading-[1.1]">{n.name}</h3>
                  <p className="strip-text mt-3 max-w-[36ch] text-[14px] leading-relaxed text-muted max-md:hidden">{n.text}</p>
                  <p className="label mt-5 flex items-center gap-3 text-fg max-md:mt-2.5 max-md:tracking-[0.14em]">
                    <span className="block h-px w-6 bg-[var(--amber)] max-md:hidden" />
                    {n.lasts}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
