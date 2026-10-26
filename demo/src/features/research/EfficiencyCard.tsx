import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader } from '../../components/ui/Card';
import { Field, Slider, TextInput } from '../../components/ui/Form';
import { EFFICIENCY_DEFAULTS, estimateEfficiency, FAILURE_RATE_RANGE, type EfficiencyInputs } from '../../logic/efficiency';
import { t } from '../../strings';
import type { ResearchData } from './useResearchData';

const pct = (v: number) => `${Math.round(v * 100)}%`;
const eur = (v: number) => `€${Math.round(v).toLocaleString('en-US')}`;

export function EfficiencyCard({ data }: { data: ResearchData }) {
  const [inputs, setInputs] = useState<EfficiencyInputs>(EFFICIENCY_DEFAULTS);
  const e = t.research.efficiency;
  const result = estimateEfficiency(inputs);
  const pool = data.funnel.prequalified;

  return (
    <Card data-demo="efficiency" className="flex flex-col">
      <CardHeader eyebrow={e.eyebrow} title={e.title} action={<Badge tone="blue">{e.badge}</Badge>} />
      <div className="flex flex-col gap-4">
        <Field label={`${e.failureRate} · ${pct(inputs.baselineFailureRate)}`}>
          <Slider
            label={e.failureRate}
            min={Math.round(FAILURE_RATE_RANGE.min * 100)}
            max={Math.round(FAILURE_RATE_RANGE.max * 100)}
            value={Math.round(inputs.baselineFailureRate * 100)}
            onChange={(v) => setInputs({ ...inputs, baselineFailureRate: v / 100 })}
          />
        </Field>
        <Field label={`${e.reduction} · ${pct(inputs.failureReduction)}`} hint={e.assumptionNote}>
          <Slider label={e.reduction} min={10} max={70} value={Math.round(inputs.failureReduction * 100)} onChange={(v) => setInputs({ ...inputs, failureReduction: v / 100 })} />
        </Field>
        <Field label={e.costPerScreen} htmlFor="cost-per-screen">
          <TextInput
            id="cost-per-screen"
            type="number"
            min={0}
            step={100}
            inputMode="numeric"
            value={inputs.costPerScreen}
            onChange={(ev) => setInputs({ ...inputs, costPerScreen: Math.max(0, Number(ev.target.value) || 0) })}
          />
        </Field>
      </div>

      <div className="mt-5 rounded-xl border border-secondary/20 bg-mint/60 px-5 py-4">
        <div className="text-label-md text-on-surface-variant uppercase">{e.resultLabel}</div>
        <div className="mt-1 text-display-hero leading-none text-navy tabular-nums" data-demo="savings-per-enrolled">
          {eur(result.savingsPerEnrolled)}
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-3 text-body-sm">
          <Stat label={e.baselineScreens} value={result.screensPerEnrolledBaseline.toFixed(1)} />
          <Stat label={e.newScreens} value={result.screensPerEnrolledPrequalified.toFixed(1)} />
          <Stat label={e.newFailure} value={pct(result.prequalifiedFailureRate)} />
        </dl>
        <p className="mt-3 border-t border-secondary/15 pt-2 text-body-sm font-medium text-navy" data-demo="savings-pool">
          {e.pool(pool, eur(result.savingsPerEnrolled * pool))}
        </p>
      </div>
      <p className="mt-3 text-[11px] text-muted">{e.formula}</p>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] leading-tight text-on-surface-variant">{label}</dt>
      <dd className="text-title-md text-navy tabular-nums">{value}</dd>
    </div>
  );
}
