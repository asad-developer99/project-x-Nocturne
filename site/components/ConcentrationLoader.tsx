"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { loading } from "@/lib/loading";
import { atFromUrl, waitForClock } from "@/lib/atTime";
import { getManifest, frameUrl } from "@/lib/frames";
import { drop, hero, loader } from "../content";

// Loader (Motion map M3 number counter roll). The engine loader is off (meta.loader = false).
// On smoke black, "22% · extrait" rolls up digit by digit like an odometer under the brand note, a thin amber line
// fills, then the digits blur into smoke and the overlay dissolves onto the (dark) hero.
// Always LOADER_SECONDS when every hero and drop frame is loaded (so real scrolling never waits for a frame); on a slow
// connection it waits at most HOLD_MAX more, while a soft amber glow keeps breathing behind the number (never a
// frozen frame).
// With &at=HH:MM:SS it holds its first frame and plays at that time.

const ROLL = 1.6;
const OUT = 0.9;
const HOLD_MAX = 9;
export const LOADER_SECONDS = ROLL + OUT; // 2.5

let revealed = false;

/** Loads every frame of a sequence into the browser cache (the frame players then draw from it). */
async function preloadFrames(folder: string) {
  try {
    const m = await getManifest(folder);
    const urls = Array.from({ length: m.count }, (_, i) => frameUrl(folder, m, i));
    let next = 0;
    const worker = async () => {
      while (next < urls.length) {
        const url = urls[next++];
        await new Promise<void>((done) => {
          const img = new Image();
          img.onload = img.onerror = () => done();
          img.src = url;
        });
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
  } catch {
    // no manifest: nothing to wait for
  }
}

/** Runs when the loader starts dissolving (immediately if it already has, or with ?static=1). */
export function onReveal(fn: () => void) {
  if (revealed) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("nocturne:reveal", h, { once: true });
  return () => window.removeEventListener("nocturne:reveal", h);
}

function reveal() {
  if (revealed) return;
  revealed = true;
  window.dispatchEvent(new Event("nocturne:reveal"));
}

const CYCLES = 2; // each column holds 0–9 this many times + the final digit, so it really rolls

function DigitColumn({ digit }: { digit: number }) {
  const cells = [...Array.from({ length: CYCLES * 10 }, (_, i) => i % 10), digit];
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top leading-none">
      <span className="ld-col block" data-final={cells.length - 1}>
        {cells.map((d, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function ConcentrationLoader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setGone(true);
      reveal();
      loading.markFinished();
    };
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    window.scrollTo(0, 0);

    const target = atFromUrl();
    let heroReady = false;
    let allFrames = false;
    const unsub = loading.subscribe((_, done) => {
      if (done) heroReady = true;
    });
    Promise.all([preloadFrames(hero.frames), preloadFrames(drop.frames)]).then(() => (allFrames = true));
    const framesReady = () => heroReady && allFrames;
    let cancelClock = () => {};

    const el = root.current!;
    const ctx = gsap.context(() => {
      const cols = gsap.utils.toArray<HTMLElement>(".ld-col");
      // always something alive: an elliptical light turns slowly and steadily behind the number (a steady rotation
      // never pauses, unlike a breathing loop) and the number slowly comes closer for the whole loader
      const glow = gsap.fromTo(".ld-glow", { rotation: 0 }, { rotation: 360, duration: 6, ease: "none", repeat: -1 });
      gsap.fromTo(".ld-figure", { scale: 0.97 }, { scale: 1.03, duration: LOADER_SECONDS + HOLD_MAX, ease: "none" });
      const tl = gsap.timeline({ paused: !!target, onComplete: () => glow.kill() });
      // columns start at 0 and roll to their final cell (right column rolls a little longer, like an odometer)
      cols.forEach((c, i) => {
        const n = Number(c.dataset.final);
        tl.fromTo(c, { yPercent: 0 }, { yPercent: (-100 * n) / (n + 1), duration: ROLL - 0.25 + i * 0.12, ease: "power3.inOut" }, 0.05);
      });
      tl.fromTo(".ld-unit", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, ROLL - 0.55)
        .fromTo(".ld-label", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }, ROLL - 0.5)
        .fromTo(".ld-note", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.1)
        .fromTo(".ld-line", { scaleX: 0 }, { scaleX: 1, duration: ROLL, ease: "power2.inOut" }, 0)
        // hold here until the hero frames are in
        .add(() => {
          const t0 = performance.now();
          const ok = () => framesReady() || performance.now() - t0 > HOLD_MAX * 1000;
          if (ok()) return;
          tl.pause();
          const wait = () => (ok() ? tl.play() : requestAnimationFrame(wait));
          wait();
        }, ROLL - 0.05)
        .add(reveal, ROLL)
        // the number blurs into smoke and drifts up; the overlay dissolves onto the dark hero
        .to(".ld-figure", { filter: "blur(18px)", opacity: 0, y: -40, duration: OUT, ease: "power2.in" }, ROLL)
        .to([".ld-note", ".ld-line-wrap"], { opacity: 0, duration: OUT * 0.6 }, ROLL)
        .to(el, { opacity: 0, duration: OUT * 0.7, ease: "power1.inOut" }, ROLL + OUT * 0.3)
        .add(() => {
          loading.markFinished();
          setGone(true);
        }, LOADER_SECONDS + 0.05);

      if (target) {
        if (Date.now() < target.getTime()) console.log(`[record] loader frozen until ${target.toLocaleTimeString()}`);
        cancelClock = waitForClock(target, () => tl.play(0));
      }
    }, el);

    return () => {
      unsub();
      cancelClock();
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  const digits = String(loader.value).split("").map(Number);

  return (
    <div ref={root} data-loader aria-hidden className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0d0b0a] text-[#ece2d0]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="ld-glow h-[60vmax] w-[60vmax] bg-[radial-gradient(ellipse_50%_20%_at_50%_50%,rgba(233,160,76,0.22),transparent_70%)]" />
      </div>
      <p className="ld-note label relative mb-8 text-[#a39684]">{loader.note}</p>
      <div className="ld-figure font-display relative flex items-baseline gap-[0.18em] text-[clamp(88px,13vw,210px)] leading-none">
        <span className="flex">
          {digits.map((d, i) => (
            <DigitColumn key={i} digit={d} />
          ))}
          <span className="ld-unit leading-none">{loader.unit}</span>
        </span>
        <span className="ld-label text-[0.36em] italic text-[color:var(--amber-soft)]">· {loader.label}</span>
      </div>
      <div className="ld-line-wrap relative mt-10 h-px w-[min(260px,50vw)] bg-[#2a241e]">
        <div className="ld-line h-full origin-left bg-[linear-gradient(90deg,transparent,#e9a04c)]" />
      </div>
    </div>
  );
}
