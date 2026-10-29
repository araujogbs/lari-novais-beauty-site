import { renderToString } from 'react-dom/server';
import { App } from './App';

/** HTML da página inicial, gerado no build (scripts/prerender.mjs) para chegar pronto antes do JavaScript. */
export function render(): string {
  return renderToString(<App />);
}
