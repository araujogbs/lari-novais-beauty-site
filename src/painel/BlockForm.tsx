import { useState } from 'react';
import { fmtDateBR } from '../utils';
import { isValidTime } from './format';
import type { BlockPayload } from './types';

const WORK_START = '06:00';
const WORK_END = '22:00';

interface Props {
  date: string;
  onSubmit: (payload: BlockPayload) => Promise<void>;
  onClose: () => void;
}

/** Bloqueio de agenda no dia selecionado: dia inteiro ou intervalo de horas. */
export function BlockForm({ date, onSubmit, onClose }: Props) {
  const [mode, setMode] = useState<'day' | 'range'>('day');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('15:00');
  const [reason, setReason] = useState('Folga');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (): Promise<void> => {
    const payload: BlockPayload = { date };
    if (reason.trim()) payload.reason = reason.trim();
    if (mode === 'range') {
      const invalid =
        !isValidTime(start) || !isValidTime(end)
          ? 'Use o formato HH:mm (ex.: 09:00).'
          : start >= end
            ? 'O início deve ser anterior ao fim.'
            : start < WORK_START || end > WORK_END
              ? `O intervalo deve estar entre ${WORK_START} e ${WORK_END}.`
              : '';
      if (invalid) {
        setError(invalid);
        return;
      }
      payload.startTime = `${start}:00`;
      payload.endTime = `${end}:00`;
    }
    setError('');
    setBusy(true);
    try {
      await onSubmit(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return (
    <div className="pn-box">
      <h3>Bloquear {fmtDateBR(date)}</h3>
      <div className="pn-segment" role="radiogroup" aria-label="Tipo de bloqueio">
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'day'}
          className={mode === 'day' ? 'active' : undefined}
          onClick={() => {
            setMode('day');
          }}
        >
          Dia inteiro
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'range'}
          className={mode === 'range' ? 'active' : undefined}
          onClick={() => {
            setMode('range');
          }}
        >
          Intervalo de horas
        </button>
      </div>
      {mode === 'range' && (
        <div className="pn-row">
          <label>
            Início
            <input
              type="time"
              min={WORK_START}
              max={WORK_END}
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
              }}
            />
          </label>
          <label>
            Fim
            <input
              type="time"
              min={WORK_START}
              max={WORK_END}
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
              }}
            />
          </label>
        </div>
      )}
      <label>
        Motivo
        <input
          type="text"
          placeholder="Folga, férias, compromisso…"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
          }}
        />
      </label>
      {error && (
        <p className="pn-error" role="alert">
          {error}
        </p>
      )}
      <div className="pn-actions">
        <button type="button" className="pn-btn" onClick={onClose} disabled={busy}>
          Cancelar
        </button>
        <button type="button" className="pn-btn pn-btn--primary" onClick={() => void save()} disabled={busy}>
          {busy ? 'Salvando…' : 'Salvar bloqueio'}
        </button>
      </div>
    </div>
  );
}
