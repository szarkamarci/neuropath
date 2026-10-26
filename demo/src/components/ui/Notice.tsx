import type { ReactNode } from 'react';
import { FlaskConical, Info, ShieldCheck, TriangleAlert } from 'lucide-react';
import { cn } from '../../lib/cn';

type NoticeTone = 'info' | 'model' | 'privacy' | 'attention';

const toneConfig: Record<NoticeTone, { classes: string; icon: ReactNode }> = {
  info: { classes: 'bg-surface-container-low border-outline-variant/40 text-ink', icon: <Info /> },
  model: { classes: 'bg-cream border-outline-variant/40 text-ink', icon: <FlaskConical /> },
  privacy: { classes: 'bg-mint border-secondary/20 text-ink', icon: <ShieldCheck /> },
  attention: { classes: 'bg-attention-soft border-attention/25 text-ink', icon: <TriangleAlert /> },
};

const iconColor: Record<NoticeTone, string> = {
  info: 'text-blue',
  model: 'text-on-surface-variant',
  privacy: 'text-secondary',
  attention: 'text-error',
};

interface NoticeProps {
  tone?: NoticeTone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Inline alert (8px radius per DESIGN.md "Shapes"). */
export function Notice({ tone = 'info', title, children, className }: NoticeProps) {
  const { classes, icon } = toneConfig[tone];
  return (
    <div className={cn('flex gap-3 rounded-lg border px-4 py-3 text-body-sm', classes, className)}>
      <span className={cn('mt-0.5 shrink-0 [&>svg]:size-4', iconColor[tone])}>{icon}</span>
      <div>
        {title && <div className="text-label-lg text-navy">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}
