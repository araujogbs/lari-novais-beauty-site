/**
 * Pending = em análise; Confirmed = aprovado; Rejected = recusado; Expired = ficou 3 dias sem resposta;
 * Cancelled = desmarcado; Blocked = bloqueio de agenda.
 */
export type AdminStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Expired' | 'Cancelled' | 'Blocked';

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
  /** Serviços do pedido, já juntos ("Maquiagem + Penteado"), e o valor deles (sem deslocamento). */
  serviceNames?: string | null;
  totalPrice?: number | null;
  /** Sinal calculado ao aprovar; `depositPaidAt` é preenchido quando a Lari marca que recebeu. */
  depositAmount?: number | null;
  depositPaidAt?: string | null;
  startTime: string;
  endTime: string;
  status: AdminStatus;
  /** Prazo para aprovar ou recusar (só nos pedidos em análise). */
  expiresAt?: string | null;
  serviceItem?: AdminService | null;
}

export interface BlockPayload {
  date: string;
  reason?: string;
  startTime?: string;
  endTime?: string;
}
