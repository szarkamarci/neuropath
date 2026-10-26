export const CLINIC = {
  name: 'Regional Memory Clinic (synthetic)',
  address: 'Example Street 12, Budapest (synthetic)',
  phone: '+36 1 555 0100',
} as const;

const APPOINTMENT_LEAD_DAYS = 17;
const APPOINTMENT_TIME = '09:30';

/** ISO date + n days (UTC, so no timezone drift). */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y!, (m ?? 1) - 1, d! + days));
  return date.toISOString().slice(0, 10);
}

export interface Appointment {
  /** ISO date. */
  date: string;
  time: string;
}

/** Deterministic simulated booking: a fixed lead time after the referral. */
export function appointmentFor(sentOn: string): Appointment {
  return { date: addDays(sentOn, APPOINTMENT_LEAD_DAYS), time: APPOINTMENT_TIME };
}
