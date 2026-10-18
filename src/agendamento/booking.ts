import { digits, maskCep } from '../utils';
import type { BookingValues, FeeEstimate, Service } from './types';

export const ACCEPTED_TYPES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export const EMPTY_VALUES: BookingValues = {
  nome: '',
  fone: '',
  cep: '',
  num: '',
  end: '',
  qtd: '1',
  msg: '',
};

export const HAIR_DURATION_LABEL = '60 a 90 min';

export const CURLY_HAIR_NOTICE =
  'Cabelos cacheados ou crespos podem exigir mais tempo de penteado. Ajustamos o cronograma para um acabamento perfeito.';

export const START_TIME_INFO =
  'Escolha o horário pensando em quando você precisa estar pronta, levando em consideração o tempo de execução de cada serviço. Ex.: para estar pronta às 17h, o horário de início precisa ser às 15h para uma produção completa.';

/** Penteado avulso dura de 60 a 90 minutos; os demais serviços usam a duração cadastrada. */
export function durationLabel(service: Service): string {
  const onlyHair = /penteado/i.test(service.name) && !/maquiagem|make/i.test(service.name);
  return onlyHair ? HAIR_DURATION_LABEL : `${Math.round(service.durationMinutes)} min`;
}

export const MAX_PEOPLE = 20;

/** Quantidade de pessoas atendidas: inteiro entre 1 e ${MAX_PEOPLE}; valores inválidos valem 1. */
export function parsePeople(qtd: string): number {
  const n = parseInt(qtd, 10);
  return Number.isNaN(n) ? 1 : Math.min(Math.max(n, 1), MAX_PEOPLE);
}

/** O serviço é cobrado por pessoa; o deslocamento é único. */
export function total(service: Service | undefined, fee: FeeEstimate | undefined, people = 1): number {
  return (service?.price ?? 0) * people + (fee?.travelFee ?? 0);
}

/** Primeira mensagem de erro de validação, ou `null` se o formulário estiver completo. */
export function firstError(v: BookingValues, service: Service | undefined, date: string, slot: string): string | null {
  if (!service) return 'Escolha o serviço.';
  if (!date || !slot) return 'Escolha a data e o horário.';
  if (!v.nome.trim()) return 'Informe o seu nome completo.';
  if (digits(v.fone).length < 10) return 'Informe um WhatsApp válido com DDD.';
  if (!v.end.trim() && !digits(v.cep)) return 'Informe o CEP ou o endereço do atendimento.';
  if (!v.msg.trim()) return 'Conte como você quer a sua produção.';
  return null;
}

/** Valida um lote de fotos novas contra as já escolhidas. */
export function acceptFiles(current: readonly File[], incoming: readonly File[]): { files: File[]; error: string } {
  const files = [...current];
  for (const f of incoming) {
    if (!ACCEPTED_TYPES.includes(f.type)) return { files, error: 'Use fotos JPG, PNG ou WebP.' };
    if (f.size > MAX_FILE_BYTES) return { files, error: 'Cada foto deve ter até 5 MB.' };
    if (files.length >= MAX_FILES) return { files, error: 'Envie no máximo 5 fotos.' };
    files.push(f);
  }
  return { files, error: '' };
}

/** Soma minutos a um horário "HH:mm" (sem passar das 23:59). */
export function plusMinutes(hhmm: string, minutes: number): string {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  const total = Math.min(h * 60 + m + minutes, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Término previsto: o horário de início mais a duração total (serviço x pessoas). */
export function endTimeFor(service: Service, people: number, start: string): string {
  return plusMinutes(start, service.durationMinutes * people);
}

export function buildAppointmentForm(
  v: BookingValues,
  service: Service,
  date: string,
  slot: string,
  files: readonly File[],
): FormData {
  const cep = digits(v.cep);
  const qtd = parsePeople(v.qtd);
  const endereco = [v.end.trim(), v.num.trim()].filter(Boolean).join(', ') + (cep ? ` — CEP ${maskCep(cep)}` : '');
  const descricao = `Atendimento Social.\n${v.msg.trim()}`;

  const fd = new FormData();
  fd.append('clientName', v.nome.trim());
  fd.append('clientPhone', v.fone.trim());
  fd.append('clientAddress', endereco);
  if (cep.length === 8) fd.append('cep', cep);
  fd.append('description', descricao);
  fd.append('serviceItemId', String(service.id));
  fd.append('people', String(qtd));
  fd.append('startTime', `${date}T${slot}:00-03:00`); // início do atendimento em horário de Brasília; a API calcula o término
  files.forEach((f) => {
    fd.append('images', f);
  });
  return fd;
}
