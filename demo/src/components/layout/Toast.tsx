import { useEffect } from 'react';
import { CircleCheck } from 'lucide-react';
import { useDemoStore } from '../../store/demoStore';

const TOAST_MS = 3200;

export function Toast() {
  const toast = useDemoStore((s) => s.toast);
  const dismissToast = useDemoStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      key={toast}
      className="fixed top-[88px] left-1/2 z-[90] flex -translate-x-1/2 animate-pop-in items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-label-lg text-white shadow-xl"
    >
      <CircleCheck className="size-4 text-secondary-fixed-dim" />
      {toast}
    </div>
  );
}
