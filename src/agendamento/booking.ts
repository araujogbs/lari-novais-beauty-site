import { digits, isValidPhone, maskCep } from '../utils';
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
  msg: '',
};

export const HAIR_DURATION_LABEL = '60 a 90 min';

export const CURLY_HAIR_NOTICE =
  'Cabelos cacheados ou crespos podem exigir mais tempo de penteado. Ajustamos o cronograma para um acabamento perfeito.';

export const START_TIME_INFO =
  'Escolha o horário pensando em quando você precisa estar pronta, levando em consideração o tempo de execução de cada serviço. Ex.: para estar pronta às 17h, o horário de início precisa ser às 15h para uma produção completa.';

const isHairOnly = (s: Service): boolean => /penteado/i.test(s.name) && !/maquiagem|make/i.test(s.name);

/** Pacote "Maquiagem + Penteado": serviço próprio, mais barato que os dois separados. */
export const isPackage = (s: Service): boolean => /penteado/i.test(s.name) && /maquiagem|make/i.test(s.name);

/** O pacote já inclui maquiagem e penteado, então não se marca junto com eles (nem eles com o pacote). */
export function conflictsWith(a: Service, b: Service): boolean {
  const single = (s: Service): boolean => !isPackage(s) && /maquiagem|make|penteado/i.test(s.name);
  return (isPackage(a) && single(b)) || (isPackage(b) && single(a));
}

/** Penteado dura de 60 a 90 minutos (o pacote, de 120 a 150); os demais serviços usam a duração cadastrada. */
export function durationLabel(service: Service): string {
  const max = Math.round(service.durationMinutes);
  if (isHairOnly(service)) return HAIR_DURATION_LABEL;
  if (isPackage(service)) return `${max - 30} a ${max} min`;
  return `${max} min`;
}

/** 150 -> "2h30"; 60 -> "1h"; 45 -> "45 min". */
export function fmtMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

export const MAX_PEOPLE = 20;

/** Serviços escolhidos para uma pessoa. */
export type PersonServices = readonly Service[];

/** Valor dos serviços escolhidos para uma pessoa. */
export const servicesPrice = (services: PersonServices): number => services.reduce((sum, s) => sum + s.price, 0);

/** Duração dos serviços escolhidos para uma pessoa, em minutos. */
export const servicesMinutes = (services: PersonServices): number =>
  services.reduce((sum, s) => sum + s.durationMinutes, 0);

/** Valor de todas as pessoas. */
export const groupsPrice = (groups: readonly PersonServices[]): number =>
  groups.reduce((sum, g) => sum + servicesPrice(g), 0);

/** Duração de todas as pessoas, em minutos (atendidas uma depois da outra). */
export const groupsMinutes = (groups: readonly PersonServices[]): number =>
  groups.reduce((sum, g) => sum + servicesMinutes(g), 0);

/** Serviços de cada pessoa no formato da API: "1,2;2" (uma pessoa com 1 e 2, outra só com 2). */
export const groupsParam = (groups: readonly (readonly number[])[]): string => groups.map((g) => g.join(',')).join(';');

const namesOf = (g: PersonServices): string => g.map((s) => s.name).join(' + ');

/** "Maquiagem + Penteado" quando todas fazem o mesmo; senão "Cliente 1: …; Cliente 2: …". */
export function groupsLabel(groups: readonly PersonServices[]): string {
  const first = groups[0] ? namesOf(groups[0]) : '';
  if (groups.every((g) => namesOf(g) === first)) return first;
  return groups.map((g, i) => `Cliente ${i + 1}: ${namesOf(g)}`).join('; ');
}

/** Os serviços são cobrados por pessoa; o deslocamento é único. */
export function total(groups: readonly PersonServices[], fee: FeeEstimate | undefined): number {
  return groupsPrice(groups) + (fee?.travelFee ?? 0);
}

/** Primeira mensagem de erro de validação, ou `null` se o formulário estiver completo. */
export function firstError(
  v: BookingValues,
  groups: readonly PersonServices[],
  date: string,
  slot: string,
): string | null {
  if (!groups.length || groups.some((g) => !g.length))
    return groups.length > 1 ? 'Escolha o serviço de cada cliente.' : 'Escolha o serviço.';
  if (!date || !slot) return 'Escolha a data e o horário.';
  if (!v.nome.trim()) return 'Informe o seu nome completo.';
  if (!isValidPhone(v.fone)) return 'Informe um WhatsApp válido com DDD.';
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

/** Término previsto: o horário de início mais a duração dos serviços de todas as pessoas. */
export function endTimeFor(groups: readonly PersonServices[], start: string): string {
  return plusMinutes(start, groupsMinutes(groups));
}

export function buildAppointmentForm(
  v: BookingValues,
  groups: readonly PersonServices[],
  date: string,
  slot: string,
  files: readonly File[],
): FormData {
  const cep = digits(v.cep);
  const endereco = [v.end.trim(), v.num.trim()].filter(Boolean).join(', ') + (cep ? ` — CEP ${maskCep(cep)}` : '');
  const descricao = `Atendimento Social.\n${v.msg.trim()}`;

  const fd = new FormData();
  fd.append('clientName', v.nome.trim());
  fd.append('clientPhone', v.fone.trim());
  fd.append('clientAddress', endereco);
  if (cep.length === 8) fd.append('cep', cep);
  fd.append('description', descricao);
  // personServices traz os serviços de cada pessoa; serviceItemIds (todos, sem repetir) segue por compatibilidade
  new Set(groups.flatMap((g) => g.map((s) => s.id))).forEach((id) => {
    fd.append('serviceItemIds', String(id));
  });
  groups.forEach((g) => {
    fd.append('personServices', g.map((s) => s.id).join(','));
  });
  fd.append('people', String(groups.length));
  fd.append('startTime', `${date}T${slot}:00-03:00`); // início do atendimento em horário de Brasília; a API calcula o término
  files.forEach((f) => {
    fd.append('images', f);
  });
  return fd;
}
