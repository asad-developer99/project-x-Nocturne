"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * True only when the page is opened with ?static=1 (layout review).
 * The OS "reduce motion" setting is deliberately NOT honoured here: this is a
 * scroll-driven showcase, and on many Windows machines that setting is on by
 * default, which made the live site open as a flat static page.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("static");

export { gsap, ScrollTrigger };
