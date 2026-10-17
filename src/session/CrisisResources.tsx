import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '../ui/Button';
import { CRISIS_RESOURCES } from '../data/resources';

/** Native modal keeps focus inside, above transformed session transitions. */
export default function CrisisResources({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = dialog.current;
    modal?.showModal();
    return () => {
      modal?.close();
      opener?.focus();
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialog}
      className="information-dialog"
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      style={{ maxWidth: 448 }}
    >
      <div style={{ padding: 22 }}>
        <h2 id={titleId} className="eyebrow">Support options</h2>
        <p style={{ fontSize: 'var(--t-lg)', marginTop: 6 }}>You don't have to hold this alone.</p>
        <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--t-sm)', marginTop: 10 }}>
          These services are for people in India. If you are elsewhere, contact a local healthcare professional or a support service in your country.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {CRISIS_RESOURCES.map((resource) => (
            <a
              key={resource.id}
              href={resource.href}
              target={resource.href.startsWith('https:') ? '_blank' : undefined}
              rel={resource.href.startsWith('https:') ? 'noopener noreferrer' : undefined}
              className="glass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ display: 'block', padding: '14px 16px', minHeight: 44, outlineColor: 'var(--gold)' }}
            >
              <span style={{ color: 'var(--gold)', fontSize: 'var(--t-md)' }}>{resource.label}</span>
              <span style={{ display: 'block', color: 'var(--ink-muted)', fontSize: 'var(--t-sm)', marginTop: 4 }}>{resource.detail}</span>
            </a>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <Button variant="ghost" onClick={onClose}>Close support options</Button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
