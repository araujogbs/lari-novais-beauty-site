import { AgendamentoWidget } from '../agendamento/AgendamentoWidget';
import { Constellation } from './Constellation';
import { StarCorners, StarDivider } from './StarCorners';

const SOCIAL_GALLERY: readonly { src: string; alt: string }[] = [
  { src: '/img/social-1.jpg', alt: 'Formanda com penteado baixo e maquiagem luminosa' },
  { src: '/img/social-2.jpg', alt: 'Madrinha com rabo de cavalo sofisticado' },
  { src: '/img/social-11.jpg', alt: 'Penteado preso com mecha ondulada e maquiagem em tons de vinho' },
  { src: '/img/social-5.jpg', alt: 'Maquiagem natural para evento' },
  { src: '/img/social-7.jpg', alt: 'Formanda com cachos definidos' },
  { src: '/img/social-8.jpg', alt: 'Debutante com vestido azul e cabelo ondulado' },
  { src: '/img/social-9.jpg', alt: 'Maquiagem e penteado ondulado para convidada' },
  { src: '/img/social-10.jpg', alt: 'Maquiagem com olhos esfumados e cabelo liso longo' },
];

/** Tabela de valores do Atendimento Social (a duração é a mesma usada no agendamento). */
const PRICES: readonly { name: string; time: string; price: string; saving?: string }[] = [
  { name: 'Maquiagem', time: '60 min', price: 'R$ 380' },
  { name: 'Penteado', time: '60 a 90 min', price: 'R$ 380' },
  { name: 'Maquiagem + Penteado', time: '120 a 150 min', price: 'R$ 700', saving: 'R$ 60' },
  { name: 'Escova e Babyliss', time: '60 min', price: 'R$ 300' },
];

export function SocialService() {
  return (
    <>
      <section id="social" className="has-constellation">
        <Constellation id="social" side="left" />
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
            <div className="pacote-card frame">
              <StarCorners />
              <h4 className="carta-title">
                <StarDivider />
                Valores
                <StarDivider />
              </h4>
              <ul className="carta-list">
                {PRICES.map((p) => (
                  <li key={p.name} className={p.saving ? 'carta-item carta-item--featured' : 'carta-item'}>
                    {p.saving && <span className="carta-badge">Pacote · economize {p.saving}</span>}
                    <span className="carta-name">
                      {p.name}
                      <small>{p.time}</small>
                    </span>
                    <span className="carta-dots" aria-hidden="true" />
                    <span className="carta-price">{p.price}</span>
                  </li>
                ))}
              </ul>
              <p className="price-note">
                A taxa de deslocamento é cobrada à parte de acordo com o endereço de atendimento. Para garantir o
                horário, é cobrado um sinal depois da confirmação do pedido.
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
