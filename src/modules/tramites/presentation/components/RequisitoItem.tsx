// ============================================================
// PRESENTATION — RequisitoItem (informational only)
// SRP: purely displays a requirement — no upload logic here.
// ============================================================

import React from 'react';
import { FileText, DollarSign, ClipboardList, Info } from 'lucide-react';
import type { Requisito } from '../../domain/models/Tramite';
import '../styles/Tramites.css';

const TIPO_CONFIG = {
  documento: {
    icon: <FileText size={18} />,
    className: 'requisito-item__icon--documento',
    label: 'Documento',
    badgeBg: 'rgba(59,130,246,0.1)',
    badgeColor: '#3b82f6'
  },
  pago: {
    icon: <DollarSign size={18} />,
    className: 'requisito-item__icon--pago',
    label: 'Pago',
    badgeBg: 'rgba(245,158,11,0.1)',
    badgeColor: '#f59e0b'
  },
  formulario: {
    icon: <ClipboardList size={18} />,
    className: 'requisito-item__icon--formulario',
    label: 'Formulario',
    badgeBg: 'rgba(139,92,246,0.1)',
    badgeColor: '#8b5cf6'
  }
};

interface RequisitoItemProps {
  requisito: Requisito;
  index: number;
}

export const RequisitoItem: React.FC<RequisitoItemProps> = ({ requisito, index }) => {
  const config = TIPO_CONFIG[requisito.tipo];

  return (
    <li className="requisito-item" id={`requisito-${requisito.id}`}>
      {/* Step number */}
      <div className="requisito-item__number">{index + 1}</div>

      {/* Type icon */}
      <div className={`requisito-item__icon ${config.className}`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="requisito-item__content">
        <div className="requisito-item__header">
          <p className="requisito-item__descripcion">
            {requisito.descripcion}
            {!requisito.obligatorio && (
              <span className="requisito-item__optional-badge">Opcional</span>
            )}
          </p>
          <div className="requisito-item__badges">
            {requisito.costo !== undefined && (
              <span className="requisito-item__costo">${requisito.costo.toFixed(2)}</span>
            )}
            <span
              className="requisito-item__tipo-badge"
              style={{ background: config.badgeBg, color: config.badgeColor }}
            >
              {config.label}
            </span>
          </div>
        </div>

        {requisito.nota && (
          <p className="requisito-item__nota">
            <Info size={11} />
            {requisito.nota}
          </p>
        )}
      </div>
    </li>
  );
};
