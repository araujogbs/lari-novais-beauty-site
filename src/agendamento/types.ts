export interface Service {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  isActive?: boolean;
}

export interface FeeEstimate {
  distanceKm: number;
  travelFee: number;
  street?: string;
  neighborhood?: string;
  city?: string;
}

/** Pending = em análise pela maquiadora; Confirmed = aprovado. */
export type AppointmentStatus = 'Pending' | 'Confirmed';

export interface Appointment {
  id: number | string;
  serviceName: string;
  startTime: string;
  clientAddress?: string;
  status?: AppointmentStatus;
}

/** Valores digitados no formulário de novo agendamento. */
export interface BookingValues {
  nome: string;
  fone: string;
  cep: string;
  num: string;
  end: string;
  qtd: string;
  msg: string;
}

/** Quantos horários de início ainda estão livres num dia (AAAA-MM-DD). */
export interface DayAvailability {
  date: string;
  slots: number;
}

export interface BookingDoneInfo {
  nome: string;
  fone: string;
  serviceName: string;
  when: string;
  total: number;
  /** AAAA-MM-DD, para salvar na agenda da cliente. */
  date: string;
  /** Início e término previstos, "HH:mm". */
  start: string;
  end: string;
}
