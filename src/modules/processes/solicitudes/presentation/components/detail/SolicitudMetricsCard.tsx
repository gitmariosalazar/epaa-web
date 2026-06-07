import React from 'react';
import { Info, CreditCard, FileCheck, Gauge } from 'lucide-react';
import { Card } from '@/shared/presentation/components/Card/Card';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';

interface SolicitudMetricsCardProps {
  solicitud: RequestDetailByClientResponse;
}

export const SolicitudMetricsCard: React.FC<SolicitudMetricsCardProps> = ({
  solicitud,
}) => {
  const showCard =
    !!solicitud.numeroFactura ||
    !!solicitud.numeroContrato ||
    !!solicitud.numeroMedidor;

  if (!showCard) return null;

  return (
    <Card className="sol-detail-card sol-detail-card--metrics">
      <div className="sol-detail-card__title-row">
        <Info size={16} className="sol-detail-card__title-icon" />
        <h3
          className="sol-detail-card__title"
          style={{ fontSize: '0.875rem' }}
        >
          Detalles del Servicio
        </h3>
      </div>
      <div className="sol-detail-metrics-list">
        {solicitud.numeroFactura && (
          <div className="sol-detail-metric-item">
            <div
              className="sol-detail-metric-item__icon"
              style={{
                color: '#f59e0b',
                background: 'rgba(245,158,11,0.1)',
              }}
            >
              <CreditCard size={15} />
            </div>
            <div className="sol-detail-metric-item__body">
              <span className="sol-detail-metric-item__label">
                Inspección & Pago
              </span>
              <span className="sol-detail-metric-item__value">
                Factura: {solicitud.numeroFactura}
              </span>
              {solicitud.montofactura && (
                <span className="sol-detail-metric-item__meta">
                  Monto: ${solicitud.montofactura.toFixed(2)} (
                  {solicitud.estadoPago ?? 'Pendiente'})
                </span>
              )}
            </div>
          </div>
        )}
        {solicitud.numeroContrato && (
          <div className="sol-detail-metric-item">
            <div
              className="sol-detail-metric-item__icon"
              style={{
                color: '#8b5cf6',
                background: 'rgba(139,92,246,0.1)',
              }}
            >
              <FileCheck size={15} />
            </div>
            <div className="sol-detail-metric-item__body">
              <span className="sol-detail-metric-item__label">
                Contrato Registrado
              </span>
              <span className="sol-detail-metric-item__value">
                Contrato N°: {solicitud.numeroContrato}
              </span>
              {solicitud.estadoFirma && (
                <span className="sol-detail-metric-item__meta">
                  Firma: {solicitud.estadoFirma}
                </span>
              )}
              {solicitud.valorTotal != null && (
                <span className="sol-detail-metric-item__meta">
                  Valor: ${solicitud.valorTotal.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}
        {(solicitud.numeroCuenta || solicitud.numeroMedidor) && (
          <div className="sol-detail-metric-item">
            <div
              className="sol-detail-metric-item__icon"
              style={{
                color: '#10b981',
                background: 'rgba(16,185,129,0.1)',
              }}
            >
              <Gauge size={15} />
            </div>
            <div className="sol-detail-metric-item__body">
              <span className="sol-detail-metric-item__label">
                Medidor e Instalación
              </span>
              {solicitud.numeroMedidor && (
                <span className="sol-detail-metric-item__value">
                  Medidor N°: {solicitud.numeroMedidor}
                </span>
              )}
              {solicitud.numeroCuenta && (
                <span className="sol-detail-metric-item__meta">
                  Cuenta N°: {solicitud.numeroCuenta}
                </span>
              )}
              {solicitud.fechaActivacion && (
                <span className="sol-detail-metric-item__meta">
                  Activo:{' '}
                  {new Date(solicitud.fechaActivacion).toLocaleDateString(
                    'es-EC'
                  )}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
