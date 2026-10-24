import { useState } from 'react';
import { brl } from '../utils';
import { clientWhatsApp, fmtDay, fmtTime, mapsLink } from './format';
import { ProtectedImage } from './ProtectedImage';
import type { AdminAppointment, AdminStatus } from './types';

interface Props {
  item: AdminAppointment;
  token: string;
  /** Mostra a data junto do horário (na lista de pedidos em análise, que mistura dias). */
  showDate?: boolean;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number, reason: string) => Promise<void>;
  onDepositPaid: (id: number) => Promise<void>;
  /** Monta a mensagem de confirmação (com o PIX) para enviar à cliente pelo WhatsApp. */
  onSendMessage: (item: AdminAppointment) => Promise<void>;
  onCancel: (item: AdminAppointment) => Promise<void>;
  onOpenImage: (url: string) => void;
}

const BADGES: Record<AdminStatus, string> = {
  Pending: 'Em análise',
  Confirmed: 'Confirmado',
  Rejected: 'Recusado',
  Expired: 'Expirado',
  Cancelled: 'Cancelado',
  Blocked: 'Bloqueado',
};

/** Um atendimento (ou bloqueio) no painel, com as ações possíveis para o status dele. */
export function AppointmentCard({
  item,
  token,
  showDate = false,
  onApprove,
  onReject,
  onDepositPaid,
  onSendMessage,
  onCancel,
  onOpenImage,
}: Props) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const people = item.people ?? 1;
  const isPending = item.status === 'Pending';
  const isBlocked = item.status === 'Blocked';
  const isInactive = item.status === 'Cancelled' || item.status === 'Rejected' || item.status === 'Expired';
  const images = item.referenceImages ?? [];
  const servicePrice = item.totalPrice ?? (item.serviceItem?.price ?? 0) * people;
  const serviceLabel = item.serviceNames ?? item.serviceItem?.name ?? 'Serviço';
  const owesDeposit = item.status === 'Confirmed' && !!item.depositAmount && !item.depositPaidAt;

  const run = async (action: () => Promise<void>): Promise<void> => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className={`pn-card pn-card--${item.status.toLowerCase()}`}>
      <header className="pn-card-head">
        <div>
          <h4>{isBlocked ? 'Agenda bloqueada' : item.clientName}</h4>
          <p className="pn-when">
            {showDate && `${fmtDay(item.startTime)} · `}
            {fmtTime(item.startTime)} às {fmtTime(item.endTime)}
            {!isBlocked && ` · ${serviceLabel}${people > 1 ? ` (${people} clientes)` : ''}`}
          </p>
          {isPending && item.expiresAt && (
            <p className="pn-deadline">
              Responder até {fmtDay(item.expiresAt)}, {fmtTime(item.expiresAt)} (depois expira sozinho)
            </p>
          )}
        </div>
        <span className={`pn-badge pn-badge--${item.status.toLowerCase()}`}>{BADGES[item.status]}</span>
      </header>

      {isBlocked ? (
        <p className="pn-line">Motivo: {item.clientName.replace('[BLOQUEIO] ', '')}</p>
      ) : (
        <>
          <p className="pn-line">WhatsApp: {item.clientPhone}</p>
          {item.clientAddress && <p className="pn-line">Local: {item.clientAddress}</p>}
          <p className="pn-line">
            Serviço {brl(servicePrice)}
            {typeof item.travelFee === 'number' && typeof item.distanceKm === 'number' && (
              <>
                {' · '}
                {item.travelFee > 0
                  ? `deslocamento ${brl(item.travelFee)} (${item.distanceKm.toFixed(1).replace('.', ',')} km) · total ${brl(servicePrice + item.travelFee)}`
                  : `deslocamento gratuito (${item.distanceKm.toFixed(1).replace('.', ',')} km)`}
              </>
            )}
          </p>
          {item.status === 'Confirmed' && !!item.depositAmount && (
            <p className="pn-line">
              Sinal {brl(item.depositAmount)}:{' '}
              {item.depositPaidAt ? <strong>recebido</strong> : <strong>aguardando pagamento</strong>}
            </p>
          )}
          {item.description && <p className="pn-desc">{item.description}</p>}
          {images.length > 0 && (
            <div className="pn-thumbs">
              {images.map((name, i) => (
                <ProtectedImage
                  key={name}
                  token={token}
                  name={name}
                  alt={`Foto de referência ${i + 1} de ${item.clientName}`}
                  onOpen={onOpenImage}
                />
              ))}
            </div>
          )}
        </>
      )}

      {rejecting ? (
        <div className="pn-reject">
          <label htmlFor={`pnMotivo${item.id}`}>Motivo (opcional, vai na mensagem para a cliente)</label>
          <input
            id={`pnMotivo${item.id}`}
            type="text"
            maxLength={300}
            placeholder="Ex.: já tenho um evento nesse dia"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />
          <div className="pn-actions">
            <button
              type="button"
              className="pn-btn"
              disabled={busy}
              onClick={() => {
                setRejecting(false);
                setReason('');
              }}
            >
              Voltar
            </button>
            <button
              type="button"
              className="pn-btn pn-btn--danger"
              disabled={busy}
              onClick={() => void run(() => onReject(item.id, reason))}
            >
              {busy ? 'Recusando…' : 'Confirmar recusa'}
            </button>
          </div>
        </div>
      ) : (
        <div className="pn-actions">
          {isPending && (
            <>
              <button
                type="button"
                className="pn-btn pn-btn--ok"
                disabled={busy}
                onClick={() => void run(() => onApprove(item.id))}
              >
                {busy ? 'Aprovando…' : 'Aprovar'}
              </button>
              <button
                type="button"
                className="pn-btn pn-btn--danger-outline"
                disabled={busy}
                onClick={() => {
                  setRejecting(true);
                }}
              >
                Recusar
              </button>
            </>
          )}
          {!isBlocked && !isInactive && (
            <>
              <a className="pn-btn" href={clientWhatsApp(item)} target="_blank" rel="noopener">
                WhatsApp
              </a>
              {item.clientAddress && (
                <a className="pn-btn" href={mapsLink(item.clientAddress)} target="_blank" rel="noopener">
                  Mapa
                </a>
              )}
            </>
          )}
          {item.status === 'Confirmed' && (
            <button
              type="button"
              className="pn-btn"
              disabled={busy}
              onClick={() => void run(() => onSendMessage(item))}
            >
              {owesDeposit ? 'Enviar PIX pelo WhatsApp' : 'Enviar confirmação'}
            </button>
          )}
          {owesDeposit && (
            <button
              type="button"
              className="pn-btn pn-btn--ok"
              disabled={busy}
              onClick={() => void run(() => onDepositPaid(item.id))}
            >
              {busy ? 'Salvando…' : 'Sinal recebido'}
            </button>
          )}
          {(item.status === 'Confirmed' || isBlocked) && (
            <button
              type="button"
              className="pn-btn pn-btn--danger-outline"
              disabled={busy}
              onClick={() => void run(() => onCancel(item))}
            >
              {isBlocked ? 'Desbloquear' : 'Desmarcar'}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
