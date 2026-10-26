import { cn } from '../../lib/cn';
import { t } from '../../strings';

/** Neural mark, reproduced from the primary logo SVG in code.html. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path
        d="M50 82 C50 82 45 68 35 65 C22 62 18 45 28 32 C22 24 30 14 42 18 C48 10 65 10 70 20 C82 18 88 32 80 44 C88 56 75 70 65 66 C55 64 50 82 50 82 Z"
        fill="#E6F2F2"
        stroke="#1BA7A8"
        strokeWidth={5}
      />
      <line stroke="#0B1D3A" strokeWidth={2.5} x1={35} x2={50} y1={35} y2={48} />
      <line stroke="#0B1D3A" strokeWidth={2.5} x1={65} x2={50} y1={35} y2={48} />
      <line stroke="#0B1D3A" strokeWidth={2.5} x1={58} x2={50} y1={22} y2={48} />
      <circle cx={35} cy={35} r={4.5} fill="#4C7DBA" stroke="#0B1D3A" strokeWidth={2} />
      <circle cx={65} cy={35} r={4.5} fill="#4C7DBA" stroke="#0B1D3A" strokeWidth={2} />
      <circle cx={50} cy={48} r={4} fill="#1BA7A8" stroke="#0B1D3A" strokeWidth={2} />
      <circle cx={58} cy={22} r={3.5} fill="#1BA7A8" stroke="#0B1D3A" strokeWidth={2} />
      <path d="M50 82 Q55 92 45 96" stroke="#1BA7A8" strokeWidth={4} />
    </svg>
  );
}

interface LogoProps {
  variant?: 'horizontal' | 'stacked';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const markSize = { sm: 'size-9', md: 'size-14', lg: 'size-20' };
const wordSize = { sm: 'text-headline-sm', md: 'text-headline-md', lg: 'text-headline-lg' };

export function Logo({ variant = 'horizontal', showTagline = false, size = 'sm', className }: LogoProps) {
  const stacked = variant === 'stacked';
  return (
    <div className={cn('flex items-center', stacked ? 'flex-col gap-2 text-center' : 'gap-2.5', className)}>
      <LogoMark className={cn('shrink-0', markSize[size])} />
      <div>
        <div className={cn('leading-none font-bold tracking-tight text-navy', wordSize[size])}>{t.brand.name}</div>
        {showTagline && <div className="mt-1.5 text-label-md tracking-tight text-secondary">{t.brand.tagline}</div>}
      </div>
    </div>
  );
}
