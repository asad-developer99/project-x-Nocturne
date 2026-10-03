"use client";

import { useEffect } from "react";

/** Adds html.is-static for ?static=1 (after hydration, so React never sees a changed <html>). */
export default function SiteFlags() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("static")) document.documentElement.classList.add("is-static");
  }, []);
  return null;
}
