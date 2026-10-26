import { useGuideStore } from '../features/guide/guideStore';

/** Entry point for "Start guided demo": resets the data and begins at step 1 (manual stepping). */
export function useStartGuidedDemo() {
  const start = useGuideStore((s) => s.start);
  return () => start();
}
