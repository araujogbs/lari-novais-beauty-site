import { useEffect, useRef } from 'react';
import { sparkleBurst } from '../lib/motion';
import { brl } from '../utils';
import { type CalendarEvent, googleCalendarUrl, icsContent } from './calendar';
import type { BookingDoneInfo } from './types';

interface Props {
  info: BookingDoneInfo;
  onViewAppointments: () => void;
}

function downloadIcs(event: CalendarEvent): void {
  const url = URL.createObjectURL(new Blob([icsContent(event)], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agendamento-lari-novais.ics';
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function BookingDone({ info, onViewAppointments }: Props) {
  const check = useRef<HTMLDivElement>(null);

  // Chuva de estrelinhas saindo do símbolo de confirmação, depois da rolagem até ele.
  useEffect(() => {
    const id = setTimeout(() => {
      const r = check.current?.getBoundingClientRect();
      if (r) sparkleBurst(r.left + r.width / 2, r.top + r.height / 2);
    }, 450);
    return () => {
      clearTimeout(id);
    };
  }, []);

  const event: CalendarEvent = {
    title: `${info.serviceName} · Lari Novais Beauty`,
    details: 'Pedido de agendamento enviado pelo site, aguardando a confirmação da Lari pelo WhatsApp.',
    date: info.date,
    start: info.start,
    end: info.end,
  };

  return (
    <div className="ag-done">
      <div className="ag-check" ref={check}>
        &#10003;
      </div>
      <h3>Agendamento em análise</h3>
      <p>{info.nome.split(' ')[0]}, você receberá a confirmação pelo WhatsApp.</p>
      <div className="ag-summary">
        <div>
          <span>Serviço</span>
          <strong>{info.serviceName}</strong>
        </div>
        <div>
          <span>Quando</span>
          <strong>{info.when}</strong>
        </div>
        <div className="ag-total">
          <span>Total</span>
          <strong>{brl(info.total)}</strong>
        </div>
      </div>
      <div className="ag-save">
        <span className="ag-label">Salvar na sua agenda</span>
        <div className="ag-save-btns">
          <a className="btn btn-outline" href={googleCalendarUrl(event)} target="_blank" rel="noopener">
            Google Agenda
          </a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              downloadIcs(event);
            }}
          >
            Apple / Outlook
          </button>
        </div>
      </div>
      <p className="ag-hint">Para ver ou cancelar (com mais de 24 h de antecedência), use "Meus agendamentos".</p>
      <button type="button" className="btn btn-primary" onClick={onViewAppointments}>
        Ver meus agendamentos
      </button>
    </div>
  );
}
