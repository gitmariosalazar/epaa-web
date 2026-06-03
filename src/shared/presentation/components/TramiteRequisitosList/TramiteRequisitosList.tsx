/**
 * TramiteRequisitosList
 *
 * SRP: renders a list of requirements for ANY tramite type.
 * DIP: receives Requisito[] as props — no knowledge of which module provides them.
 * OCP: add new RequisitoTipo display by extending the config map.
 */
import React from 'react';
import type { Requisito, RequisitoTipo } from '@/shared/domain/models/TramiteBase';
import {
  FileText,
  CreditCard,
  ClipboardList,
  CheckCircle,
  Info
} from 'lucide-react';
import './TramiteRequisitosList.css';

// ── Icon + color config per tipo ──────────────────────────────────────────────
interface TipoConfig {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
}

const TIPO_CONFIG: Record<RequisitoTipo, TipoConfig> = {
  documento: {
    icon: <FileText size={14} />,
    label: 'Documento',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)'
  },
  pago: {
    icon: <CreditCard size={14} />,
    label: 'Pago',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)'
  },
  formulario: {
    icon: <ClipboardList size={14} />,
    label: 'Formulario',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)'
  }
};

interface TramiteRequisitosListProps {
  requisitos: Requisito[];
  /** Show only items of this type (undefined = show all) */
  filterTipo?: RequisitoTipo;
}

export const TramiteRequisitosList: React.FC<TramiteRequisitosListProps> = ({
  requisitos,
  filterTipo
}) => {
  const items = filterTipo
    ? requisitos.filter((r) => r.tipo === filterTipo)
    : requisitos;

  if (items.length === 0) return null;

  return (
    <ul className="trq-list" role="list">
      {items.map((req) => {
        const cfg = TIPO_CONFIG[req.tipo];
        return (
          <li key={req.id} className={`trq-item${!req.obligatorio ? ' trq-item--opcional' : ''}`}>
            {/* Left: tipo badge */}
            <span
              className="trq-item__tipo"
              style={{ color: cfg.color, background: cfg.bg }}
              title={cfg.label}
            >
              {cfg.icon}
              <span>{cfg.label}</span>
            </span>

            {/* Center: description */}
            <div className="trq-item__body">
              <span className="trq-item__desc">
                {req.descripcion}
                {!req.obligatorio && (
                  <span className="trq-item__opt-tag">Opcional</span>
                )}
              </span>
              {req.nota && (
                <span className="trq-item__nota">
                  <Info size={10} /> {req.nota}
                </span>
              )}
            </div>

            {/* Right: cost or check */}
            <span className="trq-item__right">
              {req.costo != null ? (
                <span className="trq-item__costo">${req.costo.toFixed(2)}</span>
              ) : (
                <CheckCircle size={15} style={{ color: '#10b981' }} />
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
