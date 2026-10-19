import { useCallback, useEffect, useState } from 'react';
import { prefersDark } from '../lib/motion';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ln-theme';

function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

/**
 * Modo noturno do site. Segue o modo escuro do aparelho até a visitante escolher pelo botão.
 * `active = false` (no painel) tira o tema da página, que volta ao visual claro.
 */
export function useTheme(active: boolean): [Theme, () => void] {
  const [chosen, setChosen] = useState<Theme | null>(storedTheme);
  const [system, setSystem] = useState<Theme>(() => (prefersDark() ? 'dark' : 'light'));
  const theme = chosen ?? system;

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (): void => {
      setSystem(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (active) root.dataset.theme = theme;
    else delete root.dataset.theme;
  }, [active, theme]);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setChosen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* navegação privada: vale só nesta visita */
    }
  }, [theme]);

  return [theme, toggle];
}
