import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import '@/shared/presentation/styles/Modal.css';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { Button } from '../Button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;

  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  headerActions,
  footer,
  size = 'md'

}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-content modal--${size}`} ref={modalRef}>
        <div className="modal-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 className="modal-title">{title}</h2>
            {description && <p className="modal-description" style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{description}</p>}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto', marginRight: '1rem' }}>
            {headerActions}
          </div>

          <Tooltip content="Cerrar">

            <Button
              variant="outline"
              className="modal-close"
              onClick={onClose}
              circle
              color="error"
            >
              <X size={24} />
            </Button>
          </Tooltip>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
