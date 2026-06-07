import React from 'react';
import { BarChart2, CheckCircle, DollarSign } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';

interface SolicitudTechnicalReportCardProps {
  solicitud: RequestDetailByClientResponse;
}

export const SolicitudTechnicalReportCard: React.FC<
  SolicitudTechnicalReportCardProps
> = ({ solicitud }) => {
  const showReport =
    !!solicitud.informeId &&
    (!!solicitud.resultadoInforme || solicitud.costoMateriales != null);

  if (!showReport) return null;

  const statusColor = solicitud.informeAprobado
    ? '#10b981'
    : solicitud.informeAprobado === false
      ? '#ef4444'
      : '#f59e0b';

  const statusLabel = solicitud.informeAprobado
    ? 'APROBADO'
    : solicitud.informeAprobado === false
      ? 'RECHAZADO'
      : 'EN REVISIÓN';

  return (
    <Card className="sol-detail-card">
      <div className="sol-detail-card__title-row">
        <BarChart2
          size={16}
          className="sol-detail-card__title-icon"
          style={{ color: '#a855f7' }}
        />
        <h3 className="sol-detail-card__title">
          Informe Técnico de Inspección
        </h3>
        <div style={{ marginLeft: 'auto' }}>
          <ColorChip
            color={statusColor}
            label={statusLabel}
            variant="soft"
            size="xs"
          />
        </div>
      </div>
      <div className="sol-detail-grid">
        {solicitud.resultadoInforme && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <CheckCircle
                size={11}
                style={{ display: 'inline', marginRight: 4 }}
              />{' '}
              Resultado
            </span>
            <span className="sol-detail-item__value">
              <strong>{solicitud.resultadoInforme}</strong>
            </span>
          </div>
        )}
        {solicitud.costoMateriales != null && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <DollarSign
                size={11}
                style={{ display: 'inline', marginRight: 4 }}
              />{' '}
              Materiales
            </span>
            <span className="sol-detail-item__value">
              ${solicitud.costoMateriales.toFixed(2)}
            </span>
          </div>
        )}
        {solicitud.costoManoObra != null && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">
              <DollarSign
                size={11}
                style={{ display: 'inline', marginRight: 4 }}
              />{' '}
              Mano de Obra
            </span>
            <span className="sol-detail-item__value">
              ${solicitud.costoManoObra.toFixed(2)}
            </span>
          </div>
        )}
        {solicitud.costoTotal != null && (
          <div className="sol-detail-item">
            <span className="sol-detail-item__label">Costo Total Estimado</span>
            <span
              className="sol-detail-item__value"
              style={{ fontWeight: 700, color: 'var(--accent)' }}
            >
              ${solicitud.costoTotal.toFixed(2)}
            </span>
          </div>
        )}
        {solicitud.motivoRechazo && (
          <div className="sol-detail-item sol-detail-item--full">
            <span className="sol-detail-item__label" style={{ color: '#ef4444' }}>
              Motivo de Rechazo
            </span>
            <span className="sol-detail-item__value">
              {solicitud.motivoRechazo}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
