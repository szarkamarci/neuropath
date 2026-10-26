/**
 * Illustrative trial pre-screening model. Every input is an assumption shown
 * to the user; nothing here is a measured or validated result.
 *
 * Screens needed per enrolled patient = 1 / (1 − screen-failure rate).
 * Pre-qualification is assumed to cut the failure rate by `failureReduction`.
 */
export interface EfficiencyInputs {
  /** Baseline screen-failure rate, 0–1 (brief: default 0.70, range 0.44–0.88). */
  baselineFailureRate: number;
  /** Cost of one full screening, in EUR. */
  costPerScreen: number;
  /** Assumed relative reduction of screen failures after pre-qualification, 0–1. */
  failureReduction: number;
}

export const EFFICIENCY_DEFAULTS: EfficiencyInputs = { baselineFailureRate: 0.7, costPerScreen: 2500, failureReduction: 0.4 };
export const FAILURE_RATE_RANGE = { min: 0.44, max: 0.88 } as const;

export interface EfficiencyResult {
  prequalifiedFailureRate: number;
  screensPerEnrolledBaseline: number;
  screensPerEnrolledPrequalified: number;
  screensSavedPerEnrolled: number;
  savingsPerEnrolled: number;
}

export function estimateEfficiency(i: EfficiencyInputs): EfficiencyResult {
  const prequalifiedFailureRate = i.baselineFailureRate * (1 - i.failureReduction);
  const base = 1 / (1 - i.baselineFailureRate);
  const pre = 1 / (1 - prequalifiedFailureRate);
  return {
    prequalifiedFailureRate,
    screensPerEnrolledBaseline: base,
    screensPerEnrolledPrequalified: pre,
    screensSavedPerEnrolled: base - pre,
    savingsPerEnrolled: (base - pre) * i.costPerScreen,
  };
}
