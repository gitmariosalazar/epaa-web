import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';

interface SolicitudHeroCardProps {
  solicitud: RequestDetailByClientResponse;
  statusConfig: {
    label: string;
    color: string;
    bg: string;
  };
  tipoLabel: string;
  updatedStr: string;
}

export const SolicitudHeroCard: React.FC<SolicitudHeroCardProps> = ({
  solicitud,
  statusConfig,
  tipoLabel,
  updatedStr,
}) => {
  const isApprovedOrCompleted = [
    'aprobada',
    'completada',
    'DOCS_APPROVED',
    'PAGO_CONFIRMADO',
    'INFORME_APROBADO',
    'CONTRATO_FIRMADO',
    'INSTALACION_COMPLETADA',
    'SUMINISTRO_ACTIVO',
  ].includes(solicitud.estado);

  const isRejectedOrCanceled = [
    'rechazada',
    'RECHAZADA_TECNICA',
    'ANULADA',
  ].includes(solicitud.estado);

  return (
    <Card className="sol-detail-card sol-detail-card--hero">
      <div
        className="sol-detail-card__header-accent"
        style={{ background: statusConfig.color }}
      />
      <div className="sol-detail-card__body sol-detail-card__body--hero">
        <div className="sol-detail-hero-status">
          <div
            className="sol-detail-hero-status__badge"
            style={{ background: statusConfig.bg, color: statusConfig.color }}
          >
            {isApprovedOrCompleted ? (
              <CheckCircle size={24} />
            ) : isRejectedOrCanceled ? (
              <XCircle size={24} />
            ) : (
              <Clock size={24} />
            )}
          </div>
          <div>
            <div className="sol-detail-hero-status__label">Estado Actual</div>
            <h3
              className="sol-detail-hero-status__value"
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </h3>
          </div>
        </div>

        <div className="sol-detail-hero-stats">
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">Días en Proceso</span>
            <span className="sol-detail-hero-stat__value">
              {(solicitud.diasEnProceso ?? 0) > 1 ? `${solicitud.diasEnProceso} días` : '1 día'}
            </span>
          </div>
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">Tipo Trámite</span>
            <span className="sol-detail-hero-stat__value">{tipoLabel}</span>
          </div>
          <div className="sol-detail-hero-stat">
            <span className="sol-detail-hero-stat__label">
              Última Actualización
            </span>
            <span
              className="sol-detail-hero-stat__value"
              style={{ fontSize: '0.8rem' }}
            >
              {updatedStr}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
