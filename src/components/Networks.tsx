/* Logos das redes em traço/preenchimento único, na cor do site (currentColor), para seguir o modo diurno e o noturno */
const InstagramLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const YouTubeLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15.1V8.9l5.8 3.1z" />
  </svg>
);

const TikTokLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

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
              <div className="social-icon">
                <InstagramLogo />
              </div>
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
              <div className="social-icon">
                <YouTubeLogo />
              </div>
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
              <div className="social-icon">
                <TikTokLogo />
              </div>
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
            <p>Artigos sobre noivas, maquiagem, cabelo e visagismo. Vinculado às redes sociais.</p>
          </div>
        </div>
      </section>
    </>
  );
}
