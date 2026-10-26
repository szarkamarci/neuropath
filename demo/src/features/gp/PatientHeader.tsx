import { CalendarDays, Database, Timer } from 'lucide-react';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { DEMO_TODAY } from '../../data/seed';
import type { Patient } from '../../data/types';
import { formatDate, initials } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import { t } from '../../strings';

export function PatientHeader({ patient }: { patient: Patient }) {
  const status = useDemoStore((s) => s.statusById[patient.id] ?? patient.initialStatus);
  const d = t.gp.detail;
  const isToday = patient.lastVisit === DEMO_TODAY;
  return (
    <Card className="flex items-center justify-between gap-8 px-6 py-5" data-demo="patient-header">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy text-title-md font-bold text-white">
          {initials(patient.name)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-headline-md text-navy">{patient.name}</h1>
            <StatusBadge status={status} />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-on-surface-variant">
            <span>{d.years(patient.age)}</span>
            <span className="text-outline-variant">•</span>
            <span>{t.sex[patient.sex]}</span>
            <span className="text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {d.visit} · {isToday ? t.gp.panel.today : formatDate(patient.lastVisit)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {patient.conditions.map((c) => (
              <Badge key={c} tone="neutral">
                {t.conditions[c]}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div
          className="flex items-center gap-2 rounded-full border border-secondary/20 bg-mint px-3.5 py-1.5 text-label-lg text-secondary"
          data-demo="time-added"
        >
          <Timer className="size-4" />
          {d.timeAdded}: <span className="text-navy">{d.timeAddedValue}</span>
        </div>
        <Badge tone="outline" icon={<Database className="size-3" />}>
          {d.source}
        </Badge>
      </div>
    </Card>
  );
}
