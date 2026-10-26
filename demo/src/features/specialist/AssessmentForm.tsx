import { CircleCheck, RotateCcw, Save, Upload } from 'lucide-react';
import { CognitiveRadar } from '../../components/charts/CognitiveRadar';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Checkbox, Field, SegmentedControl, Select, Slider } from '../../components/ui/Form';
import { DEMO_TODAY } from '../../data/seed';
import { formatDate } from '../../lib/format';
import {
  aetiologies,
  cognitiveDomains,
  draftToAssessment,
  EMPTY_DRAFT,
  followUpOptions,
  needsAetiology,
  overallScore,
  simulatedProfile,
  workingDiagnoses,
  type Aetiology,
  type AssessmentDraft,
  type CognitiveProfile,
  type FollowUpMonths,
  type WorkingDiagnosis,
} from '../../logic/assessment';
import { useDemoStore, type Referral } from '../../store/demoStore';
import { t } from '../../strings';
import { AssessmentFacts } from './AssessmentFacts';

const a = t.specialist.assess;

export function AssessmentPanel({ referral }: { referral: Referral }) {
  const saved = useDemoStore((s) => s.assessmentById[referral.patientId]);
  return saved ? <SavedAssessment referral={referral} /> : <AssessmentForm referral={referral} />;
}

function SavedAssessment({ referral }: { referral: Referral }) {
  const saved = useDemoStore((s) => s.assessmentById[referral.patientId]);
  const reopen = useDemoStore((s) => s.reopenAssessment);
  if (!saved) return null;
  return (
    <div className="flex flex-col gap-gutter animate-fade-in" data-demo="assessment-saved">
      <Card tone="muted" className="border-secondary/25 bg-mint/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <CircleCheck className="mt-0.5 size-6 shrink-0 text-secondary" />
            <div>
              <h2 className="text-title-md text-navy">{a.savedTitle}</h2>
              <p className="mt-0.5 text-body-sm text-ink">{a.savedOn(formatDate(saved.assessedOn))}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => reopen(referral.patientId)} iconLeft={<RotateCcw className="size-3.5" />}>
            {a.amend}
          </Button>
        </div>
      </Card>
      <Card>
        <CardHeader title={a.cognitiveTitle} description={a.scaleNote} />
        <CognitiveRadar profile={saved.profile} />
        <div className="mt-4">
          <AssessmentFacts assessment={saved} />
        </div>
      </Card>
    </div>
  );
}

