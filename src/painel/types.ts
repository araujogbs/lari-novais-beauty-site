/** Pending = em análise; Confirmed = aprovado; Rejected = recusado; Cancelled = desmarcado; Blocked = bloqueio de agenda. */
export type AdminStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Blocked';

export interface AdminService {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
}

/** Agendamento como a rota protegida da API devolve (horários em UTC). */
export interface AdminAppointment {
  id: number;
  clientName: string;
  clientPhone: string;
  clientAddress?: string | null;
  description?: string | null;
  travelFee?: number | null;
  distanceKm?: number | null;
  referenceImages?: string[] | null;
  people?: number;
  startTime: string;
  endTime: string;
  status: AdminStatus;
  serviceItem?: AdminService | null;
}

export interface BlockPayload {
  date: string;
  reason?: string;
  startTime?: string;
  endTime?: string;
}
