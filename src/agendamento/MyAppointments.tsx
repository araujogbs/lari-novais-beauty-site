import { useState } from 'react';
import { brl, digits, fmtWhen, maskPhone } from '../utils';
import * as api from './api';
import { PixQr } from './PixQr';
import type { Appointment } from './types';
import { useAsync } from './useAsync';

interface Props {
  /** Telefone para buscar assim que o painel abrir (ex.: logo após agendar). */
  initialPhone?: string;
}

interface Query {
  phone: string;
  nonce: number;
}

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));
const isValidPhone = (p: string): boolean => digits(p).length >= 10;

/** Sinal ainda a pagar: confirmado, com valor e sem pagamento registrado. */
const owesDeposit = (a: Appointment): boolean => a.status === 'Confirmed' && !!a.depositAmount && !a.depositPaid;

export function MyAppointments({ initialPhone = '' }: Props) {
  const [phone, setPhone] = useState(initialPhone);
  const [query, setQuery] = useState<Query | null>(
    isValidPhone(initialPhone) ? { phone: initialPhone, nonce: 0 } : null,
  );
  const [formError, setFormError] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [copied, setCopied] = useState<Appointment['id'] | null>(null);

  const copyPix = async (a: Appointment): Promise<void> => {
    if (!a.pixCode) return;
    try {
      await navigator.clipboard.writeText(a.pixCode);
      setCopied(a.id);
    } catch {
      setCancelError('Não foi possível copiar. Selecione o código e copie manualmente.');
    }
  };

  const result = useAsync<Appointment[] | null>(query ? `${query.phone}|${query.nonce}` : null, () =>
    api.getMyAppointments(query?.phone ?? ''),
  );

  const search = (): void => {
    setCancelError('');
    if (!isValidPhone(phone)) {
      setFormError('Informe um WhatsApp válido.');
      return;
    }
    setFormError('');
    setQuery((q) => ({ phone, nonce: (q?.nonce ?? 0) + 1 }));
  };

  const cancel = async (id: Appointment['id']): Promise<void> => {
    if (!query || !confirm('Cancelar este agendamento?')) return;
    setCancelError('');
    try {
      await api.cancelAppointment(id, query.phone);
      setQuery({ phone: query.phone, nonce: query.nonce + 1 });
    } catch (e) {
      setCancelError(errMsg(e));
    }
  };

  const error = formError || cancelError || (result.status === 'error' ? result.message : '');

  return (
    <>
      <p className="ag-hint">Digite o WhatsApp usado no agendamento para ver seus horários futuros.</p>
      <div className="ag-lookup">
        <input
          type="tel"
          placeholder="(11) 91234-5678"
          aria-label="WhatsApp usado no agendamento"
          value={phone}
          onChange={(e) => {
            setPhone(maskPhone(e.target.value));
          }}
        />
        <button type="button" className="btn btn-primary" onClick={search}>
          Buscar
        </button>
      </div>
      {error && <p className="ag-msg">{error}</p>}
      <div>
        {result.status === 'loading' && <p className="ag-hint">Buscando…</p>}
        {result.status === 'ready' && !result.data?.length && (
          <p className="ag-hint">Nenhum agendamento futuro encontrado para este número.</p>
        )}
        {result.status === 'ready' &&
          result.data?.map((a) => (
            <div className="ag-appt" key={a.id}>
              <div>
                <strong>{a.serviceName}</strong>
                {a.status === 'Pending' ? (
                  <em className="ag-status ag-status--pending">Em análise</em>
                ) : (
                  <em className="ag-status ag-status--confirmed">Confirmado</em>
                )}
                <span>{fmtWhen(a.startTime)}</span>
                {a.clientAddress && <span>{a.clientAddress}</span>}
                {owesDeposit(a) && (
                  <span className="ag-deposit">
                    Sinal para garantir o horário: <strong>{brl(a.depositAmount ?? 0)}</strong>
                    {a.pixCode ? ' (PIX copia e cola)' : '. A Lari envia a chave PIX por WhatsApp.'}
                  </span>
                )}
                {a.status === 'Confirmed' && a.depositPaid && (
                  <span className="ag-deposit">Sinal recebido. Obrigada!</span>
                )}
                {owesDeposit(a) && a.pixCode && (
                  <div className="ag-pix-box">
                    <div className="ag-pix-text">
                      <code className="ag-pix">{a.pixCode}</code>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          void copyPix(a);
                        }}
                      >
                        {copied === a.id ? 'Código copiado!' : 'Copiar PIX'}
                      </button>
                    </div>
                    <PixQr code={a.pixCode} />
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  void cancel(a.id);
                }}
              >
                Cancelar
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
