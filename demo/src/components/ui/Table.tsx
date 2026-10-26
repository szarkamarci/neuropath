import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className={cn('w-full border-collapse text-left text-body-sm', className)} {...rest} />
    </div>
  );
}

export function THead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-surface-container-low', className)} {...rest} />;
}

export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'border-b border-outline-variant/30 px-4 py-3 text-label-md tracking-wide whitespace-nowrap text-on-surface-variant uppercase',
        className,
      )}
      {...rest}
    />
  );
}

interface TrProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  interactive?: boolean;
}

export function Tr({ className, selected, interactive, ...rest }: TrProps) {
  return (
    <tr
      className={cn(
        'border-b border-outline-variant/20 last:border-b-0 transition-colors',
        interactive && 'cursor-pointer hover:bg-surface-container-low/70',
        selected && 'bg-mint/60 hover:bg-mint/80',
        className,
      )}
      {...rest}
    />
  );
}

export function Td({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 align-middle text-on-surface', className)} {...rest} />;
}
