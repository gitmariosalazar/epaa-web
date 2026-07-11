import React, { memo, useCallback } from 'react';
import {
  AlertTriangle,
  Calendar,
  MapPin,
  Tag,
  ExternalLink,
  X
} from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  DEFAULT_CONFIG
} from './IncidentMapInstantTooltip';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { Button } from '@/shared/presentation/components/Button/Button';

interface IncidentMapInfoWindowProps {
  incident: IncidentDetailRowResponse;
  theme: string;
  onClose: () => void;
  onViewDetail?: (incident: IncidentDetailRowResponse) => void;
}

/**
 * IncidentMapInfoWindow — SRP: solo renderiza el popup de info del incidente.
 * Se muestra al hacer click en un marcador.
 * ISP: recibe solo los datos que necesita, sin el contexto entero.
 */
export const IncidentMapInfoWindow: React.FC<IncidentMapInfoWindowProps> = memo(
  ({ incident, theme, onClose, onViewDetail }) => {
    const pCfg = PRIORITY_CONFIG[incident.currentPriority] ?? DEFAULT_CONFIG;
    const sCfg = STATUS_CONFIG[incident.status] ?? {
      color: '#6b7280',
      label: incident.status
    };
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

    const handleViewDetail = useCallback(
      (ev: React.MouseEvent) => {
        stopEventPropagation(ev);
        onViewDetail?.(incident);
      },
      [incident, onViewDetail, stopEventPropagation]
    );

    return (
      <div className={`premium-popup ${isDark ? 'dark' : ''}`}>
        <button
          type="button"
          className="incident-popup-close"
          onClick={handleClose}
          onMouseDown={stopEventPropagation}
          onPointerDown={stopEventPropagation}
          aria-label="Cerrar"
        >
          <X size={14} />
        </button>

        <div className="incident-popup-body">
          <div className="incident-popup-titlebar">
            <span className="incident-popup-titlebar-label">
              INFORMACIÓN BÁSICA
            </span>
            <h3 className="incident-popup-titlebar-title">
              Incidente ID: <span className='text-secondary'>{incident.incidentCode}</span>
            </h3>
          </div>

          {/* Header */}
          <div className="incident-popup-header">
            <div
              className="incident-popup-icon"
              style={{
                background: `${pCfg.color}22`,
                border: `1.5px solid ${pCfg.color}55`
              }}
            >
              <AlertTriangle size={16} color={pCfg.color} strokeWidth={2.5} />
            </div>
            <div className="incident-popup-title-block">
              <span className="incident-popup-id">
                ID: {incident.incidentCode}
              </span>
              <h3 className="incident-popup-title">
                {incident.incidentTypeName}
              </h3>
              <span className="incident-popup-category">
                {incident.categoryName}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="incident-popup-badges">
            <span
              className="incident-popup-badge"
              style={{
                background: `${pCfg.color}22`,
                color: pCfg.color,
                border: `1px solid ${pCfg.color}44`
              }}
            >
              {pCfg.label}
            </span>
            <span
              className="incident-popup-badge"
              style={{
                background: `${sCfg.color}22`,
                color: sCfg.color,
                border: `1px solid ${sCfg.color}44`
              }}
            >
              {sCfg.label}
            </span>
          </div>

          {/* Info rows */}
          <div className="incident-popup-info">
            {incident.connectionId && (
              <div className="incident-popup-info-row">
                <Tag size={12} />
                <span>
                  Acometida: <strong>{incident.connectionId}</strong>
                </span>
              </div>
            )}
            {incident.referenceAddress && (
              <div className="incident-popup-info-row">
                <MapPin size={12} />
                <span>{incident.referenceAddress}</span>
              </div>
            )}
            <div className="incident-popup-info-row">
              <Calendar size={12} />
              <span>{ConverDate(incident.reportDate)}</span>
            </div>
          </div>

          {/* Description preview */}
          {incident.reportDescription && (
            <p className="incident-popup-description">
              {incident.reportDescription.length > 80
                ? `${incident.reportDescription.slice(0, 80)}…`
                : incident.reportDescription}
            </p>
          )}

          {/* Action */}
          {onViewDetail && (
            <div
              onMouseDown={stopEventPropagation}
              onPointerDown={stopEventPropagation}
              onClick={stopEventPropagation}
            >
              <Button
                className="incident-popup-action"
                style={{
                  background: `linear-gradient(135deg, ${pCfg.color}dd, ${pCfg.color}aa)`,
                  boxShadow: `0 4px 12px ${pCfg.glow}`
                }}
                onClick={handleViewDetail}
              >
                <ExternalLink size={13} />
                Ver Detalle
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
