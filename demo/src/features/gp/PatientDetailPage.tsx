import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Notice } from '../../components/ui/Notice';
import { patientsById } from '../../data/seed';
import type { Patient } from '../../data/types';
import { mbiAnsweredCount } from '../../logic/mbi';
import { useDemoStore } from '../../store/demoStore';
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
  // The dialog's open state lives in the URL so the guided demo can open it deterministically.
  const [params, setParams] = useSearchParams();
  const decided = useDemoStore((s) => s.decisionById[patient.id] !== undefined);
  const referralOpen = params.get('referral') === '1' && !decided;
  useEffect(() => {
    if (decided && params.has('referral')) setParams({}, { replace: true });
  }, [decided, params, setParams]);

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
          <DecisionCard patient={patient} band={risk.current.band} onRefer={() => setParams({ referral: '1' })} />
        </div>
        {/* Sticky so the risk card stays in view while the GP answers the check. */}
        <div className="sticky top-[88px] col-span-5">
          <RiskCard risk={risk} checkStarted={checkStarted} />
        </div>
      </div>
      <ReferralModal open={referralOpen} onClose={() => setParams({}, { replace: true })} patient={patient} risk={risk} />
    </>
  );
}
