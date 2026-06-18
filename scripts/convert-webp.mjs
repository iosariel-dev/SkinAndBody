#!/usr/bin/env node
/**
 * Convert all .jpg/.jpeg/.png files in public/images/ to .webp alongside originals.
 * Keeps docs/ folder (certificates) untouched unless --include-docs passed.
 */
import { readdir, stat } from "node:fs/promises";
import { join, extname, dirname, basename } from "node:path";
import sharp from "sharp";

const ROOT = new URL("../public/images", import.meta.url).pathname;
const includeDocs = process.argv.includes("--include-docs");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!includeDocs && entry.name === "docs") continue;
      files.push(...(await walk(p)));
    } else {
      files.push(p);
    }
  }
  return files;
}

function isConvertible(file) {
  const ext = extname(file).toLowerCase();
  return ext === ".jpg" || ext === ".jpeg" || ext === ".png";
}

async function convert(file) {
  const out = join(
    dirname(file),
    `${basename(file, extname(file))}.webp`
  );
  // Skip if webp already exists and newer than source
  try {
    const [srcStat, outStat] = await Promise.all([stat(file), stat(out)]);
    if (outStat.mtimeMs >= srcStat.mtimeMs) return { file, status: "skip" };
  } catch {
    // out doesn't exist — proceed
  }
  const ext = extname(file).toLowerCase();
  const quality = ext === ".png" ? 90 : 82;
  await sharp(file).webp({ quality, effort: 5 }).toFile(out);
  return { file, out, status: "ok" };
}

const files = (await walk(ROOT)).filter(isConvertible);
console.log(`Converting ${files.length} files…`);

let ok = 0, skip = 0, fail = 0;
for (const f of files) {
  try {
    const r = await convert(f);
    if (r.status === "ok") ok++;
    else skip++;
  } catch (e) {
    console.error(`FAIL ${f}: ${e.message}`);
    fail++;
  }
}

console.log(`Done: ${ok} converted, ${skip} skipped, ${fail} failed.`);
