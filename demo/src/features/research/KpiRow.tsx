import { Activity, ClipboardCheck, FolderOpen, Microscope, ShieldCheck, TriangleAlert } from 'lucide-react';
import { MetricCard } from '../../components/ui/MetricCard';
import { formatCell } from '../../logic/suppression';
import { t } from '../../strings';
import type { FunnelStage, ResearchData } from './useResearchData';

/** Every funnel stage except `assessed`, which is not a headline KPI. */
type KpiStage = Exclude<FunnelStage, 'assessed'>;

const KPI: Array<{ stage: KpiStage; icon: React.ReactNode; tone: 'teal' | 'blue' | 'attention' }> = [
  { stage: 'screened', icon: <Activity />, tone: 'teal' },
  { stage: 'flagged', icon: <TriangleAlert />, tone: 'attention' },
  { stage: 'referred', icon: <FolderOpen />, tone: 'blue' },
  { stage: 'mci', icon: <Microscope />, tone: 'teal' },
  { stage: 'registry', icon: <ShieldCheck />, tone: 'blue' },
  { stage: 'prequalified', icon: <ClipboardCheck />, tone: 'teal' },
];

export function KpiRow({ data }: { data: ResearchData }) {
  const r = t.research;
  return (
    <div className="grid grid-cols-6 gap-4" data-demo="research-kpis">
      {KPI.map(({ stage, icon, tone }) => (
        <div key={stage} className="relative" data-demo={`kpi-${stage}`}>
          <MetricCard icon={icon} tone={tone === 'attention' ? 'attention' : tone} value={formatCell(data.funnel[stage])} label={r.kpis[stage]} sublabel={r.kpiSub[stage]} className="h-full" />
          {data.live[stage] > 0 && (
            <span className="absolute top-3 right-3 animate-pop-in rounded-full bg-teal px-2 py-0.5 text-[11px] font-bold text-white" data-demo={`kpi-live-${stage}`}>
              {r.liveBadge(data.live[stage])}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
