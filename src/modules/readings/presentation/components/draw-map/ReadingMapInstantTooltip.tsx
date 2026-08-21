import React from 'react';
import type { TakenReadingConnection } from '../../../domain/models/Reading';

// ── Marker type → visual config (SRP: solo mapeo visual) ─────────────────────
export const READING_MARKER_CONFIG: Record<
  'capture' | 'connection',
  { color: string; glow: string; label: string }
> = {
  capture: {
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.5)',
    label: 'Punto de Lectura'
  },
  connection: {
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.5)',
    label: 'Lugar de Acometida'
  }
};

// ── Radius status → visual config ────────────────────────────────────────────
export const RADIUS_STATUS_CONFIG = {
  inside: { color: '#10b981', label: 'Dentro del radio' },
  outside: { color: '#ef4444', label: 'Fuera del radio' },
  unknown: { color: '#6b7280', label: 'Sin verificar' }
} as const;

export type RadiusStatus = keyof typeof RADIUS_STATUS_CONFIG;

export function getRadiusStatus(
  isInsideAllowedRadius: boolean | null | undefined
): RadiusStatus {
  if (isInsideAllowedRadius === true) return 'inside';
  if (isInsideAllowedRadius === false) return 'outside';
  return 'unknown';
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ReadingMapInstantTooltipProps {
  reading: TakenReadingConnection;
  markerType: 'capture' | 'connection';
}

/**
 * ReadingMapInstantTooltip — SRP: solo renderiza el tooltip flotante del marcador.
 * Se muestra al hacer hover sobre el marcador (sin latencia).
 * Equivalente a IncidentMapInstantTooltip del módulo incidents.
 */
export const ReadingMapInstantTooltip: React.FC<ReadingMapInstantTooltipProps> = ({
  reading,
  markerType
}) => {
  const cfg = READING_MARKER_CONFIG[markerType];
  const statusCfg = RADIUS_STATUS_CONFIG[getRadiusStatus(reading.isInsideAllowedRadius)];

  return (
    <div
      className="reading-map-tooltip"
      style={{ '--tooltip-color': cfg.color } as React.CSSProperties}
    >
      <span className="reading-map-tooltip-dot" style={{ background: cfg.color }} />
      <span className="reading-map-tooltip-text">{cfg.label}</span>
      <div className="reading-map-tooltip-info">
        <span className="reading-map-tooltip-meter">{reading.meterNumber}</span>
        {markerType === 'capture' && reading.isInsideAllowedRadius !== undefined && (
          <span
            className="reading-map-tooltip-status"
            style={{ color: statusCfg.color }}
          >
            {statusCfg.label}
          </span>
        )}
      </div>
    </div>
  );
};
