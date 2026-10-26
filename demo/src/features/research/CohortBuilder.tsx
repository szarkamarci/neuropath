import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';
import { Checkbox, Field, Select, Slider } from '../../components/ui/Form';
import { cn } from '../../lib/cn';
import { countCohort, DEFAULT_CRITERIA, type CohortCriteria, type ComorbidityFilter, type TimeSinceDiagnosis } from '../../logic/cohort';
import { formatCell, isSuppressed } from '../../logic/suppression';
import { t } from '../../strings';
import type { ResearchData } from './useResearchData';

export function CohortBuilder({ data }: { data: ResearchData }) {
  const [c, setC] = useState<CohortCriteria>(DEFAULT_CRITERIA);
  const k = t.research.cohort;
  const count = useMemo(() => countCohort(data.records, c), [data.records, c]);
  const hidden = isSuppressed(count);
  const set = (patch: Partial<CohortCriteria>) => setC((prev) => ({ ...prev, ...patch }));

  return (
    <Card data-demo="cohort-builder" className="flex flex-col">
      <CardHeader
        eyebrow={k.eyebrow}
        title={k.title}
        description={k.description}
        action={
          <Button variant="ghost" size="sm" onClick={() => setC(DEFAULT_CRITERIA)} iconLeft={<RotateCcw className="size-3.5" />}>
            {k.reset}
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Field label={`${k.age} · ${k.ageValue(c.ageMin, c.ageMax)}`} className="col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <Slider label={k.ageMin} min={50} max={90} value={c.ageMin} onChange={(v) => set({ ageMin: Math.min(v, c.ageMax) })} />
            <Slider label={k.ageMax} min={50} max={90} value={c.ageMax} onChange={(v) => set({ ageMax: Math.max(v, c.ageMin) })} />
          </div>
        </Field>
        <div className="flex flex-col gap-3 rounded-lg bg-surface-container-low px-4 py-3">
          <Checkbox checked={c.mciConfirmed} onChange={(v) => set({ mciConfirmed: v })} label={k.mci} />
          <Checkbox checked={c.adAetiology} onChange={(v) => set({ adAetiology: v })} label={k.ad} />
        </div>
        <div className="flex flex-col gap-3">
          <Field label={k.comorbidity} htmlFor="cohort-comorbidity">
            <Select id="cohort-comorbidity" value={c.comorbidity} onChange={(e) => set({ comorbidity: e.target.value as ComorbidityFilter })}>
              {(Object.keys(k.comorbidityOptions) as ComorbidityFilter[]).map((o) => (
                <option key={o} value={o}>
                  {k.comorbidityOptions[o]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={k.since} htmlFor="cohort-since">
            <Select id="cohort-since" value={c.sinceDiagnosis} onChange={(e) => set({ sinceDiagnosis: e.target.value as TimeSinceDiagnosis })}>
              {(Object.keys(k.sinceOptions) as TimeSinceDiagnosis[]).map((o) => (
                <option key={o} value={o}>
                  {k.sinceOptions[o]}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-secondary/20 bg-mint/60 px-5 py-4" data-demo="cohort-result">
        <div>
          <div className="text-label-md text-on-surface-variant uppercase">{k.matching}</div>
          <div className="text-body-sm text-ink">{hidden ? k.suppressedNote : k.shownNote}</div>
        </div>
        <div className={cn('text-display-hero leading-none tabular-nums', hidden ? 'text-on-surface-variant' : 'text-navy')} data-demo="cohort-count">
          {formatCell(count)}
        </div>
      </div>
    </Card>
  );
}
