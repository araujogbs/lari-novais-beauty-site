import { useEffect, useState } from 'react';

type Settled<T> = { key: string; data: T } | { key: string; error: Error };

export type AsyncState<T> =
  { status: 'idle' } | { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error'; message: string };

/**
 * Busca assíncrona dependente de uma chave. Passe `key = null` para ficar ocioso.
 * O estado "carregando" é derivado (resultado ainda não corresponde à chave atual),
 * então respostas de chaves antigas nunca sobrescrevem a atual.
 */
export function useAsync<T>(key: string | null, fetcher: () => Promise<T>, onData?: (data: T) => void): AsyncState<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    fetcher().then(
      (data) => {
        if (cancelled) return;
        setSettled({ key, data });
        onData?.(data);
      },
      (e: unknown) => {
        if (!cancelled) setSettled({ key, error: e instanceof Error ? e : new Error(String(e)) });
      },
    );
    return () => {
      cancelled = true;
    };
    // `fetcher` e `onData` mudam a cada render; só a chave deve disparar nova busca.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (key === null) return { status: 'idle' };
  if (settled?.key !== key) return { status: 'loading' };
  return 'error' in settled
    ? { status: 'error', message: settled.error.message }
    : { status: 'ready', data: settled.data };
}
