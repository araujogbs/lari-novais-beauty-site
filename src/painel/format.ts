import { digits } from '../utils';
import type { AdminAppointment } from './types';

const TZ = 'America/Sao_Paulo';

/** Datas sem fuso vindas da API são UTC. */
const asDate = (iso: string): Date => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : iso + 'Z');

/** "14:30" no fuso de Brasília. */
export const fmtTime = (iso: string): string =>
  asDate(iso).toLocaleTimeString('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });

/** "sex., 17/10" no fuso de Brasília. */
export const fmtDay = (iso: string): string =>
  asDate(iso).toLocaleDateString('pt-BR', { timeZone: TZ, weekday: 'short', day: '2-digit', month: '2-digit' });

/** Link do WhatsApp da cliente com uma mensagem pronta. */
export function clientWhatsApp(a: AdminAppointment): string {
  let phone = digits(a.clientPhone);
  if (phone.length <= 11) phone = `55${phone}`; // sem DDI
  const text = `Olá ${a.clientName}, tudo bem? Passando para falar do seu atendimento de ${a.serviceItem?.name ?? 'beleza'}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const mapsLink = (address: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const isValidTime = (t: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
