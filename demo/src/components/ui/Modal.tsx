import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { t } from '../../strings';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
  /** Hook for the guided demo overlay. */
  demoId?: string;
}

/** Level-3 dialog with 16px radius (DESIGN.md "Elevation" / "Shapes"). */
export function Modal({ open, onClose, title, description, children, footer, size = 'md', demoId }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 animate-fade-in bg-navy/30 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        data-demo={demoId}
        className={`relative flex max-h-[calc(100vh-3rem)] w-full ${size === 'lg' ? 'max-w-3xl' : 'max-w-xl'} animate-pop-in flex-col rounded-2xl border border-outline-variant/30 bg-white shadow-xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-6 pt-6 pb-4">
          <div>
            <h2 className="text-headline-sm text-navy">{title}</h2>
            {description && <p className="mt-1 text-body-sm text-on-surface-variant">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:text-navy"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 custom-scrollbar">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
