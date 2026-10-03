"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { rail } from "../content";

// Nav N6 "left vertical rail" (Motion map M24 outline to fill). "Nocturne" stands vertically in outline letters that
// fill with amber as you read down the page (the rail is the progress bar); five chapter marks; the bag at the foot.
// Top right: an ivory "Shop" pill. Phone: a slim top bar (the wordmark fills left → right) + a full-screen menu.

export default function ScentRail() {
  const root = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [bag, setBag] = useState(0);

  // "Add to bag" anywhere (a click, or the collection's hands-free add): the count goes up and bumps
  useEffect(() => {
    const add = () => {
      setBag((b) => b + 1);
      const counts = root.current?.querySelectorAll(".bag-count");
      if (!counts) return;
      gsap
        .timeline()
        .to(counts, { scale: 1.7, backgroundColor: "#e9a04c", duration: 0.22, ease: "power2.out" })
        .to(counts, { scale: 1, backgroundColor: "#ece2d0", duration: 0.6, ease: "power3.out" });
    };
    window.addEventListener("bag:add", add);
    return () => window.removeEventListener("bag:add", add);
  }, []);

  // page progress → --p (0..1) on the rail and the phone bar
  useEffect(() => {
    const el = root.current!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      // the Shop pill steps aside while a strip marked data-hide-pill (the ticker) passes under it
      const under = Array.from(document.querySelectorAll<HTMLElement>("[data-hide-pill]")).some((s) => {
        const r = s.getBoundingClientRect();
        return r.top < 96 && r.bottom > 0;
      });
      pill.current?.classList.toggle("is-away", under);
      // the chapter mark of the section in the middle of the screen lights up
      let active = "";
      for (const c of rail.chapters) {
        const sec = document.getElementById(c.id);
        if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.5) active = c.id;
      }
      el.querySelectorAll<HTMLElement>(".rail-mark").forEach((m) => m.classList.toggle("is-active", m.dataset.chapter === active));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <div ref={root}>
      {/* ---------- laptop: the rail ---------- */}
      <nav aria-label="Main" className="rail fixed inset-y-0 left-0 z-50 hidden w-[var(--rail-w)] flex-col items-center justify-between border-r border-[rgba(236,226,208,0.08)] bg-[linear-gradient(90deg,rgba(13,11,10,0.72),rgba(13,11,10,0.2))] py-7 backdrop-blur-[2px] lg:flex">
        <a href="#top" aria-label="Nocturne, back to top" className="font-display flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(236,226,208,0.3)] text-[20px] italic leading-none text-fg">
          n
        </a>

        <div className="rail-word font-display relative text-[46px] tracking-[0.04em]" data-cursor="Top">
          <span className="outline">Nocturne</span>
          <span className="fill" aria-hidden>
            Nocturne
          </span>
        </div>

        <ul className="flex flex-col items-center gap-5">
          {rail.chapters.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} data-chapter={c.id} className="rail-mark group flex flex-col items-center gap-2 text-[12px] tracking-[0.12em] text-muted transition-colors hover:text-fg">
                <span className="rail-dot block h-[5px] w-[5px] rounded-full bg-[rgba(236,226,208,0.35)] transition-[background-color,box-shadow] duration-500" />
                {c.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#sizes" aria-label={`Bag, ${bag} items`} className="relative flex h-10 w-10 items-center justify-center text-fg" data-cursor="Bag">
          <BagIcon />
          <span className="bag-count absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--ivory)] px-1 text-[12px] font-medium leading-none text-[var(--smoke)]">
            {bag}
          </span>
        </a>
      </nav>

      {/* top-right shop pill (laptop) */}
      <div ref={pill} data-magnet className="shop-pill fixed right-8 top-7 z-50 hidden transition-[opacity,transform] duration-500 lg:block [&.is-away]:pointer-events-none [&.is-away]:-translate-y-3 [&.is-away]:opacity-0">
        <a href="#glass" className="btn btn-outline !px-6 !py-3">
          Shop
        </a>
      </div>

      {/* ---------- phone: top bar ---------- */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[rgba(236,226,208,0.08)] bg-[rgba(13,11,10,0.7)] px-5 backdrop-blur-md lg:hidden">
        <a href="#top" className="bar-word font-display relative text-[26px] leading-none">
          <span className="outline">Nocturne</span>
          <span className="fill" aria-hidden>
            Nocturne
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a href="#sizes" aria-label={`Bag, ${bag} items`} className="relative text-fg">
            <BagIcon />
            <span className="bag-count absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--ivory)] px-1 text-[12px] leading-none text-[var(--smoke)]">{bag}</span>
          </a>
          <button onClick={() => setOpen(true)} className="label text-fg">
            Menu
          </button>
        </div>
      </div>

      {/* phone menu */}
      <div className={`fixed inset-0 z-[70] flex flex-col bg-[#0d0b0a] px-6 pb-10 pt-5 transition-[opacity,visibility] duration-500 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="flex items-center justify-between">
          <span className="font-display text-[26px] italic">nocturne</span>
          <button onClick={() => setOpen(false)} className="label text-fg">
            Close
          </button>
        </div>
        <ul className="mt-16 flex flex-col gap-4">
          {rail.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="font-display text-[44px] leading-none">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#glass" onClick={() => setOpen(false)} className="btn btn-solid mt-auto self-start">
          Shop Nocturne
        </a>
      </div>
    </div>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </svg>
  );
}
