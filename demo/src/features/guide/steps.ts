import { DEMO_TODAY, HERO_ID, patientsById } from '../../data/seed';
import { draftToAssessment, simulatedProfile } from '../../logic/assessment';
import type { MbiAnswer, MbiItemId } from '../../logic/mbi';
import { assessPatient } from '../../logic/riskInput';
import { useDemoStore } from '../../store/demoStore';
import type { RoleId } from '../../app/roles';

/**
 * The scripted Erzsébet story. Every step is data plus idempotent store
 * actions, so the state at any step can be rebuilt exactly: reset, then replay
 * the actions of all earlier steps. That makes back, jump and auto-play agree.
 */
export type StepId =
  | 'panel'
  | 'why'
  | 'check'
  | 'risk'
  | 'decide'
  | 'referral'
  | 'notification'
  | 'message'
  | 'next'
  | 'inbox'
  | 'assess'
  | 'saved'
  | 'registry';

export interface GuideStep {
  id: StepId;
  role: RoleId;
  /** Hash route (path + query) the step lives on. */
  route: string;
  /** `data-demo` ids to highlight; the first one present on screen wins. */
  targets: string[];
  /** Time on this step in auto-play. Steps sum to ~39 s. */
  ms: number;
  /** What a click on the highlighted element does. All run together, or staggered in auto-play. */
  acts: Array<() => void>;
  /**
   * Manual stepping applies `acts` when leaving the step instead of on entry, so the audience
   * sees the "before" (e.g. the referral dialog). Later steps always include them.
   */
  actOnExit?: boolean;
}

const store = () => useDemoStore.getState();
const GP_DETAIL = `/gp/patient/${HERO_ID}`;

const HERO_ANSWERS: Array<[MbiItemId, MbiAnswer]> = [
  ['lostInterest', 2],
  ['withdrawn', 1],
  ['lowMood', 1],
  ['irritable', 2],
  ['impulsive', 0],
  ['socialOutOfCharacter', 0],
  ['unusualBeliefs', 0],
];

const answerActs = HERO_ANSWERS.map(([item, answer]) => () => store().setMbiAnswer(HERO_ID, item, answer));

const completeCheck = () => store().completeMbi(HERO_ID, 58);

const sendReferral = () => {
  const mbiAnswers = store().mbiAnswersById[HERO_ID] ?? {};
  store().sendReferral({
    patientId: HERO_ID,
    sentOn: DEMO_TODAY,
    gpNote: 'Daughter will accompany her.',
    risk: assessPatient(patientsById[HERO_ID]!, mbiAnswers),
    mbiAnswers,
  });
};

const fillAssessment = () => {
  const referral = store().referrals.find((r) => r.patientId === HERO_ID);
  const score = referral?.risk.score ?? assessPatient(patientsById[HERO_ID]!, store().mbiAnswersById[HERO_ID]).score;
  store().patchAssessmentDraft(HERO_ID, {
    profile: simulatedProfile(score),
    diagnosis: 'mci',
    aetiology: 'ad',
    followUpMonths: 6,
    registryConsent: true,
  });
};

const saveAssessment = () => {
  const assessment = draftToAssessment(HERO_ID, store().assessmentDraftById[HERO_ID] ?? { profile: null, diagnosis: '', aetiology: '', followUpMonths: 6, registryConsent: false }, DEMO_TODAY);
  if (assessment) store().saveAssessment(assessment);
};

export const STEPS: readonly GuideStep[] = [
  { id: 'panel', role: 'gp', route: '/gp', targets: ['panel-row-p-erzsebet'], ms: 2800, acts: [] },
  { id: 'why', role: 'gp', route: GP_DETAIL, targets: ['risk-card'], ms: 3000, acts: [] },
  { id: 'check', role: 'gp', route: GP_DETAIL, targets: ['mbi-card'], ms: 3400, acts: answerActs },
  { id: 'risk', role: 'gp', route: GP_DETAIL, targets: ['risk-card'], ms: 3000, acts: [completeCheck] },
  { id: 'decide', role: 'gp', route: GP_DETAIL, targets: ['decision-refer'], ms: 2400, acts: [] },
  { id: 'referral', role: 'gp', route: `${GP_DETAIL}?referral=1`, targets: ['decision-recorded', 'send-referral'], ms: 3000, acts: [sendReferral], actOnExit: true },
  { id: 'notification', role: 'patient', route: '/patient', targets: ['push-notification'], ms: 2400, acts: [] },
  { id: 'message', role: 'patient', route: '/patient?screen=message', targets: ['phone'], ms: 2600, acts: [] },
  { id: 'next', role: 'patient', route: '/patient?screen=next', targets: ['patient-appointment'], ms: 3000, acts: [() => store().setCaregiverShare(true)] },
  { id: 'inbox', role: 'specialist', route: '/specialist', targets: ['inbox-row-p-erzsebet'], ms: 2600, acts: [] },
  { id: 'assess', role: 'specialist', route: `/specialist/referral/${HERO_ID}`, targets: ['cognitive-card'], ms: 3600, acts: [fillAssessment] },
  { id: 'saved', role: 'specialist', route: `/specialist/referral/${HERO_ID}`, targets: ['assessment-saved', 'save-assessment'], ms: 3000, acts: [saveAssessment] },
  { id: 'registry', role: 'research', route: '/research', targets: ['kpi-prequalified'], ms: 4000, acts: [] },
];

export const AUTOPLAY_TOTAL_MS = STEPS.reduce((sum, s) => sum + s.ms, 0);

/** Resets all demo data, then replays the actions of the first `count` steps. */
export function replayBefore(count: number): void {
  store().reset();
  for (const step of STEPS.slice(0, count)) for (const act of step.acts) act();
}
