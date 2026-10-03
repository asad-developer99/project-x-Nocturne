"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { collection } from "../content";
import { Lines, plain } from "./Rich";
import Blotter from "./Blotter";

// The collection (Motion map M5 mask wipe, diagonal and light-edged). Laptop: pinned 300vh; the three glass slides
// lie on top of each other (same bottle, same framing, same vignette) and a slanted polygon() wipe, led by a bright
// band of light (.glass-edge), crosses the screen left → right to uncover the next glass: Noir → Ambre → Velours.
// Each slide carries its own glow, so the page glow turns burgundy only for Velours.
// Phone: pinned too; the light falls top → down over the same bottle position (one bottle on screen at a time).
// ?static=1: the three slides stacked.

const TILT = 12; // % of the width the edge leans over the full height
const WIPES = [
  [0.03, 0.4],
  [0.5, 0.88],
] as const; // scroll progress for Ambre, Velours (short gaps: no stretch of scroll where nothing changes)

/** clip-path showing what lies left of the slanted edge whose top is at e% (bottom at e − TILT %). */
const clip = (e: number) => `polygon(-20% 0%, ${e}% 0%, ${e - TILT}% 100%, -20% 100%)`;
const E_FROM = -2;
const E_TO = 100 + TILT + 2;
/** phone: the same light wipe, falling top → down (so text is never cut at the side of the screen) */
const clipDown = (e: number) => `polygon(-5% -20%, 105% -20%, 105% ${e}%, -5% ${e - 8}%)`;

/** "Add to bag" by itself (once, for filming) or by a click: the button presses, says "Added", the bag bumps. */
function addToBag(btn: HTMLButtonElement | null) {
  if (!btn) return;
  const label = btn.querySelector<HTMLElement>(".btn-label");
  const done = btn.querySelector<HTMLElement>(".btn-done");
  gsap
    .timeline()
    .to(btn, { scale: 0.95, duration: 0.14, ease: "power2.out" })
    .to(btn, { scale: 1, duration: 0.5, ease: "power3.out" })
    .to(label, { yPercent: -110, opacity: 0, duration: 0.35, ease: "power2.in" }, 0.1)
    .fromTo(done, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.3)
    .to(done, { yPercent: -110, opacity: 0, duration: 0.35, ease: "power2.in" }, 2.1)
    .to(label, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 2.3);
  window.dispatchEvent(new CustomEvent("bag:add"));
}

