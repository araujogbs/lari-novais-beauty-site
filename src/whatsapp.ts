import { WHATSAPP } from './config';

export interface BrideFormValues {
  nome: string;
  data: string;
  local: string;
  mensagem: string;
}

export interface ContactFormValues {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

const fmtDate = (iso: string): string => (iso ? iso.split('-').reverse().join('/') : '');

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export function buildBrideMessage(v: BrideFormValues): string {
  return (
    'Olá, Lari! Vim pelo site e quero falar sobre a beleza do meu casamento.\n\n' +
    `*Nome da noiva:* ${v.nome.trim()}\n` +
    `*Data do casamento:* ${fmtDate(v.data.trim())}\n` +
    `*Local do evento:* ${v.local.trim()}\n` +
    `*Mensagem:* ${v.mensagem.trim()}`
  );
}

export function buildContactMessage(v: ContactFormValues): string {
  return (
    'Olá, vim pelo site.\n\n' +
    `*Nome:* ${v.nome.trim()}\n` +
    `*E-mail:* ${v.email.trim()}\n` +
    `*Assunto:* ${v.assunto.trim()}\n` +
    `*Mensagem:* ${v.mensagem.trim()}`
  );
}

export function openWhatsapp(text: string): void {
  window.open(whatsappUrl(text), '_blank', 'noopener');
}
