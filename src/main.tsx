import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles/fonts.css';
import './styles/main.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado em index.html');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Com o HTML pré-renderizado (build), o React assume a página sem recriá-la: a foto do topo,
// que é o LCP, aparece antes do JavaScript. No `npm run dev` o #root vem vazio; o painel
// (/#painel) é outra tela e o link do WhatsApp (/#ag=código) abre "Meus agendamentos",
// que não estão no HTML do build: nesses casos o React monta do zero.
const hash = window.location.hash;
if (container.hasChildNodes() && hash !== '#painel' && !hash.startsWith('#ag=')) {
  // O HTML já está completo: deixa o navegador pintá-lo primeiro e hidrata no quadro seguinte
  requestAnimationFrame(() => {
    setTimeout(() => {
      hydrateRoot(container, app);
    }, 0);
  });
} else {
  container.replaceChildren();
  createRoot(container).render(app);
}
