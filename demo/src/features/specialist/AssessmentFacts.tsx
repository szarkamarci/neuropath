import { needsAetiology, type Assessment } from '../../logic/assessment';
import { t } from '../../strings';

/** Key facts of a saved assessment; shared by the specialist and GP views. */
export function AssessmentFacts({ assessment }: { assessment: Assessment }) {
  const o = t.gpOutcome;
  const rows: Array<[string, string]> = [
    [o.diagnosis, t.diagnoses[assessment.diagnosis]],
    ...(needsAetiology(assessment.diagnosis) && assessment.aetiology
      ? ([[o.aetiology, t.aetiologies[assessment.aetiology]]] as Array<[string, string]>)
      : []),
    [o.cognitive, o.cognitiveValue(assessment.overall)],
    [o.followUp, o.followUpValue(assessment.followUpMonths)],
    [o.registry, assessment.registryConsent ? o.registryYes : o.registryNo],
  ];
  return (
    <dl className="divide-y divide-outline-variant/20 rounded-lg border border-outline-variant/30 bg-white">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[10rem_1fr] gap-4 px-4 py-2.5">
          <dt className="text-label-md text-on-surface-variant uppercase">{label}</dt>
          <dd className="text-body-sm font-medium text-navy">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
