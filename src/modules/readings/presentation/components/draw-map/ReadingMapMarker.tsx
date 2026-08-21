import React from 'react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import type { TakenReadingConnection } from '../../../domain/models/Reading';
import {
  ReadingMapInstantTooltip,
  READING_MARKER_CONFIG
} from './ReadingMapInstantTooltip';

// ── Props ─────────────────────────────────────────────────────────────────────
interface ReadingMapMarkerProps {
  type: 'capture' | 'connection';
  /** La lectura completa permite al tooltip mostrar datos relevantes */
  reading?: TakenReadingConnection;
  isHovered?: boolean;
  isSelected?: boolean;
  disablePointerEvents?: boolean;
  onClick?: () => void;
}

/**
 * ReadingMapMarker — SRP: solo renderiza el marcador pulsante en el mapa.
 * - capture   → azul  (punto donde se tomó la lectura)
 * - connection → verde (punto de acometida/medidor)
 * OCP: extensible vía props sin modificar el componente.
 * Equivalente a IncidentMapMarker del módulo incidents.
 */
export const ReadingMapMarker: React.FC<ReadingMapMarkerProps> = ({
  type,
  reading,
  isHovered = false,
  isSelected = false,
  disablePointerEvents = false,
  onClick
}) => {
  const cfg = READING_MARKER_CONFIG[type];

  return (
    <div
      className={[
        'reading-marker-container',
        `type-${type}`,
        isHovered ? 'is-hovered' : '',
        isSelected ? 'is-selected' : ''
      ].join(' ')}
      onClick={onClick}
      style={
        {
          cursor: disablePointerEvents ? 'default' : 'pointer',
          pointerEvents: disablePointerEvents ? 'none' : 'auto',
          '--marker-color': cfg.color,
          '--marker-glow': cfg.glow
        } as React.CSSProperties
      }
      role="button"
      tabIndex={0}
      aria-label={`Marcador ${cfg.label}${reading ? `: ${reading.meterNumber}` : ''}`}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Instant hover tooltip */}
      {isHovered && reading && (
        <ReadingMapInstantTooltip reading={reading} markerType={type} />
      )}

      {/* Pulsing rings */}
      <div className="reading-marker-pulse-ring" />
      <div className="reading-marker-pulse-ring ring-2" />

      {/* Core icon */}
      <div className="reading-marker-core">
        {type === 'capture' ? (
          <FaLocationCrosshairs size={isSelected ? 16 : 14} color="#fff" />
        ) : (
          <FaHome size={isSelected ? 16 : 14} color="#fff" />
        )}
      </div>
    </div>
  );
};
