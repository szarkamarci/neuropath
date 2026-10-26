import type { ReactNode } from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';
import { cn } from '../../lib/cn';
import { t } from '../../strings';

interface PhoneFrameProps {
  children: ReactNode;
  /** Dark status bar text for light-on-dark screens (lock screen). */
  statusTone?: 'dark' | 'light';
  className?: string;
}

/** Phone mockup. Height follows the viewport so it fits 1440×900 and 1920×1080. */
export function PhoneFrame({ children, statusTone = 'dark', className }: PhoneFrameProps) {
  return (
    <div
      className={cn('relative aspect-[9/19] rounded-[46px] bg-navy p-2.5 shadow-xl ring-1 ring-navy/40', className)}
      style={{ height: 'min(760px, calc(100vh - 150px))' }}
      data-demo="phone"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[36px] bg-white">
        <div
          className={cn(
            'absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 pt-1 text-[13px] font-semibold',
            statusTone === 'light' ? 'text-white' : 'text-navy',
          )}
        >
          <span className="tabular-nums">{t.patient.phone.time}</span>
          <span className="absolute top-2 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-navy" />
          <span className="flex items-center gap-1">
            <Signal className="size-3.5" />
            <Wifi className="size-3.5" />
            <BatteryFull className="size-4" />
          </span>
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-navy/70" />
      </div>
    </div>
  );
}
