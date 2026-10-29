// Pré-renderiza a página inicial: coloca o HTML do React dentro do <div id="root"> do dist/index.html.
// Buscadores e prévias de link leem o conteúdo sem rodar JavaScript; no navegador o React assume a página.
// Roda no fim do `npm run build`, depois de `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

// Navegador simulado para os componentes que leem window/document/localStorage ao renderizar
const { window } = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://larinovaisbeauty.com.br/' });
window.matchMedia = () => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined });
for (const key of ['window', 'document', 'localStorage', 'sessionStorage', 'location', 'HTMLElement', 'Node']) {
  Object.defineProperty(globalThis, key, { value: window[key], configurable: true, writable: true });
}
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });

const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href);
const html = render();
const file = 'dist/index.html';
const page = readFileSync(file, 'utf8');
if (!page.includes('<div id="root"></div>')) throw new Error('<div id="root"></div> não encontrado em dist/index.html');
writeFileSync(file, page.replace('<div id="root"></div>', `<div id="root">${html}</div>`));
rmSync('dist-ssr', { recursive: true, force: true });
console.log(`Pré-renderizado: ${Math.round(html.length / 1024)} KB de HTML em ${file}`);
process.exit(0);
