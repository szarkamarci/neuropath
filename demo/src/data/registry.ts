import type { ConditionCode } from './types';
import type { Aetiology, WorkingDiagnosis } from '../logic/assessment';

/**
 * Synthetic historical aggregates behind the Research & Pharma view.
 * Deterministic (fixed-seed PRNG). Individual registry records exist only as
 * rows for the cohort builder; the UI never lists them.
 */

export interface County {
  id: string;
  name: string;
  short: string;
  /** Tile-grid position (a schematic, not a geographic map). */
  col: number;
  row: number;
  /** Historical screened patients (synthetic). */
  screened: number;
  /** Historical registry-consented patients (synthetic). */
  registry: number;
}

// Grid layout approximates Hungary's geography. Totals: screened 2,480; registry 61.
export const counties: readonly County[] = [
  { id: 'GYMS', name: 'Győr-Moson-Sopron', short: 'GY', col: 0, row: 0, screened: 120, registry: 3 },
  { id: 'KE', name: 'Komárom-Esztergom', short: 'KE', col: 1, row: 0, screened: 70, registry: 2 },
  { id: 'BU', name: 'Budapest', short: 'BP', col: 2, row: 0, screened: 440, registry: 12 },
  { id: 'NO', name: 'Nógrád', short: 'NÓ', col: 3, row: 0, screened: 40, registry: 1 },
  { id: 'BAZ', name: 'Borsod-Abaúj-Zemplén', short: 'BO', col: 4, row: 0, screened: 190, registry: 5 },
  { id: 'SZSZB', name: 'Szabolcs-Szatmár-Bereg', short: 'SZ', col: 5, row: 0, screened: 150, registry: 3 },
  { id: 'VAS', name: 'Vas', short: 'VA', col: 0, row: 1, screened: 80, registry: 1 },
  { id: 'VE', name: 'Veszprém', short: 'VE', col: 1, row: 1, screened: 95, registry: 2 },
  { id: 'FE', name: 'Fejér', short: 'FE', col: 2, row: 1, screened: 105, registry: 3 },
  { id: 'PE', name: 'Pest', short: 'PE', col: 3, row: 1, screened: 260, registry: 12 },
  { id: 'HE', name: 'Heves', short: 'HE', col: 4, row: 1, screened: 75, registry: 2 },
  { id: 'HB', name: 'Hajdú-Bihar', short: 'HB', col: 5, row: 1, screened: 170, registry: 4 },
  { id: 'ZA', name: 'Zala', short: 'ZA', col: 0, row: 2, screened: 60, registry: 1 },
  { id: 'SO', name: 'Somogy', short: 'SO', col: 1, row: 2, screened: 85, registry: 2 },
  { id: 'TO', name: 'Tolna', short: 'TO', col: 2, row: 2, screened: 55, registry: 1 },
  { id: 'BK', name: 'Bács-Kiskun', short: 'BK', col: 3, row: 2, screened: 110, registry: 2 },
  { id: 'JNSZ', name: 'Jász-Nagykun-Szolnok', short: 'JN', col: 4, row: 2, screened: 90, registry: 1 },
  { id: 'BE', name: 'Békés', short: 'BÉ', col: 5, row: 2, screened: 85, registry: 1 },
  { id: 'BA', name: 'Baranya', short: 'BA', col: 2, row: 3, screened: 100, registry: 1 },
  { id: 'CS', name: 'Csongrád-Csanád', short: 'CS', col: 4, row: 3, screened: 100, registry: 2 },
];

/** The demo GP practice (and so every panel patient) is in Pest county. */
export const PRACTICE_COUNTY = 'PE';

/** Historical funnel totals, before any live demo action. */
export const BASE_FUNNEL = {
  screened: 2480,
  flagged: 312,
  referred: 204,
  assessed: 158,
  mci: 74,
  registry: 61,
  prequalified: 28,
} as const;

export interface RegistryRecord {
  county: string;
  age: number;
  diagnosis: WorkingDiagnosis;
  aetiology: Aetiology | null;
  comorbidities: ConditionCode[];
  monthsSinceDiagnosis: number;
}

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

type Profile = { diagnosis: WorkingDiagnosis; aetiology: Aetiology | null };

/** 61 consented records: 28 MCI/AD (= pre-qualified), 20 other MCI, 7 dementia, 6 SCD. */
function diagnosisPool(): Profile[] {
  const other: Aetiology[] = ['vascular', 'mixed', 'other'];
  return [
    ...Array.from({ length: 28 }, () => ({ diagnosis: 'mci' as const, aetiology: 'ad' as const })),
    ...Array.from({ length: 20 }, (_, i) => ({ diagnosis: 'mci' as const, aetiology: other[i % 3]! })),
    ...Array.from({ length: 7 }, (_, i) => ({ diagnosis: 'dementia' as const, aetiology: i % 2 ? ('mixed' as const) : ('ad' as const) })),
    ...Array.from({ length: 6 }, () => ({ diagnosis: 'scd' as const, aetiology: null })),
  ];
}

const COMORBIDITY_SETS: ConditionCode[][] = [['t2dm', 'htn'], ['htn'], ['t2dm'], ['htn', 'dlp'], ['t2dm', 'htn', 'dlp'], ['dlp'], []];

function buildRecords(): RegistryRecord[] {
  const rand = prng(4242);
  const profiles = diagnosisPool();
  // Fisher–Yates with the fixed-seed PRNG.
  for (let i = profiles.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [profiles[i], profiles[j]] = [profiles[j]!, profiles[i]!];
  }
  const records: RegistryRecord[] = [];
  let k = 0;
  for (const county of counties) {
    for (let n = 0; n < county.registry; n++) {
      const profile = profiles[k++]!;
      records.push({
        county: county.id,
        age: 56 + Math.floor(rand() * 31),
        ...profile,
        comorbidities: COMORBIDITY_SETS[Math.floor(rand() * COMORBIDITY_SETS.length)]!,
        monthsSinceDiagnosis: 1 + Math.floor(rand() * 30),
      });
    }
  }
  return records;
}

export const baseRegistryRecords: readonly RegistryRecord[] = buildRecords();
