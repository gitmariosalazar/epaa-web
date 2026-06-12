/**
 * WorkOrderPhaseActionBtn
 *
 * SRP: botón de acción de fase. Mismo patrón que PhaseActionBtn de SolicitudDetailPage.
 * Sin lógica de negocio, solo presentación.
 */
import React from 'react';
import { Clock } from 'lucide-react';

export interface PhaseActionBtnProps {
  color: string;
  bg: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  id?: string;
}

export const WorkOrderPhaseActionBtn: React.FC<PhaseActionBtnProps> = ({
  color, bg, icon, label, sublabel, onClick, disabled, loading, id,
}) => (
  <button
    id={id}
    onClick={onClick}
    disabled={disabled || loading}
    className="wo-phase-action-btn"
    style={{ '--phase-color': color, '--phase-bg': bg } as React.CSSProperties}
  >
    <span className="wo-phase-action-btn__icon">
      {loading ? <Clock size={18} className="wo-detail-loading__spinner" /> : icon}
    </span>
    <div className="wo-phase-action-btn__text">
      <span className="wo-phase-action-btn__label">
        {loading ? 'Procesando...' : label}
      </span>
      {sublabel && (
        <span className="wo-phase-action-btn__sublabel">{sublabel}</span>
      )}
    </div>
  </button>
);
