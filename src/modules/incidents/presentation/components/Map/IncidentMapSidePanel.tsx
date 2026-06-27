import React from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import { PRIORITY_CONFIG, STATUS_CONFIG, DEFAULT_CONFIG } from './IncidentMapInstantTooltip';

interface IncidentMapSidePanelProps {
  incidents: IncidentDetailRowResponse[];
  selectedIncident: IncidentDetailRowResponse | null;
  onSelect: (incident: IncidentDetailRowResponse) => void;
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
  collapsed,
  onToggle,
}) => {
  const withCoords = incidents.filter((i) => i.latitude && i.longitude);
  const withoutCoords = incidents.filter((i) => !i.latitude || !i.longitude);

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
          <div className="incident-side-panel-header">
            <AlertTriangle size={16} className="incident-side-panel-icon" />
            <span className="incident-side-panel-title">Incidentes</span>
            <span className="incident-side-panel-count">{incidents.length}</span>
          </div>

          {/* Stats row */}
          <div className="incident-side-panel-stats">
            <div className="incident-stat-pill" style={{ '--stat-color': '#22c55e' } as React.CSSProperties}>
              <span>{incidents.filter((i) => i.status === 'RESUELTO').length}</span>
              <label>Resueltos</label>
            </div>
            <div className="incident-stat-pill" style={{ '--stat-color': '#f59e0b' } as React.CSSProperties}>
              <span>{incidents.filter((i) => i.status === 'REPORTADO').length}</span>
              <label>Reportados</label>
            </div>
            <div className="incident-stat-pill" style={{ '--stat-color': '#ef4444' } as React.CSSProperties}>
              <span>{incidents.filter((i) => i.currentPriority === 'CRITICA').length}</span>
              <label>Críticos</label>
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
              const pCfg = PRIORITY_CONFIG[incident.currentPriority] ?? DEFAULT_CONFIG;
              const sCfg = STATUS_CONFIG[incident.status] ?? { color: '#6b7280', label: incident.status };
              const isSelected = selectedIncident?.incidentId === incident.incidentId;

              return (
                <button
                  key={incident.incidentId}
                  className={`incident-side-panel-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelect(incident)}
                  style={{ '--item-accent': pCfg.color } as React.CSSProperties}
                >
                  <div className="incident-item-dot" style={{ background: pCfg.color }} />
                  <div className="incident-item-body">
                    <span className="incident-item-id">#{incident.incidentId}</span>
                    <span className="incident-item-type">{incident.incidentTypeName}</span>
                    {incident.connectionId && (
                      <span className="incident-item-conn">
                        <MapPin size={9} /> {incident.connectionId}
                      </span>
                    )}
                  </div>
                  <span
                    className="incident-item-status"
                    style={{ color: sCfg.color }}
                  >
                    {sCfg.label}
                  </span>
                </button>
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
