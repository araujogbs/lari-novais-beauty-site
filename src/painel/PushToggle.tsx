import { useEffect, useState } from 'react';
import { SessionExpiredError } from './adminApi';
import { disablePush, enablePush, pushState, pushSupport, type PushState } from './webPush';

interface Props {
  token: string;
  onExpired: () => void;
}

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/** Liga e desliga o aviso de pedido novo neste aparelho, com as instruções para o iPhone. */
export function PushToggle({ token, onExpired }: Props) {
  const support = pushSupport();
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (support !== 'ready') return;
    let cancelled = false;
    void pushState().then((s) => {
      if (!cancelled) setState(s);
    });
    return () => {
      cancelled = true;
    };
  }, [support]);

  if (support === 'unsupported') return null;

  if (support === 'needs-install') {
    return (
      <section className="pn-push" aria-label="Avisos de pedido novo">
        <h3>Receber aviso de pedido novo</h3>
        <p className="pn-hint">
          No iPhone, o aviso só funciona com o painel na Tela de Início: toque em <strong>Compartilhar</strong> (o
          quadrado com a seta, na barra do Safari), depois em <strong>Adicionar à Tela de Início</strong>, e abra o
          painel pelo ícone novo. Aí volte aqui e toque em <strong>Ativar avisos</strong>.
        </p>
      </section>
    );
  }

  const run = async (action: () => Promise<void>, next: PushState): Promise<void> => {
    setBusy(true);
    setError('');
    try {
      await action();
      setState(next);
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        onExpired();
        return;
      }
      setError(errMsg(e));
      setState(await pushState());
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="pn-push" aria-label="Avisos de pedido novo">
      <h3>Receber aviso de pedido novo</h3>
      {state === 'on' && (
        <>
          <p className="pn-hint">
            Avisos ativados neste aparelho: você recebe uma notificação quando chegar um pedido.
          </p>
          <button
            type="button"
            className="pn-btn"
            disabled={busy}
            onClick={() => void run(() => disablePush(token), 'off')}
          >
            {busy ? 'Desativando…' : 'Desativar avisos'}
          </button>
        </>
      )}
      {state === 'off' && (
        <>
          <p className="pn-hint">Ative para ser avisada na hora quando alguém pedir um agendamento.</p>
          <button
            type="button"
            className="pn-btn pn-btn--ok"
            disabled={busy}
            onClick={() => void run(() => enablePush(token), 'on')}
          >
            {busy ? 'Ativando…' : 'Ativar avisos'}
          </button>
        </>
      )}
      {state === 'blocked' && (
        <p className="pn-hint">
          As notificações estão bloqueadas. No iPhone, abra Ajustes → Notificações → Painel Lari e permita; depois volte
          aqui.
        </p>
      )}
      {error && (
        <p className="pn-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
