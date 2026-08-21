import React, { memo, useCallback } from 'react';
import { MapPin, Calendar, X, Ruler } from 'lucide-react';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdMyLocation } from 'react-icons/md';
import type { TakenReadingConnection } from '../../../domain/models/Reading';
import {
  RADIUS_STATUS_CONFIG,
  getRadiusStatus
} from './ReadingMapInstantTooltip';

// ── Props ─────────────────────────────────────────────────────────────────────
interface ReadingMapInfoWindowProps {
  reading: TakenReadingConnection;
  markerType: 'capture' | 'connection';
  theme: string;
  onClose: () => void;
  onViewDetail?: (reading: TakenReadingConnection) => void;
}

/**
 * ReadingMapInfoWindow — SRP: solo renderiza el popup de info de la lectura.
 * Se muestra al hacer click en un marcador del mapa.
 * ISP: recibe solo los datos que necesita, no el contexto completo.
 * Equivalente a IncidentMapInfoWindow del módulo incidents.
 */
export const ReadingMapInfoWindow: React.FC<ReadingMapInfoWindowProps> = memo(
  ({ reading, markerType, theme, onClose, onViewDetail }) => {
    const isDark = theme === 'dark';
    const statusKey = getRadiusStatus(reading.isInsideAllowedRadius);
    const statusCfg = RADIUS_STATUS_CONFIG[statusKey];

    const stopEventPropagation = useCallback((ev: React.SyntheticEvent) => {
      ev.stopPropagation();
      ev.preventDefault?.();
    }, []);

    const handleClose = useCallback(
      (ev: React.SyntheticEvent) => {
        stopEventPropagation(ev);
        onClose();
      },
      [onClose, stopEventPropagation]
    );

    const isCapture = markerType === 'capture';
    const markerColor = isCapture ? '#3b82f6' : '#10b981';
    const markerLabel = isCapture ? 'Punto de Lectura' : 'Lugar de Acometida';
    const MarkerIcon = isCapture ? MdMyLocation : FaHome;

    return (
      <div className={`reading-popup ${isDark ? 'dark' : ''}`}>
        {/* Close button */}
        <button
          type="button"
          className="reading-popup-close"
          onClick={handleClose}
          onMouseDown={stopEventPropagation}
          onPointerDown={stopEventPropagation}
          aria-label="Cerrar"
        >
          <X size={14} />
        </button>

        <div className="reading-popup-body">
          {/* Title bar */}
          <div className="reading-popup-titlebar">
            <span className="reading-popup-titlebar-label">INFORMACIÓN DE LECTURA</span>
            <h3 className="reading-popup-titlebar-title">
              Medidor: <span className="reading-popup-text-secondary">{reading.meterNumber}</span>
            </h3>
          </div>

          {/* Header with icon */}
          <div className="reading-popup-header">
            <div
              className="reading-popup-icon"
              style={{
                background: `${markerColor}22`,
                border: `1.5px solid ${markerColor}55`
              }}
            >
              <MarkerIcon size={16} color={markerColor} />
            </div>
            <div className="reading-popup-title-block">
              <span className="reading-popup-id">
                {reading.readingCode ?? reading.readingId}
              </span>
              <h3 className="reading-popup-title">{markerLabel}</h3>
              <span className="reading-popup-category">{reading.rateName}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="reading-popup-badges">
            <span
              className="reading-popup-badge"
              style={{
                background: `${markerColor}22`,
                color: markerColor,
                border: `1px solid ${markerColor}44`
              }}
            >
              {reading.readingTypeName}
            </span>

            {reading.isInsideAllowedRadius !== null &&
              reading.isInsideAllowedRadius !== undefined && (
                <span
                  className="reading-popup-badge"
                  style={{
                    background: `${statusCfg.color}22`,
                    color: statusCfg.color,
                    border: `1px solid ${statusCfg.color}44`
                  }}
                >
                  {reading.isInsideAllowedRadius ? (
                    <FaCheckCircle size={10} />
                  ) : (
                    <IoIosCloseCircle size={10} />
                  )}
                  {statusCfg.label}
                </span>
              )}
          </div>

          {/* Info rows */}
          <div className="reading-popup-info">
            <div className="reading-popup-info-row">
              <MapPin size={12} />
              <span>{reading.address}</span>
            </div>
            {reading.readingDate && (
              <div className="reading-popup-info-row">
                <Calendar size={12} />
                <span>
                  {new Date(reading.readingDate).toLocaleString('es-EC', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
            {reading.distanceMeters != null && (
              <div className="reading-popup-info-row">
                <Ruler size={12} />
                <span>
                  Distancia:{' '}
                  <strong>{reading.distanceMeters.toFixed(2)} m</strong>
                </span>
              </div>
            )}
          </div>

          {/* Reading values (only for capture marker) */}
          {isCapture && (
            <div className="reading-popup-values">
              <div className="reading-popup-value-row">
                <span className="reading-popup-value-label">Lectura anterior</span>
                <span className="reading-popup-value">{reading.previousReading ?? '—'}</span>
              </div>
              <div className="reading-popup-value-row">
                <span className="reading-popup-value-label">Lectura actual</span>
                <span className="reading-popup-value">{reading.currentReading ?? '—'}</span>
              </div>
              <div className="reading-popup-value-row">
                <span className="reading-popup-value-label">Consumo</span>
                <span className="reading-popup-value reading-popup-value-highlight">
                  {reading.calculatedConsumption ?? '—'} m³
                </span>
              </div>
            </div>
          )}

          {/* Client info */}
          <div className="reading-popup-client">
            <span className="reading-popup-client-name">{reading.clientName}</span>
            <span className="reading-popup-client-key">{reading.cadastralKey}</span>
          </div>

          {/* Novelty */}
          {reading.novelty && (
            <p className="reading-popup-novelty">{reading.novelty}</p>
          )}

          {/* Actions */}
          {onViewDetail && (
            <div className="reading-popup-actions">
              <button
                type="button"
                className="reading-popup-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(reading);
                }}
              >
                Ver detalle completo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReadingMapInfoWindow.displayName = 'ReadingMapInfoWindow';
