import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { RoleSwitcher } from './RoleSwitcher';
import { t } from '../../strings';
import { useStartGuidedDemo } from '../../app/useStartGuidedDemo';

/** 72px blurred navigation header (DESIGN.md "Navigation Headers"). */
export function TopBar() {
  const startGuidedDemo = useStartGuidedDemo();
  return (
    <header className="fixed top-0 left-0 z-50 flex h-[72px] w-full items-center justify-between gap-6 border-b border-outline-variant/30 bg-white/88 px-6 shadow-sm backdrop-blur-md lg:px-12">
      <Link to="/" aria-label={t.nav.home} className="transition-transform duration-200 hover:scale-[1.02]">
        <Logo size="sm" />
      </Link>

      <RoleSwitcher />

      <div className="flex items-center gap-3">
        <div className="hidden items-center rounded-full border border-outline-variant/40 bg-surface-container px-3 py-1 text-label-md text-on-surface-variant xl:flex">
          <span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-teal" />
          {t.nav.synthetic}
        </div>
        <Button size="sm" onClick={startGuidedDemo} iconRight={<ArrowRight className="size-4" />}>
          {t.nav.startGuided}
        </Button>
      </div>
    </header>
  );
}
