import type { ReactNode } from 'react';
import { BellRing, CalendarCheck, Check, ChevronLeft, MapPin, Phone } from 'lucide-react';
import { LogoMark } from '../../components/brand/Logo';
import { Switch } from '../../components/ui/Form';
import { cn } from '../../lib/cn';
import { formatDateLong } from '../../lib/format';
import { CLINIC } from '../../logic/appointment';
import type { Assessment } from '../../logic/assessment';
import { useDemoStore, type Referral } from '../../store/demoStore';
import { t } from '../../strings';

const p = t.patient.phone;

/** Lock screen with the push notification; tapping it opens the message. */
export function LockScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative flex h-full flex-col items-center bg-gradient-to-b from-navy via-primary-container to-tertiary-container px-5 pt-16 text-white">
      <div className="pointer-events-none absolute -top-10 -right-16 size-64 rounded-full bg-teal/25 blur-3xl" />
      <div className="relative text-center">
        <div className="text-[15px] font-medium text-white/80">{p.lockDate}</div>
        <div className="text-[72px] leading-[1.05] font-bold tracking-tight tabular-nums">{p.time}</div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        data-demo="push-notification"
        className="relative mt-10 w-full animate-pop-in rounded-2xl bg-white/92 p-3.5 text-left shadow-xl backdrop-blur transition-transform active:scale-[0.98]"
      >
        <div className="mb-1.5 flex items-center justify-between text-[12px] text-on-surface-variant">
          <span className="flex items-center gap-1.5 font-semibold">
            <LogoMark className="size-5" />
            {p.appName}
          </span>
          <span>{p.now}</span>
        </div>
        <div className="text-[14px] font-semibold text-navy">{p.pushSender}</div>
        <div className="text-[14px] leading-snug text-ink">{p.pushBody}</div>
      </button>
      <div className="relative mt-5 flex items-center gap-1.5 text-[12px] text-white/70">
        <BellRing className="size-3.5" />
        {p.tapHint}
      </div>
    </div>
  );
}

function ScreenHeader({ children, onBack }: { children?: ReactNode; onBack?: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between px-4 pt-12 pb-2">
      {onBack ? (
        <button type="button" onClick={onBack} className="flex items-center gap-0.5 text-[14px] font-semibold text-secondary" data-demo="phone-back">
          <ChevronLeft className="size-5" />
          {p.back}
        </button>
      ) : (
        <span className="flex items-center gap-1.5 text-[14px] font-bold text-navy">
          <LogoMark className="size-6" />
          {p.appName}
        </span>
      )}
      {children}
    </div>
  );
}

interface MessageScreenProps {
  assessment: Assessment | undefined;
  onNext: () => void;
  onBack: () => void;
}

/** In-app message: the recommendation in plain language, plus the post-visit update. */
export function MessageScreen({ assessment, onNext, onBack }: MessageScreenProps) {
  return (
    <div className="flex h-full flex-col bg-cream">
      <ScreenHeader onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 pb-8 custom-scrollbar">
        <div className="mt-1 text-[13px] font-medium text-secondary">{p.hello}</div>
        {assessment && (
          <div className="mt-3 animate-pop-in rounded-2xl border border-secondary/25 bg-mint p-4" data-demo="patient-update">
            <div className="mb-1 flex items-center gap-2 text-[14px] font-bold text-navy">
              <Check className="size-4 text-secondary" strokeWidth={3} />
              {p.updateTitle}
            </div>
            <p className="text-[13px] leading-relaxed text-ink">{p.updateBody(assessment.followUpMonths)}</p>
          </div>
        )}
        <h2 className="mt-3 text-[22px] leading-tight font-bold tracking-tight text-navy">{p.messageTitle}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">{p.messageBody}</p>
        <div className="mt-4 rounded-2xl bg-white p-4 text-[14px] leading-relaxed font-medium text-navy shadow-sm">{p.messageReassure}</div>
        <button
          type="button"
          onClick={onNext}
          data-demo="see-next"
          className="mt-6 h-12 w-full rounded-full bg-teal text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-teal-hover active:scale-[0.98]"
        >
          {p.seeNext}
        </button>
      </div>
    </div>
  );
}

interface NextScreenProps {
  referral: Referral;
  onBack: () => void;
}

export function NextStepsScreen({ referral, onBack }: NextScreenProps) {
  const caregiverShare = useDemoStore((s) => s.caregiverShare);
  const setCaregiverShare = useDemoStore((s) => s.setCaregiverShare);
  return (
    <div className="flex h-full flex-col bg-white">
      <ScreenHeader onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 pb-8 custom-scrollbar">
        <h2 className="mt-1 mb-4 text-[22px] font-bold tracking-tight text-navy">{p.nextTitle}</h2>

        <ol className="flex flex-col">
          {p.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-3 pb-4 last:pb-0" data-demo={`patient-step-${i + 1}`}>
              {i < p.steps.length - 1 && <span className="absolute top-8 bottom-0 left-[15px] w-0.5 bg-secondary/25" />}
              <span
                className={cn(
                  'z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
                  i === 0 ? 'bg-teal text-white' : 'border-2 border-secondary/30 bg-white text-secondary',
                )}
              >
                {i === 0 ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <div>
                <div className="text-[14px] font-semibold text-navy">
                  {step.title}
                  {i === 0 && <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold text-secondary">{p.done}</span>}
                </div>
                <div className="text-[13px] leading-snug text-on-surface-variant">{step.body}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-2xl bg-mint p-4" data-demo="patient-appointment">
          <div className="mb-2 flex items-center gap-2 text-[12px] font-bold tracking-wide text-secondary uppercase">
            <CalendarCheck className="size-4" />
            {p.appointmentTitle}
          </div>
          <div className="text-[16px] font-bold text-navy">{formatDateLong(referral.appointment.date)}</div>
          <div className="text-[15px] font-semibold text-navy">{referral.appointment.time}</div>
          <div className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-ink">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-secondary" />
            <span>
              {CLINIC.name}
              <br />
              {CLINIC.address}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-[13px] font-bold text-navy">{p.bringTitle}</div>
          <ul className="flex flex-col gap-1.5">
            {p.bring.map((item) => (
              <li key={item} className="flex gap-2 text-[13px] leading-snug text-ink">
                <Check className="mt-0.5 size-3.5 shrink-0 text-secondary" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-outline-variant/40 px-3 py-2.5 text-[13px] text-ink">
          <Phone className="size-4 shrink-0 text-secondary" />
          <span>
            {p.questions} <span className="font-semibold whitespace-nowrap text-navy">{CLINIC.phone}</span>
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-cream p-3.5" data-demo="caregiver-share">
          <Switch checked={caregiverShare} onChange={setCaregiverShare} label={p.shareTitle} description={p.shareBody} />
        </div>
      </div>
    </div>
  );
}

/** Shown before the GP has referred. */
export function EmptyScreen() {
  return (
    <div className="flex h-full flex-col bg-cream">
      <ScreenHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-mint text-secondary">
          <Check className="size-8" strokeWidth={2.5} />
        </div>
        <div className="text-[18px] font-bold text-navy">{t.patient.waiting.phoneTitle}</div>
        <div className="mt-1 text-[14px] text-on-surface-variant">{t.patient.waiting.phoneBody}</div>
      </div>
    </div>
  );
}
