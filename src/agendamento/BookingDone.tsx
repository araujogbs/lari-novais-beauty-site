import { brl } from '../utils';
import type { BookingDoneInfo } from './types';

interface Props {
  info: BookingDoneInfo;
  onViewAppointments: () => void;
}

export function BookingDone({ info, onViewAppointments }: Props) {
  return (
    <div className="ag-done">
      <div className="ag-check">&#10003;</div>
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
      <p className="ag-hint">Para ver ou cancelar (com mais de 24 h de antecedência), use "Meus agendamentos".</p>
      <button type="button" className="btn btn-primary" onClick={onViewAppointments}>
        Ver meus agendamentos
      </button>
    </div>
  );
}
