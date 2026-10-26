import { beforeEach, describe, expect, it } from 'vitest';
import { HERO_ID } from '../../data/seed';
import { EMPTY_DRAFT, draftToAssessment, simulatedProfile } from '../../logic/assessment';
import { useDemoStore, type DemoData } from '../../store/demoStore';
import { AUTOPLAY_TOTAL_MS, replayBefore, STEPS } from './steps';

/** The data part of the store (no actions, no toast). */
function snapshot(): DemoData {
  const { statusById, mbiAnswersById, mbiCompletedById, decisionById, referrals, assessmentById, assessmentDraftById, caregiverShare } =
    useDemoStore.getState();
  return JSON.parse(JSON.stringify({ statusById, mbiAnswersById, mbiCompletedById, decisionById, referrals, assessmentById, assessmentDraftById, caregiverShare }));
}

beforeEach(() => replayBefore(0));

describe('guided story', () => {
  it('auto-play takes about 40 seconds', () => {
    expect(AUTOPLAY_TOTAL_MS).toBeGreaterThanOrEqual(36_000);
    expect(AUTOPLAY_TOTAL_MS).toBeLessThanOrEqual(44_000);
  });

  it('replaying the same prefix twice gives identical state (deterministic)', () => {
    for (let n = 0; n <= STEPS.length; n++) {
      replayBefore(n);
      const first = snapshot();
      replayBefore(n);
      expect(snapshot()).toEqual(first);
    }
  });

  it('is idempotent: acting again after entering a step changes nothing', () => {
    for (let n = 0; n < STEPS.length; n++) {
      replayBefore(n + 1);
      const once = snapshot();
      for (const act of STEPS[n]!.acts) act();
      expect(snapshot()).toEqual(once);
    }
  });

  it('shows the referral dialog before the referral is sent (act on exit)', () => {
    const i = STEPS.findIndex((s) => s.id === 'referral');
    expect(STEPS[i]!.actOnExit).toBe(true);
    replayBefore(i);
    expect(snapshot().referrals.some((r) => r.patientId === HERO_ID)).toBe(false);
    replayBefore(i + 1);
    expect(snapshot().referrals.some((r) => r.patientId === HERO_ID)).toBe(true);
  });

  it('state is path independent: going back lands on the same state as going forward', () => {
    replayBefore(5);
    const forward = snapshot();
    replayBefore(STEPS.length);
    replayBefore(5);
    expect(snapshot()).toEqual(forward);
  });

  it('starts from the seed and ends with the hero assessed, referred and in the registry', () => {
    const start = snapshot();
    expect(start.statusById[HERO_ID]).toBe('newFlag');
    expect(start.referrals.some((r) => r.patientId === HERO_ID)).toBe(false);

    replayBefore(STEPS.length);
    const end = snapshot();
    expect(end.statusById[HERO_ID]).toBe('assessed');
    expect(end.referrals.find((r) => r.patientId === HERO_ID)?.risk.band).toBe('high');
    expect(end.assessmentById[HERO_ID]).toMatchObject({ diagnosis: 'mci', aetiology: 'ad', registryConsent: true, followUpMonths: 6 });
    expect(end.caregiverShare).toBe(true);
    expect(end.mbiCompletedById[HERO_ID]).toBe(58);
  });

  it('walks roles in story order', () => {
    const roles = STEPS.map((s) => s.role).filter((r, i, all) => i === 0 || r !== all[i - 1]);
    expect(roles).toEqual(['gp', 'patient', 'specialist', 'research']);
  });
});

describe('draftToAssessment', () => {
  const profile = simulatedProfile(16);
  it('needs a result and a diagnosis', () => {
    expect(draftToAssessment('p', EMPTY_DRAFT, '2026-10-26')).toBeNull();
    expect(draftToAssessment('p', { ...EMPTY_DRAFT, profile }, '2026-10-26')).toBeNull();
  });

  it('needs an aetiology for MCI but not for normal cognition', () => {
    expect(draftToAssessment('p', { ...EMPTY_DRAFT, profile, diagnosis: 'mci' }, '2026-10-26')).toBeNull();
    expect(draftToAssessment('p', { ...EMPTY_DRAFT, profile, diagnosis: 'normal', aetiology: 'ad' }, '2026-10-26')?.aetiology).toBeNull();
    expect(draftToAssessment('p', { ...EMPTY_DRAFT, profile, diagnosis: 'mci', aetiology: 'ad' }, '2026-10-26')).toMatchObject({ aetiology: 'ad', overall: 70 });
  });
});
