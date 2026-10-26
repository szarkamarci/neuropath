import type { ConditionCode, LabPoint, Patient } from '../data/types';
import { mbiScore, type MbiAnswers } from './mbi';
import { assessRisk, type RiskInput, type RiskResult } from './risk';

const CARDIOMETABOLIC: ReadonlySet<ConditionCode> = new Set(['t2dm', 'htn', 'dlp', 'af', 'chd', 'obesity', 'ckd']);

const MS_PER_YEAR = 365.25 * 24 * 3600 * 1000;

function yearsSince(start: string, date: string): number {
  return (Date.parse(date) - Date.parse(start)) / MS_PER_YEAR;
}

/** Least-squares slope of a lab value per year. */
export function slopePerYear(labs: LabPoint[], key: keyof Omit<LabPoint, 'date'>): number {
  if (labs.length < 2) return 0;
  const first = labs[0]!.date;
  const xs = labs.map((p) => yearsSince(first, p.date));
  const ys = labs.map((p) => p[key]);
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let den = 0;
  xs.forEach((x, i) => {
    num += (x - mx) * (ys[i]! - my);
    den += (x - mx) ** 2;
  });
  return den === 0 ? 0 : num / den;
}

export function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Population standard deviation. */
export function stdDev(values: number[]): number {
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
}

export function latestLab(patient: Patient): LabPoint {
  return patient.labs[patient.labs.length - 1]!;
}

export function riskInputFor(patient: Patient, mbiAnswers: MbiAnswers = {}): RiskInput {
  const systolic = patient.labs.map((p) => p.sys);
  const latest = latestLab(patient);
  return {
    age: patient.age,
    sex: patient.sex,
    hba1cSlopePerYear: slopePerYear(patient.labs, 'hba1c'),
    hba1cLatest: latest.hba1c,
    egfrLatest: latest.egfr,
    systolicMean: mean(systolic),
    systolicSd: stdDev(systolic),
    cardiometabolicCount: patient.conditions.filter((c) => CARDIOMETABOLIC.has(c)).length,
    memoryComplaint: patient.memoryComplaint,
    mbiScore: mbiScore(mbiAnswers),
  };
}

export function assessPatient(patient: Patient, mbiAnswers: MbiAnswers = {}): RiskResult {
  return assessRisk(riskInputFor(patient, mbiAnswers));
}
