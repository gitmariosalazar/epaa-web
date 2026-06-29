import React from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  DEFAULT_CONFIG
} from './IncidentMapInstantTooltip';
import { Button } from '@/shared/presentation/components/Button/Button';
import './IncidentMapSidePanel.css';
import { MdCable, MdKey, MdLocationOn } from 'react-icons/md';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { IoMdEye } from 'react-icons/io';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { truncateText } from '@/shared/utils/text/truncate-text';

interface IncidentMapSidePanelProps {
  incidents: IncidentDetailRowResponse[];
  selectedIncident: IncidentDetailRowResponse | null;
  onSelect: (incident: IncidentDetailRowResponse) => void;
  onViewDetail?: (incident: IncidentDetailRowResponse) => void; // ← Agregar esto
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
  onViewDetail, // ← Recibir
  collapsed,
  onToggle
}) => {
  const withCoords = incidents.filter((i) => i.latitude && i.longitude);
  const withoutCoords = incidents.filter((i) => !i.latitude || !i.longitude);

  console.log(`Selectet: `, selectedIncident);

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
              <div className="incident-side-panel-empty">
                <AlertTriangle size={24} opacity={0.3} />
                <p>Sin incidentes para mostrar</p>
              </div>
            )}
            {withCoords.map((incident) => {
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
                  key={incident.incidentId}
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
                        {incident.incidentId && (
                          <ColorChip
                            label={incident.incidentId}
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
                    </div>
                  </div>

                  <div className="incident-description">
                    <p className="incident-text-description">
                      {truncateText(incident.reportDescription, 60)}
                    </p>
                  </div>

                  <Divider variant="dashed" thickness="thin" />

                  {/* Botones de Acción */}
                  {/* Botones de Acción */}
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
                        leftIcon={<IoMdEye size={18} />}

                        onClick={(e) => {
                          e.stopPropagation(); // ← Muy importante
                          console.log('✅ Botón Ver Detalles clickeado');
                          console.log('onViewDetail existe?', !!onViewDetail);
                          onViewDetail?.(incident);
                        }}
                      >
                        Ver Detalles
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(incident);
                        }}
                      >
                        Ver Ubicación
                      </Button>
                    </Tooltip>
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
