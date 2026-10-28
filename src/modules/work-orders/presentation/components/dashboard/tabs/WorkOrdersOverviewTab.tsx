/**
 * WorkOrdersOverviewTab
 *
 * Tab 1: General Executive Dashboard & Work Order Performance.
 * Clean Architecture — Presentation Layer.
 *
 * SOLID:
 *   SRP: Presentation of global order statistics, distributions and immediate alerts.
 *   DIP: Consumes typed domain models with 0% any.
 */

import React, { useMemo } from 'react';
import {
  ClipboardList,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DonutChart, type DonutSlice } from '@/shared/presentation/components/Charts/DonutChart';
import type {
  ExecutiveImmediateOrder,
  ExecutiveOverview,
  HeaderKpis,
  WorkOrderPriorityStatistic,
  WorkOrderStatusStatistic,
  WorkOrderTypeStatistic
} from '../../../../domain/schemas/models/dashboard/work-order-dashboard.models';
import type { WorkOrdersKeyStatisticsSummary } from '../../../../domain/schemas/models/dashboard/work-order-dashboard.models';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MdOutlineContentPasteSearch } from 'react-icons/md';

interface WorkOrdersOverviewTabProps {
  headerKpis: HeaderKpis | null;
  executiveOverview: ExecutiveOverview | null;
  statusStats: WorkOrderStatusStatistic[];
  priorityStats: WorkOrderPriorityStatistic[];
  workTypeStats: WorkOrderTypeStatistic[];
  keySummary: WorkOrdersKeyStatisticsSummary | null;
  onNavigateToOrder?: (orderCode: string) => void;
  onViewAllOrders?: () => void;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  NOTIFICADA: 'slate',
  PENDIENTE: 'amber',
  ASIGNADA: 'cyan',
  EN_PROCESO: 'blue',
  EN_ESPERA: 'orange',
  EN_SUPERVISION: 'purple',
  COMPLETADA: 'emerald',
  CERRADA: 'teal',
  CANCELADA: 'rose'
};

const PRIORITY_COLOR_MAP: Record<string, string> = {
  EMERGENCIA: 'rose',
  URGENTE: 'orange',
  ALTA: 'amber',
  MEDIA: 'blue',
  BAJA: 'slate'
};

