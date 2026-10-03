"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";

// Round 3 transitions between sections (X codes in docs/MOTION-MENU.md; the plan is under the Motion map in
// site/DESIGN.md). Each one is scrubbed with the scroll. ?static=1: nothing runs.
//   hero → statement   X1 the statement slides up over the pinned hero, which dims under it
//   statement → drop   X5 hard cut (in TheDrop: the drop is already falling as the edge arrives)
//   every meniscus     X3 the liquid-surface edge flattens as it passes (drop → ticker, collection → wrist, finder → gifting)
//   ticker → glass     X2 the Noir glow washes in before the glass arrives
//   glass → wrist      X1 the wrist slides over the pinned last glass, which dims (laptop)
//   wrist → sizes      X2 the mist's amber becomes the ledge light
//   gifting → reviews  X2 a warm wash rises behind the strips
//   reviews → closing  X4 zoom-through: the rainy window arrives zoomed in and settles as it fills the screen

const CURVE = "M0 70 Q500 -10 1000 70";
const FLAT = "M0 70 Q500 46 1000 70";

export default function Transitions() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;

    const setup = () => {
      ctx = gsap.context(() => {
        const scrub = (trigger: string | Element, start: string, end: string) => ({ trigger, start, end, scrub: true });

        // X1 hero → statement
        gsap.fromTo(".hero-dim", { opacity: 0 }, { opacity: 0.7, ease: "none", scrollTrigger: scrub(".statement", "top bottom", "top 35%") });

        // X3 every meniscus edge flattens as it passes
        gsap.utils.toArray<HTMLElement>(".meniscus").forEach((m) => {
          const tl = gsap.timeline({ scrollTrigger: scrub(m, "top 95%", "top 25%") });
          tl.fromTo(m.querySelector(".men-line"), { attr: { d: CURVE } }, { attr: { d: FLAT }, ease: "none" }, 0);
          tl.fromTo(m.querySelector(".men-body"), { attr: { d: `M0 100 L0 70 Q500 -10 1000 70 L1000 100 Z` } }, { attr: { d: `M0 100 L0 70 Q500 46 1000 70 L1000 100 Z` }, ease: "none" }, 0);
          tl.fromTo(m.querySelector(".men-glow"), { attr: { d: `${CURVE} L1000 100 L0 100 Z` } }, { attr: { d: `${FLAT} L1000 100 L0 100 Z` }, ease: "none" }, 0);
        });

        // X2 ticker → collection: the Noir glow washes in before the glass arrives
        gsap.fromTo(".glass-slide:first-child .glass-glow", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: scrub("#glass", "top bottom", "top top") });

        // X1 collection → wrist (laptop only: that is where the collection is pinned)
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px)", () => {
          gsap.fromTo(".glass-dim", { opacity: 0 }, { opacity: 0.65, ease: "none", scrollTrigger: scrub(".wrist", "top bottom", "top 30%") });
        });

        // X2 wrist → sizes, gifting → reviews: warm washes rise as the sections arrive
        gsap.fromTo(".sizes-wash", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: scrub(".sizes", "top bottom", "top 25%") });
        gsap.fromTo(".reviews-wash", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: scrub(".reviews", "top bottom", "top 20%") });

        // X4 reviews → closing: the window arrives zoomed in and settles as it fills the screen
        gsap.fromTo(".closing .closing-img", { scale: 1.28 }, { scale: 1, ease: "none", scrollTrigger: scrub(".closing", "top bottom", "top top") });
      });
      ScrollTrigger.refresh();
    };

    const off = onSiteReady(setup);
    return () => {
      off();
      ctx?.revert();
    };
  }, []);

  return null;
}
