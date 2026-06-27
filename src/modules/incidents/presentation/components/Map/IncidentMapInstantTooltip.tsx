import React from 'react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';

// ── Priority → visual config mapping (SRP: solo mapeo de prioridad) ──────────
const PRIORITY_CONFIG: Record<
  string,
  { color: string; glow: string; label: string }
> = {
  CRITICA: { color: '#ef4444', glow: 'rgba(239,68,68,0.5)',   label: 'CRÍTICA'  },
  ALTA:    { color: '#f97316', glow: 'rgba(249,115,22,0.45)', label: 'ALTA'     },
  MEDIA:   { color: '#eab308', glow: 'rgba(234,179,8,0.4)',   label: 'MEDIA'    },
  BAJA:    { color: '#22c55e', glow: 'rgba(34,197,94,0.35)',  label: 'BAJA'     },
};

const DEFAULT_CONFIG = { color: '#6b7280', glow: 'rgba(107,114,128,0.3)', label: 'N/A' };

// ── Status → badge config ─────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  REPORTADO:     { color: '#f59e0b', label: 'Reportado'     },
  EN_INSPECCION: { color: '#3b82f6', label: 'En Inspección' },
  RESUELTO:      { color: '#10b981', label: 'Resuelto'      },
  FALSO_REPORTE: { color: '#ef4444', label: 'Falso Reporte' },
};

interface IncidentMapInstantTooltipProps {
  incident: IncidentDetailRowResponse;
}

/**
 * IncidentMapInstantTooltip — SRP: solo renderiza el tooltip flotante del marcador.
 * Se muestra al hacer hover sobre el marcador (sin latencia).
 */
export const IncidentMapInstantTooltip: React.FC<IncidentMapInstantTooltipProps> = ({
  incident,
}) => {
  const cfg = PRIORITY_CONFIG[incident.currentPriority] ?? DEFAULT_CONFIG;
  return (
    <div className="incident-map-tooltip" style={{ '--tooltip-color': cfg.color } as React.CSSProperties}>
      <span className="incident-map-tooltip-dot" style={{ background: cfg.color }} />
      <span className="incident-map-tooltip-text">{incident.incidentTypeName}</span>
    </div>
  );
};

// ── Exports helpers for reuse in other subcomponents ─────────────────────────
export { PRIORITY_CONFIG, STATUS_CONFIG, DEFAULT_CONFIG };
