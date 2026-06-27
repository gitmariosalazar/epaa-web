import React from 'react';
import {
  AlertTriangle,
  Calendar,
  MapPin,
  Tag,
  X,
  ExternalLink,
} from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import { PRIORITY_CONFIG, STATUS_CONFIG, DEFAULT_CONFIG } from './IncidentMapInstantTooltip';
import { ConverDate } from '@/shared/utils/datetime/ConverDate';

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
export const IncidentMapInfoWindow: React.FC<IncidentMapInfoWindowProps> = ({
  incident,
  theme,
  onClose,
  onViewDetail,
}) => {
  const pCfg = PRIORITY_CONFIG[incident.currentPriority] ?? DEFAULT_CONFIG;
  const sCfg = STATUS_CONFIG[incident.status] ?? { color: '#6b7280', label: incident.status };
  const isDark = theme === 'dark';

  return (
    <div className={`incident-popup ${isDark ? 'dark' : ''}`}>
      {/* Color accent bar based on priority */}
      <div
        className="incident-popup-accent"
        style={{ background: pCfg.color }}
      />

      {/* Close button */}
      <button className="incident-popup-close" onClick={onClose} aria-label="Cerrar">
        <X size={14} />
      </button>

      <div className="incident-popup-body">
        {/* Header */}
        <div className="incident-popup-header">
          <div
            className="incident-popup-icon"
            style={{ background: `${pCfg.color}22`, border: `1.5px solid ${pCfg.color}55` }}
          >
            <AlertTriangle size={16} color={pCfg.color} strokeWidth={2.5} />
          </div>
          <div className="incident-popup-title-block">
            <span className="incident-popup-id">#{incident.incidentId}</span>
            <h3 className="incident-popup-title">{incident.incidentTypeName}</h3>
            <span className="incident-popup-category">{incident.categoryName}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="incident-popup-badges">
          <span
            className="incident-popup-badge"
            style={{
              background: `${pCfg.color}22`,
              color: pCfg.color,
              border: `1px solid ${pCfg.color}44`,
            }}
          >
            {pCfg.label}
          </span>
          <span
            className="incident-popup-badge"
            style={{
              background: `${sCfg.color}22`,
              color: sCfg.color,
              border: `1px solid ${sCfg.color}44`,
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
              <span>Acometida: <strong>{incident.connectionId}</strong></span>
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
          <button
            className="incident-popup-action"
            style={{
              background: `linear-gradient(135deg, ${pCfg.color}dd, ${pCfg.color}aa)`,
              boxShadow: `0 4px 12px ${pCfg.glow}`,
            }}
            onClick={() => onViewDetail(incident)}
          >
            <ExternalLink size={13} />
            Ver Detalle
          </button>
        )}
      </div>
    </div>
  );
};
