import { responsive } from '../lib/img';
export function AboutHome() {
  return (
    <>
      <section>
        <div className="container">
          <div className="about-home reveal">
            <div className="photo-placeholder">
              <img
                {...responsive('/img/lari-perfil.jpg', '(max-width: 968px) 90vw, 400px')}
                loading="lazy"
                alt="Lari"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
            <div>
              <h3>
                Olá, eu sou a <em>Lari</em> ☾☼
              </h3>
              <p>
                Sou maquiadora e penteadista profissional com 11 anos de experiência no mercado de beleza. Minha missão
                é traduzir a sua melhor versão através de uma beleza sofisticada e natural.
              </p>
              <p>
                Especializada em atendimento 100% externo, vou até onde você desejar com toda a estrutura necessária
                para o seu total conforto. Meu trabalho se apoia em um cronograma planejado e cuidadoso para garantir
                total pontualidade, permitindo que você se arrume em um ambiente leve, tranquilo e sem pressa.
              </p>
              <p>
                Para entregar o melhor resultado, utilizo exclusivamente produtos de alta performance que garantem
                máxima durabilidade. Além disso, sou especialista em todas as texturas e curvaturas de cabelo, criando
                penteados sofisticados que valorizam desde os fios mais lisos até os crespos.
              </p>
              <p>
                Meus atendimentos são voltados para o social, noivas e também compartilho meu conhecimento através de
                cursos de automaquiagem e especializações profissionais.
              </p>
              <p>
                <strong>
                  Agende o seu atendimento exclusivo e descubra como uma beleza natural e atemporal pode elevar a sua
                  visão sobre si!
                </strong>
              </p>
              <a href="#sobre" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
                Conhecer Minha Trajetória
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
