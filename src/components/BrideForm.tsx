import { useState } from 'react';
import { buildBrideMessage, openWhatsapp } from '../whatsapp';

export function BrideForm() {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [mensagem, setMensagem] = useState('');

  return (
    <form
      className="noivas-form"
      onSubmit={(e) => {
        e.preventDefault();
        openWhatsapp(buildBrideMessage({ nome, data, local, mensagem }));
      }}
    >
      <div className="form-group form-full">
        <label htmlFor="noivaNome">Nome da noiva</label>
        <input
          type="text"
          id="noivaNome"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="noivaData">Data do casamento</label>
        <input
          type="date"
          id="noivaData"
          value={data}
          onChange={(e) => {
            setData(e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="noivaLocal">Local do evento</label>
        <input
          type="text"
          id="noivaLocal"
          placeholder="Cidade / Local"
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
          }}
        />
      </div>
      <div className="form-group form-full">
        <label htmlFor="noivaMsg">Mensagem</label>
        <textarea
          id="noivaMsg"
          rows={4}
          placeholder="Conte sobre o seu casamento e o seu desejo de beleza de noiva. Como você se imagina no seu grande dia?"
          value={mensagem}
          onChange={(e) => {
            setMensagem(e.target.value);
          }}
        />
      </div>
      <div className="form-submit">
        <button type="submit" className="btn btn-primary">
          Quero falar sobre o meu casamento
        </button>
      </div>
    </form>
  );
}
