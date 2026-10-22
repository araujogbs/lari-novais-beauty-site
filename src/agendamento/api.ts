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

export const getSlots = (date: string, serviceIds: readonly number[], people: number) =>
  request<string[] | null>(
    `/appointments/available-slots?date=${date}&serviceIds=${serviceIds.join(',')}&people=${people}`,
  );

export const getAvailability = (from: string, days: number, serviceIds: readonly number[], people: number) =>
  request<DayAvailability[] | null>(
    `/appointments/availability?from=${from}&days=${days}&serviceIds=${serviceIds.join(',')}&people=${people}`,
  );

export const estimateFee = (cep: string) => request<FeeEstimate>(`/appointments/estimate-fee?cep=${cep}`);

export const createAppointment = (body: FormData) => request<unknown>('/appointments', { method: 'POST', body });

export const getMyAppointments = (phone: string) =>
  request<Appointment[] | null>(`/appointments/my-appointments?phone=${encodeURIComponent(phone)}`);

export const cancelAppointment = (id: number | string, phone: string) =>
  request<unknown>(`/appointments/${id}/client-cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
