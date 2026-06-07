import React from 'react';
import {
  CreditCard,
  FileText,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { RequestDetailByClientResponse } from '../../../domain/models/Solicitud';

interface PaymentConfirmationCardProps {
  solicitud: RequestDetailByClientResponse;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  paymentReference: string;
  setPaymentReference: (val: string) => void;
  isConfirmingPayment: boolean;
  handleConfirmPayment: () => void;
  setReceiptModalOpen: (open: boolean) => void;
}

export const PaymentConfirmationCard: React.FC<
  PaymentConfirmationCardProps
> = ({
  solicitud,
  paymentMethod,
  setPaymentMethod,
  paymentReference,
  setPaymentReference,
  isConfirmingPayment,
  handleConfirmPayment,
  setReceiptModalOpen,
}) => {
  return (
    <div className="sol-detail-payment-confirm-card">
      <div className="sol-detail-payment-confirm-card__header">
        <CreditCard
          size={20}
          className="sol-detail-payment-confirm-card__header-icon"
        />
        <div>
          <h3 className="sol-detail-payment-confirm-card__title">
            Validación de Pago de Inspección
          </h3>
          <p className="sol-detail-payment-confirm-card__subtitle">
            Revise el comprobante y confirme los detalles del depósito o
            transferencia del cliente.
          </p>
        </div>
      </div>
      <div className="sol-detail-payment-confirm-card__body">
        <div className="sol-detail-payment-confirm-grid">
          <div className="sol-detail-payment-confirm-info">
            <h4 className="sol-detail-payment-confirm-section-title">
              Detalles de Facturación
            </h4>
            <div className="sol-detail-payment-confirm-details">
              <div className="sol-detail-payment-confirm-item">
                <span className="sol-detail-payment-confirm-item__label">
                  N° Factura
                </span>
                <span className="sol-detail-payment-confirm-item__value">
                  {solicitud.numeroFactura || '—'}
                </span>
              </div>
              <div className="sol-detail-payment-confirm-item">
                <span className="sol-detail-payment-confirm-item__label">
                  Monto a Validar
                </span>
                <span className="sol-detail-payment-confirm-item__value">
                  $
                  {solicitud.montofactura
                    ? solicitud.montofactura.toFixed(2)
                    : '0.00'}
                </span>
              </div>
              {solicitud.urlComprobante ? (
                <div
                  className="sol-detail-payment-confirm-item sol-detail-payment-confirm-item--full"
                  style={{ marginTop: '0.5rem' }}
                >
                  <button
                    type="button"
                    onClick={() => setReceiptModalOpen(true)}
                    className="sol-detail-view-receipt-link"
                    style={{
                      cursor: 'pointer',
                      background: 'none',
                      border: '1px solid var(--accent)',
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'all 0.18s',
                    }}
                  >
                    <FileText size={16} /> Ver Comprobante de Pago{' '}
                    <ExternalLink size={12} />
                  </button>
                </div>
              ) : (
                <div
                  className="sol-detail-payment-confirm-item sol-detail-payment-confirm-item--full"
                  style={{
                    marginTop: '0.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
                  <span>
                    El cliente aún no ha subido una captura del comprobante.
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="sol-detail-payment-confirm-form">
            <h4 className="sol-detail-payment-confirm-section-title">
              Registro de Confirmación
            </h4>
            <div className="sol-detail-payment-confirm-fields">
              <div className="sol-detail-payment-confirm-field">
                <label className="sol-detail-payment-confirm-field__label">
                  Método de Pago
                </label>
                <select
                  className="sol-detail-payment-confirm-field__select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                  <option value="VENTANILLA">Depósito en Ventanilla</option>
                  <option value="ONLINE">Pago en Línea</option>
                </select>
              </div>
              <div className="sol-detail-payment-confirm-field">
                <label className="sol-detail-payment-confirm-field__label">
                  Referencia / N° Transacción
                </label>
                <input
                  type="text"
                  className="sol-detail-payment-confirm-field__input"
                  placeholder="Ej: DEP-109283"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                disabled={isConfirmingPayment}
                onClick={handleConfirmPayment}
                leftIcon={
                  isConfirmingPayment ? (
                    <Clock
                      size={16}
                      className="sol-detail-loading__spinner"
                    />
                  ) : (
                    <CheckCircle size={16} />
                  )
                }
              >
                {isConfirmingPayment ? 'Registrando...' : 'Confirmar y Registrar Pago'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
