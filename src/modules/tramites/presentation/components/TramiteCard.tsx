// ============================================================
// PRESENTATION — TramiteCard component (SRP)
// Only responsible for rendering a single tramite summary card.
// ============================================================

import React from 'react';
import {
  Droplets,
  Building2,
  Users,
  XCircle,
  Heart,
  ArrowRight,
  DollarSign,
  Clock
} from 'lucide-react';
import { FaWheelchair } from 'react-icons/fa';
import type { Tramite, TipoPersona } from '../../domain/models/Tramite';
import '../styles/Tramites.css';

const ICONS: Record<string, React.ReactNode> = {
  droplets: <Droplets size={24} />,
  building2: <Building2 size={24} />,
  users: <Users size={24} />,
  'x-circle': <XCircle size={24} />,
  heart: <Heart size={24} />,
  accessibility: <FaWheelchair size={22} />
};

const TIPO_LABELS: Record<TipoPersona, string> = {
  natural: 'Persona Natural',
  juridica: 'Persona Jurídica',
  ambas: 'Natural y Jurídica'
};

interface TramiteCardProps {
  tramite: Tramite;
  onClick: (tramite: Tramite) => void;
}

export const TramiteCard: React.FC<TramiteCardProps> = ({ tramite, onClick }) => {
  const costosPagos = tramite.requisitos
    .filter((r) => r.costo !== undefined)
    .reduce((sum, r) => sum + (r.costo ?? 0), 0);

  return (
    <div
      className="tramite-card"
      style={{ '--tramite-color': tramite.color } as React.CSSProperties}
      onClick={() => onClick(tramite)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(tramite)}
      id={`tramite-card-${tramite.id}`}
    >
      <div className="tramite-card__top">
        <div className="tramite-card__icon">
          {ICONS[tramite.icono] ?? <Droplets size={24} />}
        </div>
        <div className="tramite-card__info">
          <h3 className="tramite-card__nombre">{tramite.nombre}</h3>
          <span className="tramite-card__tipo">
            {TIPO_LABELS[tramite.tipoPersona]}
          </span>
        </div>
        <ArrowRight size={18} className="tramite-card__arrow" />
      </div>

      <p className="tramite-card__descripcion">{tramite.descripcion}</p>

      <div className="tramite-card__meta">
        <div className="tramite-card__meta-item">
          <DollarSign size={14} />
          <span>Desde <strong>${costosPagos.toFixed(2)}</strong></span>
        </div>
        {tramite.tiempoEstimadoDias && (
          <div className="tramite-card__meta-item">
            <Clock size={14} />
            <span>~<strong>{tramite.tiempoEstimadoDias} días</strong></span>
          </div>
        )}
        <div className="tramite-card__meta-item">
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '9999px',
            background: 'color-mix(in srgb, var(--tramite-color) 12%, transparent)',
            color: 'var(--tramite-color)',
            fontWeight: 700
          }}>
            {tramite.requisitos.length} requisitos
          </span>
        </div>
      </div>
    </div>
  );
};
