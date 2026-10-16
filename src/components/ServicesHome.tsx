export function ServicesHome() {
  return (
    <>
      <section className="section-rose">
        <div className="container section-center">
          <div className="section-label">Serviços</div>
          <h2 className="section-title">O que eu posso fazer por você?</h2>
          <div className="services-grid reveal">
            <div className="service-card">
              <div className="service-card-img">
                <img
                  src="/img/serv-noivas.jpg"
                  alt="Noiva"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="service-card-content">
                <h4>Noivas</h4>
                <p>
                  Uma experiência exclusiva do primeiro contato até o seu grande dia. Beleza estratégica, natural e
                  atemporal.
                </p>
                <a href="#noivas" className="btn btn-outline">
                  Saiba Mais
                </a>
              </div>
            </div>
            <div className="service-card">
              <div className="service-card-img">
                <img
                  src="/img/serv-social.jpg"
                  alt="Social"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="service-card-content">
                <h4>Social</h4>
                <p>
                  De formandas a madrinhas, do corporativo a eventos sociais: maquiagem e penteado para todas as
                  ocasiões.
                </p>
                <a href="#social" className="btn btn-outline">
                  Saiba Mais
                </a>
              </div>
            </div>
            <div className="service-card">
              <div className="service-card-img">
                <img
                  src="/img/serv-cursos.jpg"
                  alt="Cursos"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="service-card-content">
                <h4>Cursos</h4>
                <p>
                  Formações personalizadas para você evoluir. Cursos de Automaquiagem, Maquiagem Profissional e Penteado
                  Profissional.
                </p>
                <a href="#cursos" className="btn btn-outline">
                  Saiba Mais
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
