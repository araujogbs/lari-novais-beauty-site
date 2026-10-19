import { type CSSProperties, useEffect, useRef } from 'react';
import { hasFinePointer, prefersReducedMotion } from '../lib/motion';
import { HeroCarousel } from './HeroCarousel';
import { MoonToday } from './MoonToday';

/** Palavras que aparecem uma a uma; `from` continua a contagem entre trechos do título. */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  return text.split(' ').map((word, i) => (
    <span key={i}>
      {i > 0 && ' '}
      <span className="hero-word" style={{ '--i': from + i } as CSSProperties}>
        {word}
      </span>
    </span>
  ));
}

export function Hero() {
  const frame = useRef<HTMLDivElement>(null);

  // A foto acompanha levemente o mouse, como se tivesse profundidade.
  useEffect(() => {
    const el = frame.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const onMove = (e: PointerEvent): void => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      el.style.setProperty('--px', Math.max(-1, Math.min(1, px)).toFixed(3));
      el.style.setProperty('--py', Math.max(-1, Math.min(1, py)).toFixed(3));
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-img reveal" ref={frame}>
        <HeroCarousel />
      </div>
      <h1>
        <Words text="Beleza com naturalidade," />
        <br />
        <em>
          <Words text="técnica e identidade" from={3} />
        </em>
      </h1>
      <p className="hero-sub">Maquiagem &amp; Penteados — São Paulo</p>
      <div className="hero-btns">
        <a href="#noivas" className="btn btn-primary">
          Agendar Noiva
        </a>
        <a href="#social" className="btn btn-outline">
          Ver Serviços
        </a>
        <a href="#cursos" className="btn btn-outline">
          Conhecer Cursos
        </a>
      </div>
      <MoonToday />
    </section>
  );
}
