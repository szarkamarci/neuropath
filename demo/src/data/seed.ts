import type { ConditionCode, LabPoint, Patient, PatientStatus, Sex } from './types';

/**
 * Synthetic, deterministic seed data. All patients are fictional.
 * No Math.random(): background labs come from a fixed-seed PRNG, so every
 * load and every reset produces identical numbers.
 */

/** The demo's fixed "today" (the hero's visit). */
export const DEMO_TODAY = '2026-10-26';

export const HERO_ID = 'p-erzsebet';

/** Routine 6-monthly chronic-care draws; the last draw is each patient's latest visit. */
const DRAW_DATES = ['2023-11-14', '2024-05-21', '2024-11-19', '2025-05-13', '2025-11-18', '2026-05-12'];

/** mulberry32 — tiny deterministic PRNG. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** n values with mean exactly 0 and population SD exactly 1. */
function standardized(rand: () => number, n: number): number[] {
  const raw = Array.from({ length: n }, () => rand() - 0.5);
  const m = raw.reduce((a, b) => a + b, 0) / n;
  const centred = raw.map((v) => v - m);
  const sd = Math.sqrt(centred.reduce((a, b) => a + b * b, 0) / n) || 1;
  return centred.map((v) => v / sd);
}

const r1 = (n: number) => Math.round(n * 10) / 10;

interface Profile {
  name: string;
  age: number;
  sex: Sex;
  conditions: ConditionCode[];
  lastVisit: string;
  /** HbA1c at the first draw, % */
  hba1c0: number;
  /** HbA1c change per year, % */
  hba1cSlope: number;
  /** eGFR at the latest draw */
  egfr: number;
  sysMean: number;
  sysSd: number;
  memoryComplaint?: boolean;
  status: PatientStatus;
  notes?: string[];
}

function yearsFromFirstDraw(date: string): number {
  return (Date.parse(date) - Date.parse(DRAW_DATES[0]!)) / (365.25 * 24 * 3600 * 1000);
}

function generateLabs(p: Profile, seed: number): LabPoint[] {
  const rand = prng(seed);
  const dates = [...DRAW_DATES, p.lastVisit];
  const n = dates.length;
  const zs = standardized(rand, n);
  const egfrDeclinePerYear = 0.8 + rand() * 1.2;
  const span = yearsFromFirstDraw(p.lastVisit);
  return dates.map((date, i) => {
    const t = yearsFromFirstDraw(date);
    const hba1c = r1(p.hba1c0 + p.hba1cSlope * t + (rand() - 0.5) * 0.1);
    // Fasting glucose loosely tracks HbA1c.
    const glucose = r1(1.25 * hba1c - 1.0 + (rand() - 0.5) * 0.4);
    const egfr = Math.round(p.egfr + egfrDeclinePerYear * (span - t) + (i === n - 1 ? 0 : (rand() - 0.5) * 3));
    const sys = Math.round(p.sysMean + p.sysSd * zs[i]!);
    const dia = Math.round(sys * 0.58 + 4 + (rand() - 0.5) * 4);
    return { date, hba1c, glucose, egfr, sys, dia };
  });
}

// --- Hero: Erzsébet K. -----------------------------------------------------
// Hand-written so the story numbers are exact: HbA1c rising ~0.5 %/yr,
// eGFR mildly reduced, systolic BP highly variable around ~139 mmHg.

const heroLabs: LabPoint[] = [
  { date: '2023-11-14', hba1c: 6.4, glucose: 7.1, egfr: 76, sys: 126, dia: 78 },
  { date: '2024-05-21', hba1c: 6.6, glucose: 7.3, egfr: 75, sys: 154, dia: 92 },
  { date: '2024-11-19', hba1c: 6.9, glucose: 7.8, egfr: 73, sys: 129, dia: 80 },
  { date: '2025-05-13', hba1c: 7.1, glucose: 8.0, egfr: 72, sys: 157, dia: 94 },
  { date: '2025-11-18', hba1c: 7.4, glucose: 8.4, egfr: 70, sys: 132, dia: 81 },
  { date: '2026-05-12', hba1c: 7.7, glucose: 8.9, egfr: 69, sys: 148, dia: 89 },
  { date: DEMO_TODAY, hba1c: 7.9, glucose: 9.2, egfr: 67, sys: 125, dia: 77 },
];

