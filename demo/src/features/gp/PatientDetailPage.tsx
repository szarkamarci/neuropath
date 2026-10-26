import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Notice } from '../../components/ui/Notice';
import { patientsById } from '../../data/seed';
import type { Patient } from '../../data/types';
import { mbiAnsweredCount } from '../../logic/mbi';
import { useMbiAnswers, usePatientRisk } from '../../store/selectors';
import { t } from '../../strings';
import { DecisionCard } from './DecisionCard';
import { LabTrendsCard, RecordNotesCard } from './LabTrendsCard';
import { MbiCheckCard } from './MbiCheckCard';
import { PatientHeader } from './PatientHeader';
import { RecommendationCard } from './RecommendationCard';
import { ReferralModal } from './ReferralModal';
import { RiskCard } from './RiskCard';
import { SpecialistOutcomeCard } from './SpecialistOutcomeCard';

export function PatientDetailPage() {
  const { patientId = '' } = useParams();
  const patient = patientsById[patientId];
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-5 lg:px-12">
      <Link
        to="/gp"
        className="mb-3 inline-flex items-center gap-1.5 text-label-lg text-on-surface-variant transition-colors hover:text-secondary"
      >
        <ArrowLeft className="size-4" />
        {t.gp.detail.back}
      </Link>
      {patient ? <PatientDetail key={patient.id} patient={patient} /> : <Notice tone="attention">{t.gp.detail.notFound}</Notice>}
    </div>
  );
}

function PatientDetail({ patient }: { patient: Patient }) {
  const risk = usePatientRisk(patient);
  const checkStarted = mbiAnsweredCount(useMbiAnswers(patient.id)) > 0;
  const [referralOpen, setReferralOpen] = useState(false);

  return (
    <>
      <PatientHeader patient={patient} />
      <div className="mt-gutter grid grid-cols-12 items-start gap-gutter">
        <div className="col-span-7 flex flex-col gap-gutter">
          <SpecialistOutcomeCard patientId={patient.id} />
          <LabTrendsCard patient={patient} />
          <RecordNotesCard patient={patient} />
          <MbiCheckCard patientId={patient.id} />
          <RecommendationCard band={risk.current.band} checkStarted={checkStarted} />
          <DecisionCard patient={patient} band={risk.current.band} onRefer={() => setReferralOpen(true)} />
        </div>
        {/* Sticky so the risk card stays in view while the GP answers the check. */}
        <div className="sticky top-[88px] col-span-5">
          <RiskCard risk={risk} checkStarted={checkStarted} />
        </div>
      </div>
      <ReferralModal open={referralOpen} onClose={() => setReferralOpen(false)} patient={patient} risk={risk} />
    </>
  );
}
