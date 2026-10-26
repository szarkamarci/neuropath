import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { PatientStatus } from '../../data/types';
import type { RiskBand } from '../../logic/risk';
import { t } from '../../strings';

export type BadgeTone = 'neutral' | 'teal' | 'blue' | 'attention' | 'navy' | 'outline';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-container text-on-surface-variant border-outline-variant/40',
  teal: 'bg-mint text-secondary border-secondary/20',
  blue: 'bg-tertiary-fixed/60 text-on-tertiary-fixed-variant border-blue/20',
  attention: 'bg-attention-soft text-error border-attention/25',
  navy: 'bg-navy text-white border-navy',
  outline: 'bg-white text-on-surface-variant border-outline-variant/50',
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: 'bg-outline',
  teal: 'bg-teal',
  blue: 'bg-blue',
  attention: 'bg-attention',
  navy: 'bg-secondary-fixed',
  outline: 'bg-outline',
};

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', dot, icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-label-md whitespace-nowrap',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dotClasses[tone])} />}
      {icon}
      {children}
    </span>
  );
}

// Design-system semantics: affirmative = teal, neutral review = blue, attention = coral.
const riskTone: Record<RiskBand, BadgeTone> = { low: 'teal', moderate: 'blue', high: 'attention' };

export function RiskBadge({ band, className }: { band: RiskBand; className?: string }) {
  return (
    <Badge tone={riskTone[band]} dot className={className}>
      {t.risk.bands[band]}
    </Badge>
  );
}

const statusTone: Record<PatientStatus, BadgeTone> = {
  routine: 'outline',
  newFlag: 'attention',
  referred: 'blue',
  followUp: 'neutral',
  monitor: 'neutral',
  dismissed: 'outline',
  assessed: 'teal',
};

export function StatusBadge({ status, className }: { status: PatientStatus; className?: string }) {
  return (
    <Badge tone={statusTone[status]} className={className}>
      {t.status[status]}
    </Badge>
  );
}
