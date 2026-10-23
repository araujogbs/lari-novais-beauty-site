/* Rotas protegidas da AgendamentoApi usadas pelo Painel Ateliê. */
import { ApiError } from '../agendamento/api';
import { API_URL } from '../config';
import type { AdminAppointment, BlockPayload } from './types';

/** O token venceu ou foi recusado: o painel volta para o login. */
export class SessionExpiredError extends ApiError {
  constructor() {
    super('Sua sessão expirou. Entre de novo.', 401);
    this.name = 'SessionExpiredError';
  }
}

async function call<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(API_URL + path, { ...init, headers });
  if (res.status === 401 || res.status === 403) throw new SessionExpiredError();

  const txt = await res.text();
  let data: unknown = null;
  try {
    data = txt ? JSON.parse(txt) : null;
  } catch {
    /* corpo não-JSON */
  }
  if (!res.ok) {
    const apiMsg = (data as { message?: string } | null)?.message;
    throw new ApiError(apiMsg || `Algo deu errado (${res.status}).`, res.status);
  }
  return data as T;
}

const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, json({ username, password }));
  if (res.ok) {
    const { token } = (await res.json()) as { token: string };
    return token;
  }
  const message =
    res.status === 401
      ? 'Usuário ou senha incorretos.'
      : res.status === 429
        ? 'Muitas tentativas. Aguarde um minuto e tente de novo.'
        : res.status === 503
          ? 'O servidor ainda não tem o usuário administrador configurado.'
          : `Não foi possível entrar (${res.status}).`;
  throw new ApiError(message, res.status);
}

export const getDay = (token: string, date: string) =>
  call<AdminAppointment[] | null>(token, `/appointments?date=${date}`);

export const getPending = (token: string) => call<AdminAppointment[] | null>(token, '/appointments/pending');

export const approve = (token: string, id: number) =>
  call<unknown>(token, `/appointments/${id}/approve`, { method: 'POST' });

export const reject = (token: string, id: number, reason: string) =>
  call<unknown>(token, `/appointments/${id}/reject`, json({ reason: reason.trim() || null }));

/**
 * Link do WhatsApp da cliente com a mensagem pronta: confirmação (com sinal e PIX) para pedido confirmado,
 * ou aviso de recusa (com o motivo) para pedido recusado.
 */
export const getClientMessage = (token: string, id: number, reason?: string) =>
  call<{ url: string }>(
    token,
    `/appointments/${id}/client-message${reason?.trim() ? `?reason=${encodeURIComponent(reason.trim())}` : ''}`,
  );

/** Marca que o sinal do pedido confirmado foi recebido. */
export const markDepositPaid = (token: string, id: number) =>
  call<unknown>(token, `/appointments/${id}/deposit-paid`, { method: 'POST' });

/** Desmarca um atendimento ou desfaz um bloqueio (a API espera a string JSON "Cancelled"). */
export const cancel = (token: string, id: number) =>
  call<unknown>(token, `/appointments/${id}/status`, { ...json('Cancelled'), method: 'PATCH' });

export const blockSlot = (token: string, payload: BlockPayload) =>
  call<unknown>(token, '/appointments/block-slot', json(payload));

/** Chave pública do VAPID, que o navegador usa para assinar o aviso (rota pública). */
export async function getWebPushKey(): Promise<{ publicKey: string }> {
  const res = await fetch(`${API_URL}/push/web/public-key`);
  if (!res.ok) throw new ApiError('Avisos no navegador indisponíveis no servidor.', res.status);
  return (await res.json()) as { publicKey: string };
}

export interface WebPushSubscriptionData {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/** Cadastra este navegador para receber o aviso de pedido novo. */
export const subscribeWebPush = (token: string, subscription: WebPushSubscriptionData) =>
  call<unknown>(token, '/push/web/subscribe', json(subscription));

export const unsubscribeWebPush = (token: string, endpoint: string) =>
  call<unknown>(token, '/push/web/unsubscribe', json({ endpoint }));

/** Foto de referência (rota protegida): baixa com o token e devolve o arquivo. */
export async function fetchImage(token: string, name: string): Promise<Blob> {
  const res = await fetch(`${API_URL}/appointments/images/${encodeURIComponent(name)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) throw new SessionExpiredError();
  if (!res.ok) throw new ApiError('Foto indisponível.', res.status);
  return res.blob();
}
