import { useMemo } from 'react';
import { BASE_FUNNEL, baseRegistryRecords, counties, PRACTICE_COUNTY, type RegistryRecord } from '../../data/registry';
import { patients, patientsById } from '../../data/seed';
import { isPrequalified } from '../../logic/cohort';
import { assessPatient } from '../../logic/riskInput';
import { useDemoStore } from '../../store/demoStore';

export type FunnelStage = keyof typeof BASE_FUNNEL;
export const FUNNEL_STAGES: readonly FunnelStage[] = ['screened', 'flagged', 'referred', 'assessed', 'mci', 'registry', 'prequalified'];

export interface ResearchData {
  funnel: Record<FunnelStage, number>;
  /** How much of each funnel stage came from actions taken in this demo session. */
  live: Record<FunnelStage, number>;
  /** Historical records plus consented patients from this session. */
  records: RegistryRecord[];
  screenedByCounty: Record<string, number>;
  registryByCounty: Record<string, number>;
}

const SEEDED_REFERRALS = new Set(patients.filter((p) => p.initialStatus === 'referred' && !p.isHero).map((p) => p.id));

/** Aggregates = synthetic history + this session's actions (deterministic; same seed, same numbers). */
export function useResearchData(): ResearchData {
  const referrals = useDemoStore((s) => s.referrals);
  const assessmentById = useDemoStore((s) => s.assessmentById);
  const mbiCompletedById = useDemoStore((s) => s.mbiCompletedById);
  const mbiAnswersById = useDemoStore((s) => s.mbiAnswersById);

  return useMemo(() => {
    const live: Record<FunnelStage, number> = { screened: 0, flagged: 0, referred: 0, assessed: 0, mci: 0, registry: 0, prequalified: 0 };
    const liveRecords: RegistryRecord[] = [];

    for (const id of Object.keys(mbiCompletedById)) {
      const patient = patientsById[id];
      if (!patient) continue;
      live.screened += 1;
      if (assessPatient(patient, mbiAnswersById[id]).band === 'high') live.flagged += 1;
    }
    live.referred = referrals.filter((r) => !SEEDED_REFERRALS.has(r.patientId)).length;

    for (const a of Object.values(assessmentById)) {
      const patient = patientsById[a.patientId];
      live.assessed += 1;
      if (a.diagnosis === 'mci') live.mci += 1;
      if (!a.registryConsent || !patient) continue;
      live.registry += 1;
      const record: RegistryRecord = {
        county: PRACTICE_COUNTY,
        age: patient.age,
        diagnosis: a.diagnosis,
        aetiology: a.aetiology,
        comorbidities: patient.conditions,
        monthsSinceDiagnosis: 0,
      };
      liveRecords.push(record);
      if (isPrequalified(record)) live.prequalified += 1;
    }

    const funnel = Object.fromEntries(FUNNEL_STAGES.map((s) => [s, BASE_FUNNEL[s] + live[s]])) as Record<FunnelStage, number>;
    const records = [...baseRegistryRecords, ...liveRecords];
    const screenedByCounty = Object.fromEntries(counties.map((c) => [c.id, c.screened + (c.id === PRACTICE_COUNTY ? live.screened : 0)]));
    const registryByCounty = Object.fromEntries(counties.map((c) => [c.id, records.filter((r) => r.county === c.id).length]));
    return { funnel, live, records, screenedByCounty, registryByCounty };
  }, [referrals, assessmentById, mbiCompletedById, mbiAnswersById]);
}
