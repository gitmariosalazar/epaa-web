import React, { memo, useCallback } from 'react';
import {
  AlertTriangle,
  Calendar,
  MapPin,
  Tag,
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

// Styles
import './IncidentMapInfoWindow.css';
import { Alert } from '@/shared/presentation/components/Alert';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { MdFactCheck, MdNoteAdd } from 'react-icons/md';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaListUl } from 'react-icons/fa';

interface IncidentMapInfoWindowProps {
  incident: IncidentDetailRowResponse;
  theme: string;
  onClose: () => void;
  onViewDetail?: (incident: IncidentDetailRowResponse) => void;
  onViewOrder: (orderCode: string) => void;

  onResolve?: (incidentId: string) => void;
  onAddWorkOrder?: (incident: IncidentDetailRowResponse) => void;
}

/**
 * IncidentMapInfoWindow — SRP: solo renderiza el popup de info del incidente.
 * Se muestra al hacer click en un marcador.
 * ISP: recibe solo los datos que necesita, sin el contexto entero.
 */
export const IncidentMapInfoWindow: React.FC<IncidentMapInfoWindowProps> = memo(
  ({
    incident,
    theme,
    onClose,
    onViewDetail,
    onViewOrder,
    onResolve,
    onAddWorkOrder
  }) => {
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
              Incidente ID:{' '}
              <span className="text-secondary">{incident.incidentCode}</span>
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

          {
            incident.orderCode === null && (
              <Alert
                type='warning'
                size='small'
                className='heartbeat-alert'
                dismissible={false}
                message="El reporte no tiene una orden de trabajo, por favor asigne un técnico inspector"
              />
            )
          }

          {
            incident.orderCode !== null && (
              <div className="incident-work-order-form">
                <Alert
                  type='info'
                  size='small'
                  dismissible={false}
                  message={`El incidente tiene una orden de trabajo: ${incident.orderCode}`}
                />
              </div>
            )
          }

          {/* Action */}
          <div className="incident-action-buttons" style={{ position: 'relative', zIndex: 10 }}>
            <div className="card-incidents-actions-left">
              {
                incident.orderCode && (
                  <Tooltip
                    themeColor="warning"
                    content="Ver Orden de Trabajo"
                    position="bottom"
                    followCursor={false}
                  >
                    <ColorChip
                      label={incident.orderCode}
                      color={incident.currentOrderState === 'COMPLETADA' ? 'green' : 'amber'}
                      variant="ghost"
                      size="xs"
                      borderRadius={5}
                      onClick={() => onViewOrder(incident.orderCode!)}
                    />
                  </Tooltip>
                )
              }
              {incident.currentOrderState == 'COMPLETADA' && incident.status != 'RESUELTO' && (
                <Tooltip
                  themeColor="warning"
                  content="Resolver Incidente"
                  position="bottom"
                  followCursor={false}
                >
                  <Button
                    variant="dashed"
                    color="amber"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve?.(incident.incidentId);
                    }}
                    leftIcon={<MdFactCheck size={16} />}
                    circle
                  >
                  </Button>
                </Tooltip>
              )}
              {
                !incident.orderCode && incident.status != 'RESUELTO' && incident.status !== 'FALSO_REPORTE' && (
                  <Tooltip
                    themeColor="warning"
                    content="Agregar Orden de Trabajo"
                    position="bottom"
                    followCursor={false}
                  >
                    <Button
                      variant="dashed"
                      color="green"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddWorkOrder?.(incident);
                      }}
                      leftIcon={<MdNoteAdd size={16} />}
                      circle
                    >
                    </Button>
                  </Tooltip>
                )
              }
            </div>
            {/* Botones de Acción right */}
            <div className="card-incidents-actions">
              <Tooltip
                themeColor="warning"
                content="Ver detalles del incidente reportado"
                position="bottom"
                followCursor={false}
              >
                <Button
                  variant="dashed"
                  size="xs"
                  leftIcon={<FaListUl size={12} />}
                  circle

                  onClick={(e) => {
                    e.stopPropagation(); // ← Muy importante
                    onViewDetail?.(incident);
                  }}
                >
                </Button>
              </Tooltip>
            </div>
          </div>

        </div>
      </div>
    );
  }
);
