import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ title, children, open, onClose, footer, maxWidth = 'max-w-lg' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
      <div className={`card w-full ${maxWidth}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
          <Button aria-label="Close modal" className="h-9 min-h-9 px-2" onClick={onClose} variant="secondary">
            <X size={17} />
          </Button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
