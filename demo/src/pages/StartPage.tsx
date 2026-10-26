import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Play, RotateCcw } from 'lucide-react';
import { LogoMark } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { roleCopy, roles } from '../app/roles';
import { useStartGuidedDemo } from '../app/useStartGuidedDemo';
import { useDemoStore } from '../store/demoStore';
import { t } from '../strings';

export function StartPage() {
  const navigate = useNavigate();
  const startGuidedDemo = useStartGuidedDemo();
  const reset = useDemoStore((s) => s.reset);
  const showToast = useDemoStore((s) => s.showToast);

  const handleReset = () => {
    reset();
    showToast(t.start.resetDone);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-6 lg:px-12 2xl:py-12">
      <StartHero onStart={startGuidedDemo} onExploreGp={() => navigate('/gp')} onReset={handleReset} />

      <section className="mt-5 2xl:mt-10">
        <h2 className="mb-4 text-label-md tracking-wider text-secondary uppercase">{t.start.rolesTitle}</h2>
        <div className="grid grid-cols-2 gap-gutter lg:grid-cols-4">
          {roles.map((role) => (
            <RoleCard key={role.id} {...role} />
          ))}
        </div>
      </section>
    </div>
  );
}

interface StartHeroProps {
  onStart: () => void;
  onExploreGp: () => void;
  onReset: () => void;
}

/** Asymmetric 2-column hero, modelled on code.html's hero template. */
function StartHero({ onStart, onExploreGp, onReset }: StartHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm lg:px-12 lg:py-8 2xl:p-14">
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-mint/60 to-transparent" />
      <div className="relative z-10 grid grid-cols-12 items-center gap-10">
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-mint px-3 py-1 text-label-md text-secondary">
            <span className="size-1.5 rounded-full bg-teal" />
            {t.start.eyebrow}
          </div>
          <h1 className="mb-5 text-headline-lg text-navy 2xl:text-display-hero">
            {t.start.headline}
            <br />
            <span className="text-teal">{t.start.headlineAccent}</span>
          </h1>
          <p className="mb-6 max-w-xl text-body-lg text-on-surface-variant">{t.start.lead}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={onStart} iconLeft={<Play className="size-4 fill-current" />}>
              {t.start.startGuided}
            </Button>
            <Button size="lg" variant="secondary" onClick={onExploreGp}>
              {t.start.exploreGp}
            </Button>
            <button
              type="button"
              onClick={onReset}
              className="ml-1 inline-flex items-center gap-1.5 text-label-md text-on-surface-variant underline-offset-4 transition-colors hover:text-secondary hover:underline"
            >
              <RotateCcw className="size-3.5" />
              {t.start.reset}
            </button>
          </div>
          <p className="mt-5 text-label-md text-muted" data-demo="shortcuts">
            {t.guide.shortcuts}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-6 text-label-md text-on-surface-variant">
            {t.start.facts.map((fact) => (
              <div key={fact} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-secondary" strokeWidth={3} />
                {fact}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 hidden items-center justify-center lg:flex">
          <BrandOrb />
        </div>
      </div>
    </section>
  );
}

/** Logo + tagline framed in the mint orb from the code.html hero illustration. */
function BrandOrb() {
  return (
    <div className="relative flex aspect-square w-full max-w-[19rem] items-center justify-center rounded-full border border-secondary/10 bg-mint/50 2xl:max-w-[26rem]">
      <div className="absolute inset-4 animate-spin rounded-full border border-dashed border-secondary/25 [animation-duration:60s]" />
      <div className="absolute inset-12 flex flex-col items-center justify-center rounded-full bg-white/85 text-center shadow-sm backdrop-blur-sm">
        <LogoMark className="mb-2 size-20 2xl:size-28" />
        <div className="text-headline-md font-bold text-navy">{t.brand.name}</div>
        <TaglineLines className="mt-1 text-label-md text-secondary" />
      </div>
    </div>
  );
}

/** Tagline split after the first sentence so it wraps cleanly in narrow spaces. */
function TaglineLines({ className }: { className?: string }) {
  const [first, ...rest] = t.brand.tagline.split('. ');
  return (
    <div className={className}>
      <div>{rest.length ? `${first}.` : first}</div>
      {rest.length > 0 && <div>{rest.join('. ')}</div>}
    </div>
  );
}

function RoleCard({ id, path, icon: Icon }: (typeof roles)[number]) {
  const copy = roleCopy(id);
  return (
    <Link to={path} className="group block h-full">
      <Card interactive className="flex h-full flex-col">
        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-surface-container-low text-secondary transition-colors group-hover:bg-mint">
          <Icon className="size-[22px]" />
        </div>
        <h3 className="mb-1 text-title-md text-navy">{copy.title}</h3>
        <p className="flex-1 text-body-sm text-on-surface-variant">{copy.description}</p>
        <div className="mt-4 flex items-center gap-1 text-label-lg text-secondary">
          {t.start.openRole}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </Card>
    </Link>
  );
}
