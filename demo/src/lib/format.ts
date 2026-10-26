const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-10-26' → '26 Oct 2026' (locale-independent, so output is deterministic). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** '2026-11-12' → 'Thursday, 12 Nov 2026'. */
export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y!, (m ?? 1) - 1, d!)).getUTCDay()];
  return `${weekday}, ${formatDate(iso)}`;
}

/** '2026-10-26' → 'Oct ’26' for chart axes. */
export function formatMonthYear(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ’${String(y).slice(2)}`;
}

/** Seconds → 'm:ss'. */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .replace(/[^A-Za-zÀ-ž]/g, '')
    .slice(0, 2)
    .toUpperCase();
}
