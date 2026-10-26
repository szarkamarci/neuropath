import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Pause, Play, X } from 'lucide-react';
import { roleCopy } from '../../app/roles';
import { cn } from '../../lib/cn';
import { t } from '../../strings';
import { useGuideStore } from './guideStore';
import { STEPS } from './steps';

const PAD = 8;
const CARD_MARGIN = 48;
const HEADER = 84;

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function findTarget(ids: string[]): HTMLElement | null {
  for (const id of ids) {
    const el = document.querySelector<HTMLElement>(`[data-demo="${id}"]`);
    if (el && el.getClientRects().length > 0) return el;
  }
  return null;
}

const overlaps = (a: { top: number; bottom: number }, b: { top: number; bottom: number }) => a.top < b.bottom && a.bottom > b.top;

/** Spotlight ring + click ripple + the step card. Pointer-transparent except for the card. */
export function GuideOverlay() {
  const { active, step, overlayVisible, autoplay, nonce, pulse } = useGuideStore();
  const ring = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [cardAtTop, setCardAtTop] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const targetRect = useRef<Rect | null>(null);

  // Follow the target every frame (layout shifts, scrolling, modals opening).
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let scrolledFor = '';
    const tick = () => {
      const current = STEPS[step];
      const el = current ? findTarget(current.targets) : null;
      const node = ring.current;
      if (node) {
        if (el) {
          const r = el.getBoundingClientRect();
          const visible = r.bottom > 0 && r.top < window.innerHeight;
          targetRect.current = { left: r.left, top: r.top, width: r.width, height: r.height };
          node.style.opacity = visible ? '1' : '0';
          node.style.left = `${r.left - PAD}px`;
          node.style.top = `${r.top - PAD}px`;
          node.style.width = `${r.width + PAD * 2}px`;
          node.style.height = `${r.height + PAD * 2}px`;
          const key = `${step}:${nonce}:${el.dataset.demo}`;
          if (scrolledFor !== key) {
            scrolledFor = key;
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          targetRect.current = null;
          node.style.opacity = '0';
        }
      }
      // Keep the card clear of the highlighted element.
      const h = card.current?.offsetHeight ?? 150;
      const vh = window.innerHeight;
      const target = targetRect.current;
      const bottomSlot = { top: vh - CARD_MARGIN - h, bottom: vh - CARD_MARGIN };
      const topSlot = { top: HEADER, bottom: HEADER + h };
      const span = target ? { top: target.top - PAD, bottom: target.top + target.height + PAD } : null;
      const atTop = span ? overlaps(span, bottomSlot) && !overlaps(span, topSlot) : false;
      setCardAtTop((prev) => (prev === atTop ? prev : atTop));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, step, nonce]);

  // Auto-play "click": a ripple on the centre of the target.
  useEffect(() => {
    if (!active || pulse === 0) return;
    const r = targetRect.current;
    if (!r) return;
    setRipple({ x: r.left + r.width / 2, y: r.top + r.height / 2, key: pulse });
    const id = window.setTimeout(() => setRipple(null), 750);
    return () => window.clearTimeout(id);
  }, [pulse, active]);

  if (!active) return null;
  const current = STEPS[step];
  if (!current) return null;
  const isLast = step === STEPS.length - 1;
  const g = t.guide;
  const { setAutoplay, next, prev, finish, toggleOverlay } = useGuideStore.getState();

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed z-[120] animate-guide-pulse rounded-2xl border-[3px] border-teal opacity-0 transition-opacity duration-300"
      />
      {ripple && (
        <span
          key={ripple.key}
          aria-hidden="true"
          className="pointer-events-none fixed z-[121] size-14 animate-ripple rounded-full bg-teal/50"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}

      {overlayVisible ? (
        <div
          ref={card}
          role="dialog"
          aria-label={g.stepOf(step + 1, STEPS.length)}
          data-demo="guide-card"
          className={cn(
            'fixed left-1/2 z-[122] w-[min(720px,calc(100vw-3rem))] -translate-x-1/2 animate-pop-in rounded-2xl border border-outline-variant/30 bg-white shadow-xl',
            cardAtTop ? 'top-[84px]' : 'bottom-12',
          )}
        >
          <div className="relative overflow-hidden rounded-2xl">
            {autoplay && (
              <div
                key={`${step}:${nonce}`}
                className="absolute top-0 left-0 h-1 w-full origin-left bg-teal"
                style={{ animation: `guide-progress ${current.ms}ms linear both` }}
              />
            )}
            <div className="flex items-start gap-4 px-5 pt-5 pb-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2 text-label-md tracking-wide text-secondary uppercase">
                  <span data-demo="guide-step">{g.stepOf(step + 1, STEPS.length)}</span>
                  <span className="rounded-full bg-mint px-2 py-0.5 text-[11px] normal-case">{roleCopy(current.role).label}</span>
                </div>
                <p className="text-title-md text-navy" data-demo="guide-text">
                  {g.steps[current.id]}
                </p>
                <p className="mt-1.5 text-[11px] text-muted">{g.hint}</p>
              </div>
              <button
                type="button"
                onClick={finish}
                aria-label={g.close}
                title={g.close}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:text-navy"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-outline-variant/20 px-5 py-3">
              <div className="flex items-center gap-1">
                {STEPS.map((s, i) => (
                  <span key={s.id} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-5 bg-teal' : i < step ? 'w-1.5 bg-teal/50' : 'w-1.5 bg-outline-variant')} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={toggleOverlay} className="flex h-9 items-center gap-1.5 rounded-full px-3 text-label-md text-on-surface-variant transition-colors hover:text-secondary" title="G">
                  <Eye className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAutoplay(!autoplay)}
                  data-demo="guide-autoplay"
                  className="flex h-9 items-center gap-1.5 rounded-full border border-secondary/40 px-3.5 text-label-lg whitespace-nowrap text-secondary transition-colors hover:bg-mint"
                >
                  {autoplay ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
                  {autoplay ? g.pause : g.autoplay}
                </button>
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 0}
                  data-demo="guide-prev"
                  className="flex h-9 items-center gap-1 rounded-full border border-hairline px-3 text-label-lg whitespace-nowrap text-navy transition-colors hover:shadow-sm disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                  {g.back}
                </button>
                <button
                  type="button"
                  onClick={next}
                  data-demo="guide-next"
                  className="flex h-9 items-center gap-1 rounded-full bg-teal px-4 text-label-lg whitespace-nowrap text-white shadow-sm transition-colors hover:bg-teal-hover"
                >
                  {isLast ? g.finish : g.next}
                  {!isLast && <ChevronRight className="size-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={toggleOverlay}
          className="fixed right-6 bottom-12 z-[122] flex h-9 items-center gap-2 rounded-full bg-navy px-4 text-label-lg text-white shadow-xl"
        >
          <Eye className="size-4" />
          {g.show}
        </button>
      )}
    </>
  );
}
