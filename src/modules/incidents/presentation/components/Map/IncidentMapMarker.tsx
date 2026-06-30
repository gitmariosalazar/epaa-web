import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import {
  IncidentMapInstantTooltip,
  PRIORITY_CONFIG,
  DEFAULT_CONFIG
} from './IncidentMapInstantTooltip';

interface IncidentMapMarkerProps {
  incident: IncidentDetailRowResponse;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * IncidentMapMarker — SRP: solo renderiza el marcador pulsante en el mapa.
 * El color y la animación reflejan la prioridad del incidente:
 *  - CRITICA → rojo
 *  - ALTA    → naranja
 *  - MEDIA   → amarillo
 *  - BAJA    → verde
 */
export const IncidentMapMarker: React.FC<IncidentMapMarkerProps> = ({
  incident,
  isHovered,
  isSelected,
  onClick
}) => {
  const priority =
    incident.currentPriority ?? incident.suggestedPriority ?? 'BAJA';
  const cfg = PRIORITY_CONFIG[priority] ?? DEFAULT_CONFIG;
  const isResolved =
    incident.status === 'RESUELTO' || incident.status === 'FALSO_REPORTE';

  return (
    <div
      className={[
        'incident-marker-container',
        `priority-${priority.toLowerCase()}`,
        isHovered ? 'is-hovered' : '',
        isSelected ? 'is-selected' : '',
        isResolved ? 'is-resolved' : ''
      ].join(' ')}
      onClick={onClick}
      style={
        {
          cursor: 'pointer',
          '--marker-color': cfg.color,
          '--marker-glow': cfg.glow
        } as React.CSSProperties
      }
      role="button"
      tabIndex={0}
      aria-label={`Incidente ${incident.incidentId}: ${incident.incidentTypeName}`}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          onClick();
        }
      }}
    >
      {isHovered && <IncidentMapInstantTooltip incident={incident} />}

      {/* Pulsing rings — only animate when not resolved */}
      {!isResolved && <div className="incident-marker-pulse-ring" />}
      {!isResolved && <div className="incident-marker-pulse-ring ring-2" />}

      {/* Core icon */}
      <div className="incident-marker-core">
        <AlertTriangle
          size={isSelected ? 16 : 13}
          strokeWidth={2.5}
          color="#fff"
        />
      </div>
    </div>
  );
};
