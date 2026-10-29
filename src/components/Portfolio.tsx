import { responsive } from '../lib/img';
export function Portfolio() {
  return (
    <>
      <section>
        <div className="container">
          <div className="portfolio-grid reveal">
            <a href="#noivas" className="portfolio-block">
              <img
                {...responsive('/img/home-noivas.jpg', '(max-width: 968px) 90vw, 400px')}
                loading="lazy"
                alt="Noivas"
                className="portfolio-img"
              />
              <div className="overlay">
                <span className="label">Noivas</span>
                <span className="count">Beleza estratégica, natural e atemporal</span>
              </div>
            </a>
            <a href="#social" className="portfolio-block">
              <img
                {...responsive('/img/home-social.jpg', '(max-width: 968px) 90vw, 400px')}
                loading="lazy"
                alt="Eventos sociais"
                className="portfolio-img"
              />
              <div className="overlay">
                <span className="label">Eventos Sociais</span>
                <span className="count">Para todas as ocasiões</span>
              </div>
            </a>
            <a href="#cursos" className="portfolio-block">
              <img
                {...responsive('/img/home-cursos.jpg', '(max-width: 968px) 90vw, 400px')}
                loading="lazy"
                alt="Cursos"
                className="portfolio-img"
              />
              <div className="overlay">
                <span className="label">Cursos</span>
                <span className="count">Formações personalizadas</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
