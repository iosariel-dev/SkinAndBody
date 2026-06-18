#!/usr/bin/env node
/**
 * Shrink oversized WebP images in public/images/.
 * - Resize to max 1440px on the longer side (retina-ready for ~720px display).
 * - Re-encode at quality 78.
 * - Skips files already under MAX_EDGE and under SIZE_THRESHOLD.
 */
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const ROOT = new URL("../public/images", import.meta.url).pathname;
const MAX_EDGE = 1440;
const QUALITY = 78;
const SIZE_THRESHOLD = 80 * 1024; // only touch files >80KB

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "docs") continue;
      files.push(...(await walk(p)));
    } else if (extname(e.name).toLowerCase() === ".webp") {
      files.push(p);
    }
  }
  return files;
}

const files = await walk(ROOT);
let touched = 0, skipped = 0, savedKB = 0;

for (const f of files) {
  const s = await stat(f);
  if (s.size < SIZE_THRESHOLD) {
    skipped++;
    continue;
  }
  const img = sharp(f, { failOn: "none" });
  const meta = await img.metadata();
  const maxEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (maxEdge <= MAX_EDGE && s.size < 2 * SIZE_THRESHOLD) {
    skipped++;
    continue;
  }
  const tmp = f + ".tmp";
  await img
    .resize({
      width: meta.width > meta.height ? MAX_EDGE : undefined,
      height: meta.height >= meta.width ? MAX_EDGE : undefined,
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(tmp);
  const newSize = (await stat(tmp)).size;
  if (newSize < s.size) {
    await unlink(f);
    await rename(tmp, f);
    savedKB += Math.round((s.size - newSize) / 1024);
    touched++;
    console.log(
      `${basename(f)}: ${Math.round(s.size / 1024)}KB → ${Math.round(newSize / 1024)}KB`
    );
  } else {
    await unlink(tmp);
    skipped++;
  }
}

console.log(`\n${touched} shrunk, ${skipped} skipped, ~${savedKB} KB saved.`);