const hero: Patient = {
  id: HERO_ID,
  name: 'Erzsébet K.',
  age: 68,
  sex: 'F',
  conditions: ['t2dm', 'htn'],
  lastVisit: DEMO_TODAY,
  labs: heroLabs,
  memoryComplaint: true,
  recordNotes: [
    'Daughter reports mild forgetfulness (misplacing items, repeating questions) — noted Sep 2026.',
    'Daughter reports new irritability and loss of interest in gardening and family visits over the last 6+ months.',
    'Medication: metformin, ramipril, amlodipine (simulated record).',
  ],
  initialStatus: 'newFlag',
  isHero: true,
};

// --- Background panel ------------------------------------------------------
// Tuned so the computed bands give ~60% low / 28% moderate / 12% high once
// the hero's behavioral check is done (15 / 7 / 3 of 25).

const profiles: Profile[] = [
  // High
  { name: 'László T.', age: 78, sex: 'M', conditions: ['t2dm', 'htn', 'af', 'chd'], lastVisit: '2026-09-15', hba1c0: 6.9, hba1cSlope: 0.45, egfr: 52, sysMean: 152, sysSd: 9, memoryComplaint: true, status: 'referred', notes: ['Referred to memory clinic, Sep 2026.'] },
  { name: 'Ilona V.', age: 74, sex: 'F', conditions: ['htn', 'dlp', 'ckd'], lastVisit: '2026-10-08', hba1c0: 5.7, hba1cSlope: 0.03, egfr: 41, sysMean: 163, sysSd: 12, memoryComplaint: true, status: 'followUp', notes: ['Memory-clinic follow-up scheduled, Dec 2026.'] },
  // Moderate
  { name: 'Gábor S.', age: 71, sex: 'M', conditions: ['t2dm', 'htn', 'dlp'], lastVisit: '2026-10-22', hba1c0: 6.8, hba1cSlope: 0.25, egfr: 74, sysMean: 146, sysSd: 7, status: 'newFlag' },
  { name: 'Katalin B.', age: 66, sex: 'F', conditions: ['t2dm', 'obesity'], lastVisit: '2026-10-17', hba1c0: 7.0, hba1cSlope: 0.3, egfr: 81, sysMean: 136, sysSd: 8.5, status: 'followUp' },
  { name: 'József N.', age: 76, sex: 'M', conditions: ['htn', 'af'], lastVisit: '2026-10-13', hba1c0: 5.9, hba1cSlope: 0, egfr: 58, sysMean: 148, sysSd: 8.6, status: 'followUp' },
  { name: 'Mária H.', age: 72, sex: 'F', conditions: ['t2dm', 'htn'], lastVisit: '2026-09-29', hba1c0: 6.7, hba1cSlope: 0.15, egfr: 63, sysMean: 142, sysSd: 6, memoryComplaint: true, status: 'referred', notes: ['Referred to memory clinic, Oct 2026.'] },
  { name: 'Sándor L.', age: 69, sex: 'M', conditions: ['t2dm', 'htn', 'chd'], lastVisit: '2026-10-06', hba1c0: 7.2, hba1cSlope: 0.22, egfr: 66, sysMean: 151, sysSd: 10.5, status: 'followUp' },
  { name: 'Éva G.', age: 63, sex: 'F', conditions: ['htn', 'dlp', 'obesity'], lastVisit: '2026-09-24', hba1c0: 5.8, hba1cSlope: 0.02, egfr: 70, sysMean: 158, sysSd: 11, status: 'followUp' },
  { name: 'Tibor Cs.', age: 74, sex: 'M', conditions: ['t2dm'], lastVisit: '2026-09-18', hba1c0: 6.6, hba1cSlope: 0.35, egfr: 71, sysMean: 133, sysSd: 7, memoryComplaint: true, status: 'followUp' },
  // Low
  { name: 'Judit R.', age: 58, sex: 'F', conditions: ['htn'], lastVisit: '2026-10-21', hba1c0: 5.5, hba1cSlope: 0, egfr: 92, sysMean: 132, sysSd: 6, status: 'routine' },
  { name: 'István F.', age: 61, sex: 'M', conditions: ['t2dm'], lastVisit: '2026-10-20', hba1c0: 6.6, hba1cSlope: 0.04, egfr: 88, sysMean: 134, sysSd: 5, status: 'routine' },
  { name: 'Zsuzsanna P.', age: 67, sex: 'F', conditions: ['htn', 'dlp'], lastVisit: '2026-10-16', hba1c0: 5.6, hba1cSlope: 0, egfr: 80, sysMean: 127, sysSd: 4.5, status: 'routine' },
  { name: 'Ferenc M.', age: 65, sex: 'M', conditions: ['t2dm', 'htn'], lastVisit: '2026-10-15', hba1c0: 7.5, hba1cSlope: -0.25, egfr: 79, sysMean: 136, sysSd: 6, status: 'routine' },
  { name: 'Anna D.', age: 55, sex: 'F', conditions: ['obesity', 'dlp'], lastVisit: '2026-10-14', hba1c0: 5.7, hba1cSlope: 0.02, egfr: 96, sysMean: 125, sysSd: 4, status: 'routine' },
  { name: 'Péter Sz.', age: 69, sex: 'M', conditions: ['htn'], lastVisit: '2026-10-10', hba1c0: 5.6, hba1cSlope: 0.01, egfr: 77, sysMean: 141, sysSd: 7, status: 'routine' },
  { name: 'Margit O.', age: 71, sex: 'F', conditions: ['dlp'], lastVisit: '2026-10-09', hba1c0: 5.6, hba1cSlope: 0, egfr: 72, sysMean: 128, sysSd: 4.5, status: 'routine' },
  { name: 'Zoltán K.', age: 62, sex: 'M', conditions: ['t2dm', 'obesity'], lastVisit: '2026-10-07', hba1c0: 6.9, hba1cSlope: 0.13, egfr: 85, sysMean: 133, sysSd: 6.5, status: 'routine' },
  { name: 'Ágnes T.', age: 60, sex: 'F', conditions: ['htn'], lastVisit: '2026-10-02', hba1c0: 5.5, hba1cSlope: 0.01, egfr: 90, sysMean: 135, sysSd: 7, status: 'routine' },
  { name: 'Attila B.', age: 57, sex: 'M', conditions: ['t2dm', 'htn', 'dlp'], lastVisit: '2026-10-01', hba1c0: 6.8, hba1cSlope: 0.17, egfr: 83, sysMean: 138, sysSd: 7.5, status: 'routine' },
  { name: 'Erika H.', age: 64, sex: 'F', conditions: ['t2dm'], lastVisit: '2026-09-30', hba1c0: 6.7, hba1cSlope: 0.05, egfr: 86, sysMean: 131, sysSd: 6, status: 'routine' },
  { name: 'György V.', age: 73, sex: 'M', conditions: ['htn', 'chd'], lastVisit: '2026-09-25', hba1c0: 5.8, hba1cSlope: 0.02, egfr: 68, sysMean: 137, sysSd: 7, status: 'routine' },
  { name: 'Ibolya N.', age: 68, sex: 'F', conditions: ['t2dm', 'htn'], lastVisit: '2026-09-22', hba1c0: 7.3, hba1cSlope: -0.25, egfr: 74, sysMean: 126, sysSd: 4.5, status: 'routine' },
  { name: 'Miklós P.', age: 66, sex: 'M', conditions: ['dlp', 'obesity'], lastVisit: '2026-09-17', hba1c0: 5.9, hba1cSlope: 0.03, egfr: 82, sysMean: 139, sysSd: 8.3, status: 'routine' },
  { name: 'Rozália F.', age: 75, sex: 'F', conditions: ['htn'], lastVisit: '2026-09-11', hba1c0: 5.6, hba1cSlope: 0, egfr: 70, sysMean: 128, sysSd: 4.5, status: 'routine' },
];

function slugify(name: string): string {
  return (
    'p-' +
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z]+/g, '-')
      .replace(/-+$/, '')
  );
}

const background: Patient[] = profiles.map((p, i) => ({
  id: slugify(p.name),
  name: p.name,
  age: p.age,
  sex: p.sex,
  conditions: p.conditions,
  lastVisit: p.lastVisit,
  labs: generateLabs(p, 1000 + i * 97),
  memoryComplaint: p.memoryComplaint ?? false,
  recordNotes: p.notes ?? [],
  initialStatus: p.status,
}));

export const patients: readonly Patient[] = [hero, ...background];

export const patientsById: Readonly<Record<string, Patient>> = Object.fromEntries(patients.map((p) => [p.id, p]));