function AssessmentForm({ referral }: { referral: Referral }) {
  const saveAssessment = useDemoStore((s) => s.saveAssessment);
  const showToast = useDemoStore((s) => s.showToast);
  const draft = useDemoStore((s) => s.assessmentDraftById[referral.patientId] ?? EMPTY_DRAFT);
  const patchDraft = useDemoStore((s) => s.patchAssessmentDraft);
  const update = (patch: Partial<AssessmentDraft>) => patchDraft(referral.patientId, patch);
  const { profile, diagnosis, aetiology, followUpMonths: followUp, registryConsent: consent } = draft;
  const setProfile = (value: CognitiveProfile | null) => update({ profile: value });
  const setDiagnosis = (value: WorkingDiagnosis | '') => update({ diagnosis: value });
  const setAetiology = (value: Aetiology | '') => update({ aetiology: value });
  const setFollowUp = (value: FollowUpMonths) => update({ followUpMonths: value });
  const setConsent = (value: boolean) => update({ registryConsent: value });

  const aetiologyNeeded = diagnosis !== '' && needsAetiology(diagnosis);
  const assessment = draftToAssessment(referral.patientId, draft, DEMO_TODAY);
  const canSave = assessment !== null;

  const handleSave = () => {
    if (!assessment) return;
    saveAssessment(assessment);
    showToast(a.saved);
  };

  return (
    <div className="flex flex-col gap-gutter">
      <Card data-demo="cognitive-card">
        <CardHeader
          eyebrow={a.cognitiveEyebrow}
          title={a.cognitiveTitle}
          description={a.cognitiveDesc}
          action={
            <Button
              size="sm"
              variant={profile ? 'tertiary' : 'primary'}
              data-demo="import-assessment"
              onClick={() => setProfile(simulatedProfile(referral.risk.score))}
              iconLeft={<Upload className="size-3.5" />}
            >
              {profile ? a.reimport : a.importResult}
            </Button>
          }
        />
        {profile ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-6">
              <div className="shrink-0 text-center">
                <div className="text-display-hero leading-none text-navy tabular-nums" data-demo="overall-score">
                  {overallScore(profile)}
                </div>
                <div className="mt-1 text-label-md text-on-surface-variant uppercase">{a.overall}</div>
              </div>
              <div className="min-w-0 flex-1">
                <CognitiveRadar profile={profile} height={200} />
              </div>
            </div>
            <p className="mt-1 text-[11px] text-muted">{a.scaleNote}</p>
            <div className="mt-3 border-t border-outline-variant/20 pt-3">
              <div className="mb-2 text-label-md text-on-surface-variant uppercase">{a.adjust}</div>
              <div className="flex flex-col gap-2">
                {cognitiveDomains.map((domain) => (
                  <div key={domain} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3">
                    <span className="text-body-sm text-navy">{t.cognitiveDomains[domain]}</span>
                    <Slider label={t.cognitiveDomains[domain]} value={profile[domain]} onChange={(v) => setProfile({ ...profile, [domain]: v })} />
                    <span className="text-right text-label-lg text-navy tabular-nums">{profile[domain]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-outline-variant/60 px-4 py-8 text-center text-body-sm text-muted">{a.scaleNote}</p>
        )}
      </Card>

      <Card data-demo="diagnosis-card">
        <CardHeader eyebrow={a.diagnosisEyebrow} title={a.diagnosisTitle} />
        <div className="grid grid-cols-2 gap-4">
          <Field label={a.diagnosisLabel} htmlFor="working-diagnosis">
            <Select
              id="working-diagnosis"
              data-demo="diagnosis-select"
              value={diagnosis}
              onChange={(e) => {
                const next = e.target.value as WorkingDiagnosis | '';
                setDiagnosis(next);
                if (next === '' || !needsAetiology(next)) setAetiology('');
              }}
            >
              <option value="">{a.diagnosisPlaceholder}</option>
              {workingDiagnoses.map((dx) => (
                <option key={dx} value={dx}>
                  {t.diagnoses[dx]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={a.aetiologyLabel} htmlFor="aetiology">
            <Select
              id="aetiology"
              data-demo="aetiology-select"
              value={aetiology}
              disabled={!aetiologyNeeded}
              onChange={(e) => setAetiology(e.target.value as Aetiology | '')}
            >
              <option value="">{a.aetiologyPlaceholder}</option>
              {aetiologies.map((ae) => (
                <option key={ae} value={ae}>
                  {t.aetiologies[ae]}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card data-demo="plan-card">
        <CardHeader eyebrow={a.planEyebrow} title={a.planTitle} />
        <Field label={a.followUpLabel}>
          <SegmentedControl
            ariaLabel={a.followUpLabel}
            value={String(followUp)}
            onChange={(v) => setFollowUp(Number(v) as FollowUpMonths)}
            options={followUpOptions.map((m) => ({ value: String(m), label: a.months(m) }))}
          />
        </Field>
        <div className="mt-5 rounded-lg bg-surface-container-low px-4 py-3" data-demo="registry-consent">
          <Checkbox checked={consent} onChange={setConsent} label={a.consent} description={a.consentHelp} />
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-body-sm text-muted">{canSave ? '' : a.saveHint}</span>
          <Button size="lg" disabled={!canSave} onClick={handleSave} data-demo="save-assessment" iconLeft={<Save className="size-4" />}>
            {a.save}
          </Button>
        </div>
      </Card>
    </div>
  );
}
