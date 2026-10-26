/** Aggregate views never show cells below this size (brief §2). */
export const SMALL_CELL_THRESHOLD = 10;

export type SuppressedCount = number | '<10';

export function isSuppressed(n: number, threshold = SMALL_CELL_THRESHOLD): boolean {
  return n < threshold;
}

/** Returns the count, or '<10' when the cell is too small to publish. */
export function suppress(n: number, threshold = SMALL_CELL_THRESHOLD): SuppressedCount {
  return isSuppressed(n, threshold) ? '<10' : n;
}

/** Display string for a count with small-cell suppression applied. */
export function formatCell(n: number, threshold = SMALL_CELL_THRESHOLD): string {
  const s = suppress(n, threshold);
  return s === '<10' ? '<10' : s.toLocaleString('en-US');
}
