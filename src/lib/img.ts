/**
 * Atributos de <img> com as versões WebP geradas por `npm run images` (public/img/w/<nome>-480|960.webp).
 * `sizes` diz ao navegador a largura em que a foto aparece, para ele baixar só a versão necessária.
 */
export function responsive(src: string, sizes: string): { src: string; srcSet: string; sizes: string } {
  const name = src.replace(/^\/img\//, '').replace(/\.\w+(\?.*)?$/, '');
  const base = `/img/w/${name}`;
  return { src: `${base}-960.webp`, srcSet: `${base}-480.webp 480w, ${base}-960.webp 960w`, sizes };
}
