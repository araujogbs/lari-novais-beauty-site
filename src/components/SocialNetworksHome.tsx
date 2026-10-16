export function SocialNetworksHome() {
  return (
    <>
      <section hidden className="section-rose">
        <div className="container section-center">
          <div className="section-label">Redes</div>
          <h2 className="section-title">Onde me encontrar?</h2>
          <div className="social-grid reveal">
            <div className="social-card">
              <div className="social-icon">★</div>
              <h5>Instagram</h5>
              <p>Portfólio, inspirações e conteúdos de beleza.</p>
              <a href="https://www.instagram.com/larinovaisbeauty/" className="btn btn-outline" target="_blank">
                @larinovaisbeauty
              </a>
            </div>
            <div className="social-card">
              <div className="social-icon">▶</div>
              <h5>YouTube</h5>
              <p>Meu universo da beleza! Aprenda comigo.</p>
              <a href="#" className="btn btn-outline" target="_blank">
                Canal Lari Novais
              </a>
            </div>
            <div className="social-card">
              <div className="social-icon">♫</div>
              <h5>TikTok</h5>
              <p>Bastidores, tutoriais e dicas rápidas.</p>
              <a href="#" className="btn btn-outline" target="_blank">
                @larinovaisbeauty
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
