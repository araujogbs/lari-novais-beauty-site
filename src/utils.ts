import { whatsappUrl } from './whatsapp';

export function brl(n: number | string | null | undefined): string {
  return 'R$ ' + (Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const digits = (v: string | null | undefined): string => (v ?? '').replace(/\D/g, '');

/** "2026-10-15" -> "15/10/2026" */
export const fmtDateBR = (iso: string): string => (iso ? iso.split('-').reverse().join('/') : '');

/** Brasília é UTC-3 o ano todo (sem horário de verão desde 2019). */
const BRASILIA_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Data de hoje (AAAA-MM-DD) em Brasília, independente do fuso do aparelho de quem abre o site. */
export function todayISO(): string {
  return new Date(Date.now() - BRASILIA_OFFSET_MS).toISOString().slice(0, 10);
}

/** Data/hora legível no fuso de Brasília. Datas sem fuso vindas da API são tratadas como UTC. */
export function fmtWhen(iso: string): string {
  const withZone = /[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : iso + 'Z';
  return new Date(withZone).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Só os dígitos do telefone, sem o 55 do país quando o número vem com ele (colado de "+55 11 91234-5678"). */
function nationalDigits(v: string): string {
  const d = digits(v).slice(0, 13);
  return d.length >= 12 && d.startsWith('55') ? d.slice(2) : d;
}

/** Telefone brasileiro com DDD: celular tem 11 dígitos e começa com 9 depois do DDD; fixo tem 10. */
export function isValidPhone(v: string): boolean {
  const d = nationalDigits(v);
  if (!/^[1-9]\d/.test(d)) return false; // DDD de 11 a 99
  return d.length === 11 ? d[2] === '9' : d.length === 10 && /[2-5]/.test(d[2] ?? '');
}

export function maskPhone(v: string): string {
  const d = nationalDigits(v).slice(0, 11);
  if (d.length <= 2) return d ? '(' + d : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCep(v: string): string {
  const d = digits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export const waLink = (text = 'Olá, vim pelo site e gostaria de agendar um atendimento social.'): string =>
  whatsappUrl(text);
