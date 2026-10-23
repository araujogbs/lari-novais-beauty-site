import { BrideForm } from './BrideForm';
import { Constellation } from './Constellation';

export function Brides() {
  return (
    <>
      <section id="noivas" className="noivas-hero has-constellation">
        <Constellation id="noivas" side="right" />
        <div>
          <div className="section-label">Noivas</div>
          <h1>
            A <em>sofisticação</em> que o seu momento pede,
            <br />
            com a <em>naturalidade</em> que você deseja.
          </h1>
        </div>
      </section>
      <section style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div className="container section-center reveal">
          <p className="section-desc" style={{ maxWidth: '720px', marginBottom: '0' }}>
            Acredito que a maquiagem e o penteado ideais não servem para criar uma fantasia, mas sim para respeitar a
            sua essência, valorizar os seus traços naturais e destacar o que você já tem de mais belo. Minha assinatura
            é bem clara: entregar uma beleza que une sofisticação, elegância e naturalidade de forma atemporal.
          </p>
        </div>
      </section>
      <section style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div className="section-center" style={{ textAlign: 'center' }}>
            <div className="section-label">Como Funciona</div>
            <h2 className="section-title section-title--noivas">Do primeiro contato ao altar</h2>
            <div className="section-divider"></div>
          </div>
          <div className="steps-grid reveal">
            <div className="step-card">
              <div className="step-num">01</div>
              <h4>Primeiro Contato</h4>
              <p>
                Preencha o formulário com as principais informações sobre o seu casamento. Assim que enviar, iniciaremos
                nossa conversa diretamente pelo WhatsApp.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h4>Planejamento de Beleza</h4>
              <p>
                Após o fechamento do contrato, damos início ao seu planejamento. Realizamos uma análise de perfil e
                estudo visagista para alinhar e definir a direção ideal da sua maquiagem e do seu penteado.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h4>Prévia</h4>
              <p>
                O ensaio completo da sua produção. Um momento essencial para você visualizar o conjunto da beleza, fazer
                ajustes e aprovar cada detalhe com total segurança antes do grande dia.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">04</div>
              <h4>Finalização do Dossiê</h4>
              <p>
                Finalização do seu planejamento de beleza. Fechamos o seu dossiê, organizamos os últimos detalhes e faço
                o envio do cronograma minucioso do seu dia.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">05</div>
              <h4>Dia Oficial</h4>
              <p>
                Pontualidade e eficiência. Toda a estrutura planejada entra em ação para garantir que você se arrume em
                um ambiente leve, tranquilo e rigorosamente dentro do horário.
              </p>
            </div>
            <div className="step-card">
              <div className="step-num">06</div>
              <h4>Pós-Atendimento</h4>
              <p>
                Sua opinião é importante para mim. Após o evento, quero muito ouvir as suas impressões e saber como você
                se sentiu vivendo esse momento.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="section-center" style={{ textAlign: 'center' }}>
            <div className="section-label">Inspirações</div>
            <h2 className="section-title section-title--noivas">Referências visuais</h2>
            <div className="section-divider"></div>
          </div>
          <div className="noivas-grid reveal">
            <div className="noiva-photo">
              <img
                src="/img/insp-1.jpg"
                alt="Noiva"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
            <div className="noiva-photo">
              <img
                src="/img/insp-2.jpg"
                alt="Noiva"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
            <div className="noiva-photo">
              <img
                src="/img/insp-3.jpg?v=2"
                alt="Noiva"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
            <div className="noiva-photo">
              <img
                src="/img/insp-4.jpg"
                alt="Noiva"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="section-rose">
        <div className="container section-center">
          <div className="section-label">Pacote</div>
          <h2 className="section-title">Uma jornada de beleza exclusiva</h2>
          <p className="section-desc">
            O essencial desenhado nos mínimos detalhes para que você viva o seu grande dia com total segurança e
            tranquilidade.
          </p>
          <div className="pacote-single reveal">
            <div className="pacote-card featured">
              <h4>O que está incluso</h4>
              <ul>
                <li>Análise de perfil &amp; análise visagista</li>
                <li>Dossiê de beleza</li>
                <li>Teste de maquiagem e penteado</li>
                <li>Suporte via WhatsApp</li>
                <li>Reuniões online de alinhamento</li>
                <li>Dia exclusivo</li>
                <li>Acompanhamento pós cerimônia (retoque de make e troca de penteado)</li>
              </ul>
              <p className="price">A partir de</p>
              <p className="from">R$ 3.000,00</p>
              <p className="price-note">Taxa de deslocamento cobrada à parte conforme a localização do evento.</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container section-center reveal">
          <div className="section-label">Vamos conversar sobre o seu casamento</div>
          <h2 className="section-title">Vamos desenhar a beleza do seu grande dia</h2>
          <p className="section-desc" style={{ marginBottom: '0' }}>
            Me conte os primeiros detalhes do seu casamento e eu retorno pelo WhatsApp para iniciarmos o seu
            planejamento.
          </p>
          <BrideForm />
        </div>
      </section>
    </>
  );
}
