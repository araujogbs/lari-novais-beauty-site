import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles/main.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado em index.html');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Com o HTML pré-renderizado (build), o React assume a página sem recriá-la: a foto do topo,
// que é o LCP, aparece antes do JavaScript. No `npm run dev` o #root vem vazio, e o painel
// (/#painel) é outra tela, então nesses casos o React monta do zero.
if (container.hasChildNodes() && window.location.hash !== '#painel') {
  hydrateRoot(container, app);
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
