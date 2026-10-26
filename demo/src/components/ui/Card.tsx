import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type CardTone = 'white' | 'muted' | 'cream' | 'navy';

const toneClasses: Record<CardTone, string> = {
  white: 'bg-surface-container-lowest border-outline-variant/30',
  muted: 'bg-surface-container-low border-outline-variant/30',
  cream: 'bg-cream border-outline-variant/30',
  navy: 'bg-navy border-navy text-white',
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  /** Lift to elevation level 2 on hover (interactive cards). */
  interactive?: boolean;
  padded?: boolean;
}

export function Card({ tone = 'white', interactive, padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border shadow-sm',
        toneClasses[tone],
        padded && 'p-6',
        interactive && 'transition-all duration-200 hover:shadow-md hover:border-secondary/40',
        className,
      )}
      {...rest}
    />
  );
}

interface CardHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ eyebrow, title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 text-label-md text-on-surface-variant uppercase">{eyebrow}</div>}
        <h3 className="text-title-md text-navy">{title}</h3>
        {description && <p className="mt-0.5 text-body-sm text-on-surface-variant">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
