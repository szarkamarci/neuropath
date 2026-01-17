export type PatientStatus = 'Pending' | 'MCI Detected' | 'Healthy' | 'Enrolled';

export interface Patient {
  id: string;
  name: string;
  age: number;
  riskScore: number;
  status: PatientStatus;
  screeningDate: string;
}

export type UserRole = 'doctor' | 'pharma' | 'patient';

export interface ScreeningResult {
  score: number;
  status: PatientStatus;
}
