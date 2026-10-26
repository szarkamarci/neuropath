import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, ClipboardList, Database, FolderOpen, TriangleAlert, Users } from 'lucide-react';
import { Badge, RiskBadge, StatusBadge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { SegmentedControl } from '../../components/ui/Form';
import { MetricCard } from '../../components/ui/MetricCard';
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table';
import { DEMO_TODAY } from '../../data/seed';
import type { RiskBand } from '../../logic/risk';
import { cn } from '../../lib/cn';
import { formatDate, initials } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import { usePanelRows, type PanelRow } from '../../store/selectors';
import { t } from '../../strings';

type BandFilter = 'all' | RiskBand;
const FILTERS: BandFilter[] = ['all', 'high', 'moderate', 'low'];

function isBandFilter(value: string | null): value is BandFilter {
  return FILTERS.includes(value as BandFilter);
}

export function GpPanelPage() {
  const rows = usePanelRows();
  const statusById = useDemoStore((s) => s.statusById);
  const [params, setParams] = useSearchParams();
  const bandParam = params.get('band');
  const filter: BandFilter = isBandFilter(bandParam) ? bandParam : 'all';

  const countBand = (band: RiskBand) => rows.filter((r) => r.risk.band === band).length;
  const countStatus = (status: string) => Object.values(statusById).filter((s) => s === status).length;
  const visible = filter === 'all' ? rows : rows.filter((r) => r.risk.band === filter);

  const p = t.gp.panel;
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-12">
      <PanelHeader />

      <div className="mb-gutter grid grid-cols-4 gap-4">
        <MetricCard icon={<Users />} value={rows.length} label={p.metrics.panel} sublabel={p.metrics.panelSub} />
        <MetricCard icon={<TriangleAlert />} value={countBand('high')} label={p.metrics.high} sublabel={p.metrics.highSub} tone="attention" />
        <MetricCard icon={<ClipboardList />} value={countStatus('newFlag')} label={p.metrics.flags} sublabel={p.metrics.flagsSub} tone="blue" />
        <MetricCard icon={<FolderOpen />} value={countStatus('referred')} label={p.metrics.referred} sublabel={p.metrics.referredSub} />
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 px-5 py-3">
          <span className="text-label-lg text-navy">{p.count(visible.length)}</span>
          <SegmentedControl
            ariaLabel={p.filterLabel}
            size="sm"
            value={filter}
            onChange={(value) => setParams(value === 'all' ? {} : { band: value }, { replace: true })}
            options={FILTERS.map((f) => ({
              value: f,
              label: `${f === 'all' ? p.filterAll : t.risk.bands[f]} · ${f === 'all' ? rows.length : countBand(f)}`,
            }))}
          />
        </div>
        <PatientTable rows={visible} />
      </Card>
    </div>
  );
}

function PanelHeader() {
  const p = t.gp.panel;
  return (
    <div className="mb-gutter flex items-end justify-between gap-8">
      <div className="max-w-3xl">
        <span className="text-label-md tracking-wider text-secondary uppercase">{p.eyebrow}</span>
        <h1 className="text-headline-md text-navy">{p.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{p.lead}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-label-md text-on-surface-variant">{t.gp.clinic}</span>
        <Badge tone="outline" icon={<Database className="size-3" />}>
          {p.source}
        </Badge>
      </div>
    </div>
  );
}

function PatientTable({ rows }: { rows: PanelRow[] }) {
  const navigate = useNavigate();
  const statusById = useDemoStore((s) => s.statusById);
  const p = t.gp.panel;

  if (rows.length === 0) {
    return <div className="px-6 py-12 text-center text-body-md text-muted">{p.empty}</div>;
  }

  return (
    <Table>
      <THead>
        <tr>
          <Th>{p.columns.name}</Th>
          <Th>{p.columns.age}</Th>
          <Th>{p.columns.conditions}</Th>
          <Th>{p.columns.lastVisit}</Th>
          <Th>{p.columns.risk}</Th>
          <Th>{p.columns.status}</Th>
          <Th className="w-10" />
        </tr>
      </THead>
      <tbody>
        {rows.map(({ patient, risk }) => {
          const status = statusById[patient.id] ?? patient.initialStatus;
          const flagged = status === 'newFlag';
          return (
            <Tr
              key={patient.id}
              interactive
              data-demo={`panel-row-${patient.id}`}
              onClick={() => navigate(`/gp/patient/${patient.id}`)}
              className={cn(flagged && 'bg-attention-soft/35')}
            >
              <Td>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                      flagged ? 'bg-attention text-white' : 'bg-surface-container text-on-surface-variant',
                    )}
                  >
                    {initials(patient.name)}
                  </span>
                  <span className="font-semibold text-navy">{patient.name}</span>
                </div>
              </Td>
              <Td className="tabular-nums">{patient.age}</Td>
              <Td className="max-w-72 truncate text-on-surface-variant">
                {patient.conditions.map((c) => t.conditions[c]).join(', ')}
              </Td>
              <Td className="whitespace-nowrap text-on-surface-variant tabular-nums">
                {patient.lastVisit === DEMO_TODAY ? (
                  <Badge tone="teal">{p.today}</Badge>
                ) : (
                  formatDate(patient.lastVisit)
                )}
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <RiskBadge band={risk.band} />
                  <span className="text-label-md text-muted tabular-nums">{risk.score}</span>
                </div>
              </Td>
              <Td>
                <StatusBadge status={status} />
              </Td>
              <Td>
                <ChevronRight className="size-4 text-outline" aria-label={p.open} />
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
