/**
 * SolicitudWorkOrderCard
 *
 * Clean Architecture — Presentation layer only.
 *   Receives data as props; zero business logic.
 *
 * SOLID:
 *   SRP  : renders work orders only, nothing else.
 *   OCP  : new OT states → just add to WORK_ORDER_ESTADO_CONFIG below.
 *   DIP  : depends on the domain model type, not any concrete implementation.
 *
 * Mirrors exactly the same composition pattern as SolicitudMetricsCard,
 * SolicitudTechnicalReportCard, and SolicitudTimelineCard.
 */
import React from 'react';
import {
  Wrench,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Hash,
  Hourglass,
} from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type { SolicitudOrdenTrabajoResponse } from '../../../domain/models/Solicitud';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SolicitudWorkOrderCardProps {
  workOrders: SolicitudOrdenTrabajoResponse[];
}

// ─── Estado config (OCP: add new states here, nowhere else) ───────────────────

interface EstadoOtConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
}

const getEstadoOtConfig = (estado: string): EstadoOtConfig => {
  const code = estado?.toUpperCase() ?? '';

  if (code.includes('PENDIENTE') || code === 'PENDIENTE_ASIGNACION')
    return { label: 'Pendiente Asignación', color: '#94a3b8', icon: <Hourglass size={13} /> };
  if (code.includes('ASIGNADA') || code.includes('ASIGNADO'))
    return { label: 'Asignada',            color: '#3b82f6', icon: <User size={13} /> };
  if (code.includes('PROCESO') || code.includes('EN_CURSO') || code.includes('INICIADA'))
    return { label: 'En Proceso',          color: '#8b5cf6', icon: <Play size={13} /> };
  if (code.includes('COMPLETADA') || code.includes('FINALIZADA') || code.includes('CERRADA'))
    return { label: 'Completada',          color: '#10b981', icon: <CheckCircle2 size={13} /> };
  if (code.includes('FALLIDA') || code.includes('CANCELADA') || code.includes('ANULADA'))
    return { label: 'Cancelada',           color: '#ef4444', icon: <AlertCircle size={13} /> };

  return { label: estado ?? 'Sin estado', color: '#64748b', icon: <Clock size={13} /> };
};

// ─── Tipo config ──────────────────────────────────────────────────────────────

const TIPO_OT_LABELS: Record<string, { label: string; color: string }> = {
  INSPECCION:  { label: 'Inspección',  color: '#6366f1' },
  INSTALACION: { label: 'Instalación', color: '#f97316' },
  MANTENIMIENTO: { label: 'Mantenimiento', color: '#06b6d4' },
  REPARACION:  { label: 'Reparación',  color: '#ec4899' },
};

const getTipoOtConfig = (tipo: string) =>
  TIPO_OT_LABELS[tipo?.toUpperCase()] ?? { label: tipo ?? 'OT', color: '#64748b' };

// ─── Prioridad config ──────────────────────────────────────────────────────────

const PRIORIDAD_COLORS: Record<string, string> = {
  ALTA:   '#ef4444',
  MEDIA:  '#f59e0b',
  BAJA:   '#10b981',
  URGENTE:'#dc2626',
};

const getPrioridadColor = (prioridad: string) =>
  PRIORIDAD_COLORS[prioridad?.toUpperCase()] ?? '#64748b';

// ─── Date helper ──────────────────────────────────────────────────────────────

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ─── Sub-component: single OT row ────────────────────────────────────────────

interface WorkOrderRowProps {
  workOrder: SolicitudOrdenTrabajoResponse;
  isFirst: boolean;
}

