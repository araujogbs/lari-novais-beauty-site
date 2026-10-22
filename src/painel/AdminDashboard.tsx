import { useEffect, useState } from 'react';
import { fmtDateBR, todayISO } from '../utils';
import * as adminApi from './adminApi';
import { SessionExpiredError } from './adminApi';
import { AppointmentCard } from './AppointmentCard';
import { BlockForm } from './BlockForm';
import type { AdminAppointment, BlockPayload } from './types';

interface Props {
  token: string;
  onExpired: () => void;
}

interface Loaded {
  day: AdminAppointment[];
  pending: AdminAppointment[];
}

type LoadResult = { key: string; date: string } & ({ data: Loaded } | { error: string });

interface Notice {
  text: string;
  kind: 'ok' | 'warn' | 'error';
}

/** Soma dias a uma data AAAA-MM-DD (em horário local, sem fuso). */
function shiftDate(iso: string, days: number): string {
  const [y = 0, m = 1, d = 1] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/** Pedidos em análise (todas as datas), agenda do dia e bloqueios. */
export function AdminDashboard({ token, onExpired }: Props) {
  const [date, setDate] = useState(todayISO);
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<LoadResult | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showBlock, setShowBlock] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Cada busca tem uma chave (dia + recarregamento). Depois de uma ação, os dados do mesmo dia
  // continuam na tela enquanto a nova busca não chega; ao trocar de dia, mostra "Carregando…".
  const key = `${date}|${nonce}`;
  const data = result?.date === date && 'data' in result ? result.data : null;
  const loadError = result?.key === key && 'error' in result ? result.error : '';
  const loading = result?.key !== key;

  const reload = (): void => {
    setNonce((n) => n + 1);
  };

  // Carrega a agenda do dia e os pedidos em análise; recarrega ao trocar o dia ou depois de cada ação
  useEffect(() => {
    let cancelled = false;
    Promise.all([adminApi.getDay(token, date), adminApi.getPending(token)]).then(
      ([day, pending]) => {
        if (!cancelled) setResult({ key, date, data: { day: day ?? [], pending: pending ?? [] } });
      },
      (e: unknown) => {
        if (cancelled) return;
        if (e instanceof SessionExpiredError) onExpired();
        else setResult({ key, date, error: errMsg(e) || 'Não foi possível carregar a agenda.' });
      },
    );
    return () => {
      cancelled = true;
    };
    // `onExpired` muda a cada render do pai; a busca depende só do token, do dia e do recarregamento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, key]);

  // O aviso some sozinho depois de alguns segundos
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => {
      setNotice(null);
    }, 6000);
    return () => {
      clearTimeout(t);
    };
  }, [notice]);

  // Esc fecha a foto ampliada
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox]);

  /** Executa uma ação, mostra o resultado e recarrega a agenda. */
  const act = async (action: () => Promise<unknown>, success: Notice): Promise<void> => {
    try {
      await action();
      setNotice(success);
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        onExpired();
        return;
      }
      setNotice({ text: errMsg(e), kind: 'error' });
    }
    reload();
  };

  const handleApprove = (id: number) =>
    act(() => adminApi.approve(token, id), {
      text: 'Agendamento confirmado. A cliente recebe a confirmação, com o PIX do sinal, pelo WhatsApp.',
      kind: 'ok',
    });

  const handleReject = (id: number, reason: string) =>
    act(() => adminApi.reject(token, id, reason), {
      text: 'Pedido recusado. O horário foi liberado e a cliente será avisada pelo WhatsApp.',
      kind: 'warn',
    });

  const handleDepositPaid = (id: number) =>
    act(() => adminApi.markDepositPaid(token, id), {
      text: 'Sinal registrado como recebido.',
      kind: 'ok',
    });

  const handleCancel = async (item: AdminAppointment): Promise<void> => {
    const isBlock = item.status === 'Blocked';
    if (!confirm(isBlock ? 'Desbloquear este horário?' : `Desmarcar o atendimento de ${item.clientName}?`)) return;
    await act(() => adminApi.cancel(token, item.id), {
      text: isBlock ? 'Horário desbloqueado.' : 'Atendimento desmarcado.',
      kind: 'ok',
    });
  };

  const handleBlock = async (payload: BlockPayload): Promise<void> => {
    try {
      await adminApi.blockSlot(token, payload);
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        onExpired();
        return;
      }
      throw e; // o formulário mostra o erro
    }
    setShowBlock(false);
    setNotice({ text: payload.startTime ? 'Intervalo bloqueado.' : 'Dia bloqueado.', kind: 'ok' });
    reload();
  };

  const cardProps = {
    token,
    onApprove: handleApprove,
    onReject: handleReject,
    onDepositPaid: handleDepositPaid,
    onCancel: handleCancel,
    onOpenImage: setLightbox,
  };

  return (
    <div className="pn-dash">
      {notice && (
        <div className={`pn-notice pn-notice--${notice.kind}`} role="status">
          {notice.text}
        </div>
      )}

      <section className="pn-section" aria-labelledby="pnPendentes">
        <h3 id="pnPendentes">
          Pedidos em análise{' '}
          {data && data.pending.length > 0 && <span className="pn-count">{data.pending.length}</span>}
        </h3>
        <p className="pn-hint">A cliente só recebe a confirmação depois que você aprovar.</p>
        {!data && loading && <p className="pn-hint">Carregando…</p>}
        {data?.pending.length === 0 && <p className="pn-empty">Nenhum pedido aguardando análise.</p>}
        {data?.pending.map((item) => (
          <AppointmentCard key={item.id} item={item} showDate {...cardProps} />
        ))}
      </section>

      <section className="pn-section" aria-labelledby="pnAgenda">
        <div className="pn-day-head">
          <h3 id="pnAgenda">Agenda de {fmtDateBR(date)}</h3>
          <div className="pn-day-nav">
            <button
              type="button"
              className="pn-btn"
              aria-label="Dia anterior"
              onClick={() => {
                setDate((d) => shiftDate(d, -1));
              }}
            >
              ‹
            </button>
            <input
              type="date"
              aria-label="Escolher dia"
              value={date}
              onChange={(e) => {
                if (e.target.value) setDate(e.target.value);
              }}
            />
            <button
              type="button"
              className="pn-btn"
              aria-label="Próximo dia"
              onClick={() => {
                setDate((d) => shiftDate(d, 1));
              }}
            >
              ›
            </button>
            <button
              type="button"
              className="pn-btn"
              onClick={() => {
                setDate(todayISO());
              }}
            >
              Hoje
            </button>
          </div>
        </div>

        {showBlock ? (
          <BlockForm
            date={date}
            onSubmit={handleBlock}
            onClose={() => {
              setShowBlock(false);
            }}
          />
        ) : (
          <button
            type="button"
            className="pn-btn pn-btn--primary pn-block-btn"
            onClick={() => {
              setShowBlock(true);
            }}
          >
            Bloquear agenda neste dia
          </button>
        )}

        {loadError && (
          <p className="pn-error" role="alert">
            {loadError}{' '}
            <button type="button" className="pn-link" onClick={reload}>
              Tentar de novo
            </button>
          </p>
        )}
        {!data && loading && <p className="pn-hint">Carregando…</p>}
        {data?.day.length === 0 && <p className="pn-empty">Nenhum atendimento neste dia.</p>}
        {data?.day.map((item) => (
          <AppointmentCard key={item.id} item={item} {...cardProps} />
        ))}
      </section>

      {lightbox && (
        <div
          className="pn-lightbox"
          role="dialog"
          aria-label="Foto de referência"
          onClick={() => {
            setLightbox(null);
          }}
        >
          <img src={lightbox} alt="Foto de referência ampliada" />
          <button type="button" className="pn-lightbox-close" aria-label="Fechar">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
