import { MoonPhases } from './CelestialSprites';
import { HeroCarousel } from './HeroCarousel';

export function Hero() {
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-img reveal">
          <HeroCarousel />
        </div>
        <h1>
          Beleza com naturalidade,
          <br />
          <em>técnica e identidade</em>
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
        <MoonPhases />
      </section>
    </>
  );
}
