import { useEffect, useRef, useState } from 'react';
import { brl, digits, fmtDateBR, maskCep, maskPhone, waLink } from '../utils';
import * as api from './api';
import { ApiError } from './api';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { addToken } from './myBookings';
import {
  acceptFiles,
  buildAppointmentForm,
  conflictsWith,
  CURLY_HAIR_NOTICE,
  durationLabel,
  EMPTY_VALUES,
  endTimeFor,
  firstError,
  fmtMinutes,
  groupsLabel,
  groupsMinutes,
  groupsParam,
  groupsPrice,
  MAX_FILES,
  MAX_PEOPLE,
  servicesMinutes,
  servicesPrice,
  START_TIME_INFO,
  total,
} from './booking';
import { dayLabel } from './calendar';
import type { BookingDoneInfo, BookingValues, FeeEstimate, Service } from './types';
import { useAsync } from './useAsync';
import type { ServicesState } from './useServices';

interface Props {
  services: ServicesState;
  onBooked: (info: BookingDoneInfo) => void;
}

interface PickedFile {
  file: File;
  url: string;
}

const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

export function NewBooking({ services, onBooked }: Props) {
  // Serviços de cada pessoa: persons[0] é a primeira pessoa, e assim por diante.
  const [persons, setPersons] = useState<number[][]>([[]]);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [slotsNonce, setSlotsNonce] = useState(0);
  const [values, setValues] = useState<BookingValues>(EMPTY_VALUES);
  const [picked, setPicked] = useState<PickedFile[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const serviceList = services.status === 'ready' ? services.services : [];
  // Cada pessoa marca os próprios serviços (na ordem da lista); o valor e a duração somam entre todas.
  const groups: Service[][] = persons.map((ids) => serviceList.filter((s) => ids.includes(s.id)));
  const groupsKey = groupsParam(groups.map((g) => g.map((s) => s.id)));
  const allChosen = groups.every((g) => g.length > 0);
  const people = groups.length;

  const toggleService = (person: number, id: number): void => {
    const picked = serviceList.find((s) => s.id === id);
    setPersons((all) =>
      all.map((ids, i) => {
        if (i !== person) return ids;
        if (ids.includes(id)) return ids.filter((x) => x !== id);
        // O pacote Maquiagem + Penteado não vale junto com maquiagem ou penteado avulsos.
        const kept = ids.filter((x) => {
          const other = serviceList.find((s) => s.id === x);
          return !(picked && other && conflictsWith(picked, other));
        });
        return [...kept, id];
      }),
    );
    setSlot('');
  };

  const addPerson = (): void => {
    setPersons((all) => (all.length < MAX_PEOPLE ? [...all, []] : all));
    setSlot('');
  };

  const removePerson = (person: number): void => {
    setPersons((all) => (all.length > 1 ? all.filter((_, i) => i !== person) : all));
    setSlot('');
  };

  const set = <K extends keyof BookingValues>(key: K, value: BookingValues[K]): void => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  /* ---------- horários livres ---------- */
  const slots = useAsync(allChosen && date ? `${groupsKey}|${date}|${slotsNonce}` : null, () =>
    api.getSlots(date, groupsKey),
  );

  /* ---------- CEP / deslocamento ---------- */
  const cepDigits = digits(values.cep);
  const fee = useAsync<FeeEstimate>(
    cepDigits.length === 8 ? cepDigits : null,
    () => api.estimateFee(cepDigits),
    (r) => {
      // Preenche o endereço pelo CEP, sem sobrescrever o que a cliente já digitou.
      if (!r.street) return;
      setValues((v) => (v.end ? v : { ...v, end: [r.street, r.neighborhood, r.city].filter(Boolean).join(', ') }));
    },
  );
  const feeData = fee.status === 'ready' ? fee.data : undefined;

  /* ---------- fotos de referência ---------- */
  const pickedRef = useRef(picked);
  useEffect(() => {
    pickedRef.current = picked;
  }, [picked]);
  // Libera as URLs de pré-visualização ao desmontar (ex.: depois de confirmar o agendamento).
  useEffect(
    () => () => {
      pickedRef.current.forEach((p) => {
        URL.revokeObjectURL(p.url);
      });
    },
    [],
  );

  // Rola até a mensagem de erro quando ela aparece.
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [error]);

  const onFiles = (list: FileList | null): void => {
    const incoming = Array.from(list ?? []);
    const { files, error: fileError } = acceptFiles(
      picked.map((p) => p.file),
      incoming,
    );
    const kept = new Map(picked.map((p) => [p.file, p]));
    const next = files.map((f) => kept.get(f) ?? { file: f, url: URL.createObjectURL(f) });
    setPicked(next);
    setError(fileError);
  };

  const removeFile = (index: number): void => {
    const removed = picked[index];
    if (removed) URL.revokeObjectURL(removed.url);
    setPicked((p) => p.filter((_, i) => i !== index));
  };

  /* ---------- envio ---------- */
  const submit = async (): Promise<void> => {
    if (busy) return;
    const invalid = firstError(values, groups, date, slot);
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const created = await api.createAppointment(
        buildAppointmentForm(
          values,
          groups,
          date,
          slot,
          picked.map((p) => p.file),
        ),
      );
      if (created?.manageToken) addToken(created.manageToken);
      onBooked({
        nome: values.nome.trim(),
        fone: values.fone,
        serviceName: groupsLabel(groups),
        when: `${fmtDateBR(date)} às ${slot}`,
        total: total(groups, feeData),
        date,
        start: slot,
        end: endTimeFor(groups, slot),
      });
    } catch (e) {
      const status = e instanceof ApiError ? e.status : 0;
      setError(
        status === 409
          ? `${errMsg(e)} Escolha outro horário.`
          : errMsg(e) || 'Não foi possível concluir o agendamento.',
      );
      if (status === 409) {
        setSlot('');
        setSlotsNonce((n) => n + 1);
      }
      setBusy(false);
    }
  };

  return (
    <>
      <div className="ag-step">
        <h4>
          <span>1</span> Escolha o serviço
        </h4>
        <p className="ag-hint">
          Marque os serviços de cada cliente (por exemplo, maquiagem e penteado). Se forem mais clientes, cada um
          escolhe os seus.
        </p>
        {services.status === 'loading' && <p className="ag-hint">Carregando serviços…</p>}
        {services.status === 'error' && (
          <p className="ag-msg">
            Não foi possível carregar os serviços agora.{' '}
            <a href={waLink()} target="_blank" rel="noopener">
              Agende pelo WhatsApp
            </a>
            .
          </p>
        )}
        {services.status === 'ready' && !serviceList.length && (
          <p className="ag-hint">Nenhum serviço disponível no momento.</p>
        )}
        {persons.map((ids, p) => (
          <div className="ag-person" key={p}>
            {people > 1 && (
              <div className="ag-person-head">
                <strong>Cliente {p + 1}</strong>
                {groups[p] && groups[p].length > 0 && (
                  <span className="ag-person-sum">
                    {fmtMinutes(servicesMinutes(groups[p]))} · {brl(servicesPrice(groups[p]))}
                  </span>
                )}
                <button
                  type="button"
                  className="ag-person-remove"
                  onClick={() => {
                    removePerson(p);
                  }}
                >
                  Remover
                </button>
              </div>
            )}
            <div className="ag-services">
              {serviceList.map((s) => (
                <label className="ag-service" key={s.id}>
                  <input
                    type="checkbox"
                    name={`agServico${p}`}
                    value={s.id}
                    checked={ids.includes(s.id)}
                    onChange={() => {
                      toggleService(p, s.id);
                    }}
                  />
                  <span className="ag-service-name">{s.name}</span>
                  <span className="ag-service-meta">{durationLabel(s)}</span>
                  <span className="ag-service-price">{brl(s.price)}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {services.status === 'ready' && people < MAX_PEOPLE && (
          <button type="button" className="ag-add-person" onClick={addPerson}>
            + Adicionar outro cliente
          </button>
        )}
        <p className="ag-notice ag-notice--hair" role="note">
          {CURLY_HAIR_NOTICE}
        </p>
      </div>

      <div className="ag-step">
        <h4>
          <span>2</span> Dia e horário de início
          <button type="button" className="ag-info" aria-label="Como escolher o horário" aria-describedby="agStartInfo">
            i
            <span className="ag-info-tip" role="tooltip" id="agStartInfo">
              {START_TIME_INFO}
            </span>
          </button>
        </h4>
        {allChosen ? (
          <AvailabilityCalendar
            groups={groupsKey}
            value={date}
            refreshKey={slotsNonce}
            onChange={(d) => {
              setDate(d);
              setSlot('');
            }}
          />
        ) : (
          <p className="ag-hint">
            {people > 1 ? 'Escolha o serviço de cada cliente' : 'Escolha o serviço'} para ver os dias livres.
          </p>
        )}
        {date && (
          <p className="ag-cal-picked">
            Horários de início em <strong>{dayLabel(date)}</strong>
          </p>
        )}
        <div className="ag-slots">
          {slots.status === 'loading' && <p className="ag-hint">Buscando horários…</p>}
          {slots.status === 'error' && <p className="ag-msg">{slots.message}</p>}
          {slots.status === 'ready' && !slots.data?.length && (
            <p className="ag-hint">Sem horários livres nesse dia. Tente outra data.</p>
          )}
          {slots.status === 'ready' &&
            slots.data?.map((h, i) => (
              <button
                type="button"
                key={h}
                className={h === slot ? 'ag-slot active' : 'ag-slot'}
                style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                onClick={() => {
                  setSlot(h);
                }}
              >
                {h}
              </button>
            ))}
        </div>
      </div>

      <div className="ag-step">
        <h4>
          <span>3</span> Seus dados
        </h4>
        <div className="ag-grid">
          <div className="form-group ag-full">
            <label htmlFor="agNome">Seu nome completo</label>
            <input
              type="text"
              id="agNome"
              autoComplete="name"
              value={values.nome}
              onChange={(e) => {
                set('nome', e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="agFone">WhatsApp</label>
            <input
              type="tel"
              id="agFone"
              placeholder="(11) 91234-5678"
              autoComplete="tel"
              value={values.fone}
              onChange={(e) => {
                set('fone', maskPhone(e.target.value));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="agCep">CEP do atendimento</label>
            <input
              type="text"
              id="agCep"
              inputMode="numeric"
              placeholder="00000-000"
              value={values.cep}
              onChange={(e) => {
                set('cep', maskCep(e.target.value));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="agNum">Número / complemento</label>
            <input
              type="text"
              id="agNum"
              placeholder="Ex.: 120, apto 32"
              value={values.num}
              onChange={(e) => {
                set('num', e.target.value);
              }}
            />
          </div>
          <div className="form-group ag-full">
            <label htmlFor="agEnd">Endereço</label>
            <input
              type="text"
              id="agEnd"
              placeholder="Preenchido pelo CEP"
              value={values.end}
              onChange={(e) => {
                set('end', e.target.value);
              }}
            />
          </div>
          {fee.status !== 'idle' && (
            <div className="form-group ag-full ag-fee">
              {fee.status === 'loading' && 'Calculando deslocamento…'}
              {fee.status === 'error' && fee.message}
              {feeData &&
                (feeData.travelFee > 0
                  ? `Distância até o ateliê: ${feeData.distanceKm.toFixed(1).replace('.', ',')} km · taxa de deslocamento (ida e volta): ${brl(feeData.travelFee)}`
                  : 'Deslocamento gratuito para o seu endereço.')}
            </div>
          )}
          <div className="form-group ag-full">
            <span className="ag-label">Fotos de referência (até {MAX_FILES}, opcional)</span>
            <input
              type="file"
              id="agFotos"
              className="ag-file-input"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = ''; // permite escolher a mesma foto de novo
              }}
            />
            <div className="ag-thumbs">
              <label htmlFor="agFotos" className="ag-add-photo" title="Adicionar fotos">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <circle cx="9" cy="10" r="1.8" />
                  <path d="m21 16-5-5-8.5 9M3 17l4.5-4.5 3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">Adicionar fotos de referência</span>
              </label>
              {picked.map((p, i) => (
                <div className="ag-thumb" key={p.url}>
                  <img src={p.url} alt={`Foto de referência ${i + 1}`} />
                  <button
                    type="button"
                    aria-label="Remover foto"
                    onClick={() => {
                      removeFile(i);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {picked.length > 0 && (
                <span className="ag-hint">
                  {picked.length}/{MAX_FILES} fotos
                </span>
              )}
            </div>
          </div>
          <div className="form-group ag-full">
            <label htmlFor="agMsg">Como você quer a sua produção?</label>
            <textarea
              id="agMsg"
              rows={3}
              placeholder="Conte o tipo de evento, o estilo de make e de penteado que você imagina…"
              value={values.msg}
              onChange={(e) => {
                set('msg', e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="ag-step">
        <h4>
          <span>4</span> Confirmação
        </h4>
        <div className="ag-summary">
          {allChosen ? (
            <>
              {people > 1 ? (
                groups.map((g, i) => (
                  <div key={i}>
                    <span>Cliente {i + 1}</span>
                    <strong>{g.map((s) => s.name).join(' + ')}</strong>
                  </div>
                ))
              ) : (
                <div>
                  <span>{groups[0] && groups[0].length > 1 ? 'Serviços' : 'Serviço'}</span>
                  <strong>{groupsLabel(groups)}</strong>
                </div>
              )}
              <div>
                <span>Tempo de atendimento</span>
                <strong>{fmtMinutes(groupsMinutes(groups))}</strong>
              </div>
              <div>
                <span>Data</span>
                <strong>{fmtDateBR(date) || '—'}</strong>
              </div>
              <div>
                <span>Início do atendimento</span>
                <strong>{slot || '—'}</strong>
              </div>
              {slot && (
                <div>
                  <span>Término previsto</span>
                  <strong>{endTimeFor(groups, slot)}</strong>
                </div>
              )}
              <div>
                <span>{people > 1 ? `Valor dos serviços (${people} clientes)` : 'Valor dos serviços'}</span>
                <strong>{brl(groupsPrice(groups))}</strong>
              </div>
              {feeData && (
                <div>
                  <span>Deslocamento</span>
                  <strong>{feeData.travelFee > 0 ? brl(feeData.travelFee) : 'Gratuito'}</strong>
                </div>
              )}
              <div className="ag-total">
                <span>Total</span>
                <strong>{brl(total(groups, feeData))}</strong>
              </div>
              <p className="ag-hint ag-deposit-note">
                Para garantir o horário, depois que a Lari confirmar o seu pedido você recebe o PIX do sinal.
              </p>
            </>
          ) : (
            <p className="ag-hint">O resumo aparece aqui.</p>
          )}
        </div>
        {error && (
          <p className="ag-msg" role="alert" ref={errorRef}>
            {error}
          </p>
        )}
        <button
          type="button"
          className="btn btn-primary ag-submit"
          disabled={busy || services.status === 'error'}
          onClick={() => void submit()}
        >
          {busy ? 'Enviando…' : 'Confirmar agendamento'}
        </button>
        <p className="ag-alt">
          Prefere conversar?{' '}
          <a href={waLink()} target="_blank" rel="noopener">
            Agendar pelo WhatsApp
          </a>
        </p>
      </div>
    </>
  );
}
