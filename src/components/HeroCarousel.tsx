import { useEffect, useState } from 'react';
import { HERO_IMAGES, HERO_INTERVAL_MS } from '../data/hero';

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Reinicia o temporizador a cada troca, inclusive quando a visitante clica num ponto.
  useEffect(() => {
    const id = setTimeout(() => {
      setCurrent((c) => (c + 1) % HERO_IMAGES.length);
    }, HERO_INTERVAL_MS);
    return () => {
      clearTimeout(id);
    };
  }, [current]);

  return (
    <div className="hero-carousel">
      {HERO_IMAGES.map(({ src, alt }, i) => (
        <img key={src} src={src} alt={alt} className={i === current ? 'carousel-img active' : 'carousel-img'} />
      ))}
      <div className="carousel-dots">
        {HERO_IMAGES.map(({ src }, i) => (
          <button
            key={src}
            type="button"
            className={i === current ? 'dot active' : 'dot'}
            aria-label={`Foto ${i + 1} de ${HERO_IMAGES.length}`}
            aria-current={i === current}
            onClick={() => {
              setCurrent(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
