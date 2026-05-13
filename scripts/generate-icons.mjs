import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const src = path.resolve('logo-source/vp-flow-icon-boxed.svg');
const svg = await readFile(src);

const targets = [
  { out: 'public/favicon-16.png', size: 16 },
  { out: 'public/favicon-32.png', size: 32 },
  { out: 'public/icon-192.png', size: 192 },
  { out: 'public/icon-512.png', size: 512 },
  { out: 'public/icon-512-maskable.png', size: 512 },
];

for (const t of targets) {
  await sharp(svg, { density: 384 })
    .resize(t.size, t.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(t.out);
  console.log(`wrote ${t.out} (${t.size}x${t.size})`);
}
