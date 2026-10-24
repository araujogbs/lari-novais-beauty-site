import { useState } from 'react';
import { buildContactMessage, openWhatsapp } from '../whatsapp';
import { StarCorners } from './StarCorners';

const SUBJECTS = ['Sugestão', 'Elogio', 'Parceria', 'Outro'] as const;

export function ContactForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');

  return (
    <form
      className="contact-form frame"
      onSubmit={(e) => {
        e.preventDefault();
        openWhatsapp(buildContactMessage({ nome, email, assunto, mensagem }));
      }}
    >
      <StarCorners />
      <div className="form-group">
        <label htmlFor="contatoNome">Seu Nome</label>
        <input
          type="text"
          id="contatoNome"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="contatoEmail">E-mail</label>
        <input
          type="email"
          id="contatoEmail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="contatoAssunto">Assunto</label>
        <select
          id="contatoAssunto"
          value={assunto}
          onChange={(e) => {
            setAssunto(e.target.value);
          }}
        >
          <option value="">Selecione</option>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="contatoMsg">Mensagem</label>
        <textarea
          id="contatoMsg"
          rows={4}
          value={mensagem}
          onChange={(e) => {
            setMensagem(e.target.value);
          }}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Enviar por WhatsApp
      </button>
    </form>
  );
}
