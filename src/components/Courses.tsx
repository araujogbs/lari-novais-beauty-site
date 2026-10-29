import { Constellation } from './Constellation';
import { responsive } from '../lib/img';

/* Ícones de linha da ficha de cada curso (duração, turma e valor), na cor do site */
const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const PeopleIcon = () => (
  <svg {...iconProps}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.4c1.6.7 2.7 2.3 3 4.6" />
  </svg>
);

const TagIcon = () => (
  <svg {...iconProps}>
    <path d="M3 12V4h8l10 10-8 8z" />
    <circle cx="7.5" cy="8.5" r="1.3" />
  </svg>
);

export function Courses() {
  return (
    <>
      <section id="cursos" className="has-constellation">
        <Constellation id="cursos" side="left" />
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
                  {...responsive('/img/curso-automaquiagem.jpg', '(max-width: 968px) 90vw, 380px')}
                  loading="lazy"
                  alt="Automaquiagem"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="curso-content">
                <div className="curso-tag">Maquiagem</div>
                <h4>Beauty Class – Automaquiagem</h4>
                <p>Para mulheres que desejam aprender a realçar sua beleza com técnica, intenção e naturalidade.</p>
                <div className="curso-meta">
                  <span>
                    <ClockIcon />4 horas
                  </span>
                  <span>
                    <PeopleIcon />
                    Individual, dupla ou trio
                  </span>
                  <span>
                    <TagIcon />
                    R$ 500,00
                  </span>
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
                  {...responsive('/img/curso-penteado.jpg', '(max-width: 968px) 90vw, 380px')}
                  loading="lazy"
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
                  <span>
                    <ClockIcon />
                    20 horas
                  </span>
                  <span>
                    <PeopleIcon />
                    Individual
                  </span>
                  <span>
                    <TagIcon />
                    Consultar valores
                  </span>
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
                  {...responsive('/img/curso-maquiagem-pro.jpg', '(max-width: 968px) 90vw, 380px')}
                  loading="lazy"
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
                  <span>
                    <ClockIcon />6 horas
                  </span>
                  <span>
                    <PeopleIcon />
                    Individual
                  </span>
                  <span>
                    <TagIcon />
                    Consultar valores
                  </span>
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
