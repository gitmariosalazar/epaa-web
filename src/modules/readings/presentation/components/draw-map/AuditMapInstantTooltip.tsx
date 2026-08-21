import React from 'react';
import type { RouteMapProperties } from '../../../domain/models/map-geojson';
import '@/modules/readings/presentation/styles/ReadingMap.css';

interface AuditMapInstantTooltipProps {
  props: Partial<RouteMapProperties>;
}

export const AuditMapInstantTooltip: React.FC<AuditMapInstantTooltipProps> = ({ props }) => {
  const isCapture = props.tipo === 'captura';
  const color = props['marker-color'] || (isCapture ? '#3b82f6' : '#10b981');
  const label = isCapture ? 'Punto de Captura' : 'Punto de Acometida';

  return (
    <div
      className="reading-map-tooltip"
      style={{ '--tooltip-color': color, pointerEvents: 'none' } as React.CSSProperties}
    >
      <span className="reading-map-tooltip-dot" style={{ background: color }} />
      <span className="reading-map-tooltip-text">{label}</span>
      <div className="reading-map-tooltip-info">
        <span className="reading-map-tooltip-meter">{props.numero_medidor || 'Sin medidor'}</span>
        <span className="reading-map-tooltip-status" style={{ color: color }}>
          CC: {props.clave_catastral || 'N/A'}
        </span>
      </div>
    </div>
  );
};
