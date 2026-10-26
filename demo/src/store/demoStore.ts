import { create } from 'zustand';
import type { PatientStatus } from '../components/ui/Badge';

/**
 * Shared in-memory demo state. Every role reads from this one store, so an
 * action taken in one view shows up in the others. Later phases extend
 * `DemoData`; `createInitialData` must stay deterministic so reset is exact.
 */
export interface DemoData {
  heroStatus: PatientStatus;
}

export function createInitialData(): DemoData {
  return { heroStatus: 'newFlag' };
}

interface DemoStore extends DemoData {
  toast: string | null;
  reset: () => void;
  showToast: (message: string) => void;
  dismissToast: () => void;
}

export const useDemoStore = create<DemoStore>()((set) => ({
  ...createInitialData(),
  toast: null,
  reset: () => set({ ...createInitialData() }),
  showToast: (message) => set({ toast: message }),
  dismissToast: () => set({ toast: null }),
}));
