import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  anchorElement?: HTMLElement | null;
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
  headerColor = 'default',
  anchorElement
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (!isOpen || !anchorElement || !modalRef.current) {
      setPopoverStyle({});
      return;
    }

    const updatePosition = () => {
      if (!anchorElement || !modalRef.current) return;
      const rect = anchorElement.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom - 16;
      const spaceAbove = rect.top - 16;

      let style: React.CSSProperties = {
        position: 'absolute',
        margin: 0,
        transform: 'none',
        display: 'flex',
        flexDirection: 'column'
      };

      let isAbove = false;
      if (rect.bottom + 8 + modalRect.height > window.innerHeight && spaceAbove > spaceBelow) {
        isAbove = true;
      }

      if (isAbove) {
        let bottom = window.innerHeight - rect.top + 8;
        if (bottom < 16) bottom = 16;
        style.bottom = `${bottom}px`;
        style.maxHeight = `${spaceAbove}px`;
      } else {
        style.top = `${rect.bottom + 8}px`;
        style.maxHeight = `${spaceBelow}px`;
      }

      if (rect.left + modalRect.width > window.innerWidth) {
        let right = window.innerWidth - rect.right;
        if (right < 16) right = 16;
        style.right = `${right}px`;
      } else {
        style.left = `${rect.left}px`;
      }

      setPopoverStyle(style);
    };

    updatePosition();

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    resizeObserver.observe(modalRef.current);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, anchorElement]);

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

  // Portal: renderiza el overlay directamente en document.body para escapar
  // cualquier stacking context creado por tabs, drawers u otros ancestros con
  // position / z-index / transform / overflow que lo atraparían.
  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${anchorElement ? 'modal-overlay--transparent' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal-content modal--${size} ${anchorElement ? 'modal--popover' : ''}`}
        ref={modalRef}
        style={popoverStyle}
      >
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
            
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              className="modal-header-content"
            >
              <div className="modal-title">{title}</div>
              {description && (
                <p
                  className="modal-description"
                  style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginLeft: 'auto'
            }}
            className="modal-header-actions"
          >
            {headerActions}
            
            <div className="modal-close-container">
              <Tooltip content="Cerrar modal" followCursor={false} position="bottom" themeColor="accent">
                <Button
                  className="modal-close-modern modal-close"
                  onClick={onClose}
                  type="button"
                  aria-label="Cerrar modal"
                  circle
                  size="xs"
                >
                  <X size={18} />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
