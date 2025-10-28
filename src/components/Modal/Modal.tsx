// src/components/Modal/Modal.tsx
import { useEffect, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface Props {
  onClose: () => void;
}

const modalRoot = document.body; 

export default function Modal({ onClose, children }: PropsWithChildren<Props>) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdrop}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
