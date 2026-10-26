import { Card, CardHeader } from '../../components/ui/Card';
import { cn } from '../../lib/cn';
import { formatCell } from '../../logic/suppression';
import { t } from '../../strings';
import { FUNNEL_STAGES, type ResearchData } from './useResearchData';

export function FunnelCard({ data }: { data: ResearchData }) {
  const f = t.research.funnel;
  const top = data.funnel.screened;
  return (
    <Card data-demo="funnel">
      <CardHeader eyebrow={f.eyebrow} title={f.title} description={f.description} />
      <ol className="flex flex-col gap-2">
        {FUNNEL_STAGES.map((stage, i) => {
          const value = data.funnel[stage];
          const prev = i === 0 ? null : data.funnel[FUNNEL_STAGES[i - 1]!];
          const last = i === FUNNEL_STAGES.length - 1;
          return (
            <li key={stage} className="grid grid-cols-[8.5rem_1fr_9.5rem] items-center gap-3" data-demo={`funnel-${stage}`}>
              <span className="text-label-lg text-navy">{f.stages[stage]}</span>
              <div className="h-8 rounded-md bg-surface-container-low">
                <div
                  className={cn('flex h-full items-center rounded-md transition-[width] duration-700 ease-out', last ? 'bg-teal' : 'bg-blue')}
                  style={{ width: `${Math.max((value / top) * 100, 2.5)}%`, opacity: 0.35 + 0.65 * (1 - i / (FUNNEL_STAGES.length * 1.3)) }}
                />
              </div>
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-title-md text-navy tabular-nums">{formatCell(value)}</span>
                {prev !== null && (
                  <span className="text-[11px] text-muted tabular-nums">{f.ofPrevious(`${Math.round((value / prev) * 100)}%`)}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
