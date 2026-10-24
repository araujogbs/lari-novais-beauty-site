import { API_URL } from '../config';
import type { Appointment, DayAvailability, FeeEstimate, Service } from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_URL + path, init);
  const txt = await res.text();
  let data: unknown = null;
  try {
    data = txt ? JSON.parse(txt) : null;
  } catch {
    /* corpo não-JSON */
  }
  if (!res.ok) {
    const apiMsg = (data as { message?: string } | null)?.message;
    const msg =
      apiMsg ||
      (res.status === 429
        ? 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
        : `Algo deu errado (${res.status}).`);
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

export const getServices = () => request<Service[] | null>('/services');

/** `groups` são os serviços de cada pessoa, no formato "1,2;2" (veja `groupsParam`). */
export const getSlots = (date: string, groups: string) =>
  request<string[] | null>(`/appointments/available-slots?date=${date}&groups=${encodeURIComponent(groups)}`);

export const getAvailability = (from: string, days: number, groups: string) =>
  request<DayAvailability[] | null>(
    `/appointments/availability?from=${from}&days=${days}&groups=${encodeURIComponent(groups)}`,
  );

export const estimateFee = (cep: string) => request<FeeEstimate>(`/appointments/estimate-fee?cep=${cep}`);

/** Devolve o código secreto do agendamento, que a cliente usa para acompanhar e cancelar. */
export const createAppointment = (body: FormData) =>
  request<{ id: number; manageToken: string } | null>('/appointments', { method: 'POST', body });

/** Agendamentos futuros dos códigos secretos guardados neste aparelho. */
export const lookupAppointments = (tokens: readonly string[]) =>
  request<Appointment[] | null>('/appointments/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokens }),
  });

export const cancelAppointment = (id: number | string, token: string) =>
  request<unknown>(`/appointments/${id}/client-cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
