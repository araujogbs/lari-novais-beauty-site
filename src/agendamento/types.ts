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

export interface WidgetState {
  services: Service[];
  service: Service | null;
  date: string;
  slot: string;
  fee: FeeEstimate | null;
  files: File[];
  busy: boolean;
}
