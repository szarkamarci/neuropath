import type { RegistryRecord } from '../data/registry';

export type ComorbidityFilter = 'any' | 't2dm' | 'htn' | 'both';
export type TimeSinceDiagnosis = 'any' | 'lt6' | '6to12' | 'gt12';

export interface CohortCriteria {
  ageMin: number;
  ageMax: number;
  mciConfirmed: boolean;
  adAetiology: boolean;
  comorbidity: ComorbidityFilter;
  sinceDiagnosis: TimeSinceDiagnosis;
}

export const DEFAULT_CRITERIA: CohortCriteria = {
  ageMin: 55,
  ageMax: 85,
  mciConfirmed: true,
  adAetiology: true,
  comorbidity: 'any',
  sinceDiagnosis: 'any',
};

function sinceMatches(months: number, filter: TimeSinceDiagnosis): boolean {
  switch (filter) {
    case 'lt6':
      return months < 6;
    case '6to12':
      return months >= 6 && months <= 12;
    case 'gt12':
      return months > 12;
    default:
      return true;
  }
}

function comorbidityMatches(record: RegistryRecord, filter: ComorbidityFilter): boolean {
  const has = (c: 't2dm' | 'htn') => record.comorbidities.includes(c);
  if (filter === 't2dm') return has('t2dm');
  if (filter === 'htn') return has('htn');
  if (filter === 'both') return has('t2dm') && has('htn');
  return true;
}

export function matchesCohort(record: RegistryRecord, c: CohortCriteria): boolean {
  return (
    record.age >= c.ageMin &&
    record.age <= c.ageMax &&
    (!c.mciConfirmed || record.diagnosis === 'mci') &&
    (!c.adAetiology || record.aetiology === 'ad') &&
    comorbidityMatches(record, c.comorbidity) &&
    sinceMatches(record.monthsSinceDiagnosis, c.sinceDiagnosis)
  );
}

/** Raw match count; callers apply small-cell suppression before display. */
export function countCohort(records: readonly RegistryRecord[], c: CohortCriteria): number {
  return records.filter((r) => matchesCohort(r, c)).length;
}

/** Pre-qualified trial candidate: consented registry member with MCI of suspected AD aetiology. */
export function isPrequalified(record: RegistryRecord): boolean {
  return record.diagnosis === 'mci' && record.aetiology === 'ad';
}
