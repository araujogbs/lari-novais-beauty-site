/* Widget de agendamento do Atendimento Social.
   Conversa com a AgendamentoApi (.NET). A URL base vem de VITE_AGENDAMENTO_API. */
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../config';
import { waLink } from '../utils';
import { BookingDone } from './BookingDone';
import { MyAppointments } from './MyAppointments';
import { NewBooking } from './NewBooking';
import type { BookingDoneInfo } from './types';
import { useServices } from './useServices';

type Tab = 'novo' | 'meus';

export function AgendamentoWidget() {
  const [tab, setTab] = useState<Tab>('novo');
  const [done, setDone] = useState<BookingDoneInfo | null>(null);
  const [lookupPhone, setLookupPhone] = useState('');
  const services = useServices();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) root.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [done]);

  if (!API_URL) {
    return (
      <div className="ag">
        <p className="ag-msg">
          Agendamento online indisponível.{' '}
          <a href={waLink()} target="_blank" rel="noopener">
            Agende pelo WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="ag" id="agendaApp" ref={root}>
        <BookingDone
          info={done}
          onViewAppointments={() => {
            setLookupPhone(done.fone);
            setDone(null);
            setTab('meus');
          }}
        />
      </div>
    );
  }

  return (
    <div className="ag" id="agendaApp" ref={root}>
      <div className="ag-tabs">
        <button
          type="button"
          className={tab === 'novo' ? 'ag-tab active' : 'ag-tab'}
          onClick={() => {
            setTab('novo');
          }}
        >
          Novo agendamento
        </button>
        <button
          type="button"
          className={tab === 'meus' ? 'ag-tab active' : 'ag-tab'}
          onClick={() => {
            setTab('meus');
          }}
        >
          Meus agendamentos
        </button>
      </div>
      {/* Os dois painéis ficam montados para preservar o que foi digitado ao trocar de aba. */}
      <div className="ag-panel" id="agNovo" hidden={tab !== 'novo'}>
        <NewBooking services={services} onBooked={setDone} />
      </div>
      <div className="ag-panel" id="agMeus" hidden={tab !== 'meus'}>
        <MyAppointments initialPhone={lookupPhone} />
      </div>
    </div>
  );
}
