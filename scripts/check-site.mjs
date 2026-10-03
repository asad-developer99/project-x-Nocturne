#!/usr/bin/env node
// Checks that every image / video / frames folder used by the site (files in site/) exists.
//   npm run check
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f)) files.push(p);
  }
};
walk("site");
const src = files.map((f) => readFileSync(f, "utf8")).join("\n");
const paths = [...new Set([...src.matchAll(/["'(](\/(?:images|frames|videos)\/[^"')]+)["')]/g)].map((m) => m[1]))];
let ok = true;
for (const p of paths) {
  const isFrames = p.startsWith("/frames/");
  const target = isFrames ? join("public", p, "manifest.json") : join("public", p);
  if (existsSync(target)) console.log(`  ✓ ${p}`);
  else {
    ok = false;
    console.log(`  ✗ ${p}  ${isFrames ? "(no manifest.json — run: npm run frames -- <video> " + p.slice(1) + ")" : "(file missing)"}`);
  }
}
console.log(ok ? "\nAll assets found.\n" : "\nSome assets are missing.\n");
process.exit(ok ? 0 : 1);
