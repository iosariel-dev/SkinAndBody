#!/usr/bin/env node
/**
 * Build multi-size favicon.ico from PNG sources using pure sharp.
 * No external dependencies beyond sharp (already a devDep).
 *
 * Usage: pnpm build-favicon
 *
 * Expects public/favicon-16x16.png, 32x32, 48x48.
 * Writes public/favicon.ico (Windows ICO, 3 images inside).
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const SRC = [
  { file: "public/favicon-16x16.png", size: 16 },
  { file: "public/favicon-32x32.png", size: 32 },
  { file: "public/favicon-48x48.png", size: 48 },
];
const OUT = "public/favicon.ico";

/**
 * ICO format: 6-byte header + directory entries (16 bytes each) + PNG payloads.
 * Modern browsers accept PNG-encoded images inside .ico (since ~2007).
 */
function buildIco(images) {
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  const dirSize = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(count * entrySize);
  let offset = dirSize;
  for (let i = 0; i < count; i++) {
    const { size, png } = images[i];
    const base = i * entrySize;
    entries.writeUInt8(size >= 256 ? 0 : size, base);
    entries.writeUInt8(size >= 256 ? 0 : size, base + 1);
    entries.writeUInt8(0, base + 2);
    entries.writeUInt8(0, base + 3);
    entries.writeUInt16LE(1, base + 4);
    entries.writeUInt16LE(32, base + 6);
    entries.writeUInt32LE(png.length, base + 8);
    entries.writeUInt32LE(offset, base + 12);
    offset += png.length;
  }

  return Buffer.concat([header, entries, ...images.map((i) => i.png)]);
}

const images = [];
for (const { file, size } of SRC) {
  const png = await sharp(readFileSync(file)).resize(size, size).png().toBuffer();
  images.push({ size, png });
}

const ico = buildIco(images);
writeFileSync(OUT, ico);
console.log(`${OUT} built: ${ico.length} bytes (${images.length} sizes: ${SRC.map((s) => s.size).join(", ")})`);
