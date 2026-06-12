/**
 * WoModalShell — shell reutilizable para todos los modales de OT.
 *
 * SRP: solo provee el overlay + contenedor + header. Sin lógica de negocio.
 */
import React from 'react';

interface WoModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  color?: string;
  children: React.ReactNode;
}

export const WoModalShell: React.FC<WoModalShellProps> = ({
  isOpen, onClose, title, subtitle, color = 'var(--accent)', children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="wo-modal-overlay" onClick={onClose}>
      <div
        className="wo-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="wo-modal__header" style={{ borderTopColor: color }}>
          <div>
            <h3 className="wo-modal__title" style={{ color }}>{title}</h3>
            {subtitle && <p className="wo-modal__subtitle">{subtitle}</p>}
          </div>
          <button className="wo-modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body */}
        <div className="wo-modal__body">{children}</div>
      </div>
    </div>
  );
};
