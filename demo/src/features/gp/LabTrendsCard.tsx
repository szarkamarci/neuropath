import { FileText } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { TrendChart, type TrendSeries } from '../../components/charts/TrendChart';
import { chartColors } from '../../components/charts/chartTheme';
import type { LabPoint, Patient } from '../../data/types';
import { formatMonthYear } from '../../lib/format';
import { latestLab } from '../../logic/riskInput';
import { t } from '../../strings';

/** Round axis bounds/ticks to `step` around the plotted values (and target band). */
function niceScale(values: number[], step: number): { domain: [number, number]; ticks: number[] } {
  const lo = Math.floor(Math.min(...values) / step) * step;
  const hi = Math.ceil(Math.max(...values) / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 10) / 10);
  return { domain: [lo, hi], ticks };
}

interface MiniChartProps {
  title: string;
  unit: string;
  latest: string;
  data: LabPoint[];
  series: TrendSeries[];
  referenceRange?: { from: number; to: number };
  step: number;
}

function MiniChart({ title, unit, latest, data, series, referenceRange, step }: MiniChartProps) {
  const values = data.flatMap((point) => series.map((s) => point[s.key as keyof LabPoint] as number));
  if (referenceRange) values.push(referenceRange.from, referenceRange.to);
  const scale = niceScale(values, step);
  return (
    <div className="rounded-lg border border-outline-variant/25 bg-surface-container-lowest p-3">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-label-lg text-navy">{title}</span>
        <span className="text-body-sm text-on-surface-variant">
          <span className="text-title-md text-navy tabular-nums">{latest}</span> {unit}
        </span>
      </div>
      <TrendChart
        data={data as unknown as Array<Record<string, string | number>>}
        xKey="date"
        series={series}
        referenceRange={referenceRange}
        yDomain={scale.domain}
        yTicks={scale.ticks}
        height={128}
        xTickFormatter={formatMonthYear}
        sparseXTicks
      />
    </div>
  );
}

export function LabTrendsCard({ patient }: { patient: Patient }) {
  const l = t.gp.detail.labs;
  const latest = latestLab(patient);
  const isDiabetic = patient.conditions.includes('t2dm');
  return (
    <Card data-demo="lab-trends">
      <CardHeader eyebrow={t.gp.detail.labsEyebrow} title={t.gp.detail.labsTitle} description={l.targetBand} />
      <div className="grid grid-cols-2 gap-3">
        <MiniChart
          title={l.hba1c}
          unit={l.hba1cUnit}
          latest={latest.hba1c.toFixed(1)}
          data={patient.labs}
          series={[{ key: 'hba1c', label: l.hba1c, color: chartColors.attention }]}
          referenceRange={isDiabetic ? { from: 5.5, to: 7 } : { from: 4.5, to: 6 }}
          step={1}
        />
        <MiniChart
          title={l.glucose}
          unit={l.glucoseUnit}
          latest={latest.glucose.toFixed(1)}
          data={patient.labs}
          series={[{ key: 'glucose', label: l.glucose, color: chartColors.teal }]}
          referenceRange={{ from: 4, to: 7 }}
          step={2}
        />
        <MiniChart
          title={l.egfr}
          unit={l.egfrUnit}
          latest={String(latest.egfr)}
          data={patient.labs}
          series={[{ key: 'egfr', label: l.egfr, color: chartColors.blue }]}
          step={10}
        />
        <MiniChart
          title={l.bp}
          unit={l.bpUnit}
          latest={`${latest.sys}/${latest.dia}`}
          data={patient.labs}
          series={[
            { key: 'sys', label: l.systolic, color: chartColors.navy },
            { key: 'dia', label: l.diastolic, color: chartColors.blue },
          ]}
          step={40}
        />
      </div>
    </Card>
  );
}

export function RecordNotesCard({ patient }: { patient: Patient }) {
  const d = t.gp.detail;
  return (
    <Card tone="cream" data-demo="record-notes">
      <CardHeader title={d.notesTitle} description={d.source} className="mb-3" />
      {patient.recordNotes.length === 0 ? (
        <p className="text-body-sm text-muted">{d.noNotes}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {patient.recordNotes.map((note) => (
            <li key={note} className="flex gap-2.5 text-body-sm text-ink">
              <FileText className="mt-0.5 size-4 shrink-0 text-secondary" />
              {note}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
