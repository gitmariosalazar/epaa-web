import React, { memo, useCallback } from 'react';
import { X } from 'lucide-react';
import { MdMyLocation } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';
import { ConverDateTime } from '@/shared/utils/datetime/ConverDate';
import type { RouteMapProperties } from '../../../domain/models/map-geojson';
import '@/modules/readings/presentation/styles/ReadingMap.css'; // Reusing premium popup styles

interface AuditMapInfoWindowProps {
  featureProps: RouteMapProperties;
  theme: 'light' | 'dark';
  onClose: () => void;
  onViewDetail?: () => void; // Si en el futuro agregamos detalle
}

export const AuditMapInfoWindow: React.FC<AuditMapInfoWindowProps> = memo(
  ({ featureProps: props, theme, onClose, onViewDetail }) => {
    const isDark = theme === 'dark';

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

    const isCapture = props.tipo === 'captura';
    const markerColor = props['marker-color'] || (isCapture ? '#3b82f6' : '#10b981');
    const markerLabel = isCapture ? 'Punto de Captura' : 'Punto de Acometida';
    const MarkerIcon = isCapture ? MdMyLocation : FaHome;

    return (
      <div className={`reading-popup ${isDark ? 'dark' : ''}`}>
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
          <div className="reading-popup-titlebar">
            <span className="reading-popup-titlebar-label">DETALLE DE AUDITORÍA</span>
            <h3 className="reading-popup-titlebar-title">
              Clave: <span className="reading-popup-text-secondary">{props.clave_catastral || 'N/A'}</span>
            </h3>
          </div>

          <div className="reading-popup-header">
            <div className="reading-popup-icon" style={{ background: `${markerColor}22`, color: markerColor }}>
              <MarkerIcon size={16} />
            </div>
            <div className="reading-popup-title-block">
              <span className="reading-popup-id">{markerLabel}</span>
              <h4 className="reading-popup-title">{props.numero_medidor || 'Sin medidor'}</h4>
            </div>
          </div>

          <div className="reading-popup-badges">
            <span
              className="reading-popup-badge"
              style={{
                background: `${markerColor}18`,
                color: markerColor,
                border: `1px solid ${markerColor}44`
              }}
            >
              {isCapture ? '✓ Captura GPS' : '✓ Base de datos'}
            </span>
          </div>

          <div className="reading-popup-values">
            {props.hora_lectura && (
              <div className="reading-popup-value-row">
                <span className="reading-popup-value-label">Hora:</span>
                <span className="reading-popup-value">{ConverDateTime(props.hora_lectura)}</span>
              </div>
            )}
            {props.usuario_lectura && (
              <div className="reading-popup-value-row">
                <span className="reading-popup-value-label">Usuario:</span>
                <span className="reading-popup-value">{props.usuario_lectura}</span>
              </div>
            )}
            {props.orden_visita !== undefined && (
              <div className="reading-popup-value-row">
                <span className="reading-popup-value-label">Orden visita:</span>
                <span className="reading-popup-value">#{props.orden_visita}</span>
              </div>
            )}
          </div>

          {props.novedad && (
            <p className="reading-popup-novelty" style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>
              <IoIosWarning size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{props.novedad}</span>
            </p>
          )}

          {onViewDetail && (
            <div className="reading-popup-actions">
              <button
                type="button"
                className="reading-popup-action-btn"
                onClick={(e) => {
                  stopEventPropagation(e);
                  onViewDetail();
                }}
              >
                Ver detalle
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
