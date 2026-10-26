import { describe, expect, it } from 'vitest';
import { HERO_ID, patients, patientsById } from '../data/seed';
import type { MbiAnswers } from './mbi';
import { assessRisk, bandFor, BAND_THRESHOLDS, MAX_SCORE, type RiskInput } from './risk';
import { assessPatient } from './riskInput';

const hero = patientsById[HERO_ID]!;

/** The answers the demo story uses for Erzsébet. */
const heroAnswers: MbiAnswers = {
  lostInterest: 2,
  withdrawn: 1,
  lowMood: 1,
  irritable: 2,
  impulsive: 0,
  socialOutOfCharacter: 0,
  unusualBeliefs: 0,
};

const baseInput: RiskInput = {
  age: 55,
  sex: 'M',
  hba1cSlopePerYear: 0,
  hba1cLatest: 5.6,
  egfrLatest: 95,
  systolicMean: 135,
  systolicSd: 6,
  cardiometabolicCount: 1,
  memoryComplaint: false,
  mbiScore: null,
};

describe('assessRisk', () => {
  it('scores a healthy middle-aged profile as low with no contributors', () => {
    const result = assessRisk(baseInput);
    expect(result).toEqual({ score: 0, band: 'low', contributors: [] });
  });

  it('is deterministic for identical input', () => {
    const input = { ...baseInput, age: 72, memoryComplaint: true, mbiScore: 4 };
    expect(assessRisk(input)).toEqual(assessRisk({ ...input }));
  });

  it('maps totals to bands at the documented thresholds', () => {
    expect(bandFor(BAND_THRESHOLDS.moderate - 1)).toBe('low');
    expect(bandFor(BAND_THRESHOLDS.moderate)).toBe('moderate');
    expect(bandFor(BAND_THRESHOLDS.high - 1)).toBe('moderate');
    expect(bandFor(BAND_THRESHOLDS.high)).toBe('high');
  });

  it('orders contributors by absolute weight, largest first', () => {
    const { contributors } = assessRisk({ ...baseInput, age: 76, hba1cSlopePerYear: 0.25, mbiScore: 7 });
    const points = contributors.map((c) => Math.abs(c.points));
    expect(points).toEqual([...points].sort((a, b) => b - a));
    expect(contributors[0]).toMatchObject({ id: 'age', weight: 'high', direction: 'up' });
  });

  it('reports protective factors with a downward direction and never goes below zero', () => {
    const result = assessRisk({ ...baseInput, systolicMean: 124, systolicSd: 4 });
    expect(result.contributors).toEqual([expect.objectContaining({ id: 'bpLevel', direction: 'down', points: -1 })]);
    expect(result.score).toBe(0);
  });

  it('cannot exceed MAX_SCORE', () => {
    const worst: RiskInput = {
      age: 90,
      sex: 'F',
      hba1cSlopePerYear: 1,
      hba1cLatest: 10,
      egfrLatest: 20,
      systolicMean: 190,
      systolicSd: 25,
      cardiometabolicCount: 6,
      memoryComplaint: true,
      mbiScore: 14,
    };
    expect(assessRisk(worst).score).toBe(MAX_SCORE);
  });
});

describe('hero patient (Erzsébet K.)', () => {
  it('is moderate on routine data alone', () => {
    const result = assessPatient(hero);
    expect(result.band).toBe('moderate');
  });

  it('lands clearly in high after the behavioral check', () => {
    const before = assessPatient(hero);
    const after = assessPatient(hero, heroAnswers);
    expect(after.band).toBe('high');
    expect(after.score).toBeGreaterThanOrEqual(BAND_THRESHOLDS.high + 2);
    expect(after.score).toBeGreaterThan(before.score);
    expect(after.contributors.map((c) => c.id)).toContain('behavior');
  });

  it('explains the flag with the story factors', () => {
    const ids = assessPatient(hero, heroAnswers).contributors.map((c) => c.id);
    expect(ids).toEqual(expect.arrayContaining(['glycaemic', 'bpVariability', 'age', 'memory', 'behavior']));
  });
});

describe('seed panel', () => {
  it('has ~25 patients with a realistic band mix once the hero is checked', () => {
    const bands = patients.map((p) => assessPatient(p, p.id === HERO_ID ? heroAnswers : {}).band);
    const count = (b: string) => bands.filter((x) => x === b).length;
    expect(patients).toHaveLength(25);
    expect({ low: count('low'), moderate: count('moderate'), high: count('high') }).toEqual({ low: 15, moderate: 7, high: 3 });
  });
});
