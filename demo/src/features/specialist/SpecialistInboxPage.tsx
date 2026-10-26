import { useNavigate } from 'react-router-dom';
import { ChevronRight, ClipboardCheck, Hourglass, Inbox } from 'lucide-react';
import { Badge, RiskBadge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { Table, Td, Th, THead, Tr } from '../../components/ui/Table';
import { patientsById } from '../../data/seed';
import { formatDate, initials } from '../../lib/format';
import { cn } from '../../lib/cn';
import { useDemoStore } from '../../store/demoStore';
import { t } from '../../strings';

export function SpecialistInboxPage() {
  const navigate = useNavigate();
  const referrals = useDemoStore((s) => s.referrals);
  const assessmentById = useDemoStore((s) => s.assessmentById);
  const i = t.specialist.inbox;

  // Newest first; ties keep insertion order, so the hero's fresh referral leads.
  const rows = [...referrals].sort((a, b) => b.sentOn.localeCompare(a.sentOn));
  const assessed = rows.filter((r) => assessmentById[r.patientId]).length;

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-12">
      <div className="mb-gutter flex items-end justify-between gap-8">
        <div className="max-w-3xl">
          <span className="text-label-md tracking-wider text-secondary uppercase">{i.eyebrow}</span>
          <h1 className="text-headline-md text-navy">{i.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{i.lead}</p>
        </div>
        <span className="shrink-0 text-label-md text-on-surface-variant">{t.specialist.clinic}</span>
      </div>

      <div className="mb-gutter grid grid-cols-3 gap-4">
        <MetricCard icon={<Inbox />} value={rows.length} label={i.metrics.total} sublabel={i.metrics.totalSub} />
        <MetricCard icon={<Hourglass />} value={rows.length - assessed} label={i.metrics.pending} sublabel={i.metrics.pendingSub} tone="blue" />
        <MetricCard icon={<ClipboardCheck />} value={assessed} label={i.metrics.done} sublabel={i.metrics.doneSub} />
      </div>

      <Card padded={false} className="overflow-hidden" data-demo="specialist-inbox">
        <div className="border-b border-outline-variant/20 px-5 py-3 text-label-lg text-navy">{i.count(rows.length)}</div>
        {rows.length === 0 ? (
          <div className="px-6 py-12 text-center text-body-md text-muted">{i.empty}</div>
        ) : (
          <Table>
            <THead>
              <tr>
                <Th>{i.columns.patient}</Th>
                <Th>{i.columns.reason}</Th>
                <Th>{i.columns.risk}</Th>
                <Th>{i.columns.received}</Th>
                <Th>{i.columns.from}</Th>
                <Th>{i.columns.status}</Th>
                <Th className="w-10" />
              </tr>
            </THead>
            <tbody>
              {rows.map((referral) => {
                const patient = patientsById[referral.patientId];
                if (!patient) return null;
                const done = Boolean(assessmentById[referral.patientId]);
                const fresh = !done && patient.isHero;
                return (
                  <Tr
                    key={referral.id}
                    interactive
                    data-demo={`inbox-row-${patient.id}`}
                    onClick={() => navigate(`/specialist/referral/${patient.id}`)}
                    className={cn(fresh && 'bg-mint/40')}
                  >
                    <Td>
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-[11px] font-bold text-on-surface-variant">
                          {initials(patient.name)}
                        </span>
                        <div>
                          <div className="font-semibold text-navy">{patient.name}</div>
                          <div className="text-body-sm text-muted">
                            {patient.age} · {t.sex[patient.sex]}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-on-surface-variant">{i.reason}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <RiskBadge band={referral.risk.band} />
                        <span className="text-label-md text-muted tabular-nums">{referral.risk.score}</span>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap text-on-surface-variant tabular-nums">{formatDate(referral.sentOn)}</Td>
                    <Td className="text-on-surface-variant">{i.from}</Td>
                    <Td>
                      <Badge tone={done ? 'teal' : 'attention'} dot>
                        {done ? i.statusAssessed : i.statusNew}
                      </Badge>
                    </Td>
                    <Td>
                      <ChevronRight className="size-4 text-outline" aria-label={i.openHint} />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
