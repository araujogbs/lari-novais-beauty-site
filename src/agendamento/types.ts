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

export interface Appointment {
  id: number | string;
  serviceName: string;
  startTime: string;
  clientAddress?: string;
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

export interface BookingDoneInfo {
  nome: string;
  fone: string;
  serviceName: string;
  when: string;
  total: number;
}
