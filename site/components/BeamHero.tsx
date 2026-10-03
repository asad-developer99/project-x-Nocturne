"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBlendFramePlayer } from "./useBlendFramePlayer";
import { onReveal } from "./ConcentrationLoader";
import { hero } from "../content";
import { plain } from "./Rich";

// Hero "the beam" (Motion map M20 scroll-lit, lit by a beam). Pinned 320vh. The frames (right edge cropped, so the
// full height of the shot is kept: headroom above the cap, the whole plinth) sit with the bottle at 28vw on laptops;
// the headline has the dark right side to itself.
//   0 → LIT_AT of the scroll: darkness lifts, the video's light comes on (video 0–2 s) and a band of light at the
//      beam's angle (.hero-beam) sweeps across the headline; each letter (.beam-letter) goes charcoal → ivory with a
//      warm rim at the moment the band reaches it (letters are ordered along the slanted band, not just left → right).
//   LIT_AT → 1: smoke drifts through the light (video 2–6 s).
// ?static=1: the lit bottle and the fully lit headline (the CSS default; the dark start is only set by the motion).

/** Scroll progress at which the light is fully on: the reveal takes the first 55% of the hero. */
export const LIT_AT = 0.55;
/** Frames (0..1) at which the video's light is fully on: 2 s of 6 s. */
export const LIT_FRAME = 2 / 6;
/** Slant of the light band (deg): lower points lie further right, like the video's beam. */
const SLANT = 24;
const SWEEP_FROM = 0;
const SWEEP_TO = 0.5;
/** Frames (0..1) reached when the pin ends; the rest of the smoke plays while the hero scrolls away. */
const PIN_END_FRAME = 0.9;

/** Splits a line into words of letter spans; "*…*" parts are italic. */
function BeamLine({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/).filter(Boolean);
  return (
    <>
      {parts.map((part, pi) => {
        const italic = part.startsWith("*");
        const words = part.replace(/\*/g, "").split(" ").filter(Boolean);
        const Tag = italic ? "em" : "span";
        return (
          <Tag key={pi} className={italic ? "not-italic" : undefined}>
            {words.map((w, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {w.split("").map((ch, ci) => (
                  <span key={ci} className={`beam-letter ${italic ? "italic" : ""}`}>
                    {ch}
                  </span>
                ))}
                {wi < words.length - 1 && <span className="inline-block w-[0.24em]" />}
              </span>
            ))}
            {pi < parts.length - 1 && <span className="inline-block w-[0.24em]" />}
          </Tag>
        );
      })}
    </>
  );
}

