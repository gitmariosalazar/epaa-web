/**
 * IncidentsVsWorkOrdersTab
 *
 * Tab 2: Incidentes vs Órdenes de Trabajo (Trazabilidad y Conversión Operativa)
 * Clean Architecture — Presentation Layer.
 *
 * SOLID:
 *   SRP: Visualizes end-to-end incident funnel, SLA dispatch control, and state discrepancies.
 *   DIP: Uses typed domain entities without any.
 */

import React, { useMemo } from 'react';
import {
  GitPullRequest,
  Timer,
  Share2,
  TableProperties,
  TrafficCone,
  AlertOctagon,
  ArrowRight,
  Globe,
  Smartphone,
  Headphones,
  CheckCircle,
} from 'lucide-react';
import type {
  CategoryDepartmentItem,
  DispatchControlItem,
  FunnelSummary,
  OriginChannelItem,
  StateMatrixItem,
  SyncDiscrepancyItem
} from '../../../../domain/schemas/models/dashboard/work-order-dashboard.models';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { PercentageFormatter } from '@/shared/utils/formatters/PercentageFormatter';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MdOutlineContentPasteSearch } from 'react-icons/md';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

interface IncidentsVsWorkOrdersTabProps {
  funnelSummary: FunnelSummary | null;
  stateMatrix: StateMatrixItem[];
  originChannels: OriginChannelItem[];
  categoryDepartments: CategoryDepartmentItem[];
  syncDiscrepancies: SyncDiscrepancyItem[];
  dispatchControl: DispatchControlItem[];
  searchFilter: string;
  onNavigateToOrder?: (orderCode: string) => void;
}

