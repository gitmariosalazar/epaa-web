import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import { IncidentMapInstantTooltip, PRIORITY_CONFIG, DEFAULT_CONFIG } from './IncidentMapInstantTooltip';

interface IncidentMapMarkerProps {
  incident: IncidentDetailRowResponse;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
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
  onClick,
  onMouseOver,
  onMouseOut,
}) => {
  const priority = incident.currentPriority ?? incident.suggestedPriority ?? 'BAJA';
  const cfg = PRIORITY_CONFIG[priority] ?? DEFAULT_CONFIG;
  const isResolved = incident.status === 'RESUELTO' || incident.status === 'FALSO_REPORTE';

  return (
    <div
      className={[
        'incident-marker-container',
        `priority-${priority.toLowerCase()}`,
        isHovered  ? 'is-hovered'  : '',
        isSelected ? 'is-selected' : '',
        isResolved ? 'is-resolved' : '',
      ].join(' ')}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{
        cursor: 'pointer',
        '--marker-color':     cfg.color,
        '--marker-glow':      cfg.glow,
      } as React.CSSProperties}
      role="button"
      aria-label={`Incidente ${incident.incidentId}: ${incident.incidentTypeName}`}
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