const WorkOrderRow: React.FC<WorkOrderRowProps> = ({ workOrder, isFirst }) => {
  const estadoConfig = getEstadoOtConfig(workOrder.estadoOt);
  const tipoConfig   = getTipoOtConfig(workOrder.tipoOrden);
  const prioColor    = getPrioridadColor(workOrder.prioridad);

  return (
    <div className={`sol-wo-row${isFirst ? ' sol-wo-row--active' : ''}`}>
      {/* ── Left accent strip colored by tipo ── */}
      <div
        className="sol-wo-row__accent"
        style={{ background: tipoConfig.color }}
      />

      {/* ── Main body ── */}
      <div className="sol-wo-row__body">

        {/* Top: code + chips */}
        <div className="sol-wo-row__top">
          <div className="sol-wo-row__code-group">
            <Hash size={12} className="sol-wo-row__hash-icon" />
            <span className="sol-wo-row__code">{workOrder.codigoOrden}</span>
          </div>
          <div className="sol-wo-row__chips">
            {/* Tipo OT */}
            <ColorChip
              label={tipoConfig.label}
              variant="soft"
              size="xs"
              color={tipoConfig.color}
              borderRadius={6}
            />
            {/* Estado */}
            <ColorChip
              label={estadoConfig.label}
              variant="soft"
              size="xs"
              color={estadoConfig.color}
              borderRadius={6}
              icon={estadoConfig.icon}
              withDot
            />
            {/* Prioridad */}
            {workOrder.prioridad && (
              <ColorChip
                label={workOrder.prioridad}
                variant="soft"
                size="xs"
                color={prioColor}
                borderRadius={6}
              />
            )}
          </div>
        </div>

        {/* Middle: description */}
        {workOrder.descripcion && (
          <p className="sol-wo-row__desc">{workOrder.descripcion}</p>
        )}

        {/* Bottom: metadata grid */}
        <div className="sol-wo-row__meta">
          <div className="sol-wo-row__meta-item">
            <User size={12} className="sol-wo-row__meta-icon" />
            <span className="sol-wo-row__meta-label">Técnico:</span>
            <span className="sol-wo-row__meta-value">
              {workOrder.tecnicoAsignado ?? 'Sin asignar'}
            </span>
          </div>
          <div className="sol-wo-row__meta-item">
            <Calendar size={12} className="sol-wo-row__meta-icon" />
            <span className="sol-wo-row__meta-label">Creada:</span>
            <span className="sol-wo-row__meta-value">
              {formatDate(workOrder.fechaCreacion)}
            </span>
          </div>
          {workOrder.fechaAsignacion && (
            <div className="sol-wo-row__meta-item">
              <Clock size={12} className="sol-wo-row__meta-icon" />
              <span className="sol-wo-row__meta-label">Asignada:</span>
              <span className="sol-wo-row__meta-value">
                {formatDate(workOrder.fechaAsignacion)}
              </span>
            </div>
          )}
          {workOrder.fechaCompletada && (
            <div className="sol-wo-row__meta-item">
              <CheckCircle2 size={12} className="sol-wo-row__meta-icon" style={{ color: '#10b981' }} />
              <span className="sol-wo-row__meta-label">Completada:</span>
              <span className="sol-wo-row__meta-value">
                {formatDate(workOrder.fechaCompletada)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

export const SolicitudWorkOrderCard: React.FC<SolicitudWorkOrderCardProps> = ({
  workOrders,
}) => {
  if (!workOrders || workOrders.length === 0) return null;

  return (
    <Card className="sol-detail-card sol-detail-card--work-orders">
      {/* ── Header ── */}
      <div className="sol-detail-card__title-row">
        <Wrench size={16} className="sol-detail-card__title-icon" style={{ color: '#f97316' }} />
        <h3 className="sol-detail-card__title" style={{ fontSize: '0.875rem' }}>
          Órdenes de Trabajo
        </h3>
        <div style={{ marginLeft: 'auto' }}>
          <ColorChip
            label={`${workOrders.length} ${workOrders.length === 1 ? 'orden' : 'órdenes'}`}
            variant="soft"
            size="xs"
            color="#f97316"
            borderRadius={6}
            icon={<Wrench size={12} />}
          />
        </div>
      </div>

      {/* ── Work order list ── */}
      <div className="sol-wo-list">
        {workOrders.map((wo, idx) => (
          <WorkOrderRow
            key={wo.codigoOrden}
            workOrder={wo}
            isFirst={idx === 0}
          />
        ))}
      </div>
    </Card>
  );
};
