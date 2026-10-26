import { useState, type ReactNode } from 'react';
import { Send } from 'lucide-react';
import { RiskBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Field, TextArea } from '../../components/ui/Form';
import { Modal } from '../../components/ui/Modal';
import { DEMO_TODAY } from '../../data/seed';
import type { Patient } from '../../data/types';
import { MBI_MAX_SCORE, mbiDomains, mbiDomainScores, mbiScore } from '../../logic/mbi';
import { MAX_SCORE } from '../../logic/risk';
import { latestLab, mean, stdDev } from '../../logic/riskInput';
import { useDemoStore } from '../../store/demoStore';
import { useMbiAnswers, type PatientRisk } from '../../store/selectors';
import { t } from '../../strings';

interface ReferralModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  risk: PatientRisk;
}

export function ReferralModal({ open, onClose, patient, risk }: ReferralModalProps) {
  const [note, setNote] = useState('');
  const answers = useMbiAnswers(patient.id);
  const sendReferral = useDemoStore((s) => s.sendReferral);
  const showToast = useDemoStore((s) => s.showToast);
  const r = t.gp.referral;
  const { current } = risk;

  const first = patient.labs[0]!;
  const latest = latestLab(patient);
  const systolic = patient.labs.map((p) => p.sys);
  const score = mbiScore(answers);
  const domainScores = mbiDomainScores(answers);
  const positiveDomains = mbiDomains.filter((d) => domainScores[d] > 0).map((d) => t.gp.mbi.domains[d]);
  const findings = [
    ...(patient.memoryComplaint ? [r.reasonMemory] : []),
    ...(current.contributors.some((c) => c.id === 'behavior') ? [r.reasonBehavior] : []),
  ];

  const handleSend = () => {
    sendReferral({ patientId: patient.id, sentOn: DEMO_TODAY, gpNote: note.trim(), risk: current, mbiAnswers: answers });
    showToast(r.sent);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      demoId="referral-modal"
      title={r.title}
      description={r.description}
      footer={
        <>
          <Button variant="tertiary" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSend} iconLeft={<Send className="size-4" />} data-demo="send-referral">
            {r.send}
          </Button>
        </>
      }
    >
      <dl className="divide-y divide-outline-variant/20 rounded-lg border border-outline-variant/30">
        <Row label={r.to}>{r.toValue}</Row>
        <Row label={r.from}>{t.gp.clinic}</Row>
        <Row label={r.patient}>
          {patient.name} · {t.gp.detail.years(patient.age)} · {t.sex[patient.sex]} ·{' '}
          {patient.conditions.map((c) => t.conditions[c]).join(', ')}
        </Row>
        <Row label={r.reason}>{r.reasonValue(t.risk.bands[current.band], findings)}</Row>
        <Row label={r.riskSummary}>
          <div className="flex items-center gap-2">
            <RiskBadge band={current.band} />
            <span className="text-label-lg text-navy tabular-nums">
              {current.score} {t.risk.outOf(MAX_SCORE)}
            </span>
          </div>
          <ul className="mt-1.5 list-disc pl-4 text-body-sm text-ink">
            {current.contributors
              .filter((c) => c.direction === 'up')
              .slice(0, 4)
              .map((c) => (
                <li key={c.id}>{c.label}</li>
              ))}
          </ul>
        </Row>
        <Row label={r.labsSummary}>
          {r.hba1cTrend(first.hba1c, latest.hba1c)} · {r.egfrLatest(latest.egfr)} ·{' '}
          {r.bpSummary(Math.round(mean(systolic)), Math.round(stdDev(systolic)))}
        </Row>
        <Row label={r.mbiSummary}>
          {score === null ? (
            r.mbiNotDone
          ) : (
            <>
              {t.gp.mbi.score(score, MBI_MAX_SCORE)}
              {positiveDomains.length > 0 && <span className="text-on-surface-variant"> · {positiveDomains.join(', ')}</span>}
            </>
          )}
        </Row>
        <Row label={r.suggested}>{r.suggestedValue}</Row>
      </dl>

      <Field label={r.note} htmlFor="referral-note" className="mt-5">
        <TextArea id="referral-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder={r.notePlaceholder} />
      </Field>
    </Modal>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-4 px-4 py-2.5">
      <dt className="text-label-md text-on-surface-variant uppercase">{label}</dt>
      <dd className="text-body-sm text-navy">{children}</dd>
    </div>
  );
}
