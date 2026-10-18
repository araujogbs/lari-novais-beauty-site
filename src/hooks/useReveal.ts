import { useEffect } from 'react';

/**
 * Marca com `.visible` os elementos `.reveal` quando entram na tela (animação de entrada).
 * `resetKey` refaz a observação quando o conteúdo da página é trocado (ex.: ao voltar do painel para o site).
 */
export function useReveal(resetKey?: unknown): void {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });
    return () => {
      observer.disconnect();
    };
  }, [resetKey]);
}
