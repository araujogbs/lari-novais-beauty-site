import { useEffect, useState } from 'react';
import { HERO_IMAGES, HERO_INTERVAL_MS } from '../data/hero';
import { responsive } from '../lib/img';

const SIZES = '(max-width: 968px) 70vw, 440px';

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  // Só baixa a foto atual e a próxima; as outras entram conforme o carrossel avança
  const [loadedUpTo, setLoadedUpTo] = useState(1);

  const show = (i: number): void => {
    setCurrent(i);
    setLoadedUpTo((n) => Math.max(n, i + 1));
  };

  // Reinicia o temporizador a cada troca, inclusive quando a visitante clica num ponto.
  useEffect(() => {
    const id = setTimeout(() => {
      show((current + 1) % HERO_IMAGES.length);
    }, HERO_INTERVAL_MS);
    return () => {
      clearTimeout(id);
    };
  }, [current]);

  return (
    <div className="hero-carousel">
      {HERO_IMAGES.map(({ src, alt }, i) =>
        i <= loadedUpTo ? (
          <img
            key={src}
            {...responsive(src, SIZES)}
            alt={alt}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className={i === current ? 'carousel-img active' : 'carousel-img'}
          />
        ) : null,
      )}
      <div className="carousel-dots">
        {HERO_IMAGES.map(({ src }, i) => (
          <button
            key={src}
            type="button"
            className={i === current ? 'dot active' : 'dot'}
            aria-label={`Foto ${i + 1} de ${HERO_IMAGES.length}`}
            aria-current={i === current}
            onClick={() => {
              show(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
