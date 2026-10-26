import { describe, expect, it } from 'vitest';
import { BASE_FUNNEL, baseRegistryRecords, counties } from '../data/registry';
import { countCohort, DEFAULT_CRITERIA, isPrequalified } from './cohort';
import { EFFICIENCY_DEFAULTS, estimateEfficiency } from './efficiency';
import { formatCell, isSuppressed, suppress } from './suppression';

describe('small-cell suppression', () => {
  it('suppresses every cell below 10, including zero', () => {
    for (const n of [0, 1, 5, 9]) expect(suppress(n)).toBe('<10');
  });

  it('shows cells of 10 or more', () => {
    expect(suppress(10)).toBe(10);
    expect(suppress(2480)).toBe(2480);
    expect(isSuppressed(10)).toBe(false);
    expect(isSuppressed(9)).toBe(true);
  });

  it('formats with a thousands separator and "<10"', () => {
    expect(formatCell(1234)).toBe('1,234');
    expect(formatCell(7)).toBe('<10');
  });

  it('honours a custom threshold', () => {
    expect(suppress(14, 15)).toBe('<10');
  });
});

describe('synthetic registry', () => {
  it('is consistent with the documented totals', () => {
    expect(counties.reduce((s, c) => s + c.screened, 0)).toBe(BASE_FUNNEL.screened);
    expect(baseRegistryRecords).toHaveLength(BASE_FUNNEL.registry);
    expect(baseRegistryRecords.filter(isPrequalified)).toHaveLength(BASE_FUNNEL.prequalified);
    expect(baseRegistryRecords.filter((r) => r.diagnosis === 'mci').length).toBeLessThanOrEqual(BASE_FUNNEL.mci);
  });

  it('has a monotone funnel', () => {
    const f = Object.values(BASE_FUNNEL);
    expect(f).toEqual([...f].sort((a, b) => b - a));
  });

  it('per-county registry counts match the records', () => {
    for (const c of counties) expect(baseRegistryRecords.filter((r) => r.county === c.id)).toHaveLength(c.registry);
  });

  it('is deterministic across loads', async () => {
    const again = (await import('../data/registry')).baseRegistryRecords;
    expect(again).toEqual(baseRegistryRecords);
  });
});

describe('cohort builder', () => {
  it('default MCI + AD criteria reproduce the pre-qualified count', () => {
    expect(countCohort(baseRegistryRecords, DEFAULT_CRITERIA)).toBeLessThanOrEqual(BASE_FUNNEL.prequalified);
    expect(countCohort(baseRegistryRecords, { ...DEFAULT_CRITERIA, ageMin: 0, ageMax: 120 })).toBe(BASE_FUNNEL.prequalified);
  });

  it('narrowing criteria never increases the count', () => {
    const wide = countCohort(baseRegistryRecords, { ...DEFAULT_CRITERIA, mciConfirmed: false, adAetiology: false });
    const narrow = countCohort(baseRegistryRecords, { ...DEFAULT_CRITERIA, comorbidity: 'both', sinceDiagnosis: 'lt6' });
    expect(narrow).toBeLessThanOrEqual(wide);
  });
});

describe('efficiency estimate', () => {
  it('matches the closed-form model at the defaults', () => {
    const r = estimateEfficiency(EFFICIENCY_DEFAULTS);
    expect(r.screensPerEnrolledBaseline).toBeCloseTo(1 / 0.3, 6);
    expect(r.prequalifiedFailureRate).toBeCloseTo(0.42, 6);
    expect(r.screensSavedPerEnrolled).toBeCloseTo(1 / 0.3 - 1 / 0.58, 6);
    expect(r.savingsPerEnrolled).toBeCloseTo((1 / 0.3 - 1 / 0.58) * 2500, 4);
  });

  it('saves nothing when pre-qualification does not reduce failures', () => {
    expect(estimateEfficiency({ ...EFFICIENCY_DEFAULTS, failureReduction: 0 }).savingsPerEnrolled).toBeCloseTo(0, 9);
  });

  it('savings grow with the baseline failure rate', () => {
    const at = (f: number) => estimateEfficiency({ ...EFFICIENCY_DEFAULTS, baselineFailureRate: f }).savingsPerEnrolled;
    expect(at(0.88)).toBeGreaterThan(at(0.7));
    expect(at(0.7)).toBeGreaterThan(at(0.44));
  });
});
