import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge, RiskBadge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Notice } from '../../components/ui/Notice';
import { cn } from '../../lib/cn';
import { BAND_THRESHOLDS, MAX_SCORE, type Contributor, type RiskBand } from '../../logic/risk';
import type { PatientRisk } from '../../store/selectors';
import { t } from '../../strings';

const bandText: Record<RiskBand, string> = { low: 'text-secondary', moderate: 'text-blue', high: 'text-error' };

const pct = (score: number) => `${(Math.min(score, MAX_SCORE) / MAX_SCORE) * 100}%`;

interface RiskCardProps {
  risk: PatientRisk;
  checkStarted: boolean;
}

export function RiskCard({ risk, checkStarted }: RiskCardProps) {
  const { current, baseline } = risk;
  const delta = current.score - baseline.score;
  const r = t.risk;
  return (
    <Card data-demo="risk-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 text-label-md text-on-surface-variant uppercase">{r.cardEyebrow}</div>
          <h2 className="text-title-md text-navy">{r.cardTitle}</h2>
        </div>
        <RiskBadge band={current.band} className="px-3 py-1 text-label-lg" />
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className={cn('text-display-hero leading-none tabular-nums transition-colors duration-500', bandText[current.band])}>
          {current.score}
        </span>
        <span className="text-body-md text-on-surface-variant">{r.outOf(MAX_SCORE)}</span>
      </div>

      <RiskScale score={current.score} baselineScore={checkStarted && delta !== 0 ? baseline.score : null} />

      <p className={cn('mt-3 text-body-sm', checkStarted && delta > 0 ? 'font-semibold text-error' : 'text-muted')}>
        {!checkStarted ? r.checkPending : delta > 0 ? r.deltaFromCheck(delta) : r.noDeltaFromCheck}
      </p>

      <div className="mt-5 border-t border-outline-variant/20 pt-4">
        <h3 className="mb-3 text-label-md text-on-surface-variant uppercase">{r.contributorsTitle}</h3>
        {current.contributors.length === 0 ? (
          <p className="text-body-sm text-muted">{r.noContributors}</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {current.contributors.map((c) => (
              <ContributorRow key={c.id} contributor={c} />
            ))}
          </ul>
        )}
      </div>

      <Notice tone="model" className="mt-5">
        {r.modelLabel}
      </Notice>
    </Card>
  );
}

function RiskScale({ score, baselineScore }: { score: number; baselineScore: number | null }) {
  const zones: Array<{ band: RiskBand; from: number; to: number; className: string }> = [
    { band: 'low', from: 0, to: BAND_THRESHOLDS.moderate, className: 'bg-mint' },
    { band: 'moderate', from: BAND_THRESHOLDS.moderate, to: BAND_THRESHOLDS.high, className: 'bg-tertiary-fixed/70' },
    { band: 'high', from: BAND_THRESHOLDS.high, to: MAX_SCORE, className: 'bg-attention-soft' },
  ];
  return (
    <div className="pt-1">
      <div className="relative h-3">
        <div className="absolute inset-0 flex overflow-hidden rounded-full">
          {zones.map((z) => (
            <div key={z.band} className={z.className} style={{ width: `${((z.to - z.from) / MAX_SCORE) * 100}%` }} />
          ))}
        </div>
        {baselineScore !== null && (
          <span
            title={t.risk.beforeCheck}
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-outline bg-white"
            style={{ left: pct(baselineScore) }}
          />
        )}
        <span
          className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-navy shadow-md transition-[left] duration-700 ease-out"
          style={{ left: pct(score) }}
        />
      </div>
      <div className="relative mt-2 h-4 text-[11px] font-semibold text-on-surface-variant">
        {zones.map((z) => (
          <span key={z.band} className="absolute" style={{ left: `${(z.from / MAX_SCORE) * 100}%` }}>
            {t.risk.scaleLabels[z.band]}
          </span>
        ))}
      </div>
    </div>
  );
}

const weightTone = { high: 'attention', moderate: 'blue', low: 'neutral' } as const;

function ContributorRow({ contributor: c }: { contributor: Contributor }) {
  const up = c.direction === 'up';
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <li className="animate-fade-in" data-demo={`contributor-${c.id}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className={cn('size-4 shrink-0', up ? 'text-attention' : 'text-secondary')} />
          <span className="text-body-sm text-navy">{c.label}</span>
        </div>
        <Badge tone={up ? weightTone[c.weight] : 'teal'} className="shrink-0">
          {up ? t.risk.weights[c.weight] : t.risk.protective}
        </Badge>
      </div>
      <div className="mt-1.5 ml-6 h-1 overflow-hidden rounded-full bg-surface-container">
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', up ? 'bg-attention/70' : 'bg-teal')}
          style={{ width: `${(Math.abs(c.points) / 4) * 100}%` }}
        />
      </div>
    </li>
  );
}
