import { create } from 'zustand';
import { patients } from '../data/seed';
import type { PatientStatus } from '../data/types';
import type { MbiAnswer, MbiAnswers, MbiItemId } from '../logic/mbi';
import type { RiskResult } from '../logic/risk';

/**
 * Shared in-memory demo state. Every role reads from this one store, so an
 * action taken in one view shows up in the others. Static patient records
 * live in data/seed.ts; only what the demo changes lives here.
 * `createInitialData` must stay deterministic so reset is exact.
 */

export type DismissReason = 'knownDiagnosis' | 'explained' | 'declined' | 'clinical';

export type ClinicianDecision =
  | { kind: 'refer' }
  | { kind: 'monitor'; months: 6 | 12 }
  | { kind: 'dismiss'; reason: DismissReason };

export interface Referral {
  id: string;
  patientId: string;
  /** ISO date the referral was sent (the demo's fixed "today"). */
  sentOn: string;
  gpNote: string;
  /** Risk as shown to the GP at the moment of referral. */
  risk: RiskResult;
  mbiAnswers: MbiAnswers;
}

export interface DemoData {
  statusById: Record<string, PatientStatus>;
  mbiAnswersById: Record<string, MbiAnswers>;
  /** Completed behavioral checks: patient id → seconds taken. */
  mbiCompletedById: Record<string, number>;
  decisionById: Record<string, ClinicianDecision>;
  referrals: Referral[];
}

export function createInitialData(): DemoData {
  return {
    statusById: Object.fromEntries(patients.map((p) => [p.id, p.initialStatus])),
    mbiAnswersById: {},
    mbiCompletedById: {},
    decisionById: {},
    referrals: [],
  };
}

interface DemoActions {
  setMbiAnswer: (patientId: string, item: MbiItemId, answer: MbiAnswer) => void;
  completeMbi: (patientId: string, seconds: number) => void;
  reopenMbi: (patientId: string) => void;
  sendReferral: (referral: Omit<Referral, 'id'>) => void;
  recordDecision: (patientId: string, decision: Exclude<ClinicianDecision, { kind: 'refer' }>) => void;
  clearDecision: (patientId: string) => void;
}

interface UiState {
  toast: string | null;
  reset: () => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
}

type DemoStore = DemoData & DemoActions & UiState;

const statusForDecision: Record<ClinicianDecision['kind'], PatientStatus> = {
  refer: 'referred',
  monitor: 'monitor',
  dismiss: 'dismissed',
};

export const useDemoStore = create<DemoStore>()((set) => ({
  ...createInitialData(),
  toast: null,

  setMbiAnswer: (patientId, item, answer) =>
    set((s) => ({
      mbiAnswersById: { ...s.mbiAnswersById, [patientId]: { ...s.mbiAnswersById[patientId], [item]: answer } },
    })),

  completeMbi: (patientId, seconds) => set((s) => ({ mbiCompletedById: { ...s.mbiCompletedById, [patientId]: seconds } })),

  reopenMbi: (patientId) =>
    set((s) => {
      const { [patientId]: _removed, ...mbiCompletedById } = s.mbiCompletedById;
      return { mbiCompletedById };
    }),

  sendReferral: (referral) =>
    set((s) => ({
      referrals: [...s.referrals.filter((r) => r.patientId !== referral.patientId), { ...referral, id: `ref-${referral.patientId}` }],
      decisionById: { ...s.decisionById, [referral.patientId]: { kind: 'refer' } },
      statusById: { ...s.statusById, [referral.patientId]: statusForDecision.refer },
    })),

  recordDecision: (patientId, decision) =>
    set((s) => ({
      decisionById: { ...s.decisionById, [patientId]: decision },
      statusById: { ...s.statusById, [patientId]: statusForDecision[decision.kind] },
      referrals: s.referrals.filter((r) => r.patientId !== patientId),
    })),

  clearDecision: (patientId) =>
    set((s) => {
      const { [patientId]: _removed, ...decisionById } = s.decisionById;
      const initial = patients.find((p) => p.id === patientId)?.initialStatus ?? 'routine';
      return {
        decisionById,
        statusById: { ...s.statusById, [patientId]: initial },
        referrals: s.referrals.filter((r) => r.patientId !== patientId),
      };
    }),

  reset: () => set({ ...createInitialData() }),
  showToast: (message) => set({ toast: message }),
  dismissToast: () => set({ toast: null }),
}));
