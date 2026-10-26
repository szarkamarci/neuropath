/**
 * Structured behavioral check (mild behavioral impairment domains).
 * Items are short paraphrased placeholders (text in src/strings), NOT
 * reproduced from any published instrument.
 */
export type MbiDomain = 'motivation' | 'mood' | 'impulse' | 'social' | 'beliefs';

export type MbiItemId =
  | 'lostInterest'
  | 'withdrawn'
  | 'lowMood'
  | 'irritable'
  | 'impulsive'
  | 'socialOutOfCharacter'
  | 'unusualBeliefs';

export interface MbiItem {
  id: MbiItemId;
  domain: MbiDomain;
}

export const mbiItems: readonly MbiItem[] = [
  { id: 'lostInterest', domain: 'motivation' },
  { id: 'withdrawn', domain: 'motivation' },
  { id: 'lowMood', domain: 'mood' },
  { id: 'irritable', domain: 'impulse' },
  { id: 'impulsive', domain: 'impulse' },
  { id: 'socialOutOfCharacter', domain: 'social' },
  { id: 'unusualBeliefs', domain: 'beliefs' },
];

export const mbiDomains: readonly MbiDomain[] = ['motivation', 'mood', 'impulse', 'social', 'beliefs'];

/** 0 = no, 1 = sometimes, 2 = often (over the last 6+ months, a change from before). */
export type MbiAnswer = 0 | 1 | 2;
export type MbiAnswers = Partial<Record<MbiItemId, MbiAnswer>>;

export const MBI_MAX_SCORE = mbiItems.length * 2;

export function mbiAnsweredCount(answers: MbiAnswers): number {
  return mbiItems.filter((item) => answers[item.id] !== undefined).length;
}

/** Sum of answered items, or null when nothing has been answered yet. */
export function mbiScore(answers: MbiAnswers): number | null {
  if (mbiAnsweredCount(answers) === 0) return null;
  return mbiItems.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0);
}

export function mbiDomainScores(answers: MbiAnswers): Record<MbiDomain, number> {
  const scores: Record<MbiDomain, number> = { motivation: 0, mood: 0, impulse: 0, social: 0, beliefs: 0 };
  for (const item of mbiItems) scores[item.domain] += answers[item.id] ?? 0;
  return scores;
}
