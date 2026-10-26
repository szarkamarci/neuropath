import { describe, expect, it } from 'vitest';
import { formatDateLong } from '../lib/format';
import { addDays, appointmentFor } from './appointment';
import { cognitiveDomains, needsAetiology, overallScore, simulatedProfile } from './assessment';

describe('overallScore', () => {
  it('is the rounded mean of the domain scores', () => {
    expect(overallScore({ memory: 60, executive: 66, attention: 72, language: 78, visuospatial: 76 })).toBe(70);
  });
});

describe('simulatedProfile', () => {
  it('is deterministic and stays inside 20–98', () => {
    expect(simulatedProfile(16)).toEqual(simulatedProfile(16));
    for (const risk of [0, 5, 16, 23, 40]) {
      for (const d of cognitiveDomains) {
        const v = simulatedProfile(risk)[d];
        expect(v).toBeGreaterThanOrEqual(20);
        expect(v).toBeLessThanOrEqual(98);
      }
    }
  });

  it('gives higher-risk patients lower scores, memory weakest', () => {
    expect(overallScore(simulatedProfile(16))).toBeLessThan(overallScore(simulatedProfile(4)));
    const p = simulatedProfile(16);
    expect(p.memory).toBeLessThan(p.language);
  });
});

describe('needsAetiology', () => {
  it('only applies to MCI and dementia', () => {
    expect(['normal', 'scd', 'mci', 'dementia'].map((d) => needsAetiology(d as never))).toEqual([false, false, true, true]);
  });
});

describe('appointments', () => {
  it('adds days across month ends', () => {
    expect(addDays('2026-10-26', 17)).toBe('2026-11-12');
    expect(addDays('2026-12-30', 5)).toBe('2027-01-04');
  });

  it('books the hero appointment 17 days out at 09:30', () => {
    expect(appointmentFor('2026-10-26')).toEqual({ date: '2026-11-12', time: '09:30' });
    expect(formatDateLong('2026-11-12')).toBe('Thursday, 12 Nov 2026');
  });
});
