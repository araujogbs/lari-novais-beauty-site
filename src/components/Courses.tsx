export function Courses() {
  return (
    <>
      <section id="cursos">
        <div className="container">
          <div className="section-center" style={{ textAlign: 'center' }}>
            <div className="section-label">Cursos</div>
            <h2 className="section-title">Mais de uma década de mercado traduzida em um método prático.</h2>
            <p className="section-desc">Cursos para iniciantes e para aperfeiçoamento profissional.</p>
          </div>
          <div className="cursos-grid reveal">
            <div className="curso-card">
              <div className="curso-img">
                <img
                  src="/img/curso-automaquiagem.jpg"
                  alt="Automaquiagem"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="curso-content">
                <div className="curso-tag">Maquiagem</div>
                <h4>Beauty Class – Automaquiagem</h4>
                <p>Para mulheres que desejam aprender a realçar sua beleza com técnica, intenção e naturalidade.</p>
                <div className="curso-meta">
                  <span>📅 4 horas</span>
                  <span>👥 Individual, dupla ou trio</span>
                  <span>R$ 500,00</span>
                </div>
                <ul>
                  <li>Diagnóstico inicial</li>
                  <li>Aula presencial</li>
                  <li>Consultoria de produtos</li>
                  <li>Material de apoio</li>
                </ul>
                <a
                  href="https://wa.me/5511914834786?text=Ol%C3%A1!%20Quero%20me%20inscrever%20no%20curso%20Beauty%20Class%20%E2%80%93%20Automaquiagem."
                  className="btn-inscrever"
                  target="_blank"
                  rel="noopener"
                >
                  Quero me Inscrever
                </a>
              </div>
            </div>
            <div className="curso-card">
              <div className="curso-img">
                <img
                  src="/fotos/Fotos modelos/Cacheado e Crespo/IMG_0220.JPG"
                  alt="Penteado Profissional"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="curso-content">
                <div className="curso-tag">Hair Styling</div>
                <h4>Beauty Class – Penteado Profissional</h4>
                <p>
                  Iniciante e aperfeiçoamento personalizado para profissionais que desejam se destacar no mercado de
                  penteados.
                </p>
                <div className="curso-meta">
                  <span>📅 20 horas</span>
                  <span>👥 Individual</span>
                  <span>Consultar valores</span>
                </div>
                <ul>
                  <li>Dia 1 – Módulo 1: Penteados em fios lisos &amp; ondulados</li>
                  <li>Dia 2 – Módulo 2: Estruturas em fios cacheados &amp; crespos</li>
                  <li>Dia 3 – Mentoria online: Teoria, mercado &amp; profissionalismo</li>
                </ul>
                <a
                  href="https://wa.me/5511914834786?text=Ol%C3%A1!%20Quero%20me%20inscrever%20no%20curso%20Beauty%20Class%20%E2%80%93%20Penteado%20Profissional."
                  className="btn-inscrever"
                  target="_blank"
                  rel="noopener"
                >
                  Quero me Inscrever
                </a>
              </div>
            </div>
            <div className="curso-card">
              <div className="curso-img">
                <img
                  src="/img/curso-maquiagem-pro.jpg"
                  alt="Maquiagem Profissional"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                />
              </div>
              <div className="curso-content">
                <div className="curso-tag">Maquiagem</div>
                <h4>Beauty Class – Maquiagem Profissional</h4>
                <p>
                  Iniciante e aperfeiçoamento personalizado para profissionais que desejam se destacar no mercado de
                  maquiagem.
                </p>
                <div className="curso-meta">
                  <span>📅 6 horas</span>
                  <span>👥 Individual</span>
                  <span>Consultar valores</span>
                </div>
                <ul>
                  <li>Maquiagem com foco em atendimento</li>
                  <li>Beleza natural e sofisticada</li>
                  <li>Técnicas de durabilidade e resistência</li>
                  <li>Bônus: fotografia e posicionamento profissional</li>
                </ul>
                <a
                  href="https://wa.me/5511914834786?text=Ol%C3%A1!%20Quero%20me%20inscrever%20no%20curso%20Beauty%20Class%20%E2%80%93%20Maquiagem%20Profissional."
                  className="btn-inscrever"
                  target="_blank"
                  rel="noopener"
                >
                  Quero me Inscrever
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