export const WorkOrdersOverviewTab: React.FC<WorkOrdersOverviewTabProps> = ({
  headerKpis,
  executiveOverview,
  statusStats,
  priorityStats,
  workTypeStats,
  keySummary,
  onNavigateToOrder,
  onViewAllOrders
}) => {
  // Aggregate KPIs merging HeaderKpis or KeySummary
  const totalOrders = headerKpis?.totalOrders ?? keySummary?.totalOrders ?? 0;
  const pendingOrAssigned = headerKpis?.pendingOrAssigned ?? keySummary?.pendingOrAssigned ?? 0;
  const inProgress = headerKpis?.inProgress ?? keySummary?.inProgress ?? 0;
  const criticalOrders =
    (headerKpis ? headerKpis.emergency + headerKpis.urgent : null) ??
    (keySummary ? keySummary.emergency + keySummary.urgent : 0);
  const completed = headerKpis?.completed ?? keySummary?.completed ?? 0;
  const completionRate =
    headerKpis?.completionRate ??
    (totalOrders > 0 ? (completed / totalOrders) * 100 : 0);
  const totalMaterialCost = headerKpis?.totalMaterialCost ?? keySummary?.totalMaterialCost ?? 0;
  const avgHours = headerKpis?.avgHoursToComplete ?? keySummary?.avgHoursToComplete ?? null;

  // Donut chart slices for statuses
  const statusSlices: DonutSlice[] = useMemo(() => {
    return statusStats.map((item) => {
      const cleanKey = item.statusId.toUpperCase().replace(/\s+/g, '_');
      const color = STATUS_COLOR_MAP[cleanKey] || 'indigo';
      return {
        label: item.statusName,
        value: item.quantity,
        color,
        fmt: (v) => `${v} OTs (${item.percentageOfTotal.toFixed(1)}%)`
      };
    });
  }, [statusStats]);

  // Donut chart slices for priorities
  const prioritySlices: DonutSlice[] = useMemo(() => {
    return priorityStats.map((item) => {
      const cleanKey = item.priorityLevel.toUpperCase().replace(/\s+/g, '_');
      const color = PRIORITY_COLOR_MAP[cleanKey] || 'slate';
      return {
        label: item.priorityLevel,
        value: item.quantity,
        color,
        fmt: (v) => `${v} OTs (${item.percentageOfTotal.toFixed(1)}%)`
      };
    });
  }, [priorityStats]);

  // Immediate attention orders
  const immediateOrders = executiveOverview?.ordenesAtencionInmediata ?? [];

  return (
    <div className="wo-dashboard">
      {/* 1. Hero KPI Grid */}
      <div className="wo-dashboard__kpi-grid">
        <div className="wo-kpi-card">
          <div
            className="wo-kpi-card__icon"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}
          >
            <ClipboardList size={22} />
          </div>
          <div className="wo-kpi-card__content">
            <span className="wo-kpi-card__label">Total Órdenes</span>
            <span className="wo-kpi-card__value">{totalOrders.toLocaleString()}</span>
            <span className="wo-kpi-card__badge wo-badge--blue">Base total activa</span>
          </div>
        </div>

        <div className="wo-kpi-card">
          <div
            className="wo-kpi-card__icon"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}
          >
            <Clock size={22} />
          </div>
          <div className="wo-kpi-card__content">
            <span className="wo-kpi-card__label">Pendientes / Asignadas</span>
            <span className="wo-kpi-card__value">{pendingOrAssigned.toLocaleString()}</span>
            <span className="wo-kpi-card__badge wo-badge--amber">En cola</span>
          </div>
        </div>

        <div className="wo-kpi-card">
          <div
            className="wo-kpi-card__icon"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#0891b2' }}
          >
            <Activity size={22} />
          </div>
          <div className="wo-kpi-card__content">
            <span className="wo-kpi-card__label">En Proceso en Campo</span>
            <span className="wo-kpi-card__value">{inProgress.toLocaleString()}</span>
            <span className="wo-kpi-card__badge wo-badge--blue">Técnicos en campo</span>
          </div>
        </div>

        <div className="wo-kpi-card">
          <div
            className="wo-kpi-card__icon"
            style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#e11d48' }}
          >
            <AlertTriangle size={22} />
          </div>
          <div className="wo-kpi-card__content">
            <span className="wo-kpi-card__label">Críticas / Emergencias</span>
            <span className="wo-kpi-card__value">{criticalOrders.toLocaleString()}</span>
            <span className="wo-kpi-card__badge wo-badge--rose">Alta prioridad SLA</span>
          </div>
        </div>

        <div className="wo-kpi-card">
          <div
            className="wo-kpi-card__icon"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div className="wo-kpi-card__content">
            <span className="wo-kpi-card__label">Completadas</span>
            <span className="wo-kpi-card__value">{completed.toLocaleString()}</span>
            <span className="wo-kpi-card__badge wo-badge--emerald">Resueltas con éxito</span>
          </div>
        </div>

        <div className="wo-kpi-card">
          <div
            className="wo-kpi-card__icon"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed' }}
          >
            <TrendingUp size={22} />
          </div>
          <div className="wo-kpi-card__content">
            <span className="wo-kpi-card__label">Tasa de Cumplimiento</span>
            <span className="wo-kpi-card__value">{completionRate.toFixed(1)}%</span>
            <span className="wo-kpi-card__badge wo-badge--purple">Efectividad global</span>
          </div>
        </div>

        <div className="wo-kpi-card">
          <div
            className="wo-kpi-card__icon"
            style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#475569' }}
          >
            <DollarSign size={22} />
          </div>
          <div className="wo-kpi-card__content">
            <span className="wo-kpi-card__label">Costo Materiales</span>
            <span className="wo-kpi-card__value">
              ${totalMaterialCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="wo-kpi-card__badge wo-badge--slate">Inversión registrada</span>
          </div>
        </div>

        {avgHours !== null && (
          <div className="wo-kpi-card">
            <div
              className="wo-kpi-card__icon"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5' }}
            >
              <Clock size={22} />
            </div>
            <div className="wo-kpi-card__content">
              <span className="wo-kpi-card__label">Tiempo Promedio Resolución</span>
              <span className="wo-kpi-card__value">{avgHours.toFixed(1)} hrs</span>
              <span className="wo-kpi-card__badge wo-badge--blue">Ciclo total estimado</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Donut Charts Section */}
      <div className="wo-dashboard__grid-2col">
        <div className="wo-card-panel">
          <div className="wo-card-panel__header">
            <h3>Distribución por Estado</h3>
            <span className="wo-card-panel__header-tag">{statusStats.length} estados registrados</span>
          </div>
          {statusSlices.length > 0 ? (
            <DonutChart
              title="Estado de Órdenes de Trabajo"
              slices={statusSlices}
              centerLabel="TOTAL OTs"
              centerValue={totalOrders.toString()}
              description="Proporción de órdenes según su estado actual en el ciclo de vida."
            />
          ) : (
            <div className="wo-empty-card">No hay estadísticas de estado disponibles</div>
          )}
        </div>

        <div className="wo-card-panel">
          <div className="wo-card-panel__header">
            <h3>Distribución por Nivel de Prioridad</h3>
            <span className="wo-card-panel__header-tag">{priorityStats.length} niveles</span>
          </div>
          {prioritySlices.length > 0 ? (
            <DonutChart
              title="Prioridad y SLA (Service Level Agreement)"
              slices={prioritySlices}
              centerLabel="CRÍTICAS"
              centerValue={criticalOrders.toString()}
              description="Distribución de órdenes según su urgencia y compromiso de nivel de servicio."
            />
          ) : (
            <div className="wo-empty-card">No hay estadísticas de prioridad disponibles</div>
          )}
        </div>
      </div>

      {/* 3. Performance by Work Type */}
      <div className="wo-card-panel">
        <div className="wo-card-panel__header">
          <h3>Rendimiento por Tipo de Trabajo</h3>
          <span className="wo-card-panel__header-tag">{workTypeStats.length} tipos activos</span>
        </div>
        {workTypeStats.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {workTypeStats.map((item) => {
              const pct = Math.min(Math.max(item.completionRatePercentage, 0), 100);
              return (
                <div key={item.workTypeId} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem', backgroundColor: 'var(--surface-hover)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.workType}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>{item.completed}</strong> de <strong>{item.quantity}</strong> resueltas ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <Divider variant='dotted' />
                  <ProgressBar
                    value={pct}
                    height="8px"
                    widthSize="full"
                    color={getTrafficLightColor(pct)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="wo-empty-card">No hay desglose por tipo de trabajo registrado</div>
        )}
      </div>

      {/* 4. Attention Needed Immediate Orders */}
      {immediateOrders.length > 0 && (
        <div className="wo-card-panel" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="wo-card-panel__header">
            <h3 style={{ color: '#dc2626' }}>
              <ShieldAlert size={18} />
              Bandeja de Atención Inmediata ({immediateOrders.length} órdenes críticas en riesgo)
            </h3>
            {onViewAllOrders && (
              <button
                type="button"
                onClick={onViewAllOrders}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                Ver todas las órdenes <ChevronRight size={14} />
              </button>
            )}
          </div>
          <div className="wo-table-wrapper">
            <table className="wo-table">
              <thead>
                <tr>
                  <th>Código OT</th>
                  <th>Tipo de Trabajo</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Técnico Asignado</th>
                  <th>Tiempo Transcurrido</th>
                  <th>SLA</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {immediateOrders.map((ord: ExecutiveImmediateOrder) => {
                  const isOverdue = ord.horasTranscurridas > ord.slaHoras;
                  return (
                    <tr key={ord.codigoOrden}>
                      <td style={{ fontWeight: 700 }}>{ord.codigoOrden}</td>
                      <td>{ord.tipoTrabajo}</td>
                      <td>
                        <span className="wo-badge wo-badge--rose">{ord.prioridad}</span>
                      </td>
                      <td>
                        <span className="wo-badge wo-badge--amber">{ord.estado}</span>
                      </td>
                      <td>{ord.tecnico}</td>
                      <td style={{ fontWeight: 600, color: isOverdue ? '#dc2626' : 'var(--text-main)' }}>
                        {ord.horasTranscurridas.toFixed(1)} hrs
                      </td>
                      <td>{ord.slaHoras!.toFixed(1)} hrs</td>
                      <td>
                        {onNavigateToOrder && (
                          <Button
                            type="button"
                            size='xs'
                            variant='dashed'
                            color='cyan'
                            leftIcon={<MdOutlineContentPasteSearch size={16} />}
                            onClick={() => onNavigateToOrder(ord.codigoOrden)}
                          >
                            Inspeccionar
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
