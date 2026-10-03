"use client";

import { useEffect, useRef } from "react";
import { drawFit, getManifest, loadFrames, type FrameManifest } from "@/lib/frames";
import { loading } from "@/lib/loading";

/**
 * Site copy of the engine's useFramePlayer that BLENDS between frames: `seek(0..1)` lands between two frames, the
 * nearer-earlier one is drawn and the next one is drawn on top with opacity = the fraction between them. So playback
 * is smooth at any scroll / record speed (no frame sits on screen while the scroll creeps on). It redraws whenever
 * the position changes, not only when the frame index does.
 * If `blockLoader` is true, the intro loader waits for the first ~30 frames.
 */
export function useBlendFramePlayer(
  folder: string,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  { fit = "cover", blockLoader = false }: { fit?: "cover" | "contain"; blockLoader?: boolean } = {},
) {
  const progress = useRef(0);
  const api = useRef<{ seek: (p: number) => void }>({ seek: (p) => (progress.current = p) });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const taskId = `frames:${folder}`;
    if (blockLoader) loading.register(taskId);

    let manifest: FrameManifest | null = null;
    let player: ReturnType<typeof loadFrames> | null = null;
    let lastPos = -1;
    let lastA: HTMLImageElement | undefined;
    let lastB: HTMLImageElement | undefined;
    let raf = 0;
    let dirty = true;
    let cancelled = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      dirty = true;
    };

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!manifest || !player) return;
      const pos = Math.min(1, Math.max(0, progress.current)) * (manifest.count - 1);
      const i = Math.floor(pos);
      const frac = pos - i;
      const a = player.get(i);
      if (!a) return;
      const b = frac > 0.002 && i + 1 < manifest.count ? player.get(i + 1) : undefined;
      if (!dirty && Math.abs(pos - lastPos) < 0.001 && a === lastA && b === lastB) return;
      ctx.globalAlpha = 1;
      drawFit(ctx, a, canvas.width, canvas.height, fit);
      if (b && b !== a) {
        // draw the next frame over it (drawFit clears first, so draw by hand at the same fit)
        const ir = b.naturalWidth / b.naturalHeight;
        const cr = canvas.width / canvas.height;
        let dw = canvas.width;
        let dh = canvas.height;
        if (fit === "cover" ? cr > ir : cr < ir) dh = canvas.width / ir;
        else dw = canvas.height * ir;
        ctx.globalAlpha = frac;
        ctx.drawImage(b, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
        ctx.globalAlpha = 1;
      }
      lastPos = pos;
      lastA = a;
      lastB = b;
      dirty = false;
    };

    api.current.seek = (p: number) => {
      progress.current = p;
    };

    getManifest(folder)
      .then((m) => {
        if (cancelled) return;
        manifest = m;
        const needed = Math.min(30, m.count);
        player = loadFrames(folder, m, (loaded) => {
          if (blockLoader) loading.update(taskId, loaded / needed);
          dirty = true;
        });
      })
      .catch((err) => {
        console.warn(err.message);
        if (blockLoader) loading.update(taskId, 1);
      });

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(render);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      player?.cancel();
    };
  }, [folder, canvasRef, fit, blockLoader]);

  return api;
}
