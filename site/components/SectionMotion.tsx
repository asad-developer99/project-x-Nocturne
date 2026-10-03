"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";

// Round 3 section motion: each section's own Motion map code (site/DESIGN.md). All of it plays by itself while on
// screen or follows the scroll (nothing needs hover or clicks). Phones use each code's fallback. ?static=1: nothing
// here runs, so every section shows its final state.
//   Statement M6 · Ticker M14 · Sizes M26 · Finder M21 · Gifting M34 · Reviews M32 · Closing M37 · Footer M12
// (Hero M20, Drop M16, Collection M5, Loader M3 live in their own components; Wrist M15 in MistCanvas; Nav M24 in
// ScentRail.)

export default function SectionMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let mm: gsap.MatchMedia | undefined;
    const killers: (() => void)[] = [];

    const setup = () => {
      mm = gsap.matchMedia();
      mm.add({ laptop: "(min-width: 768px)", phone: "(max-width: 767px)" }, (c) => {
        const { laptop } = c.conditions as { laptop: boolean };

        // ---------- Statement · M6 text rise from blur: words float up out of a blur, one after another ----------
        const words = gsap.utils.toArray<HTMLElement>(".statement .st-word");
        if (laptop) {
          gsap.fromTo(
            words,
            { y: 44, opacity: 0, filter: "blur(10px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out", stagger: 0.07, scrollTrigger: { trigger: ".statement", start: "top 55%", once: true } },
          );
        } else {
          gsap.fromTo(".statement .st-word", { y: 24, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power2.out", scrollTrigger: { trigger: ".statement", start: "top 60%", once: true } });
        }
        gsap.fromTo(".statement .st-line", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut", delay: 0.8, scrollTrigger: { trigger: ".statement", start: "top 55%", once: true } });

        // ---------- Ticker · M14 marquee: scrolling speeds it up (smoothly back to its idle pace) ----------
        const track = document.querySelector<HTMLElement>(".ticker-track");
        const anim = track?.getAnimations()[0];
        if (anim) {
          const rate = { v: 1 };
          const st = ScrollTrigger.create({
            trigger: track,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
              const target = 1 + Math.min(5, Math.abs(self.getVelocity()) / 350);
              gsap.to(rate, { v: target, duration: 0.3, overwrite: true, onUpdate: () => (anim.playbackRate = rate.v) });
              gsap.to(rate, { v: 1, duration: 1.2, delay: 0.3, ease: "power2.out", onUpdate: () => (anim.playbackRate = rate.v) });
            },
          });
          killers.push(() => st.kill());
        }

        // ---------- Sizes · M26 progress fill: the amber rises in each bottle, 10 → 50 → 100 → 200 ml ----------
        const liquids = gsap.utils.toArray<SVGRectElement>(".sizes .liquid");
        const lines = gsap.utils.toArray<SVGRectElement>(".sizes .liquid-line");
        const sizeLabels = gsap.utils.toArray<HTMLElement>(laptop ? ".sizes .size-label-lg" : ".sizes .size-label-sm");
        const fill = gsap.timeline({ scrollTrigger: { trigger: ".sizes", start: "top 70%", end: "center 45%", scrub: 0.6 } });
        liquids.forEach((l, i) => {
          const at = i * 0.18;
          fill.fromTo(l, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.5, ease: "power1.inOut" }, at);
          fill.fromTo(lines[i], { y: 110 }, { y: 0, duration: 0.5, ease: "power1.inOut" }, at);
          if (sizeLabels[i]) fill.fromTo(sizeLabels[i], { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, at + 0.25);
        });

        // ---------- Finder · M21 typewriter: questions type themselves, answers get picked, the result types out ----------
        const finder = document.querySelector<HTMLElement>(".finder");
        if (finder) {
          const texts = gsap.utils.toArray<HTMLElement>(".finder .type-text");
          const full = texts.map((t) => t.dataset.text || t.textContent || "");
          const picks = gsap.utils.toArray<HTMLElement>(".finder .chip[data-pick]");
          const card = finder.querySelector(".finder-card");
          const caret = document.createElement("span");
          caret.className = "caret";
          caret.setAttribute("aria-hidden", "true");
          finder.querySelectorAll(".caret").forEach((c) => c.remove());
          texts.forEach((t) => (t.textContent = ""));
          picks.forEach((p) => p.classList.remove("is-picked"));
          gsap.set(card, { opacity: 0, y: 30, filter: "blur(8px)" });

          const tl = gsap.timeline({ paused: true });
          texts.forEach((t, i) => {
            const obj = { n: 0 };
            tl.add(() => t.after(caret));
            tl.to(obj, {
              n: full[i].length,
              duration: full[i].length * (i < 3 ? (laptop ? 0.015 : 0.011) : laptop ? 0.04 : 0.03),
              ease: "none",
              onUpdate: () => (t.textContent = full[i].slice(0, Math.round(obj.n))),
            });
            if (picks[i]) tl.add(() => picks[i].classList.add("is-picked"), "+=0.1").to({}, { duration: 0.18 });
            if (i === 2) tl.to(card, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }, "+=0.05");
          });
          // phones: the finder is tall, so it starts as soon as it enters and types faster (done while still on screen)
          const st = ScrollTrigger.create({ trigger: finder, start: laptop ? "top 80%" : "top bottom", once: true, onEnter: () => tl.play() });
          killers.push(() => {
            st.kill();
            tl.kill();
            caret.remove();
            texts.forEach((t, i) => (t.textContent = full[i]));
            picks.forEach((p) => p.classList.add("is-picked"));
          });
        }

        // ---------- Gifting · M34 snap-in tiles: tiles fly in from different sides and lock into the bento ----------
        const tiles = gsap.utils.toArray<HTMLElement>(".gifting .gift-tile");
        const from = laptop
          ? [
              { x: -140, y: 60, rotation: -4 },
              { x: 120, y: -90, rotation: 5 },
              { x: 160, y: 40, rotation: -6 },
              { x: 60, y: 140, rotation: 4 },
              { x: 180, y: 120, rotation: -3 },
            ]
          : tiles.map(() => ({ x: 0, y: 70, rotation: 0 }));
        tiles.forEach((t, i) =>
          gsap.fromTo(t, { ...from[i % from.length], opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: i * 0.08, scrollTrigger: { trigger: ".gift-grid", start: "top 78%", once: true } }),
        );

        // ---------- Reviews · M32 masonry drift: the three columns move at different speeds, up / down / up ----------
        if (laptop) {
          const amounts = [-70, 60, -110];
          gsap.utils.toArray<HTMLElement>(".reviews .review-col").forEach((col, i) =>
            gsap.fromTo(col, { y: -amounts[i] }, { y: amounts[i], ease: "none", scrollTrigger: { trigger: ".reviews", start: "top bottom", end: "bottom top", scrub: true } }),
          );
        } else {
          gsap.utils.toArray<HTMLElement>(".reviews .review-strip").forEach((s) =>
            gsap.fromTo(s, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s, start: "top 88%", once: true } }),
          );
        }

        // ---------- Closing · M37 breathing light: the city lights and the glow on the bottle brighten and dim ----------
        const breathe = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
        breathe.fromTo(".closing .city-glow", { opacity: 0.35 }, { opacity: 1, duration: 4, ease: "sine.inOut" }, 0);
        breathe.fromTo(".closing .bottle-glow", { opacity: 1 }, { opacity: 0.4, duration: 4, ease: "sine.inOut" }, 0);
        const bst = ScrollTrigger.create({ trigger: ".closing", start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? breathe.play() : breathe.pause()) });
        killers.push(() => {
          bst.kill();
          breathe.kill();
        });
        // supporting: the closing line slides up line by line
        gsap.fromTo(".closing .line-inner", { yPercent: 105 }, { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.14, scrollTrigger: { trigger: ".closing", start: "top 45%", once: true } });
        gsap.fromTo(".closing .closing-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.4, scrollTrigger: { trigger: ".closing", start: "top 45%", once: true } });

        // ---------- Footer · M12 letters rise out of their masks, the last "e" with an amber glint ----------
        const letters = gsap.utils.toArray<HTMLElement>(".foot-letter");
        const footTl = gsap.timeline({ scrollTrigger: { trigger: ".foot-word", start: "top 92%", once: true } });
        if (laptop) {
          footTl.fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.06 });
        } else {
          footTl.fromTo(".foot-word", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out" });
        }
        footTl.fromTo(letters[letters.length - 1], { textShadow: "0 0 0px rgba(233,160,76,0)" }, { textShadow: "0 0 34px rgba(233,160,76,0.7)", duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, "-=0.3");
      });
      ScrollTrigger.refresh();
    };

    const off = onSiteReady(setup);
    return () => {
      off();
      killers.forEach((k) => k());
      mm?.revert();
    };
  }, []);

  return null;
}
