import { WHATSAPP } from './config';

/** Escapa texto para uso seguro em innerHTML. */
export function esc(t: string | number | null | undefined): string {
  const d = document.createElement('div');
  d.textContent = t === null || t === undefined ? '' : String(t);
  return d.innerHTML;
}

export function brl(n: number | string | null | undefined): string {
  return 'R$ ' + (Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const digits = (v: string | null | undefined): string => (v ?? '').replace(/\D/g, '');

/** "2026-10-15" -> "15/10/2026" */
export const fmtDateBR = (iso: string): string => (iso ? iso.split('-').reverse().join('/') : '');

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

export function maskPhone(v: string): string {
  const d = digits(v).slice(0, 11);
  if (d.length <= 2) return d ? '(' + d : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCep(v: string): string {
  const d = digits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function waLink(text = 'Olá, vim pelo site e gostaria de agendar um atendimento social.'): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/** querySelector que falha alto se o elemento não existir. */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- T é o ponto de asserção de tipo do DOM
export function must<T extends Element>(parent: ParentNode, selector: string): T {
  const el = parent.querySelector<T>(selector);
  if (!el) throw new Error(`Elemento não encontrado: ${selector}`);
  return el;
}
