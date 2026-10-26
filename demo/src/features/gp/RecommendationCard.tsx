import { ArrowRight, Ban, ClipboardCheck, Eye, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/cn';
import type { RiskBand } from '../../logic/risk';
import { t } from '../../strings';

interface RecommendationCardProps {
  band: RiskBand;
  /** True once any behavioral-check answer exists. */
  checkStarted: boolean;
}

type Variant = 'high' | 'moderatePending' | 'moderate' | 'low';

const accent: Record<Variant, { bar: string; icon: ReactNode }> = {
  high: { bar: 'bg-attention', icon: <ArrowRight className="size-5 text-error" /> },
  moderatePending: { bar: 'bg-blue', icon: <ClipboardCheck className="size-5 text-blue" /> },
  moderate: { bar: 'bg-blue', icon: <Eye className="size-5 text-blue" /> },
  low: { bar: 'bg-teal', icon: <ShieldCheck className="size-5 text-secondary" /> },
};

export function RecommendationCard({ band, checkStarted }: RecommendationCardProps) {
  const variant: Variant = band === 'moderate' && !checkStarted ? 'moderatePending' : band;
  const r = t.gp.recommendation;
  const copy = r[variant];
  return (
    <Card padded={false} className="relative overflow-hidden" data-demo="recommendation">
      <div className={cn('absolute inset-y-0 left-0 w-1', accent[variant].bar)} />
      <div className="p-5 pl-6">
        <div className="mb-1 text-label-md text-on-surface-variant uppercase">{r.eyebrow}</div>
        <div key={variant} className="animate-fade-in">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0">{accent[variant].icon}</span>
            <h2 className="text-title-md text-navy">{copy.title}</h2>
          </div>
          <ul className="mt-2 ml-7.5 flex list-disc flex-col gap-1 pl-4 text-body-sm text-ink marker:text-outline-variant">
            {copy.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          {variant === 'low' && (
            <div className="mt-3 ml-7.5">
              <div className="mb-1.5 text-label-md text-secondary">{r.low.avoidedTitle}</div>
              <div className="flex flex-wrap gap-1.5">
                {r.low.avoided.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full border border-outline-variant/40 bg-surface-container-low px-2.5 py-0.5 text-label-md text-on-surface-variant"
                  >
                    <Ban className="size-3" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 flex items-center gap-1.5 border-t border-outline-variant/20 pt-3 text-[11px] font-medium text-muted">
          <ShieldCheck className="size-3.5" />
          {r.decisionSupport}
        </p>
      </div>
    </Card>
  );
}
