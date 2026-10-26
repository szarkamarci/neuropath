import { useState, type ReactNode } from 'react';
import { CalendarClock, CircleCheck, CircleX, RotateCcw, Send } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Field, SegmentedControl, Select } from '../../components/ui/Form';
import { DEMO_TODAY } from '../../data/seed';
import type { Patient } from '../../data/types';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';
import type { RiskBand } from '../../logic/risk';
import { useDemoStore, type ClinicianDecision, type DismissReason } from '../../store/demoStore';
import { t } from '../../strings';

type Option = ClinicianDecision['kind'];

const recommendedFor: Record<RiskBand, Option | null> = { high: 'refer', moderate: 'monitor', low: null };

interface DecisionCardProps {
  patient: Patient;
  band: RiskBand;
  onRefer: () => void;
}

export function DecisionCard({ patient, band, onRefer }: DecisionCardProps) {
  const decision = useDemoStore((s) => s.decisionById[patient.id]);
  const [selected, setSelected] = useState<Option | null>(null);
  const d = t.gp.decision;

  return (
    <Card data-demo="decision-card">
      <div className="mb-4">
        <div className="mb-1 text-label-md text-on-surface-variant uppercase">{d.eyebrow}</div>
        <h2 className="text-title-md text-navy">{d.title}</h2>
      </div>

      {decision ? (
        <RecordedDecision patientId={patient.id} decision={decision} onChange={() => setSelected(null)} />
      ) : (
        <>
          {band === 'low' && <p className="mb-3 text-body-sm text-muted">{d.noFlag}</p>}
          <div className="grid grid-cols-3 gap-3">
            <OptionTile
              icon={<Send className="size-5" />}
              title={d.refer}
              description={d.referDesc}
              recommended={recommendedFor[band] === 'refer'}
              selected={selected === 'refer'}
              demoId="decision-refer"
              onClick={() => {
                setSelected('refer');
                onRefer();
              }}
            />
            <OptionTile
              icon={<CalendarClock className="size-5" />}
              title={d.monitor}
              description={d.monitorDesc}
              recommended={recommendedFor[band] === 'monitor'}
              selected={selected === 'monitor'}
              demoId="decision-monitor"
              onClick={() => setSelected('monitor')}
            />
            <OptionTile
              icon={<CircleX className="size-5" />}
              title={d.dismiss}
              description={d.dismissDesc}
              selected={selected === 'dismiss'}
              demoId="decision-dismiss"
              onClick={() => setSelected('dismiss')}
            />
          </div>
          {selected === 'monitor' && <MonitorForm patientId={patient.id} />}
          {selected === 'dismiss' && <DismissForm patientId={patient.id} />}
        </>
      )}
    </Card>
  );
}

interface OptionTileProps {
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  recommended?: boolean;
  demoId: string;
  onClick: () => void;
}

function OptionTile({ icon, title, description, selected, recommended, demoId, onClick }: OptionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-demo={demoId}
      className={cn(
        'relative flex flex-col items-start gap-2 rounded-xl border-[1.5px] p-4 text-left transition-all duration-150',
        selected ? 'border-teal bg-mint/50 shadow-sm' : 'border-hairline bg-white hover:border-secondary/40 hover:shadow-sm',
      )}
    >
      <span className={cn('flex size-9 items-center justify-center rounded-lg', selected ? 'bg-teal text-white' : 'bg-mint text-secondary')}>
        {icon}
      </span>
      <span className="text-label-lg text-navy">{title}</span>
      <span className="text-body-sm leading-snug text-on-surface-variant">{description}</span>
      {recommended && (
        <Badge tone="teal" className="absolute top-3 right-3">
          {t.gp.decision.recommended}
        </Badge>
      )}
    </button>
  );
}

function MonitorForm({ patientId }: { patientId: string }) {
  const [months, setMonths] = useState<6 | 12>(6);
  const recordDecision = useDemoStore((s) => s.recordDecision);
  const d = t.gp.decision;
  return (
    <div className="mt-4 flex animate-fade-in items-center justify-between gap-4 rounded-lg bg-surface-container-low px-4 py-3">
      <SegmentedControl
        ariaLabel={d.monitor}
        value={String(months)}
        onChange={(v) => setMonths(v === '12' ? 12 : 6)}
        options={[
          { value: '6', label: d.months(6) },
          { value: '12', label: d.months(12) },
        ]}
      />
      <Button onClick={() => recordDecision(patientId, { kind: 'monitor', months })}>{d.monitorConfirm}</Button>
    </div>
  );
}

const DISMISS_REASONS: DismissReason[] = ['knownDiagnosis', 'explained', 'declined', 'clinical'];

function DismissForm({ patientId }: { patientId: string }) {
  const [reason, setReason] = useState<DismissReason>('clinical');
  const recordDecision = useDemoStore((s) => s.recordDecision);
  const d = t.gp.decision;
  return (
    <div className="mt-4 flex animate-fade-in items-end gap-4 rounded-lg bg-surface-container-low px-4 py-3">
      <Field label={d.dismissReasonLabel} htmlFor="dismiss-reason" className="flex-1">
        <Select id="dismiss-reason" value={reason} onChange={(e) => setReason(e.target.value as DismissReason)}>
          {DISMISS_REASONS.map((r) => (
            <option key={r} value={r}>
              {d.dismissReasons[r]}
            </option>
          ))}
        </Select>
      </Field>
      <Button variant="danger" size="lg" onClick={() => recordDecision(patientId, { kind: 'dismiss', reason })}>
        {d.dismissConfirm}
      </Button>
    </div>
  );
}

function RecordedDecision({ patientId, decision, onChange }: { patientId: string; decision: ClinicianDecision; onChange: () => void }) {
  const clearDecision = useDemoStore((s) => s.clearDecision);
  const d = t.gp.decision;
  const text =
    decision.kind === 'refer'
      ? d.recordedReferred
      : decision.kind === 'monitor'
        ? d.recordedMonitor(decision.months)
        : d.recordedDismissed(d.dismissReasons[decision.reason]);
  return (
    <div className="flex animate-pop-in items-center justify-between gap-4 rounded-lg border border-secondary/20 bg-mint/60 px-4 py-3" data-demo="decision-recorded">
      <div className="flex items-center gap-3">
        <CircleCheck className="size-5 text-secondary" />
        <div>
          <div className="text-label-lg text-navy">{text}</div>
          <div className="text-body-sm text-on-surface-variant">{d.recordedOn(formatDate(DEMO_TODAY))}</div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={<RotateCcw className="size-3.5" />}
        onClick={() => {
          clearDecision(patientId);
          onChange();
        }}
      >
        {d.change}
      </Button>
    </div>
  );
}
