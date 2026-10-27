import { useEffect, useRef } from 'react';

import { classNames } from '../../lib/format.js';
import Icon from './Icon.jsx';

/**
 * Accessible dialog: Escape to close, backdrop click to close, focus moved in on
 * open and restored on close, background scroll locked while open.
 */
export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg', className }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const node = dialogRef.current;
    const initial = node?.querySelector('[data-autofocus]') || node;
    window.setTimeout(() => initial?.focus?.(), 0);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !node) return;
      const candidates = Array.from(
        node.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (candidates.length === 0) return;
      const first = candidates[0];
      const last = candidates[candidates.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-navy/65 px-4 py-6 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={classNames(
          'w-full animate-panel-in rounded-panel bg-white p-6 shadow-panel focus:outline-none sm:p-8',
          maxWidth,
          className,
        )}
      >
        <div className="flex items-start justify-between gap-6">
          <h2 className="font-display text-[1.35rem] font-bold leading-tight text-navy">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 -mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-navy/70 transition-colors duration-200 hover:bg-navy/5 hover:text-navy"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
