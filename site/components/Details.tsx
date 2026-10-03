"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onSiteReady } from "@/lib/loading";

// Round 4 details. Each one works on hover and also plays once by itself while on screen (nobody touches the mouse on
// camera). Calm, no bounce.
//   [data-magnet]     magnetic: pulls gently toward the pointer; hands-free: one small drift and back
//   .swing            blotter strips swing from their top edge (CSS); hands-free: once when they come on screen
//   [data-flip]       the collection tag flips 100 ml ↔ 50 ml (CSS on hover); hands-free: flips once and back
//   .underline-once   amber underline draws itself once when it comes on screen (and stays)
//   record holds      ?record=1: during each hold the section's main visual pushes in 1.00 → 1.02 (never a frozen
//                     frame): the stop's data-hold-push selector (searched in its section), or the collection slide
//                     named by data-rec-slide
// The bag count bump lives in ScentRail ("bag:add"), the hands-free "Add to bag" in GlassCollection.
// ?static=1: underlines are drawn, nothing moves.

function onceVisible(els: Element[], fn: (el: HTMLElement) => void, threshold = 0.9) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        fn(e.target as HTMLElement);
      }),
    { threshold },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

export default function Details() {
  useEffect(() => {
    const underlines = Array.from(document.querySelectorAll(".underline-once"));
    if (prefersReducedMotion()) {
      underlines.forEach((u) => u.classList.add("is-drawn"));
      return;
    }
    const offs: (() => void)[] = [];

    // record-mode holds: a slow push-in on the held section's main visual, easing back as the page moves on
    const onHold = (e: Event) => {
      const stop = e.target as HTMLElement;
      const hold = (e as CustomEvent<{ duration: number }>).detail?.duration ?? 0.5;
      const section = stop.closest("section") ?? stop;
      let target: HTMLElement | null = null;
      if (stop.dataset.recSlide !== undefined) target = section.querySelectorAll<HTMLElement>(".glass-slide")[Number(stop.dataset.recSlide)] ?? null;
      else if (stop.dataset.holdPush) target = section.querySelector<HTMLElement>(stop.dataset.holdPush);
      if (!target) return;
      gsap
        .timeline()
        .to(target, { scale: 1.02, duration: hold + 0.35, ease: "sine.out" })
        .to(target, { scale: 1, duration: 2.2, ease: "sine.inOut" });
    };
    window.addEventListener("record:hold", onHold);
    offs.push(() => window.removeEventListener("record:hold", onHold));

    const setup = () => {
      // magnetic buttons
      const hover = window.matchMedia("(hover: hover)").matches;
      document.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
        if (!hover) return;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.6, ease: "power3.out" });
        };
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        offs.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
      offs.push(
        onceVisible(Array.from(document.querySelectorAll("[data-magnet]")), (el) =>
          gsap
            .timeline({ delay: 0.5 })
            .to(el, { x: 6, y: -4, duration: 0.5, ease: "sine.inOut" })
            .to(el, { x: -4, y: 2, duration: 0.5, ease: "sine.inOut" })
            .to(el, { x: 0, y: 0, duration: 0.6, ease: "sine.out" }),
        ),
      );

      // blotter swing, once by itself
      offs.push(onceVisible(Array.from(document.querySelectorAll(".swing")), (el) => el.classList.add("is-swung")));

      // price flip 100 ml ↔ 50 ml, once by itself
      offs.push(
        onceVisible(
          Array.from(document.querySelectorAll("[data-flip]")),
          (el) => {
            gsap.delayedCall(0.6, () => el.classList.add("is-flipped"));
            gsap.delayedCall(2.2, () => el.classList.remove("is-flipped"));
          },
          1,
        ),
      );

      // underline draws itself once
      offs.push(onceVisible(underlines, (el) => gsap.delayedCall(0.3, () => el.classList.add("is-drawn")), 1));
    };

    const off = onSiteReady(setup);
    return () => {
      off();
      offs.forEach((o) => o());
    };
  }, []);

  return null;
}