export default function BeamHero() {
  const outer = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useBlendFramePlayer(hero.frames, canvas, { blockLoader: true });

  useEffect(() => {
    if (prefersReducedMotion()) {
      player.current.seek(LIT_FRAME + 0.1);
      return;
    }
    const root = outer.current!;
    let offReveal = () => {};

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const h1 = q(".hero-h1")[0] as HTMLElement;
      const band = q(".hero-beam")[0] as HTMLElement;
      const letters = q(".beam-letter") as HTMLElement[];
      const tan = Math.tan((SLANT * Math.PI) / 180);

      // final colours come from the CSS (ivory, the italic words warm ivory-amber)
      const finals = letters.map((l) => getComputedStyle(l).color);

      // where the slanted band's centre line has to be (x at the h1's middle height) to cross each letter
      const keys = () => {
        const box = h1.getBoundingClientRect();
        const midY = box.top + box.height / 2;
        return letters.map((l) => {
          const r = l.getBoundingClientRect();
          return r.left + r.width / 2 - box.left - tan * (r.top + r.height / 2 - midY);
        });
      };

      let k = keys();
      const range = () => {
        const w = h1.getBoundingClientRect().width;
        const stageBox = root.querySelector(".hero-stage")!.getBoundingClientRect();
        const left = h1.getBoundingClientRect().left - stageBox.left;
        // the shaft always starts on screen (at least 20% in), so it shows the moment the loader leaves, even on
        // phones where the headline sits at the left edge
        return { from: Math.max(Math.min(...k) - w * 0.02, -left + stageBox.width * 0.2), to: Math.max(...k) + w * 0.2 };
      };

      gsap.set(letters, { color: "#1e1916", textShadow: "0 0 0px rgba(255,214,160,0)" });
      gsap.set(".hero-fade", { opacity: 0, y: 14 });

      // video: the reveal (0–2 s) over the first LIT_AT of the scroll, then the smoke (2–6 s). Plus a small intro
      // drift that starts as the loader dissolves (the light is already coming on before the first scroll) and
      // hands over to the scroll by p = 0.3 (the scroll climbs much faster, so it never steps backwards)
      const intro = { v: 0 };
      let lastP = 0;
      const applyVideo = (p: number) => {
        lastP = p;
        const base = p < LIT_AT ? (p / LIT_AT) * LIT_FRAME : LIT_FRAME + ((p - LIT_AT) / (1 - LIT_AT)) * (PIN_END_FRAME - LIT_FRAME);
        player.current.seek(base + intro.v * Math.max(0, 1 - p / 0.3));
      };
      gsap.set(".hero-veil", { opacity: 0.7 });
      // the shaft hangs from above the screen; it is slanted around the headline's middle height, so its centre line
      // crosses each letter exactly where the keys say
      const stage = q(".hero-stage")[0] as HTMLElement;
      const pivot = () => {
        const sb = stage.getBoundingClientRect();
        const hb = h1.getBoundingClientRect();
        const bb = band.getBoundingClientRect();
        return { left: hb.left - sb.left, originY: hb.top + hb.height / 2 - (bb.top - (gsap.getProperty(band, "y") as number)) };
      };
      gsap.set(band, { skewX: SLANT, opacity: 1, transformOrigin: () => `50% ${pivot().originY}px` });
      // the shaft switches on by itself as the loader leaves (so the page never opens on a black screen); the scroll
      // then carries it across the headline
      gsap.set(".hero-beam-wrap", { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          invalidateOnRefresh: true,
          onRefresh: () => {
            k = keys();
            gsap.set(band, { transformOrigin: `50% ${pivot().originY}px` });
          },
        },
        onUpdate() {
          applyVideo(this.progress());
        },
      });
      tl.to({}, { duration: 1 }, 0); // timeline length 1 = scroll progress 0–1
      // after the pin: the smoke keeps drifting while the hero scrolls away (never a still picture moving off)
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.3,
          onUpdate: (self) => self.progress > 0 && player.current.seek(PIN_END_FRAME + self.progress * (1 - PIN_END_FRAME)),
        },
      });

      // darkness lifts with the light
      tl.to(".hero-veil", { opacity: 0, duration: LIT_AT, ease: "power1.in" }, 0);
      tl.to(".hero-hint", { opacity: 0, duration: 0.05 }, 0.02);

      // the band sweeps across the headline, each letter lights as the band's centre crosses it
      const sweep = SWEEP_TO - SWEEP_FROM;
      // (x moves the band's left edge; its centre is half a band further right)
      tl.fromTo(
        band,
        { x: () => pivot().left + range().from - band.offsetWidth / 2 },
        { x: () => pivot().left + range().to - band.offsetWidth / 2, duration: sweep },
        SWEEP_FROM,
      );
      tl.to(band, { opacity: 0, duration: 0.08 }, SWEEP_TO - 0.06);
      letters.forEach((l, i) => {
        const at = () => {
          const { from, to } = range();
          return SWEEP_FROM + Math.max(0, (k[i] - from) / (to - from)) * sweep;
        };
        tl.to(l, { color: finals[i], textShadow: "0 0 26px rgba(233,160,76,0.32)", duration: 0.025, ease: "power2.out" }, at());
      });

      // eyebrow + line under the headline arrive once the headline is lit
      tl.to(".hero-fade", { opacity: 1, y: 0, duration: 0.08, stagger: 0.03, ease: "power2.out" }, SWEEP_TO - 0.04);

      // the hint rises in once the loader has gone
      gsap.set(".hero-hint", { opacity: 0 });
      offReveal = onReveal(() => {
        // the picture settles in from a slight zoom while the loader dissolves (moving from the very first frame)
        gsap.fromTo(root.querySelectorAll(".hero-media"), { scale: 1.05 }, { scale: 1, duration: 2.4, ease: "power2.out" });
        gsap.to(intro, { v: 0.015, duration: 1.6, ease: "none", onUpdate: () => applyVideo(lastP) });
        // the shaft glides in while the loader dissolves, so the first frame after the loader is already moving
        gsap.fromTo(root.querySelector(".hero-beam-wrap"), { opacity: 0, x: -90 }, { opacity: 1, x: 0, duration: 1.3, ease: "power2.out" });
        gsap.to(root.querySelector(".hero-hint"), { opacity: 1, duration: 1.2, delay: 0.4 });
      });
    }, root);

    return () => {
      offReveal();
      ctx.revert();
    };
  }, [player]);

  return (
    <section ref={outer} id="top" className="pin-outer" style={{ height: "320vh" }} data-record-time="0" data-record-label="Hero">
      <span id="light" className="absolute top-0" />
      {/* record-mode stops inside the pin: the light is on and the headline lit (LIT_AT), the smoke has drifted */}
      {/* an early stop a few vh down: record mode leaves the top already moving (no slow start on a dark screen) */}
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: "10vh" }} data-record-time="0.3" data-record-label="Hero: beam" />
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `${LIT_AT * 220}vh` }} data-record-time="3.05" data-record-label="Hero: lit" />
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: "205vh" }} data-record-time="1.3" data-record-label="Hero: smoke" />
      <div className="hero-stage pin-stage bg-bg">
        {/* laptop: the frame keeps the shot's full height (headroom above the cap) with the bottle centre at 28vw;
            its right edge fades into the page. Phone: cover */}
        <img src={hero.poster} alt="" aria-hidden className="hero-media absolute inset-y-0 max-w-none object-cover" />
        <canvas ref={canvas} className="hero-media absolute inset-y-0" />

        {/* darkness veil (lifts as the light comes on) + a soft shade on the right so the headline reads */}
        <div className="hero-veil pointer-events-none absolute inset-0 bg-[#050403] opacity-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(270deg,rgba(13,11,10,0.5)_0%,rgba(13,11,10,0.1)_45%,transparent_60%)] max-md:bg-none" />

        {/* the light shaft that carries on across the headline: hangs from above the screen, wide and soft at its
            source, fading out toward the bottom (moved by the motion; hidden at rest) */}
        <div aria-hidden className="hero-beam-wrap pointer-events-none absolute inset-0 z-[1]">
          <div className="hero-beam absolute left-0 top-[-30vh] h-[150vh] w-[max(30vw,380px)] opacity-0" />
        </div>

        <div className="hero-copy absolute right-[6vw] top-1/2 z-[2] w-[min(42vw,640px)] -translate-y-1/2 max-md:inset-x-5 max-md:bottom-[5svh] max-md:top-auto max-md:w-auto max-md:translate-y-0">
          <p className="eyebrow hero-fade mb-7">{hero.eyebrow}</p>
          <h1 className="hero-h1 font-display h-xl relative" aria-label={plain(hero.lines)}>
            {hero.lines.map((l, i) => (
              <span key={i} className="block pb-[0.06em]" aria-hidden>
                <BeamLine text={l} />
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-8 max-w-[34ch] text-[15px] leading-relaxed text-muted">{hero.sub}</p>
        </div>

        {/* X1: darkens while the statement slides up over the hero */}
        <div aria-hidden className="hero-dim pointer-events-none absolute inset-0 z-[3] bg-[#0d0b0a] opacity-0" />

        <p className="hero-hint label absolute bottom-8 left-1/2 z-[2] -translate-x-1/2 text-muted max-md:hidden">{hero.hint}</p>
      </div>
    </section>
  );
}
