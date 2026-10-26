import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, CircleCheck, Hourglass, Languages, Send, Users } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { HERO_ID } from '../../data/seed';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';
import { useDemoStore } from '../../store/demoStore';
import { t } from '../../strings';
import { PhoneFrame } from './PhoneFrame';
import { EmptyScreen, LockScreen, MessageScreen, NextStepsScreen } from './PhoneScreens';

type ScreenId = 'lock' | 'message' | 'next';
const SCREENS: ScreenId[] = ['lock', 'message', 'next'];

function parseScreen(value: string | null): ScreenId {
  return SCREENS.includes(value as ScreenId) ? (value as ScreenId) : 'lock';
}

export function PatientPage() {
  const referral = useDemoStore((s) => s.referrals.find((r) => r.patientId === HERO_ID));
  const assessment = useDemoStore((s) => s.assessmentById[HERO_ID]);
  const caregiverShare = useDemoStore((s) => s.caregiverShare);
  const [params, setParams] = useSearchParams();
  const screen = parseScreen(params.get('screen'));
  const go = (next: ScreenId) => setParams(next === 'lock' ? {} : { screen: next }, { replace: true });

  const phone = t.patient;
  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-10 px-6 py-6 lg:px-12" style={{ minHeight: 'calc(100vh - 108px)' }}>
      <section className="flex flex-col gap-gutter">
        <div>
          <span className="text-label-md tracking-wider text-secondary uppercase">{phone.persona}</span>
          <h1 className="text-headline-md text-navy">{phone.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{phone.lead}</p>
        </div>
        {referral && (
          <Card padded={false} className="divide-y divide-outline-variant/20" data-demo="patient-screens">
            {SCREENS.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className={cn(
                  'flex w-full items-center gap-3 px-5 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl',
                  screen === id ? 'bg-mint/60' : 'hover:bg-surface-container-low',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-label-md',
                    screen === id ? 'bg-teal text-white' : 'bg-surface-container text-on-surface-variant',
                  )}
                >
                  {i + 1}
                </span>
                <span className="text-label-lg text-navy">{phone.screens[id]}</span>
              </button>
            ))}
          </Card>
        )}
      </section>

      <section className="flex justify-center">
        <PhoneFrame statusTone={referral && screen === 'lock' ? 'light' : 'dark'}>
          {!referral ? (
            <EmptyScreen />
          ) : screen === 'lock' ? (
            <LockScreen onOpen={() => go('message')} />
          ) : screen === 'message' ? (
            <MessageScreen assessment={assessment} onNext={() => go('next')} onBack={() => go('lock')} />
          ) : (
            <NextStepsScreen referral={referral} onBack={() => go('message')} />
          )}
        </PhoneFrame>
      </section>

      <section className="flex flex-col gap-gutter">
        {referral ? (
          <Card className="flex flex-col gap-3.5" data-demo="patient-context">
            <ContextRow icon={<Send />} label={phone.context.trigger} value={phone.context.triggerValue(formatDate(referral.sentOn))} />
            <ContextRow icon={<Languages />} label={phone.context.language} value={phone.context.languageValue} />
            <ContextRow
              icon={<Users />}
              label={phone.context.caregiver}
              value={
                <Badge tone={caregiverShare ? 'teal' : 'outline'} dot>
                  {caregiverShare ? phone.context.caregiverOn : phone.context.caregiverOff}
                </Badge>
              }
            />
            {assessment && (
              <ContextRow icon={<CircleCheck />} label={phone.context.visit} value={phone.context.visitDone(formatDate(assessment.assessedOn))} />
            )}
          </Card>
        ) : (
          <WaitingCard />
        )}
        <Card tone="cream">
          <div className="mb-2 flex items-center gap-2 text-label-lg text-navy">
            <Bell className="size-4 text-secondary" />
            {phone.notes.title}
          </div>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body-sm text-ink marker:text-outline-variant">
            {phone.notes.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

function ContextRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-mint text-secondary [&>svg]:size-4">{icon}</span>
      <div>
        <div className="text-label-md text-on-surface-variant uppercase">{label}</div>
        <div className="text-body-sm font-medium text-navy">{value}</div>
      </div>
    </div>
  );
}

function WaitingCard() {
  const navigate = useNavigate();
  const w = t.patient.waiting;
  return (
    <Card className="flex flex-col items-start gap-3" data-demo="patient-waiting">
      <span className="flex size-10 items-center justify-center rounded-full bg-mint text-secondary">
        <Hourglass className="size-5" />
      </span>
      <div>
        <h2 className="text-title-md text-navy">{w.title}</h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">{w.body}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={() => navigate('/gp/patient/p-erzsebet')}>
        {w.goGp}
      </Button>
    </Card>
  );
}
