// Gera as versões WebP das fotos (480 e 960 px de largura) usadas pelo srcset do site.
// Rode depois de colocar ou trocar uma foto em public/img: npm run images
import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'public/img';
const OUT = 'public/img/w';
const WIDTHS = [480, 960];

mkdirSync(OUT, { recursive: true });
for (const file of readdirSync(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const { name } = parse(file);
  const input = join(SRC, file);
  for (const w of WIDTHS) {
    const out = join(OUT, `${name}-${w}.webp`);
    if (existsSync(out) && statSync(out).mtimeMs > statSync(input).mtimeMs) continue;
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    console.log(out);
  }
}
