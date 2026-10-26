export type Sex = 'F' | 'M';

export type ConditionCode = 't2dm' | 'htn' | 'dlp' | 'af' | 'chd' | 'obesity' | 'ckd';

export type PatientStatus = 'routine' | 'newFlag' | 'referred' | 'followUp' | 'monitor' | 'dismissed' | 'assessed';

/** One routine chronic-care lab/vitals draw. */
export interface LabPoint {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** HbA1c, % */
  hba1c: number;
  /** Fasting glucose, mmol/L */
  glucose: number;
  /** eGFR, mL/min/1.73m² */
  egfr: number;
  /** Systolic BP, mmHg */
  sys: number;
  /** Diastolic BP, mmHg */
  dia: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: Sex;
  conditions: ConditionCode[];
  /** ISO date of last visit. */
  lastVisit: string;
  labs: LabPoint[];
  /** Subjective memory complaint recorded (patient or family). */
  memoryComplaint: boolean;
  /** Free-text items shown as "from the record". */
  recordNotes: string[];
  initialStatus: PatientStatus;
  isHero?: boolean;
}
