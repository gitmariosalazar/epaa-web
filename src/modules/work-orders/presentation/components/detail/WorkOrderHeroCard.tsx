/**
 * WorkOrderHeroCard
 *
 * SRP: muestra el estado actual, SLA y datos esenciales de una OT.
 * DIP: recibe OrdenTrabajoDetalle como prop.
 */
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { OrdenTrabajoDetalle } from '../../../domain/schemas/dto/response/work-orders.get.response';
import {
  getEstadoOrdenConfig,
  getPrioridadConfig,
  getSlaColor,
  formatSlaHoras,
} from '../WorkOrderConfig';

interface WorkOrderHeroCardProps {
  orden: OrdenTrabajoDetalle;
  updatedStr: string;
}

const getEstadoIcon = (codigo: string): React.ReactNode => {
  const upper = (codigo || '').toUpperCase();
  if (['COMPLETADA'].includes(upper)) return <CheckCircle size={24} />;
  if (['CANCELADA', 'RECHAZADA_TECNICA', 'REVISION_RECHAZADA'].includes(upper)) return <XCircle size={24} />;
  if (['ESCALADA'].includes(upper)) return <AlertTriangle size={24} />;
  if (['NOTIFICADA'].includes(upper)) return <Zap size={24} />;
  return <Clock size={24} />;
};

export const WorkOrderHeroCard: React.FC<WorkOrderHeroCardProps> = ({ orden, updatedStr }) => {
  const estadoConfig    = getEstadoOrdenConfig(orden.estado || '');
  const prioridadConfig = getPrioridadConfig(orden.prioridad || '');
  const cumpleSla       = orden.cumpleSla ?? false;
  const horasRestantes  = parseFloat(orden.horasRestantesSla as any) || 0;
  const diasEnProceso   = parseInt(orden.diasEnProceso as any, 10) || 0;
  const slaColor        = getSlaColor(cumpleSla, horasRestantes);

  return (
    <Card className="wo-detail-card wo-detail-card--hero">
      <div
        className="wo-detail-card__header-accent"
        style={{ background: estadoConfig.color }}
      />
      <div className="wo-detail-card__body wo-detail-card__body--hero">

        {/* Estado principal */}
        <div className="wo-detail-hero-status">
          <div
            className="wo-detail-hero-status__badge"
            style={{ background: estadoConfig.bg, color: estadoConfig.color }}
          >
            {getEstadoIcon(orden.estado)}
          </div>
          <div>
            <div className="wo-detail-hero-status__label">Estado Actual</div>
            <h3
              className="wo-detail-hero-status__value"
              style={{ color: estadoConfig.color }}
            >
              {orden.estadoLabel}
            </h3>
            <span className="wo-detail-hero-status__code">{orden.codigoOrden}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="wo-detail-hero-stats">
          <div className="wo-detail-hero-stat">
            <span className="wo-detail-hero-stat__label">Días en Proceso</span>
            <span className="wo-detail-hero-stat__value">
              {diasEnProceso > 1 ? `${diasEnProceso} días` : '1 día'}
            </span>
          </div>

          <div className="wo-detail-hero-stat">
            <span className="wo-detail-hero-stat__label">Prioridad</span>
            <span
              className="wo-detail-hero-stat__value"
              style={{ color: prioridadConfig.color }}
            >
              {prioridadConfig.label}
            </span>
          </div>

          <div className="wo-detail-hero-stat">
            <span className="wo-detail-hero-stat__label">SLA</span>
            <span
              className="wo-detail-hero-stat__value"
              style={{ color: slaColor }}
            >
              {cumpleSla
                ? `✓ ${formatSlaHoras(horasRestantes)} restantes`
                : `✗ Vencido`}
            </span>
          </div>

          <div className="wo-detail-hero-stat">
            <span className="wo-detail-hero-stat__label">Última Act.</span>
            <span className="wo-detail-hero-stat__value" style={{ fontSize: '0.78rem' }}>
              {updatedStr}
            </span>
          </div>

          {orden.escalaSupervisor && (
            <div className="wo-detail-hero-stat wo-detail-hero-stat--warn">
              <span className="wo-detail-hero-stat__label">⚠ Escalada</span>
              <span className="wo-detail-hero-stat__value" style={{ fontSize: '0.78rem' }}>
                {orden.motivoEscalamiento || 'Sin detalle'}
              </span>
            </div>
          )}
        </div>

      </div>
    </Card>
  );
};
