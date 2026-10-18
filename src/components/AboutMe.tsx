export function AboutMe() {
  return (
    <>
      <section id="sobre">
        <div className="container">
          <div className="sobre-head">
            <div className="section-label">Sobre Mim</div>
            <h1>
              A <em>artista</em> por trás
              <br />
              dos pincéis
            </h1>
          </div>
          <div className="sobre-grid reveal">
            <div className="sobre-text">
              <h3>Trajetória</h3>
              <p>
                A maquiagem entrou na minha vida de forma sutil, como uma ferramenta de autoexpressão e embelezamento
                através das cores. O YouTube foi a minha primeira escola: no auge dos meus 13 anos, eu maratonava
                conteúdos de beleza e aprendia com as blogueiras da época a transformar meu rosto em arte.
              </p>
              <p>
                Ao sair do ensino médio, na necessidade de escolher uma profissão, em minhas pesquisas de cursos
                encontrei uma formação de maquiador profissional no Senac. Ali descobri a minha vocação. Recebi o meu
                primeiro diploma na área e, desde então, nunca mais parei. Em 2016, entrei na Universidade Anhembi
                Morumbi, cursando Estética e Cosmética com ênfase em Maquiagem Profissional. Mais uma porta que se
                abria, um mundo de possibilidades e caminhos; fiz a minha tão sonhada faculdade na minha área de paixão.
              </p>
              <p>
                Os anos se seguiram, os estudos continuaram e meu trabalho foi acontecendo. Trabalhei em loja de
                shopping como vendedora de maquiagens, fiz parte de uma agência de modelos como maquiadora e produtora
                de moda, viajei o Brasil, atendi em diversos estados, trabalhei em desfiles, salões e estúdio próprio,
                até me encontrar no atendimento a domicílio.
              </p>
              <p>
                Nesse meio tempo, desenvolvi uma nova paixão: penteados. Comecei a assinar belezas completas e a
                entender todas as necessidades das minhas clientes. O estudo nunca cessou: fiz especializações em novas
                técnicas de maquiagem e especializações para ser apta a pentear todas as texturas de cabelo, sempre
                buscando a melhor entrega.
              </p>
              <p>
                Hoje, a minha assinatura é bem clara: sofisticação e naturalidade. Meu aperfeiçoamento é constante para
                que minhas clientes sintam total satisfação ao se olharem no espelho e encontrarem a melhor versão de
                si. E, fechando o ciclo que começou como aluna do Senac, hoje atuo também como educadora na instituição,
                formando novos profissionais da beleza e compartilhando o que aprendi em mais de uma década de mercado.
              </p>
            </div>
            <div className="sobre-photos">
              <div className="sobre-photo">
                <img
                  src="/img/lari-pb-1.jpg"
                  alt="Lari"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
              <div className="sobre-photo">
                <img
                  src="/img/lari-pb-2.jpg"
                  alt="Lari"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
              <div className="sobre-photo">
                <img
                  src="/img/lari-pb-3.jpg"
                  alt="Lari"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
              <div className="sobre-photo">
                <img
                  src="/img/lari-pb-4.jpg"
                  alt="Lari"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>
          <div className="sobre-curriculo reveal">
            <h3>Currículo</h3>
            <div className="certificates">
              <div className="cert-item">Maquiador Profissional</div>
              <div className="cert-item">SENAC Santo André</div>
              <div className="cert-item">Estética e Cosmética com Ênfase em Maquiagem Profissional</div>
              <div className="cert-item">Universidade Anhembi Morumbi</div>
              <div className="cert-item">Penteado Profissional</div>
              <div className="cert-item">Style Academy</div>
              <div className="cert-item">Visagismo</div>
              <div className="cert-item">SENAC Tatuapé Serra de Bragança</div>
              <div className="cert-item">O Poder da Juba</div>
              <div className="cert-item">Patricia Tavares</div>
              <div className="cert-item">Professora e Educadora</div>
              <div className="cert-item">SENAC</div>
              <div className="cert-item">+ especializações extras</div>
              <div className="cert-item"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
