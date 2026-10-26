import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { roles } from '../../app/roles';
import { useDemoStore } from '../../store/demoStore';
import { t } from '../../strings';
import { useGuideStore } from './guideStore';
import { replayBefore, STEPS } from './steps';

/** Delay before the auto-play "click", and the gap between staggered actions. */
const CLICK_DELAY_MS = 1100;
const STAGGER_MS = 170;

const isFormControl = (el: EventTarget | null): boolean =>
  el instanceof HTMLElement && (el.matches('input, textarea, select') || el.isContentEditable);

/**
 * Runs the guided demo: enters steps (state replay + navigation), drives
 * auto-play, and owns the keyboard shortcuts. Renders nothing.
 */
export function GuideController() {
  const navigate = useNavigate();
  const location = useLocation();
  const active = useGuideStore((s) => s.active);
  const step = useGuideStore((s) => s.step);
  const nonce = useGuideStore((s) => s.nonce);
  const timers = useRef<number[]>([]);
  const here = useRef('');
  here.current = location.pathname + location.search;

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Enter a step: rebuild the state before it, go to its route, then act (now, or "click" in auto-play).
  useEffect(() => {
    if (!active) return;
    clearTimers();
    const guide = useGuideStore.getState();
    const current = STEPS[step];
    if (!current) return;

    replayBefore(step);
    if (here.current !== current.route) navigate(current.route, { replace: true });

    if (!guide.autoplay) {
      if (!current.actOnExit) current.acts.forEach((act) => act());
      return;
    }
    later(() => {
      guide.firePulse();
      current.acts.forEach((act, i) => later(act, 250 + i * STAGGER_MS));
    }, CLICK_DELAY_MS);
    later(() => useGuideStore.getState().next(), current.ms);
    return clearTimers;
    // `navigate` is stable; re-enter only when the step, activation or nonce changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, step, nonce]);

  useEffect(() => clearTimers, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isFormControl(e.target)) return;
      const guide = useGuideStore.getState();
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      switch (key) {
        case 'ArrowRight':
        case ' ':
          if (!guide.active) return;
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur?.();
          guide.next();
          return;
        case 'ArrowLeft':
          if (!guide.active) return;
          e.preventDefault();
          guide.prev();
          return;
        case 'Escape':
          if (guide.active) guide.finish();
          return;
        case 'g':
          if (guide.active) guide.toggleOverlay();
          else guide.start();
          return;
        case 'a':
          if (!guide.active) guide.start({ autoplay: true });
          else guide.setAutoplay(!guide.autoplay);
          return;
        case 'r':
          useDemoStore.getState().reset();
          if (guide.active) guide.restart();
          else useDemoStore.getState().showToast(t.start.resetDone);
          return;
        default: {
          const role = roles[Number(key) - 1];
          if (role) navigate(role.path);
        }
      }
    };
    // Space activates a focused button on key-up; swallow it while the guide is driving.
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && useGuideStore.getState().active && !isFormControl(e.target)) e.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [navigate]);

  return null;
}
