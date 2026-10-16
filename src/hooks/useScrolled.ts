import { useEffect, useState } from 'react';

const SCROLLED_AFTER_PX = 40;

/** `true` quando a página já saiu do topo (usado para deixar o header mais translúcido). */
export function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = (): void => {
      setScrolled(window.scrollY > SCROLLED_AFTER_PX);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
    };
  }, []);

  return scrolled;
}
