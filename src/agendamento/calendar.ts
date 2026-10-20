/* Datas do calendário de agendamento. Tudo em strings AAAA-MM-DD / AAAA-MM, sem fuso,
   para o dia não "pular" conforme o fuso do aparelho de quem abre o site. */

const pad = (n: number): string => String(n).padStart(2, '0');

/** "2026-10-19" -> "2026-10" */
export const monthOf = (iso: string): string => iso.slice(0, 7);

/** Soma meses a "AAAA-MM". */
export function addMonths(ym: string, n: number): string {
  const [y = 0, m = 1] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

/** Soma meses a "AAAA-MM-DD"; se o dia não existir no mês final (31/01 + 1 mês), usa o último dia dele. */
export function addMonthsToDate(iso: string, n: number): string {
  const ym = addMonths(monthOf(iso), n);
  const [y = 0, m = 1] = ym.split('-').map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${ym}-${pad(Math.min(Number(iso.slice(8)), lastDay))}`;
}

/** Dias do mês e quantas casas vazias vêm antes do dia 1 (semana começando na segunda). */
export function monthGrid(ym: string): { blanks: number; days: string[] } {
  const [y = 0, m = 1] = ym.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    blanks: (first.getUTCDay() + 6) % 7,
    days: Array.from({ length: count }, (_, i) => `${ym}-${pad(i + 1)}`),
  };
}

/** "2026-10" -> "outubro de 2026" */
export function monthLabel(ym: string): string {
  const [y = 0, m = 1] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** "2027-01-19" -> "19 de janeiro" */
export function shortDateLabel(iso: string): string {
  const [y = 0, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

/** "2026-10-19" -> "segunda-feira, 19 de outubro" */
export function dayLabel(iso: string): string {
  const [y = 0, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

export type AvailabilityLevel = 'livre' | 'poucos' | 'lotado';

/** Até 3 horários de início livres já conta como "últimos horários". */
export function availabilityLevel(slots: number): AvailabilityLevel {
  if (slots <= 0) return 'lotado';
  return slots <= 3 ? 'poucos' : 'livre';
}

export const AVAILABILITY_TEXT: Record<AvailabilityLevel, string> = {
  livre: 'livre',
  poucos: 'últimos horários',
  lotado: 'lotado',
};

/* ---------- salvar na agenda da cliente ---------- */

export interface CalendarEvent {
  title: string;
  details: string;
  date: string; // AAAA-MM-DD
  start: string; // HH:mm (Brasília)
  end: string; // HH:mm (Brasília)
}

const compact = (date: string, hhmm: string): string => `${date.replace(/-/g, '')}T${hhmm.replace(':', '')}00`;

export function googleCalendarUrl(e: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${compact(e.date, e.start)}/${compact(e.date, e.end)}`,
    ctz: 'America/Sao_Paulo',
    details: e.details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Brasília é UTC-3 o ano todo: o .ics vai em UTC para abrir certo em qualquer agenda. */
function utcStamp(date: string, hhmm: string): string {
  const [y = 0, m = 1, d = 1] = date.split('-').map(Number);
  const [h = 0, min = 0] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, h + 3, min))
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

const icsText = (s: string): string =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/[,;]/g, (c) => `\\${c}`);

/** Arquivo .ics (Apple, Outlook e outras agendas). */
export function icsContent(e: CalendarEvent, now = new Date()): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lari Novais Beauty//Agendamento//PT',
    'BEGIN:VEVENT',
    `UID:${compact(e.date, e.start)}-${Math.random().toString(36).slice(2)}@larinovaisbeauty`,
    `DTSTAMP:${now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')}`,
    `DTSTART:${utcStamp(e.date, e.start)}`,
    `DTEND:${utcStamp(e.date, e.end)}`,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText(e.details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
