import { create } from 'zustand';
import { STEPS } from './steps';

interface GuideState {
  active: boolean;
  step: number;
  overlayVisible: boolean;
  autoplay: boolean;
  /** Bumped whenever the controller must (re)enter the current step. */
  nonce: number;
  /** Bumped right before an auto-play "click", to draw a ripple on the target. */
  pulse: number;
  start: (opts?: { autoplay?: boolean }) => void;
  goTo: (step: number) => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  finish: () => void;
  toggleOverlay: () => void;
  setAutoplay: (autoplay: boolean) => void;
  firePulse: () => void;
}

const last = STEPS.length - 1;

export const useGuideStore = create<GuideState>()((set, get) => ({
  active: false,
  step: 0,
  overlayVisible: true,
  autoplay: false,
  nonce: 0,
  pulse: 0,

  start: (opts) => set((s) => ({ active: true, step: 0, overlayVisible: true, autoplay: opts?.autoplay ?? false, nonce: s.nonce + 1 })),
  goTo: (step) => set((s) => ({ active: true, step: Math.min(last, Math.max(0, step)), nonce: s.nonce + 1 })),
  next: () => {
    const { step, finish, goTo } = get();
    if (step >= last) finish();
    else goTo(step + 1);
  },
  prev: () => get().goTo(get().step - 1),
  restart: () => set((s) => ({ step: 0, autoplay: false, nonce: s.nonce + 1 })),
  finish: () => set({ active: false, autoplay: false }),
  toggleOverlay: () => set((s) => ({ overlayVisible: !s.overlayVisible })),
  setAutoplay: (autoplay) => set((s) => ({ autoplay, nonce: s.nonce + 1 })),
  firePulse: () => set((s) => ({ pulse: s.pulse + 1 })),
}));