export const IncidentsVsWorkOrdersTab: React.FC<IncidentsVsWorkOrdersTabProps> = ({
  funnelSummary,
  stateMatrix,
  originChannels,
  categoryDepartments,
  syncDiscrepancies,
  dispatchControl,
  searchFilter,
  onNavigateToOrder
}) => {
  // Filter dispatch control items by search filter
  const filteredDispatch = useMemo(() => {
    if (!searchFilter.trim()) return dispatchControl;
    const q = searchFilter.toLowerCase();
    return dispatchControl.filter(
      (item) =>
        item.codigoIncidente.toLowerCase().includes(q) ||
        (item.codigoOrden && item.codigoOrden.toLowerCase().includes(q)) ||
        item.tecnicoResponsable.toLowerCase().includes(q) ||
        (item.tipoTrabajo && item.tipoTrabajo.toLowerCase().includes(q))
    );
  }, [dispatchControl, searchFilter]);

  const f = funnelSummary;

  const getSemaforoClass = (semaforo: string): string => {
    const s = semaforo.toUpperCase();
    if (s.includes('ROJO') || s.includes('VENCIDA')) return 'wo-badge--rose';
    if (s.includes('AMARILLO') || s.includes('PRECAUCIÓN')) return 'wo-badge--amber';
    return 'wo-badge--emerald';
  };

  const getChannelIcon = (canal: string) => {
    const c = canal.toUpperCase();
    if (c.includes('WEB')) return <Globe size={18} />;
    if (c.includes('LECTURISTA')) return <Smartphone size={18} />;
    if (c.includes('ATENCION')) return <Headphones size={18} />;
    return <Share2 size={18} />;
  };

  const columns: Column<DispatchControlItem>[] = useMemo(
    () => [
      {
        header: 'Incidente',
        accessor: (row) => <span style={{ fontWeight: 700 }}>{row.codigoIncidente}</span>,
      },
      {
        header: 'OT Asignada',
        accessor: (row) => {
          if (row.codigoOrden) {
            return <span style={{ fontWeight: 600 }}>{row.codigoOrden}</span>;
          }
          return <span style={{ color: 'var(--text-muted)' }}>Sin OT</span>;
        },
      },
      {
        header: 'Fecha Reporte',
        accessor: (row) => row.fechaReporte.split('T')[0],
      },
      {
        header: 'Prioridad',
        accessor: (row) => <span className="wo-badge wo-badge--amber">{row.prioridadReporte}</span>,
      },
      {
        header: 'Estado OT',
        accessor: (row) => <span className="wo-badge wo-badge--blue">{row.nombreEstadoOt}</span>,
      },
      {
        header: 'Técnico Responsable',
        accessor: (row) => row.tecnicoResponsable,
      },
      {
        header: 'SLA',
        accessor: (row) => `${row.slaHoras ?? 0} hrs`,
      },
      {
        header: 'Horas Transcurridas',
        accessor: (row) => `${row.horasDesdeReporte?.toFixed(1) ?? 0} hrs`,
      },
      {
        header: 'Semáforo SLA',
        accessor: (row) => <span className={`wo-badge ${getSemaforoClass(row.semaforoSla ?? '')}`}>{row.semaforoSla}</span>,
      },
      {
        header: 'Acción',
        accessor: (row) => {
          if (onNavigateToOrder && row.codigoIncidente) {
            return (
              <Tooltip
                content={'Proximamente...'}
                themeColor="info"
                followCursor={false}
              >
                <Button
                  type="button"
                  size='xs'
                  variant='dashed'
                  color='cyan'
                  disabled={!row.codigoOrden}
                  leftIcon={<MdOutlineContentPasteSearch size={16} />}
                  onClick={() => onNavigateToOrder(row.codigoIncidente)}
                >
                  Ver detalle
                </Button>
              </Tooltip>
            );
          }
          return null;
        },
      },
    ],
    [onNavigateToOrder]
  );

  return (
    <div className="wo-dashboard">
      {/* 1. Funnel Summary Section */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <GitPullRequest size={18} style={{ color: 'var(--accent)' }} />
            Embudo de Conversión de Incidentes Ciudadanos a Órdenes de Trabajo
          </h3>
          <span className="wo-card-panel__header-tag">Trazabilidad de Flujo</span>
        </div>

        {f ? (
          <>
            <div className="wo-funnel">
              <div className="wo-funnel-step">
                <div className="wo-funnel-step__header">
                  <span>1. Reportes</span>
                  <ColorChip
                    label={f.totalReportesIngresados}
                    color="#4C85D5"
                    size='xs'
                    borderRadius={10}
                  />
                </div>
                <div className="wo-funnel-step__value">{f.totalReportesIngresados}</div>
                <div className="wo-funnel-step__footer">Total ingresados</div>
              </div>

              <div className="wo-funnel-step">
                <div className="wo-funnel-step__header">
                  <span>2. En Triaje</span>
                  <ColorChip
                    label='Sin OT'
                    color="#EAB308"
                    size='xs'
                    borderRadius={10}
                  />
                </div>
                <div className="wo-funnel-step__value">{f.reportesEnTriajeSinOt}</div>
                <div className="wo-funnel-step__footer">Por evaluar</div>
              </div>

              <div className="wo-funnel-step">
                <div className="wo-funnel-step__header">
                  <span>3. Con Orden OT</span>
                  <ColorChip
                    label={f.pctTasaConversionAOt ? `${f.pctTasaConversionAOt.toFixed(2)}%` : '—'}
                    color={getTrafficLightColor(f.pctTasaConversionAOt || 0)}
                    size='xs'
                    borderRadius={10}
                  />
                </div>
                <div className="wo-funnel-step__value">{f.reportesConOrdenTrabajo}</div>
                <div className="wo-funnel-step__footer">Tasa de conversión</div>
              </div>

              <div className="wo-funnel-step">
                <div className="wo-funnel-step__header">
                  <span>4. Asignadas</span>
                  <ColorChip
                    label='Técnicos'
                    color="#94A3B8"
                    size='xs'
                    borderRadius={10}
                  />
                </div>
                <div className="wo-funnel-step__value">{f.otAsignadasACuadrilla}</div>
                <div className="wo-funnel-step__footer">Con técnico a cargo</div>
              </div>

              <div className="wo-funnel-step">
                <div className="wo-funnel-step__header">
                  <span>5. En Campo</span>
                  <ColorChip
                    label='Ejecución'
                    color="#A855F7"
                    size='xs'
                    borderRadius={10}
                  />
                </div>
                <div className="wo-funnel-step__value">{f.otEnProcesoEjecucion}</div>
                <div className="wo-funnel-step__footer">Trabajos en marcha</div>
              </div>

              <div className="wo-funnel-step">
                <div className="wo-funnel-step__header">
                  <span>6. Resueltas</span>
                  <ColorChip
                    label={f.pctTasaResolucionGlobal ? `${f.pctTasaResolucionGlobal.toFixed(2)}%` : '—'}
                    color={getTrafficLightColor(f.pctTasaResolucionGlobal || 0)}
                    size='xs'
                    borderRadius={10}
                  />
                </div>
                <div className="wo-funnel-step__value">{f.otCompletadasResueltas}</div>
                <div className="wo-funnel-step__footer">Tasa de resolución</div>
              </div>
            </div>

            {/* Lead Times Banner */}
            <div className="wo-lead-times-banner">
              <div className="wo-lead-time-item">
                <span className="wo-lead-time-item__label">
                  <Timer size={14} /> Triaje a Creación OT
                </span>
                <span className="wo-lead-time-item__val">
                  {f.horasPromedioTriajeACreacionOt !== null
                    ? `${f.horasPromedioTriajeACreacionOt.toFixed(1)} hrs`
                    : '—'}
                </span>
              </div>

              <div className="wo-lead-time-item">
                <span className="wo-lead-time-item__label">
                  <Timer size={14} /> Asignación a Técnico
                </span>
                <span className="wo-lead-time-item__val">
                  {f.horasPromedioAsignacionTecnico !== null
                    ? `${f.horasPromedioAsignacionTecnico.toFixed(1)} hrs`
                    : '—'}
                </span>
              </div>

              <div className="wo-lead-time-item">
                <span className="wo-lead-time-item__label">
                  <Timer size={14} /> Ejecución en Campo
                </span>
                <span className="wo-lead-time-item__val">
                  {f.horasPromedioEjecucionCampo !== null
                    ? `${f.horasPromedioEjecucionCampo.toFixed(1)} hrs`
                    : '—'}
                </span>
              </div>

              <div className="wo-lead-time-item wo-lead-time-item--highlight">
                <span className="wo-lead-time-item__label">
                  <CheckCircle size={14} /> Ciclo Completo Total
                </span>
                <span className="wo-lead-time-item__val">
                  {f.horasPromedioCicloCompletoResolucion !== null
                    ? `${f.horasPromedioCicloCompletoResolucion.toFixed(1)} hrs`
                    : '—'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="wo-empty-card">No hay datos del embudo de conversión disponibles</div>
        )}
      </div>

      {/* 2. Origin Channels Grid */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <Share2 size={18} style={{ color: 'var(--accent)' }} />
            Rendimiento por Canal de Ingreso de Reportes
          </h3>
          <span className="wo-card-panel__header-tag">{originChannels.length} canales activos</span>
        </div>

        {originChannels.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {originChannels.map((c) => {
              const conv = c.tasaConversionOtPct ?? 0;
              const exit = c.tasaExitoResolucionPct ?? 0;
              return (
                <div
                  key={c.canalOrigen}
                  style={{
                    backgroundColor: 'var(--surface-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--accent)' }}>{getChannelIcon(c.canalOrigen)}</span>
                      <span>{c.canalOrigen}</span>
                    </div>
                    <span className="wo-badge wo-badge--blue">{c.totalReportes} reportes</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Con OT asignada:</span>
                    <strong>{c.conOrdenTrabajo} ({conv.toFixed(1)}%)</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Resueltos con éxito:</span>
                    <strong style={{ color: '#059669' }}>{c.totalResueltos} ({exit.toFixed(1)}%)</strong>
                  </div>

                  {c.horasPromedioResolucion !== null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Tiempo medio:</span>
                      <strong>{c.horasPromedioResolucion.toFixed(1)} hrs</strong>
                    </div>
                  )}
                  <div className="db-progress-bar-wrapper">
                    <ProgressBar
                      height="1.25rem"
                      widthSize="full"
                      value={conv}
                      color={getTrafficLightColor(conv)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="wo-empty-card">No hay estadísticas de canales de origen disponibles</div>
        )}
      </div>

      {/* 3. Cross State Matrix */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <TableProperties size={18} style={{ color: 'var(--accent)' }} />
            Matriz Cruzada: Estado del Incidente vs Estado de la Orden de Trabajo
          </h3>
          <span className="wo-card-panel__header-tag">{stateMatrix.length} combinaciones</span>
        </div>

        {stateMatrix.length > 0 ? (
          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Estado Incidente</th>
                  <th style={{ width: '24px' }}></th>
                  <th>Estado Orden de Trabajo</th>
                  <th>Cantidad</th>
                  <th>% del Total</th>
                  <th>Días Abierto</th>
                  <th>Críticos</th>
                  <th>Diagnóstico Operativo</th>
                </tr>
              </thead>
              <tbody>
                {stateMatrix.map((item, idx) => {
                  const isAlert = item.diagnosticoOperativo.toUpperCase().includes('ALERTA');
                  return (
                    <tr key={`${item.estadoIncidente}-${item.estadoOrdenTrabajo}-${idx}`}>
                      <td>
                        <ColorChip
                          label={item.estadoIncidente}
                          color={'gray'}
                          size='xs'
                        />
                      </td>
                      <td>
                        <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                      </td>
                      <td>
                        <ColorChip
                          label={item.nombreEstadoOt}
                          color={'#3b82f6'}
                          size='xs'
                        />
                      </td>
                      <td style={{ fontWeight: 700 }}>{item.cantidadReportes}</td>
                      <td>
                        <ColorChip
                          label={PercentageFormatter.formatWithDecimals(item.porcentajeDelTotalReportes / 100)}
                          color={getTrafficLightColor(item.porcentajeDelTotalReportes)}
                          size='xs'
                        />
                      </td>
                      <td>{item.diasPromedioAbierto !== null ? `${item.diasPromedioAbierto.toFixed(1)} d` : '—'}</td>
                      <td>
                        {item.criticosEnEstaEtapa > 0 ? (
                          <span className="wo-badge wo-badge--rose">{item.criticosEnEstaEtapa}</span>
                        ) : (
                          '0'
                        )}
                      </td>
                      <td style={{ fontWeight: isAlert ? 700 : 400, color: isAlert ? '#dc2626' : 'inherit' }}>
                        {item.diagnosticoOperativo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="wo-empty-card">No hay datos en la matriz cruzada</div>
        )}
      </div>

      {/* 4. Dispatch Control Tray with SLA Semaphore */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>
            <TrafficCone size={18} style={{ color: 'var(--accent)' }} />
            Bandeja de Control de Despacho (Semáforo SLA)
          </h3>
          <span className="wo-card-panel__header-tag">{filteredDispatch.length} órdenes en seguimiento</span>
        </div>

        <Table<DispatchControlItem>
          data={filteredDispatch}
          columns={columns}
          pagination
          pageSize={15}
          emptyState={
            <EmptyState
              message="No se encontraron lecturas completadas."
              description="Intenta ajustar los filtros de búsqueda para ver los resultados."
              icon={IoInformationCircleOutline}
              variant="info"
            />
          }
        />
      </div>

      {/* 5. Sync Discrepancies Alert */}
      {syncDiscrepancies.length > 0 && (
        <div className="wo-card-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="wo-card-panel__header">
            <h3 style={{ color: '#d97706' }}>
              <AlertOctagon size={18} />
              Desfases de Sincronización entre Incidentes y OTs ({syncDiscrepancies.length} detectados)
            </h3>
            <span className="wo-card-panel__header-tag">Auditoría Operativa</span>
          </div>

          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Incidente</th>
                  <th>Código OT</th>
                  <th>Estado Incidente</th>
                  <th>Estado OT</th>
                  <th>Tipo de Desfase</th>
                  <th>Técnico Asignado</th>
                  <th>Fecha Reporte</th>
                </tr>
              </thead>
              <tbody>
                {syncDiscrepancies.map((disc, idx) => (
                  <tr key={`${disc.codigoIncidente}-${disc.codigoOrden}-${idx}`}>
                    <td style={{ fontWeight: 700 }}>{disc.codigoIncidente}</td>
                    <td style={{ fontWeight: 600 }}>{disc.codigoOrden}</td>
                    <td>
                      <span className="wo-badge wo-badge--slate">{disc.estadoIncidente}</span>
                    </td>
                    <td>
                      <span className="wo-badge wo-badge--blue">{disc.estadoOt}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#d97706' }}>{disc.tipoDesfase}</td>
                    <td>{disc.tecnicoAsignado}</td>
                    <td>{disc.fechaReporte.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Problem Categories vs Departments */}
      {categoryDepartments.length > 0 && (
        <div className="wo-card-panel">
          <div className="wo-card-panel__header">
            <h3>Categorías de Problemas por Departamento Ejecutor</h3>
            <span className="wo-card-panel__header-tag">{categoryDepartments.length} categorías</span>
          </div>
          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Tipo Problema</th>
                  <th>Departamento</th>
                  <th>Incidentes</th>
                  <th>OTs Creadas</th>
                  <th>En Campo</th>
                  <th>Completadas</th>
                  <th>% Cumplimiento</th>
                  <th>Costo Reparación</th>
                </tr>
              </thead>
              <tbody>
                {categoryDepartments.map((cat, idx) => (
                  <tr key={`${cat.categoriaProblema}-${cat.tipoProblema}-${idx}`}>
                    <td style={{ fontWeight: 600 }}>{cat.categoriaProblema}</td>
                    <td>{cat.tipoProblema}</td>
                    <td>
                      <span className="wo-badge wo-badge--slate">{cat.departamentoResponsable}</span>
                    </td>
                    <td>{cat.totalIncidentes}</td>
                    <td>{cat.totalOtsCreadas}</td>
                    <td>{cat.otsEnProcesoCampo}</td>
                    <td style={{ fontWeight: 600 }}>{cat.totalCompletados}</td>
                    <td>
                      <ColorChip
                        label={cat.pctCumplimiento !== null ? `${(cat.pctCumplimiento ?? 0).toFixed(2)}%` : '—'}
                        color={getTrafficLightColor(cat.pctCumplimiento ?? 0)}
                        size='xs'
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      ${cat.costoReparacionAcumulado.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
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
