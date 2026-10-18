import { ContactForm } from './ContactForm';

export function Contact() {
  return (
    <>
      <section id="contato">
        <div className="container">
          <div className="section-center" style={{ textAlign: 'center' }}>
            <div className="section-label">Fale Comigo</div>
            <h2 className="section-title">Sugestões, Elogios e Parcerias</h2>
            <p className="section-desc">
              Quer sugerir algo, bater um papo ou propor um projeto? É só mandar uma mensagem.
            </p>
          </div>
          <div className="contact-grid reveal">
            <ContactForm />
            <div className="contact-channels">
              <div className="contact-channel">
                <h5>WhatsApp</h5>
                <p>Para respostas rápidas</p>
                <a href="https://wa.me/5511914834786" target="_blank" rel="noopener">
                  (11) 91483-4786
                </a>
              </div>
              <div className="contact-channel">
                <h5>E-mail</h5>
                <p>Para parcerias, propostas e contratos formais</p>
                <a href="mailto:larinovaisbeauty@gmail.com">larinovaisbeauty@gmail.com</a>
              </div>
              <div className="contact-channel">
                <h5>Redes</h5>
                <p>Nas demais redes (Instagram, TikTok e YouTube)</p>
                <a href="https://www.instagram.com/larinovaisbeauty/" target="_blank">
                  @larinovaisbeauty
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
