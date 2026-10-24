import { useState } from 'react';
import { todayISO } from '../utils';
import * as api from './api';
import {
  addMonths,
  addMonthsToDate,
  AVAILABILITY_TEXT,
  availabilityLevel,
  dayLabel,
  monthGrid,
  monthLabel,
  monthOf,
  shortDateLabel,
} from './calendar';
import { useAsync } from './useAsync';

const WEEKDAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
/** A agenda abre só até 3 meses à frente (de hoje até o mesmo dia daqui a 3 meses). */
export const BOOKING_WINDOW_MONTHS = 3;

interface Props {
  /** Serviços de cada pessoa, no formato "1,2;2". */
  groups: string;
  value: string;
  onChange: (date: string) => void;
  /** Muda quando a agenda pode ter mudado (ex.: depois de um conflito), para buscar de novo. */
  refreshKey: number;
}

/** Calendário do mês com a disponibilidade de cada dia (livre, últimos horários, lotado). */
export function AvailabilityCalendar({ groups, value, onChange, refreshKey }: Props) {
  const today = todayISO();
  const lastDay = addMonthsToDate(today, BOOKING_WINDOW_MONTHS);
  const firstMonth = monthOf(today);
  const lastMonth = monthOf(lastDay);
  const [month, setMonth] = useState(() => monthOf(value || today));
  const { blanks, days } = monthGrid(month);
  const open = days.filter((d) => d >= today && d <= lastDay);
  const from = open[0] ?? '';

  const availability = useAsync(from ? `${groups}|${from}|${open.length}|${refreshKey}` : null, () =>
    api.getAvailability(from, open.length, groups),
  );
  const slotsByDay = new Map(
    availability.status === 'ready' ? (availability.data ?? []).map((d) => [d.date, d.slots]) : [],
  );

  return (
    <div className="ag-cal">
      <p className="ag-cal-window">
        Agenda aberta até 3 meses à frente: no momento está aberta até <strong>{shortDateLabel(lastDay)}</strong>.
      </p>
      <div className="ag-cal-head">
        <button
          type="button"
          aria-label="Mês anterior"
          disabled={month <= firstMonth}
          onClick={() => {
            setMonth((m) => addMonths(m, -1));
          }}
        >
          ‹
        </button>
        <strong aria-live="polite">{monthLabel(month)}</strong>
        <button
          type="button"
          aria-label="Próximo mês"
          disabled={month >= lastMonth}
          onClick={() => {
            setMonth((m) => addMonths(m, 1));
          }}
        >
          ›
        </button>
      </div>
      <div className="ag-cal-grid" role="group" aria-label="Escolha o dia do evento">
        {WEEKDAYS.map((w) => (
          <span key={w} className="ag-cal-dow" aria-hidden="true">
            {w}
          </span>
        ))}
        {Array.from({ length: blanks }, (_, i) => (
          <span key={`b${i}`} aria-hidden="true" />
        ))}
        {days.map((d) => {
          const past = d < today || d > lastDay;
          const slots = slotsByDay.get(d);
          const level = slots === undefined ? null : availabilityLevel(slots);
          const text =
            d > lastDay ? 'agenda ainda não aberta' : past ? 'indisponível' : level ? AVAILABILITY_TEXT[level] : '';
          const classes = ['ag-day', level ? `ag-day--${level}` : '', d === value ? 'active' : '']
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={d}
              type="button"
              className={classes}
              disabled={past || level === 'lotado'}
              aria-pressed={d === value}
              aria-label={text ? `${dayLabel(d)}: ${text}` : dayLabel(d)}
              onClick={() => {
                onChange(d);
              }}
            >
              {Number(d.slice(8))}
              {!past && level && <small>{level === 'poucos' ? 'últimos' : text}</small>}
            </button>
          );
        })}
      </div>
      <div className="ag-cal-legend" aria-hidden="true">
        <span>
          <i className="ag-dot ag-dot--livre" /> livre
        </span>
        <span>
          <i className="ag-dot ag-dot--poucos" /> últimos horários
        </span>
        <span>
          <i className="ag-dot ag-dot--lotado" /> lotado
        </span>
      </div>
      {availability.status === 'loading' && <p className="ag-hint">Verificando os dias livres…</p>}
      {availability.status === 'error' && (
        <p className="ag-hint">Não foi possível ver a disponibilidade agora. Escolha o dia para ver os horários.</p>
      )}
    </div>
  );
}
