import { Stethoscope } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { formatDate } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import { t } from '../../strings';
import { AssessmentFacts } from '../specialist/AssessmentFacts';

/** Result flowing back from the memory clinic; only renders once the specialist has saved. */
export function SpecialistOutcomeCard({ patientId }: { patientId: string }) {
  const assessment = useDemoStore((s) => s.assessmentById[patientId]);
  if (!assessment) return null;
  const o = t.gpOutcome;
  return (
    <Card tone="muted" className="animate-pop-in border-secondary/25 bg-mint/50" data-demo="specialist-outcome">
      <CardHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <Stethoscope className="size-3.5" />
            {o.eyebrow}
          </span>
        }
        title={o.title}
        description={o.description(formatDate(assessment.assessedOn))}
      />
      <AssessmentFacts assessment={assessment} />
    </Card>
  );
}
