import React, { } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  DEFAULT_CONFIG
} from './IncidentMapInstantTooltip';
import { Button } from '@/shared/presentation/components/Button/Button';
import './IncidentMapSidePanel.css';
import { MdCable, MdFactCheck, MdKey, MdLocationOn, MdNoteAdd } from 'react-icons/md';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { truncateText } from '@/shared/utils/text/truncate-text';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { FaListUl } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface IncidentMapSidePanelProps {
  incidents: IncidentDetailRowResponse[];
  selectedIncident: IncidentDetailRowResponse | null;
  onSelect: (incident: IncidentDetailRowResponse) => void;
  onViewDetail?: (incident: IncidentDetailRowResponse) => void;
  onResolve?: (incidentId: string) => void;
  onAddWorkOrder?: (incident: IncidentDetailRowResponse) => void;
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * IncidentMapSidePanel — SRP: lista lateral de incidentes en la vista mapa.
 * Permite seleccionar un incidente para centrarlo en el mapa.
 * OCP: extensible sin modificar (solo agregar props).
 */
export const IncidentMapSidePanel: React.FC<IncidentMapSidePanelProps> = ({
  incidents,
  selectedIncident,
  onSelect,
  onViewDetail,
  onResolve,
  onAddWorkOrder,
  collapsed,
  onToggle
}) => {
  const withCoords = incidents.filter((i) => i.latitude && i.longitude);
  const withoutCoords = incidents.filter((i) => !i.latitude || !i.longitude);

  const navigate = useNavigate();

  return (
    <div className={`incident-side-panel ${collapsed ? 'collapsed' : ''}`}>
      {/* Toggle button */}
      <button
        className="incident-side-panel-toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir panel' : 'Colapsar panel'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!collapsed && (
        <>
          {/* Header */}
          <div className="incident-side-panel-header-container">
            <div className="incident-side-panel-header">
              <AlertTriangle size={16} className="incident-side-panel-icon" />
              <span className="incident-side-panel-title">
                Incidentes Reportados
              </span>
              <span className="incident-side-panel-count">
                {incidents.length}
              </span>
            </div>

            {/* Stats row */}
            <div className="incident-side-panel-stats">
              <div className="incident-stat-pill priority-success">
                <span>
                  {incidents.filter((i) => i.status === 'RESUELTO').length}
                </span>
                <label>Resueltos</label>
              </div>
              <div className="incident-stat-pill priority-warning">
                <span>
                  {incidents.filter((i) => i.status === 'REPORTADO').length}
                </span>
                <label>Reportados</label>
              </div>
              <div className="incident-stat-pill priority-error">
                <span>
                  {
                    incidents.filter((i) => i.currentPriority === 'CRITICA')
                      .length
                  }
                </span>
                <label>Críticos</label>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="incident-side-panel-list">
            {withCoords.length === 0 && withoutCoords.length === 0 && (
              <EmptyState
                message="Sin incidentes para mostrar"
                description='No se han encontrado incidentes para los filtros seleccionados.'
                icon={<AlertTriangle size={24} opacity={0.3} />}
                variant='info'
              />
            )}
            {withCoords.map((incident, idx) => {
              const pCfg =
                PRIORITY_CONFIG[incident.currentPriority] ?? DEFAULT_CONFIG;
              const sCfg = STATUS_CONFIG[incident.status] ?? {
                color: '#6b7280',
                label: incident.status
              };
              const isSelected =
                selectedIncident?.incidentId === incident.incidentId;

              return (
                <div
                  key={idx}
                  className={`incident-item-container ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelect(incident)} // ← SOLO ENFOCAR MAPA
                >
                  {/* Contenido principal */}
                  <div className={`incident-item-bottom`}>
                    <div className="">
                      <div className="incident-item-dot-content">
                        <div
                          className="incident-item-dot"
                          style={{ background: pCfg.color }}
                        />
                        <div className="incident-item-body">
                          <Tooltip
                            content={incident.incidentTypeName}
                            themeColor="primary"
                            position="top"
                            followCursor={false}
                          >
                            <span className="incident-item-type">
                              {truncateText(incident.incidentTypeName, 20)}
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                      <>
                        {incident.incidentCode && (
                          <ColorChip
                            label={incident.incidentCode}
                            size="sm"
                            variant="ghost"
                            icon={<MdKey size={9} />}
                            borderRadius={5}
                          />
                        )}
                        <ColorChip
                          label={
                            incident.connectionId
                              ? incident.connectionId
                              : 'Sin Clave'
                          }
                          size="sm"
                          variant="ghost"
                          icon={<MdCable size={9} />}
                          borderRadius={5}
                        />
                      </>
                    </div>
                    <div className="incident-item-main-info">

                      <span
                        className="incident-item-status"
                        style={{ color: 'var(--color-text-muted) !important' }}
                      >
                        {'ESTADO'}
                      </span>

                      <span
                        className="incident-item-status"
                        style={{ color: sCfg.color }}
                      >
                        {sCfg.label}
                      </span>

                      <Tooltip content={incident.categoryName} themeColor="primary" position="top" followCursor={false}>
                        <span
                          className="incident-item-status"
                          style={{ color: '#6b7280' }}
                        >
                          {truncateText(incident.categoryName, 15)}
                        </span>
                      </Tooltip>
                    </div>

                  </div>

                  <div className="incident-description">
                    <p className="incident-text-description">
                      {truncateText(incident.reportDescription, 60)}
                    </p>
                  </div>

                  <Divider variant="dashed" thickness="thin" />

                  {/* Botones de Acción left */}
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
                              onClick={() => navigate(`/work-orders/search?code=${incident.orderCode}`)}
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

                      <Tooltip
                        themeColor="warning"
                        content="Centrar en el mapa"
                        position="bottom"
                        followCursor={false}
                      >
                        <Button
                          variant="dashed"
                          color="green"
                          size="xs"
                          leftIcon={<MdLocationOn size={18} />}
                          circle
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(incident);
                          }}
                        >
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Incidents without coordinates */}
            {withoutCoords.length > 0 && (
              <div className="incident-side-panel-no-coords">
                <span>{withoutCoords.length} sin coordenadas</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
