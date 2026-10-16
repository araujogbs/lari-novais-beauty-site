export function Networks() {
  return (
    <>
      <section id="redes">
        <div className="container">
          <div className="section-center" style={{ textAlign: 'center' }}>
            <div className="section-label">Redes</div>
            <h2 className="section-title">Onde me encontrar?</h2>
          </div>
          <div className="rede-grid reveal">
            <div className="rede-card">
              <div className="social-icon">★</div>
              <h4>Instagram</h4>
              <p>Portfólio atualizado, noivas reais, detalhes de atendimentos e inspirações diárias.</p>
              <div className="preview">
                <div className="preview-item">Portfólio atualizado</div>
                <div className="preview-item">Noivas reais e detalhes de atendimentos</div>
                <div className="preview-item">Inspirações diárias</div>
              </div>
              <a href="https://www.instagram.com/larinovaisbeauty/" className="btn btn-outline" target="_blank">
                @larinovaisbeauty
              </a>
            </div>
            <div className="rede-card">
              <div className="social-icon">▶</div>
              <h4>YouTube</h4>
              <p>Conteúdos aprofundados, aulas e o universo profissional da beleza.</p>
              <div className="preview">
                <div className="preview-item">Conteúdos aprofundados</div>
                <div className="preview-item">Aulas de maquiagem e penteado</div>
                <div className="preview-item">O universo profissional da beleza</div>
              </div>
              <a
                href="https://www.youtube.com/@larinovaisbeauty"
                className="btn btn-outline"
                target="_blank"
                rel="noopener"
              >
                @larinovaisbeauty
              </a>
            </div>
            <div className="rede-card">
              <div className="social-icon">♫</div>
              <h4>TikTok</h4>
              <p>Bastidores da rotina, tutoriais rápidos, dicas práticas de beleza e tendências.</p>
              <div className="preview">
                <div className="preview-item">Bastidores da rotina</div>
                <div className="preview-item">Tutoriais rápidos e dicas práticas</div>
                <div className="preview-item">Tendências de beleza</div>
              </div>
              <a
                href="https://www.tiktok.com/@larinovaisbeauty"
                className="btn btn-outline"
                target="_blank"
                rel="noopener"
              >
                @larinovaisbeauty
              </a>
            </div>
          </div>
          <div className="blog-note reveal">
            <h4>Em breve: Blog</h4>
            <p>Artigos sobre noivas, maquiagem, cabelo e visagismo. Vinculado as redes sociais.</p>
          </div>
        </div>
      </section>
    </>
  );
}
