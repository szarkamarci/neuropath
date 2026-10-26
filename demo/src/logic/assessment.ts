/**
 * Specialist assessment model. Scores use a PLACEHOLDER 0–100 scale (higher =
 * better performance) standing in for a partner-validated digital instrument.
 * Nothing here is a validated cut-off.
 */
export type CognitiveDomain = 'memory' | 'executive' | 'attention' | 'language' | 'visuospatial';

export const cognitiveDomains: readonly CognitiveDomain[] = ['memory', 'executive', 'attention', 'language', 'visuospatial'];

export type CognitiveProfile = Record<CognitiveDomain, number>;

export type WorkingDiagnosis = 'normal' | 'scd' | 'mci' | 'dementia';
export const workingDiagnoses: readonly WorkingDiagnosis[] = ['normal', 'scd', 'mci', 'dementia'];

export type Aetiology = 'ad' | 'vascular' | 'mixed' | 'other' | 'undetermined';
export const aetiologies: readonly Aetiology[] = ['ad', 'vascular', 'mixed', 'other', 'undetermined'];

export type FollowUpMonths = 3 | 6 | 12;
export const followUpOptions: readonly FollowUpMonths[] = [3, 6, 12];

export interface Assessment {
  patientId: string;
  profile: CognitiveProfile;
  /** Mean of the domain scores, rounded. */
  overall: number;
  diagnosis: WorkingDiagnosis;
  /** Only meaningful when the diagnosis is MCI or dementia. */
  aetiology: Aetiology | null;
  followUpMonths: FollowUpMonths;
  registryConsent: boolean;
  /** ISO date. */
  assessedOn: string;
}

/** Whether the working diagnosis needs a suspected aetiology. */
export function needsAetiology(diagnosis: WorkingDiagnosis): boolean {
  return diagnosis === 'mci' || diagnosis === 'dementia';
}

export function overallScore(profile: CognitiveProfile): number {
  const sum = cognitiveDomains.reduce((acc, d) => acc + profile[d], 0);
  return Math.round(sum / cognitiveDomains.length);
}

/** Per-domain offsets: memory typically weakest in the story, language best preserved. */
const DOMAIN_OFFSET: CognitiveProfile = { memory: -10, executive: -4, attention: 2, language: 8, visuospatial: 6 };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Deterministic simulated "import" from the digital assessment, scaled by risk points. */
export function simulatedProfile(riskScore: number): CognitiveProfile {
  const base = 96 - riskScore * 1.6;
  return Object.fromEntries(cognitiveDomains.map((d) => [d, Math.round(clamp(base + DOMAIN_OFFSET[d], 20, 98))])) as CognitiveProfile;
}
