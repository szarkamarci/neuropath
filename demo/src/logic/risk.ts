import type { Sex } from '../data/types';
import { t } from '../strings';

/**
 * NeuroPath prototype risk logic — a transparent, additive points model.
 *
 * ALL WEIGHTS AND CUT-OFFS BELOW ARE ILLUSTRATIVE, LITERATURE-INSPIRED AND
 * NOT VALIDATED. They exist to demonstrate the workflow and will be replaced
 * by models validated in the clinical pilot. Pure function: no I/O, no clock,
 * no randomness.
 */

export type RiskBand = 'low' | 'moderate' | 'high';

export interface RiskInput {
  age: number;
  sex: Sex;
  /** Linear HbA1c trend, %-points per year. */
  hba1cSlopePerYear: number;
  hba1cLatest: number;
  egfrLatest: number;
  systolicMean: number;
  /** Visit-to-visit systolic standard deviation, mmHg. */
  systolicSd: number;
  /** Number of cardiometabolic conditions on the problem list. */
  cardiometabolicCount: number;
  memoryComplaint: boolean;
  /** Structured behavioral check total, or null if not done. */
  mbiScore: number | null;
}

export type FactorId =
  | 'age'
  | 'sex'
  | 'glycaemic'
  | 'egfr'
  | 'bpLevel'
  | 'bpVariability'
  | 'comorbidity'
  | 'memory'
  | 'behavior';

export type ContributionWeight = 'high' | 'moderate' | 'low';

export interface Contributor {
  id: FactorId;
  /** Signed points added to the total. */
  points: number;
  weight: ContributionWeight;
  direction: 'up' | 'down';
  /** Plain-language explanation for the clinician. */
  label: string;
}

export interface RiskResult {
  score: number;
  band: RiskBand;
  /** Ordered by absolute contribution, largest first. */
  contributors: Contributor[];
}

/** Total score at or above which a band starts (illustrative). */
export const BAND_THRESHOLDS = { moderate: 8, high: 14 } as const;

/** Highest achievable score; used to draw the risk scale. */
export const MAX_SCORE = 23;

// --- Illustrative factor scoring ------------------------------------------

/** Age: risk roughly doubles every ~5 years after 65. 0–4 points. */
function agePoints(age: number): number {
  if (age >= 75) return 4;
  if (age >= 70) return 3;
  if (age >= 65) return 2;
  if (age >= 60) return 1;
  return 0;
}

/** Female sex: higher lifetime dementia prevalence. 1 point. */
function sexPoints(sex: Sex): number {
  return sex === 'F' ? 1 : 0;
}

/** Worsening glycaemic control (HbA1c trend). -1–3 points. */
function glycaemicPoints(slope: number, latest: number): number {
  if (slope >= 0.4) return 3;
  if (slope >= 0.2) return 2;
  if (slope >= 0.1) return 1;
  if (slope <= -0.2 && latest < 7) return -1;
  return 0;
}

/** Reduced kidney function (eGFR) as a marker of vascular burden. 0–3 points. */
function egfrPoints(egfr: number): number {
  if (egfr < 45) return 3;
  if (egfr < 60) return 2;
  if (egfr < 90) return 1;
  return 0;
}

/** Mid-life/late-life hypertension. -1–2 points (well-controlled BP is protective). */
function bpLevelPoints(mean: number, sd: number): number {
  if (mean >= 160) return 2;
  if (mean >= 140) return 1;
  if (mean < 130 && sd < 6) return -1;
  return 0;
}

/** Visit-to-visit BP variability. 0–2 points. */
function bpVariabilityPoints(sd: number): number {
  if (sd >= 10) return 2;
  if (sd >= 8) return 1;
  return 0;
}

/** Cardiometabolic multimorbidity. 0–2 points. */
function comorbidityPoints(count: number): number {
  if (count >= 3) return 2;
  if (count === 2) return 1;
  return 0;
}

/** Subjective memory complaint (patient or family). 2 points. */
function memoryPoints(complaint: boolean): number {
  return complaint ? 2 : 0;
}

/** Structured behavioral check (0–14). 0–4 points. */
function behaviorPoints(score: number | null): number {
  if (score === null) return 0;
  if (score >= 6) return 4;
  if (score >= 3) return 2;
  if (score >= 1) return 1;
  return 0;
}

// ---------------------------------------------------------------------------

function weightFor(points: number): ContributionWeight {
  const abs = Math.abs(points);
  if (abs >= 3) return 'high';
  if (abs === 2) return 'moderate';
  return 'low';
}

export function bandFor(score: number): RiskBand {
  if (score >= BAND_THRESHOLDS.high) return 'high';
  if (score >= BAND_THRESHOLDS.moderate) return 'moderate';
  return 'low';
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function assessRisk(input: RiskInput): RiskResult {
  const labels = t.riskFactors;
  const raw: Array<{ id: FactorId; points: number; label: string }> = [
    { id: 'age', points: agePoints(input.age), label: labels.age(input.age) },
    { id: 'sex', points: sexPoints(input.sex), label: labels.sex },
    {
      id: 'glycaemic',
      points: glycaemicPoints(input.hba1cSlopePerYear, input.hba1cLatest),
      label: input.hba1cSlopePerYear >= 0 ? labels.glycaemicUp(round1(input.hba1cSlopePerYear)) : labels.glycaemicDown,
    },
    { id: 'egfr', points: egfrPoints(input.egfrLatest), label: labels.egfr(Math.round(input.egfrLatest)) },
    {
      id: 'bpLevel',
      points: bpLevelPoints(input.systolicMean, input.systolicSd),
      label: input.systolicMean >= 140 ? labels.bpHigh(Math.round(input.systolicMean)) : labels.bpControlled,
    },
    { id: 'bpVariability', points: bpVariabilityPoints(input.systolicSd), label: labels.bpVariability(Math.round(input.systolicSd)) },
    { id: 'comorbidity', points: comorbidityPoints(input.cardiometabolicCount), label: labels.comorbidity(input.cardiometabolicCount) },
    { id: 'memory', points: memoryPoints(input.memoryComplaint), label: labels.memory },
    { id: 'behavior', points: behaviorPoints(input.mbiScore), label: labels.behavior(input.mbiScore ?? 0) },
  ];

  const contributors: Contributor[] = raw
    .filter((f) => f.points !== 0)
    .map((f) => ({ ...f, weight: weightFor(f.points), direction: f.points > 0 ? ('up' as const) : ('down' as const) }))
    // Stable sort: larger absolute contribution first, ties keep factor order.
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points));

  const score = Math.max(0, raw.reduce((sum, f) => sum + f.points, 0));
  return { score, band: bandFor(score), contributors };
}
