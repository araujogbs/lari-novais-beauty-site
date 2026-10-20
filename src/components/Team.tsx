export function Team() {
  return (
    <>
      <section id="equipe" hidden className="section-rose">
        <div className="container">
          <div className="section-center" style={{ textAlign: 'center' }}>
            <div className="section-label">Equipe</div>
            <h2 className="section-title">Quem faz parte do time</h2>
            <p className="section-desc">
              Evento grande — destination, casamentos multiplos, formaturas — minha equipe entra. Mesmos valores:
              tecnica, respeito e beleza real.
            </p>
          </div>
          <div className="equipe-grid reveal">
            <div className="equipe-member">
              <div className="photo-placeholder">
                <span>FN</span>
              </div>
              <div className="member-info">
                <h5>Fernanda Nunes</h5>
                <span className="role">Especialista em Noivas</span>
                <p>8 anos de experiencia. Visagismo e maquiagem duradoura.</p>
              </div>
            </div>
            <div className="equipe-member">
              <div className="photo-placeholder">
                <span>JS</span>
              </div>
              <div className="member-info">
                <h5>Juliana Santos</h5>
                <span className="role">Hair Stylist</span>
                <p>10 anos de hair styling. Coques, trancas e penteados.</p>
              </div>
            </div>
            <div className="equipe-member">
              <div className="photo-placeholder">
                <span>MC</span>
              </div>
              <div className="member-info">
                <h5>Marina Castro</h5>
                <span className="role">Maquiadora Social</span>
                <p>5 anos. Especialista em make corporativa natural.</p>
              </div>
            </div>
            <div className="equipe-member">
              <div className="photo-placeholder">
                <span>AO</span>
              </div>
              <div className="member-info">
                <h5>Ana Oliveira</h5>
                <span className="role">Colorimetria</span>
                <p>Especialista em colorimetria e consultoria de imagem.</p>
              </div>
            </div>
          </div>
          <div className="equipe-gallery reveal">
            <div className="gallery-placeholder">
              <img
                src="/img/equipe-1.jpg"
                alt="Trabalho"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div className="gallery-placeholder">
              <img
                src="/img/equipe-2.jpg"
                alt="Trabalho"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div className="gallery-placeholder">
              <img
                src="/img/equipe-3.jpg"
                alt="Trabalho"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div className="gallery-placeholder">
              <img
                src="/img/equipe-4.jpg"
                alt="Trabalho"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
