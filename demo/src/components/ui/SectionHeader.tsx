import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}

/** Section title row from code.html ("Asset Library 01" pattern). */
export function SectionHeader({ eyebrow, title, aside, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4 border-b border-outline-variant/30 pb-3', className)}>
      <div>
        {eyebrow && <span className="text-label-md tracking-wider text-secondary uppercase">{eyebrow}</span>}
        <h2 className="text-headline-sm text-navy">{title}</h2>
      </div>
      {aside && <div className="text-label-md text-on-surface-variant">{aside}</div>}
    </div>
  );
}
