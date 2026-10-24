import type { CSSProperties } from 'react';
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
  return (
    <section id="home" className="hero">
      <div className="hero-img reveal">
        <HeroCarousel />
      </div>
      {/* No desktop o texto fica à esquerda e a foto à direita, para os botões aparecerem sem rolar */}
      <div className="hero-text">
        <h1>
          <Words text="Beleza com naturalidade," />
          <br />
          <em>
            <Words text="técnica e identidade" from={3} />
          </em>
        </h1>
        <p className="hero-sub">Maquiagem &amp; Penteados — São&nbsp;Paulo</p>
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
      </div>
      <MoonToday />
    </section>
  );
}
