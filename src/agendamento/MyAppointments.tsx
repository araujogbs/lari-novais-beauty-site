import { useState } from 'react';
import { brl, fmtWhen, waLink } from '../utils';
import * as api from './api';
import { getTokens } from './myBookings';
import { PixQr } from './PixQr';
import type { Appointment } from './types';
import { useAsync } from './useAsync';

interface Props {
  /** Muda quando a aba é aberta ou um agendamento acaba de ser feito, para buscar de novo. */
  refreshKey?: number;
}

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/** Sinal ainda a pagar: confirmado, com valor e sem pagamento registrado. */
const owesDeposit = (a: Appointment): boolean => a.status === 'Confirmed' && !!a.depositAmount && !a.depositPaid;

export function MyAppointments({ refreshKey = 0 }: Props) {
  const [nonce, setNonce] = useState(0);
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

  // Só aparecem os agendamentos cujo código secreto está neste aparelho (feitos aqui ou abertos pelo link do WhatsApp).
  const tokens = getTokens();
  const result = useAsync<Appointment[] | null>(
    tokens.length ? `${tokens.join(',')}|${refreshKey}|${nonce}` : null,
    () => api.lookupAppointments(tokens),
  );

  const cancel = async (a: Appointment): Promise<void> => {
    if (!a.manageToken || !confirm('Cancelar este agendamento?')) return;
    setCancelError('');
    try {
      await api.cancelAppointment(a.id, a.manageToken);
      setNonce((n) => n + 1);
    } catch (e) {
      setCancelError(errMsg(e));
    }
  };

  const error = cancelError || (result.status === 'error' ? result.message : '');

  return (
    <>
      {error && <p className="ag-msg">{error}</p>}
      {!tokens.length && (
        <p className="ag-hint">
          Nenhum agendamento neste aparelho. Por segurança, só aparecem os agendamentos feitos aqui ou abertos pelo link
          que chega por WhatsApp. Precisa de ajuda?{' '}
          <a href={waLink()} target="_blank" rel="noopener">
            Fale com a Lari
          </a>
          .
        </p>
      )}
      <div>
        {result.status === 'loading' && <p className="ag-hint">Buscando…</p>}
        {result.status === 'ready' && !result.data?.length && (
          <p className="ag-hint">Nenhum agendamento futuro encontrado.</p>
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
                  void cancel(a);
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
