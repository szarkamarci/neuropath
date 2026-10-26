import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type MetricTone = 'teal' | 'blue' | 'attention';

const iconTileClasses: Record<MetricTone, string> = {
  teal: 'bg-mint text-secondary',
  blue: 'bg-mint text-blue',
  attention: 'bg-cream text-error',
};

interface MetricCardProps {
  icon: ReactNode;
  value: ReactNode;
  label: ReactNode;
  sublabel?: ReactNode;
  tone?: MetricTone;
  className?: string;
}

/** "Badge metric" card from code.html's Today's Triage Overview. */
export function MetricCard({ icon, value, label, sublabel, tone = 'teal', className }: MetricCardProps) {
  const isAttention = tone === 'attention';
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm',
        className,
      )}
    >
      <div className={cn('mb-3 flex size-9 items-center justify-center rounded-lg [&>svg]:size-[18px]', iconTileClasses[tone])}>
        {icon}
      </div>
      <div>
        <div className={cn('text-metric-number tabular-nums', isAttention ? 'text-error' : 'text-navy')}>{value}</div>
        <div className="text-body-sm font-medium text-on-surface">{label}</div>
        {sublabel && (
          <div className={cn('text-[11px] leading-4', isAttention ? 'font-medium text-error' : 'text-on-surface-variant')}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
