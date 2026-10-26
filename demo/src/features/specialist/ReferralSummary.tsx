import { FileText, ShieldCheck } from 'lucide-react';
import { Badge, RiskBadge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Notice } from '../../components/ui/Notice';
import { MBI_MAX_SCORE, mbiDomains, mbiDomainScores, mbiItems, mbiScore } from '../../logic/mbi';
import { MAX_SCORE } from '../../logic/risk';
import type { Referral } from '../../store/demoStore';
import { t } from '../../strings';
import { ContributorList } from '../gp/RiskCard';

const d = t.specialist.detail;

export function ReasonCard({ referral }: { referral: Referral }) {
  const { risk } = referral;
  return (
    <Card data-demo="referral-reason">
      <CardHeader
        eyebrow={d.reasonEyebrow}
        title={d.reasonTitle}
        action={
          <Badge tone="outline" icon={<ShieldCheck className="size-3" />}>
            {d.prefilled}
          </Badge>
        }
      />
      <div className="flex items-center gap-3">
        <RiskBadge band={risk.band} className="px-3 py-1 text-label-lg" />
        <span className="text-label-lg text-navy tabular-nums">
          {risk.score} {t.risk.outOf(MAX_SCORE)}
        </span>
      </div>
      <p className="mt-2 text-body-sm text-ink">{d.reasonValue(t.risk.bands[risk.band])}</p>
      <div className="mt-4 rounded-lg bg-cream px-4 py-3">
        <div className="mb-1 flex items-center gap-1.5 text-label-md text-on-surface-variant uppercase">
          <FileText className="size-3.5" />
          {d.gpNote}
        </div>
        <p className="text-body-sm text-ink" data-demo="gp-note">
          {referral.gpNote || <span className="text-muted">{d.noGpNote}</span>}
        </p>
      </div>
    </Card>
  );
}

export function ContributorsCard({ referral }: { referral: Referral }) {
  return (
    <Card data-demo="referral-contributors">
      <CardHeader title={d.contributorsTitle} description={d.contributorsNote} />
      <ContributorList contributors={referral.risk.contributors} />
      <Notice tone="model" className="mt-4">
        {t.risk.modelLabel}
      </Notice>
    </Card>
  );
}

export function BehaviorCard({ referral }: { referral: Referral }) {
  const score = mbiScore(referral.mbiAnswers);
  const domains = mbiDomainScores(referral.mbiAnswers);
  const m = t.gp.mbi;
  return (
    <Card data-demo="referral-behavior">
      <CardHeader
        title={d.behaviorTitle}
        description={score === null ? undefined : d.behaviorScore(score, MBI_MAX_SCORE)}
      />
      {score === null ? (
        <p className="text-body-sm text-muted">{d.behaviorNotDone}</p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            {mbiDomains.map((domain) => (
              <Badge key={domain} tone={domains[domain] > 0 ? 'attention' : 'outline'}>
                {m.domains[domain]} · {domains[domain]}
              </Badge>
            ))}
          </div>
          <ul className="divide-y divide-outline-variant/20 rounded-lg border border-outline-variant/30">
            {mbiItems.map((item) => {
              const answer = referral.mbiAnswers[item.id] ?? 0;
              return (
                <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-2">
                  <span className="text-body-sm text-navy">{m.items[item.id]}</span>
                  <span className={answer > 0 ? 'text-label-md font-bold text-error' : 'text-label-md text-muted'}>{m.scale[answer]}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
}
