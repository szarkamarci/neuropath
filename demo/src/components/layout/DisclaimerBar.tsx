import { FlaskConical } from 'lucide-react';
import { t } from '../../strings';

/** Always-visible honesty banner (brief §2). Never hide or remove it. */
export function DisclaimerBar() {
  return (
    <footer
      role="note"
      className="fixed bottom-0 left-0 z-50 flex h-9 w-full items-center justify-center gap-2 border-t border-outline-variant/30 bg-cream/95 px-6 text-label-md text-on-surface-variant backdrop-blur-sm"
    >
      <FlaskConical className="size-3.5 text-secondary" />
      <span>{t.disclaimer}</span>
    </footer>
  );
}
