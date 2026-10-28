/**
 * TechniciansAndSlaTab
 *
 * Tab 3: Cuadrillas, Técnicos de Campo, Monitoreo SLA y Calidad.
 * Clean Architecture — Presentation Layer.
 *
 * SOLID:
 *   SRP: Presentation of field workforce performance, SLA monitors and quality audits.
 *   DIP: Uses typed domain entities without any.
 */

import React, { useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Eye,
  CheckCircle
} from 'lucide-react';
import type {
  CrewAssignmentItem,
  EscalationAuditItem,
  QualityIndicatorItem,
  SlaMonitorItem,
  TechnicianPerformanceItem
} from '../../../../domain/schemas/models/dashboard/work-order-dashboard.models';

interface TechniciansAndSlaTabProps {
  technicianPerformance: TechnicianPerformanceItem[];
  crewAssignments: CrewAssignmentItem[];
  slaMonitor: SlaMonitorItem[];
  qualityIndicators: QualityIndicatorItem[];
  escalationAudit: EscalationAuditItem[];
  searchFilter: string;
  onNavigateToOrder?: (orderCode: string) => void;
}

export const TechniciansAndSlaTab: React.FC<TechniciansAndSlaTabProps> = ({
  technicianPerformance,
  crewAssignments,
  slaMonitor,
  qualityIndicators,
  escalationAudit,
  searchFilter,
  onNavigateToOrder
}) => {
  // Filter technicians by search filter
  const filteredTechs = useMemo(() => {
    if (!searchFilter.trim()) return technicianPerformance;
    const q = searchFilter.toLowerCase();
    return technicianPerformance.filter(
      (t) =>
        t.nombreTecnico.toLowerCase().includes(q) ||
        (t.cedula && t.cedula.toLowerCase().includes(q)) ||
        (t.telefonoInterno && t.telefonoInterno.includes(q))
    );
  }, [technicianPerformance, searchFilter]);

  const getSlaBadgeClass = (semaforo: string): string => {
    const s = semaforo.toUpperCase();
    if (s.includes('VENCIDA') || s.includes('INCUMPLIDA') || s.includes('ROJO')) return 'wo-badge--rose';
    if (s.includes('RIESGO') || s.includes('PRECAUCIÓN') || s.includes('AMARILLO')) return 'wo-badge--amber';
    return 'wo-badge--emerald';
  };

  return (
    <div className="wo-dashboard">
      {/* 1. Technician Workload & Performance Section */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <Users size={18} style={{ color: 'var(--accent)' }} />
            Carga Operativa y Rendimiento de Técnicos de Campo
          </h3>
          <span className="wo-card-panel__header-tag">{filteredTechs.length} técnicos activos</span>
        </div>

        {filteredTechs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {filteredTechs.map((t) => {
              const sla = t.tasaCumplimientoSlaPct ?? 0;
              const initials = t.nombreTecnico
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={t.idTecnico}
                  style={{
                    backgroundColor: 'var(--surface-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  {/* Header info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="wo-avatar-badge">{initials || 'T'}</div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {t.nombreTecnico}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Cédula: {t.cedula || 'S/N'} • Ext: {t.telefonoInterno || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`wo-badge ${sla >= 85 ? 'wo-badge--emerald' : sla >= 70 ? 'wo-badge--amber' : 'wo-badge--rose'
                        }`}
                    >
                      {sla.toFixed(1)}% SLA
                    </span>
                  </div>

                  {/* Workload metric grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '0.5rem',
                      backgroundColor: 'var(--surface)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'block' }}>
                        Por Iniciar
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: '#d97706' }}>{t.ordenesPorIniciar}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'block' }}>
                        En Curso
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: '#2563eb' }}>{t.ordenesEnEjecucionHoy}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'block' }}>
                        En Pausa
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: '#ea580c' }}>{t.ordenesEnPausa}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', display: 'block' }}>
                        En cola
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: 'var(--text-main)' }}>{t.totalBacklogActivo}</strong>
                    </div>
                  </div>

                  {/* Monthly totals and field hours */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>
                      Completadas este mes: <strong style={{ color: '#059669' }}>{t.completadasEsteMes}</strong> ({t.totalCompletadas} históricas)
                    </span>
                    {t.horasPromedioEnCampo !== null && (
                      <span>
                        Promedio en campo: <strong>{t.horasPromedioEnCampo.toFixed(1)} hrs</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="wo-empty-card">No hay técnicos asignados que coincidan con la búsqueda</div>
        )}
      </div>

      {/* 2. SLA Monitor Tray */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
            Monitor de Semáforo de SLA por Orden Activa
          </h3>
          <span className="wo-card-panel__header-tag">{slaMonitor.length} órdenes bajo monitoreo</span>
        </div>

        {slaMonitor.length > 0 ? (
          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Código OT</th>
                  <th>Tipo de Trabajo</th>
                  <th>Departamento</th>
                  <th>Prioridad</th>
                  <th>Técnico Asignado</th>
                  <th>Fecha Creación</th>
                  <th>SLA</th>
                  <th>Transcurrido</th>
                  <th>Holgura SLA</th>
                  <th>Semáforo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {slaMonitor.map((item) => (
                  <tr key={item.codigoOrden}>
                    <td style={{ fontWeight: 700 }}>{item.codigoOrden}</td>
                    <td>{item.tipoTrabajo}</td>
                    <td>
                      <span className="wo-badge wo-badge--slate">{item.departamento}</span>
                    </td>
                    <td>
                      <span className="wo-badge wo-badge--amber">{item.prioridad}</span>
                    </td>
                    <td>{item.tecnicoAsignado}</td>
                    <td>{item.fechaCreacion.split('T')[0]}</td>
                    <td>{item.slaHoras} hrs</td>
                    <td style={{ fontWeight: 600 }}>{item.horasTranscurridas.toFixed(1)} hrs</td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: item.horasHolguraSla < 0 ? '#dc2626' : item.horasHolguraSla < 4 ? '#d97706' : '#059669'
                      }}
                    >
                      {item.horasHolguraSla > 0 ? `+${item.horasHolguraSla.toFixed(1)} hrs` : `${item.horasHolguraSla.toFixed(1)} hrs`}
                    </td>
                    <td>
                      <span className={`wo-badge ${getSlaBadgeClass(item.estadoSlaSemaforo)}`}>
                        {item.estadoSlaSemaforo}
                      </span>
                    </td>
                    <td>
                      {onNavigateToOrder && (
                        <button
                          type="button"
                          onClick={() => onNavigateToOrder(item.codigoOrden)}
                          className="wo-badge wo-badge--blue"
                          style={{ cursor: 'pointer', background: 'none' }}
                          title="Inspeccionar orden"
                        >
                          <Eye size={12} /> Ver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="wo-empty-card">No hay órdenes en riesgo o fuera de SLA en este momento</div>
        )}
      </div>

      {/* 3. Quality Indicators and Inspections */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <FileCheck size={18} style={{ color: 'var(--accent)' }} />
            Indicadores de Control de Calidad y Pre-Inspecciones
          </h3>
          <span className="wo-card-panel__header-tag">{qualityIndicators.length} departamentos auditados</span>
        </div>

        {qualityIndicators.length > 0 ? (
          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Tipo Trabajo</th>
                  <th>Inspeccionadas</th>
                  <th>Pre-Inspecciones</th>
                  <th>Pre Aprobadas</th>
                  <th>Pre Rechazadas</th>
                  <th>% Pre-Inspección</th>
                  <th>Controles Calidad</th>
                  <th>Calidad OK</th>
                  <th>Retrabajos</th>
                  <th>% Calidad Final</th>
                </tr>
              </thead>
              <tbody>
                {qualityIndicators.map((qi, idx) => {
                  const prePct = qi.pctAprobacionPreinspeccion ?? 0;
                  const finalPct = qi.pctAprobacionCalidadFinal ?? 0;
                  return (
                    <tr key={`${qi.departamento}-${qi.tipoTrabajo}-${idx}`}>
                      <td style={{ fontWeight: 600 }}>{qi.departamento}</td>
                      <td>{qi.tipoTrabajo}</td>
                      <td>{qi.totalOrdenesInspeccionadas}</td>
                      <td>{qi.totalInspeccionesPreparacion}</td>
                      <td style={{ color: '#059669', fontWeight: 600 }}>{qi.preinspeccionesAprobadas}</td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>{qi.preinspeccionesRechazadas}</td>
                      <td>
                        <span className={`wo-badge ${prePct >= 80 ? 'wo-badge--emerald' : 'wo-badge--amber'}`}>
                          {prePct.toFixed(1)}%
                        </span>
                      </td>
                      <td>{qi.totalControlesCalidad}</td>
                      <td style={{ color: '#059669', fontWeight: 600 }}>{qi.trabajosCalidadAprobados}</td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>{qi.trabajosCalidadRechazadosRetrabajo}</td>
                      <td>
                        <span className={`wo-badge ${finalPct >= 85 ? 'wo-badge--emerald' : 'wo-badge--rose'}`}>
                          {finalPct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="wo-empty-card">No hay registros de control de calidad disponibles</div>
        )}
      </div>

      {/* 4. Supervisor Escalation Audit */}
      {escalationAudit.length > 0 && (
        <div className="wo-card-panel" style={{ borderLeft: '4px solid #f43f5e' }}>
          <div className="wo-card-panel__header">
            <h3 style={{ color: '#e11d48' }}>
              <AlertTriangle size={18} />
              Auditoría de Escalamiento a Supervisores ({escalationAudit.length} casos)
            </h3>
            <span className="wo-card-panel__header-tag">Auditoría de Excepciones</span>
          </div>

          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Código OT</th>
                  <th>Tipo Trabajo</th>
                  <th>Departamento</th>
                  <th>Estado Actual</th>
                  <th>Fecha Creación</th>
                  <th>Técnico que Escaló</th>
                  <th>Motivo de Escalamiento</th>
                </tr>
              </thead>
              <tbody>
                {escalationAudit.map((esc) => (
                  <tr key={esc.codigoOrden}>
                    <td style={{ fontWeight: 700 }}>{esc.codigoOrden}</td>
                    <td>{esc.tipoTrabajo}</td>
                    <td>
                      <span className="wo-badge wo-badge--slate">{esc.departamento}</span>
                    </td>
                    <td>
                      <span className="wo-badge wo-badge--amber">{esc.estadoActual}</span>
                    </td>
                    <td>{esc.fechaCreacion.split('T')[0]}</td>
                    <td style={{ fontWeight: 600 }}>{esc.tecnicoQueEscalo || 'No especificado'}</td>
                    <td style={{ color: '#e11d48', fontWeight: 600 }}>{esc.motivoEscalamiento || 'Sin motivo reportado'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Crew Assignments Overview */}
      {crewAssignments.length > 0 && (
        <div className="wo-card-panel">
          <div className="wo-card-panel__header">
            <h3>Composición de Técnicos por Orden Activa</h3>
            <span className="wo-card-panel__header-tag">{crewAssignments.length} asignaciones</span>
          </div>

          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Código OT</th>
                  <th>Estado OT</th>
                  <th>Tipo Trabajo</th>
                  <th>Trabajador</th>
                  <th>Cédula</th>
                  <th>Rol en Cuadrilla</th>
                  <th>Responsable</th>
                  <th>Fecha Asignación</th>
                </tr>
              </thead>
              <tbody>
                {crewAssignments.map((ca, idx) => (
                  <tr key={`${ca.codigoOrden}-${ca.nombreTrabajador}-${idx}`}>
                    <td style={{ fontWeight: 700 }}>{ca.codigoOrden}</td>
                    <td>
                      <span className="wo-badge wo-badge--blue">{ca.estadoOt}</span>
                    </td>
                    <td>{ca.tipoTrabajo}</td>
                    <td style={{ fontWeight: 600 }}>{ca.nombreTrabajador}</td>
                    <td>{ca.cedula || '—'}</td>
                    <td>{ca.rolEnCuadrilla || 'Técnico'}</td>
                    <td>
                      {ca.esResponsable ? (
                        <span className="wo-badge wo-badge--emerald">
                          <CheckCircle size={12} /> Líder
                        </span>
                      ) : (
                        <span className="wo-badge wo-badge--slate">Operativo</span>
                      )}
                    </td>
                    <td>{ca.fechaAsignacion ? ca.fechaAsignacion.split('T')[0] : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
