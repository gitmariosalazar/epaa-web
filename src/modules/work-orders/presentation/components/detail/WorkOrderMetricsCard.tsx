/**
 * WorkOrderMetricsCard
 *
 * SRP: métricas numéricas de la OT (tiempos, costos, SLA, conteos).
 */
import React from 'react';
import { Clock, DollarSign, Package, Paperclip, MessageSquare, ShieldCheck } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { OrdenTrabajoDetalle } from '../../../domain/schemas/dto/response/work-orders.get.response';
import { getSlaColor, formatSlaHoras } from '../WorkOrderConfig';

interface WorkOrderMetricsCardProps {
  orden: OrdenTrabajoDetalle;
}

interface MetricTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  sublabel?: string;
}

const MetricTile: React.FC<MetricTileProps> = ({ icon, label, value, color, sublabel }) => (
  <div className="wo-metric-tile">
    <div className="wo-metric-tile__icon" style={{ color: color ?? 'var(--text-secondary)' }}>
      {icon}
    </div>
    <div className="wo-metric-tile__body">
      <span className="wo-metric-tile__label">{label}</span>
      <span className="wo-metric-tile__value" style={{ color: color }}>
        {value}
      </span>
      {sublabel && <span className="wo-metric-tile__sublabel">{sublabel}</span>}
    </div>
  </div>
);

export const WorkOrderMetricsCard: React.FC<WorkOrderMetricsCardProps> = ({ orden }) => {
  const slaColor = getSlaColor(
    orden.cumpleSla ?? false,
    parseFloat(orden.horasRestantesSla as any) || 0,
  );

  // Backend may return numbers as strings — parseFloat handles both cases safely
  const toNum = (v: any): number | null => {
    if (v == null) return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  };

  const fmt = (raw: any, prefix = '') => {
    const n = toNum(raw);
    return n != null ? `${prefix}${n.toFixed(2)}` : '—';
  };

  const fmtSla = (raw: any) => {
    const n = toNum(raw);
    return n != null ? formatSlaHoras(n) : '—';
  };

  return (
    <Card title="Métricas del Servicio" className="wo-detail-card wo-detail-card--metrics">
      <div className="wo-metrics-grid">

        {/* Tiempos */}
        <MetricTile
          icon={<Clock size={16} />}
          label="Horas en Proceso"
          value={fmt(orden.horasTotalesProceso)}
          sublabel={`${toNum(orden.diasEnProceso) ?? 0} día(s)`}
        />
        <MetricTile
          icon={<Clock size={16} />}
          label="Horas hasta Asignación"
          value={fmt(orden.horasHastaAsignacion)}
        />
        <MetricTile
          icon={<Clock size={16} />}
          label="Horas Ejecución Campo"
          value={fmt(orden.horasEjecucionCampo)}
        />

        {/* SLA */}
        <MetricTile
          icon={<ShieldCheck size={16} />}
          label="SLA Asignado"
          value={fmtSla(orden.slaHoras)}
          color={slaColor}
          sublabel={(orden.cumpleSla ?? false) ? 'En tiempo' : 'VENCIDO'}
        />
        <MetricTile
          icon={<ShieldCheck size={16} />}
          label="Horas Restantes SLA"
          value={
            (orden.cumpleSla ?? false)
              ? fmtSla(Math.max(0, parseFloat(orden.horasRestantesSla as any) || 0))
              : 'Vencido'
          }
          color={slaColor}
        />

        {/* Costos */}
        <MetricTile
          icon={<Package size={16} />}
          label="Costo Materiales"
          value={fmt(orden.costoTotalMateriales, '$')}
        />
        <MetricTile
          icon={<DollarSign size={16} />}
          label="Costos Adicionales"
          value={fmt(orden.costoTotalAdicionales, '$')}
        />
        <MetricTile
          icon={<DollarSign size={16} />}
          label="Costo Total OT"
          value={fmt(orden.costoTotalOrden, '$')}
          color="#10b981"
        />

        {/* Conteos */}
        <MetricTile
          icon={<Package size={16} />}
          label="Materiales"
          value={(orden.materiales ?? []).length}
        />
        <MetricTile
          icon={<Paperclip size={16} />}
          label="Adjuntos"
          value={(orden.adjuntos ?? []).length}
        />
        <MetricTile
          icon={<MessageSquare size={16} />}
          label="Observaciones"
          value={(orden.observaciones ?? []).length}
        />

        {orden.calificacionSatisfaccion != null && (
          <MetricTile
            icon={<ShieldCheck size={16} />}
            label="Satisfacción"
            value={`${orden.calificacionSatisfaccion} / 5 ★`}
            color="#f59e0b"
          />
        )}
      </div>
    </Card>
  );
};