export default function GlassCollection() {
  const outer = useRef<HTMLElement>(null);
  const g = collection.glasses;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = outer.current!;
    const mm = gsap.matchMedia();

    mm.add({ laptop: "(min-width: 1024px)", phone: "(max-width: 1023px)" }, (c) => {
      const { laptop } = c.conditions as { laptop: boolean };
      const stage = root.querySelector<HTMLElement>(".glass-stage")!;
      const all = gsap.utils.toArray<HTMLElement>(".glass-slide", root);
      const slides = all.slice(1);
      const edges = gsap.utils.toArray<HTMLElement>(".glass-edge", root);

      // laptop: a slanted edge sweeping left → right, led by a band of light; phone: the light falls top → down
      // (the same glass position, so only one bottle is ever on screen)
      const place = (i: number, e: number) => {
        if (!laptop) {
          slides[i].style.clipPath = clipDown(e);
          return;
        }
        const W = stage.clientWidth;
        const H = stage.clientHeight;
        slides[i].style.clipPath = clip(e);
        // the light band sits on the edge line (its centre at mid-height is at e − TILT/2 %), slanted with it
        const skew = (-Math.atan((TILT / 100) * (W / H)) * 180) / Math.PI;
        const x = ((e - TILT / 2) / 100) * W - edges[i].offsetWidth / 2;
        edges[i].style.transform = `translateX(${x}px) skewX(${skew}deg)`;
      };
      const from = laptop ? E_FROM : -2;
      const to = laptop ? E_TO : 110;
      slides.forEach((_, i) => place(i, from));

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.7, invalidateOnRefresh: true },
      });
      tl.to({}, { duration: 1 }, 0);
      // a very slow push-in across the whole pin, so any scroll inside it shows some motion
      tl.fromTo(stage, { scale: 1 }, { scale: 1.03, duration: 1, ease: "none" }, 0);
      WIPES.forEach(([a, b], i) => {
        const p = { e: from };
        tl.to(p, { e: to, duration: b - a, ease: "power1.inOut", onUpdate: () => place(i, p.e) }, a);
        if (laptop) {
          tl.fromTo(edges[i], { opacity: 0 }, { opacity: 1, duration: 0.04 }, a);
          tl.to(edges[i], { opacity: 0, duration: 0.05 }, b - 0.05);
        }
        // the words never mix ("Velibre"): the old glass's name, line and notes fade out before the light edge
        // reaches them, the new ones fade in only after it has passed, and the new name settles in from the left
        const d = b - a;
        const inAt = laptop ? 0.7 : 0.8;
        const oldSwap = all[i].querySelectorAll(".swap");
        const newSwap = slides[i].querySelectorAll(".swap");
        tl.fromTo(oldSwap, { opacity: 1 }, { opacity: 0, duration: d * 0.22, ease: "power1.in", immediateRender: false }, a + d * 0.12);
        tl.fromTo(newSwap, { opacity: 0 }, { opacity: 1, duration: d * 0.18, ease: "power1.out" }, a + d * inAt);
        tl.fromTo(slides[i].querySelector(".glass-name"), { x: -24 }, { x: 0, duration: d * 0.28, ease: "power2.out", immediateRender: false }, a + d * inAt);
      });

      // Velours: "Add to bag" plays once by itself after its glass has arrived (filming)
      let added = false;
      tl.call(() => {
        if (added) return;
        added = true;
        addToBag(root.querySelector<HTMLButtonElement>('[data-glass="velours"] [data-add-bag]'));
      }, [], WIPES[1][1] + 0.004);

      return () => slides.forEach((s) => (s.style.clipPath = ""));
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={outer} id="glass" className="glass-outer pin-outer relative z-[3] h-[300vh] bg-bg" data-record-time="1" data-record-hold="0.5" data-hold-push=".glass-slide" data-record-label="Collection">
      {/* record-mode stops inside the pin (Noir = the pin start, Ambre has wiped in, Velours has wiped in); the hold
          push-in (Details) acts on the slide named by data-rec-slide */}
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: 0 }} data-rec-slide="0" data-record-time="0" data-record-label="Collection: Noir" />
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `${WIPES[0][1] * 200 + 4}vh` }} data-rec-slide="1" data-record-time="2.2" data-record-hold="0.5" data-record-label="Collection: Ambre" />
      <div aria-hidden className="pointer-events-none absolute left-0 h-px w-px" style={{ top: `${WIPES[1][1] * 200 + 4}vh` }} data-rec-slide="2" data-record-time="2.2" data-record-hold="0.5" data-record-label="Collection: Velours" />
      <div className="glass-stage relative">
        {g.map((glass, i) => (
          <div key={glass.id} className="glass-slide flex items-center bg-bg max-lg:items-start max-lg:pt-[calc(56px+2svh)]" style={{ zIndex: i + 1 }} data-glass={glass.id}>
            {/* the slide's own light */}
            <div aria-hidden className="glass-glow pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse var(--gw) var(--gh) at var(--gx) var(--gy), ${glass.glow}80, transparent 70%)` }} />
            <div className="container-x relative grid w-full items-center gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
              {/* bottle: identical frame + vignette on all three; the price tag hangs just under the bottle */}
              <div className="glass-bottle relative mx-auto lg:w-[min(36vw,74vh*0.75)]">
                <img src={glass.image} alt={`Nocturne ${glass.name}, 100 ml`} className="glass-photo breathe aspect-[3/4] w-full object-cover" data-cursor="View" />
                {/* the tag hangs just under the bottle; it flips to the 50 ml price on hover (once by itself) */}
                <div className="glass-tag swing absolute left-[54%] top-[78%] w-[132px] rotate-[5deg] max-lg:left-1/2 max-lg:top-[82%] max-lg:-ml-[66px] max-lg:rotate-[3deg]" data-flip>
                  <div className="flip-card">
                    <Blotter className="flip-face !pb-6 !pt-3">
                      <p className="label">{glass.size}</p>
                      <p className="font-display mt-1 text-[24px] leading-none">{glass.price}</p>
                    </Blotter>
                    <Blotter className="flip-face flip-back !pb-6 !pt-3">
                      <p className="label">{glass.half.size}</p>
                      <p className="font-display mt-1 text-[24px] leading-none">{glass.half.price}</p>
                    </Blotter>
                  </div>
                </div>
              </div>

              {/* copy */}
              <div className="max-w-[520px] max-lg:mx-auto max-lg:w-full">
                <div className={i > 0 ? "glass-title-repeat" : undefined} aria-hidden={i > 0 || undefined}>
                  <p className="eyebrow max-lg:hidden">{collection.eyebrow}</p>
                  <h2 className="font-display h-md mt-6 max-lg:mt-0" aria-label={plain(collection.title)}>
                    <Lines lines={collection.title} />
                  </h2>
                </div>
                <div className="mt-12 flex items-baseline gap-5 border-t border-line pt-8 max-lg:mt-5 max-lg:pt-4">
                  <span className="swap label text-muted">{String(i + 1).padStart(2, "0")} / 03</span>
                  <h3 className="swap glass-name font-display text-[clamp(46px,5vw,84px)] italic leading-none" style={{ color: i === 2 ? "#e7a3ad" : undefined }}>
                    {glass.name}
                  </h3>
                </div>
                <p className="swap mt-5 text-[17px] leading-relaxed text-fg">{glass.mood}</p>
                <p className="glass-notes swap label mt-4 leading-loose text-muted">{glass.notes}</p>
                <div className="mt-9 flex flex-wrap items-center gap-6 max-lg:mt-5">
                  <span data-magnet className="inline-block">
                    <button className="btn btn-solid" data-add-bag onClick={(e) => addToBag(e.currentTarget)}>
                      <span className="relative block overflow-hidden">
                        <span className="btn-label block">Add to bag · {glass.price}</span>
                        <span className="btn-done absolute inset-0 block text-center opacity-0">Added ✓</span>
                      </span>
                    </button>
                  </span>
                  <div className="flex items-center gap-3" aria-label="Glass colours">
                    {g.map((c, k) => (
                      <span
                        key={c.id}
                        title={c.name}
                        className={`block h-4 w-4 rounded-full border ${k === i ? "border-[var(--ivory)] ring-2 ring-[rgba(236,226,208,0.25)] ring-offset-2 ring-offset-[#0d0b0a]" : "border-[rgba(236,226,208,0.3)]"}`}
                        style={{ background: c.chip }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* X1: darkens while the next section slides over the pinned last glass */}
        <div aria-hidden className="glass-dim pointer-events-none absolute inset-0 z-[6] bg-[#0d0b0a] opacity-0 max-lg:hidden" />
        {/* the bands of light that lead the two wipes (outside the clipped slides, so they straddle the edge) */}
        {[1, 2].map((k) => (
          <div key={k} aria-hidden className="glass-edge pointer-events-none absolute inset-y-[-10%] left-0 z-[5] w-[300px] opacity-0 max-lg:hidden" />
        ))}
      </div>
    </section>
  );
}
