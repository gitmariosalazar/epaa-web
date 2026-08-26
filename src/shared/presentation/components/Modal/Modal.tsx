import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import '@/shared/presentation/styles/Modal.css';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { Button } from '../Button/Button';
import { BsWindow } from 'react-icons/bs';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
  icon?: React.ReactNode;
  headerColor?: 'teal' | 'indigo' | 'purple' | 'pink' | 'green' | 'orange' | 'default';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  headerActions,
  footer,
  size = 'md',
  icon,
  headerColor = 'default'
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

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal-content modal--${size}`} ref={modalRef}>
        <div className={`modal-header ${headerColor !== 'default' ? `modal-header--${headerColor}` : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            {icon ? (
              <div className="modal-header-icon">
                {icon}
              </div>
            ) : (
              <div className="modal-header-icon-default">
                <BsWindow size={24} />
              </div>
            )}
            <div className="modal-header-content">
              <div className="modal-title">{title}</div>
              {description && (
                <p className="modal-description">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="modal-header-actions">
            {headerActions}
          </div>

          <div className="modal-close-container">
            <Tooltip content="Cerrar modal" followCursor={false} position="bottom" themeColor='accent'>
              <Button
                className="modal-close-modern"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
