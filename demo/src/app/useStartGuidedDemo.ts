import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../store/demoStore';
import { t } from '../strings';

/**
 * Entry point for "Start guided demo". The scripted walkthrough arrives in
 * build phase 5; until then it opens the first step of the story (GP view).
 */
export function useStartGuidedDemo() {
  const navigate = useNavigate();
  const showToast = useDemoStore((s) => s.showToast);
  return () => {
    showToast(t.start.guidedComingSoon);
    navigate('/gp');
  };
}
