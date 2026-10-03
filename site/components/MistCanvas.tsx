"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

// "Wear it close" mist (Motion map M15 glow particles). A canvas over the whole section: fine amber mist leaves the
// atomizer in the photo (NOZZLE), sprays left over the wrist, slows, then lifts and drifts right across the gap
// toward the headline as it fades, like scent rising off skin. ~70 particles (20 on phones), additive glow, paused
// off screen. ?static=1: nothing drawn.

/** Nozzle position in wrist.webp (fractions of the photo). */
const NOZZLE = { x: 0.71, y: 0.47 };

type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; age: number; a: number };

export default function MistCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = ref.current!;
    const section = canvas.parentElement!;
    const photo = section.querySelector<HTMLImageElement>(".wrist-img");
    const ctx = canvas.getContext("2d")!;
    const phone = window.matchMedia("(max-width: 767px)").matches;
    const COUNT = phone ? 20 : 70;
    const parts: P[] = [];
    let dpr = 1;
    let w = 0;
    let h = 0;
    let nozzle = { x: 0, y: 0 };
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = section.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (photo) {
        const p = photo.getBoundingClientRect();
        nozzle = { x: p.left - r.left + p.width * NOZZLE.x, y: p.top - r.top + p.height * NOZZLE.y };
      }
    };

    const spawn = (p?: P): P => {
      const q = p ?? ({} as P);
      q.x = nozzle.x + (Math.random() - 0.5) * 8;
      q.y = nozzle.y + (Math.random() - 0.5) * 8;
      const speed = 120 + Math.random() * 220; // px/s, mostly to the left (the spray direction)
      const ang = Math.PI + (Math.random() - 0.5) * 0.5;
      q.vx = Math.cos(ang) * speed;
      q.vy = Math.sin(ang) * speed - 10;
      q.r = 0.8 + Math.random() * 2.4;
      q.life = 3.5 + Math.random() * 3;
      q.age = p ? 0 : Math.random() * q.life; // the first batch starts spread over its lives
      q.a = 0.45 + Math.random() * 0.5;
      return q;
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.age += dt;
        if (p.age > p.life) spawn(p);
        // the spray slows quickly, then the mist lifts and drifts right toward the headline
        p.vx *= 1 - 1.6 * dt;
        p.vy *= 1 - 1.6 * dt;
        p.vx += 26 * dt;
        p.vy -= 9 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = p.age / p.life;
        const alpha = p.a * Math.min(1, k * 6) * (1 - k);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,214,150,${alpha})`);
        g.addColorStop(1, "rgba(233,160,76,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    for (let i = 0; i < COUNT; i++) parts.push(spawn());
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(section);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="mist-canvas pointer-events-none absolute inset-0 z-[2] h-full w-full" />;
}
