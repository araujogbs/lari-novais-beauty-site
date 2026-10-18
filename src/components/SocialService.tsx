import { AgendamentoWidget } from '../agendamento/AgendamentoWidget';

const SOCIAL_GALLERY: readonly { src: string; alt: string }[] = [
  { src: '/img/social-1.jpg', alt: 'Formanda com penteado baixo e maquiagem luminosa' },
  { src: '/img/social-2.jpg', alt: 'Madrinha com rabo de cavalo sofisticado' },
  { src: '/img/social-3.jpg', alt: 'Convidada com coque alto e maquiagem elegante' },
  { src: '/img/social-4.jpg', alt: 'Penteado preso com detalhes florais em cabelo cacheado' },
  { src: '/img/social-5.jpg', alt: 'Maquiagem natural para evento' },
  { src: '/img/social-6.jpg', alt: 'Cabelo cacheado semipreso' },
  { src: '/img/social-7.jpg', alt: 'Formanda com cachos definidos' },
  { src: '/img/social-8.jpg', alt: 'Debutante com vestido azul e cabelo ondulado' },
];

export function SocialService() {
  return (
    <>
      <section id="social">
        <div className="container">
          <div className="section-center" style={{ textAlign: 'center' }}>
            <div className="section-label">Atendimento Social</div>
            <h2 className="section-title">A sua melhor versão para celebrar momentos inesquecíveis.</h2>
            <p className="section-desc" style={{ maxWidth: '720px' }}>
              Seja para celebrar como madrinha, formanda, convidada ou para registrar um momento especial em um ensaio
              fotográfico, a sua produção merece excelência. Minha missão é criar uma beleza sofisticada, natural e
              elegante, feita sob medida para valorizar os seus traços e respeitar o seu estilo pessoal, sem exageros.
            </p>
          </div>
          <div className="social-gallery reveal">
            {SOCIAL_GALLERY.map(({ src, alt }) => (
              <img key={src} src={src} alt={alt} loading="lazy" />
            ))}
          </div>
          <div className="pacote-single reveal" style={{ textAlign: 'center' }}>
            <div className="pacote-card featured">
              <h4>Maquiagem + Penteado</h4>
              <p className="from">R$ 700,00</p>
              <div className="price-list" style={{ textAlign: 'left' }}>
                <div className="price-item">
                  <span className="service">Maquiagem</span>
                  <span className="value">R$ 350,00</span>
                </div>
                <div className="price-item">
                  <span className="service">Penteado</span>
                  <span className="value">R$ 350,00</span>
                </div>
                <div className="price-item">
                  <span className="service">Escova e Babyliss</span>
                  <span className="value">R$ 300,00</span>
                </div>
              </div>
              <p className="price-note">
                A taxa de deslocamento é cobrada à parte de acordo com o endereço de atendimento.
              </p>
            </div>
          </div>
          <div className="section-center" id="agendar" style={{ textAlign: 'center', marginTop: '5rem' }}>
            <div className="section-label">Agendamento</div>
            <h2 className="section-title">Agende o seu horário</h2>
            <div className="section-divider"></div>
            <AgendamentoWidget />
          </div>
        </div>
      </section>
    </>
  );
}
