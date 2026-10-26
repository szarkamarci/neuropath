import { useMemo } from 'react';
import { patients } from '../data/seed';
import type { Patient } from '../data/types';
import type { MbiAnswers } from '../logic/mbi';
import type { RiskResult } from '../logic/risk';
import { assessPatient } from '../logic/riskInput';
import { useDemoStore } from './demoStore';

const EMPTY_ANSWERS: MbiAnswers = {};

export function useMbiAnswers(patientId: string): MbiAnswers {
  return useDemoStore((s) => s.mbiAnswersById[patientId] ?? EMPTY_ANSWERS);
}

export interface PatientRisk {
  /** Current risk, including any behavioral-check answers. */
  current: RiskResult;
  /** Risk from routine data only (before the behavioral check). */
  baseline: RiskResult;
}

export function usePatientRisk(patient: Patient): PatientRisk {
  const answers = useMbiAnswers(patient.id);
  return useMemo(() => ({ current: assessPatient(patient, answers), baseline: assessPatient(patient) }), [patient, answers]);
}

export interface PanelRow {
  patient: Patient;
  risk: RiskResult;
}

/** All panel patients with live risk; new flags first, then by score. */
export function usePanelRows(): PanelRow[] {
  const answersById = useDemoStore((s) => s.mbiAnswersById);
  const statusById = useDemoStore((s) => s.statusById);
  return useMemo(() => {
    const rows = patients.map((patient) => ({ patient, risk: assessPatient(patient, answersById[patient.id]) }));
    const flagRank = (id: string) => (statusById[id] === 'newFlag' ? 0 : 1);
    return rows.sort((a, b) => flagRank(a.patient.id) - flagRank(b.patient.id) || b.risk.score - a.risk.score);
  }, [answersById, statusById]);
}
