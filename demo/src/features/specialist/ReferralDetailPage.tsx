import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Inbox } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Notice } from '../../components/ui/Notice';
import { patientsById } from '../../data/seed';
import { formatDate, initials } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import { t } from '../../strings';
import { LabTrendsCard } from '../gp/LabTrendsCard';
import { AssessmentPanel } from './AssessmentForm';
import { BehaviorCard, ContributorsCard, ReasonCard } from './ReferralSummary';

export function ReferralDetailPage() {
  const { patientId = '' } = useParams();
  const patient = patientsById[patientId];
  const referral = useDemoStore((s) => s.referrals.find((r) => r.patientId === patientId));
  const assessed = useDemoStore((s) => Boolean(s.assessmentById[patientId]));
  const d = t.specialist.detail;
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-5 lg:px-12">
      <Link to="/specialist" className="mb-3 inline-flex items-center gap-1.5 text-label-lg text-on-surface-variant transition-colors hover:text-secondary">
        <ArrowLeft className="size-4" />
        {d.back}
      </Link>
      {!patient ? (
        <Notice tone="attention">{d.notFound}</Notice>
      ) : !referral ? (
        <Card className="flex flex-col items-center px-8 py-16 text-center" data-demo="referral-empty">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-mint text-secondary">
            <Inbox className="size-6" />
          </div>
          <h1 className="text-title-md text-navy">{d.emptyTitle}</h1>
          <p className="mt-1 mb-6 max-w-md text-body-sm text-on-surface-variant">{d.emptyBody}</p>
          <div className="flex gap-3">
            <Button variant="tertiary" onClick={() => navigate('/specialist')}>
              {d.emptyBack}
            </Button>
            <Button onClick={() => navigate(`/gp/patient/${patient.id}`)}>{d.emptyAction}</Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="flex items-center justify-between gap-8 px-6 py-5" data-demo="referral-header">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy text-title-md font-bold text-white">
                {initials(patient.name)}
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-headline-md text-navy">{patient.name}</h1>
                  <Badge tone={assessed ? 'teal' : 'attention'} dot>
                    {assessed ? t.specialist.inbox.statusAssessed : t.specialist.inbox.statusNew}
                  </Badge>
                </div>
                <div className="mt-0.5 text-body-sm text-on-surface-variant">
                  {t.gp.detail.years(patient.age)} · {t.sex[patient.sex]} · {patient.conditions.map((c) => t.conditions[c]).join(', ')}
                </div>
              </div>
            </div>
            <div className="text-right text-body-sm text-on-surface-variant">
              <div>
                {d.referredBy}: <span className="font-semibold text-navy">{t.specialist.inbox.from}</span>
              </div>
              <div>{d.received(formatDate(referral.sentOn))}</div>
            </div>
          </Card>

          <div className="mt-gutter grid grid-cols-12 items-start gap-gutter">
            <div className="col-span-6 flex flex-col gap-gutter">
              <ReasonCard referral={referral} />
              <ContributorsCard referral={referral} />
              <BehaviorCard referral={referral} />
              <LabTrendsCard patient={patient} />
            </div>
            <div className="col-span-6">
              <AssessmentPanel referral={referral} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
