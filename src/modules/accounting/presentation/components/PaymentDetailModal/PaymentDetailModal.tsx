import React from 'react';
import type { Payment } from '@/modules/accounting/domain/models/Payment';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import {
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TextSelect
} from 'lucide-react';
import './PaymentDetailModal.css';

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  if (!isOpen) return null;
  if (!payment) return null;

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (val: number | string | undefined | null) => {
    if (val === undefined || val === null) return '$0.00';
    return `$${Number(val).toFixed(2)}`;
  };

  const isPaid = payment.incomeStatus?.toLowerCase() === 'p';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Pago"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      }
    >
      <div className="payment-detail-modal">
        {/* Header Section */}
        <div className="payment-detail__header">
          <Avatar name={payment.name || 'Unknown User'} size="lg" />
          <div className="payment-detail__info-main">
            <h2>{payment.name || 'Unknown User'}</h2>
            <div
              className="payment-detail__status"
              style={{
                color: isPaid
                  ? 'var(--success)'
                  : payment.incomeStatus === 'PENDIENTE'
                    ? 'var(--warning)'
                    : 'var(--error)'
              }}
            >
              {isPaid ? (
                <CheckCircle size={16} />
              ) : payment.incomeStatus === 'PENDIENTE' ? (
                <Clock size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {payment.incomeStatus === 'P' ? 'Pagado' : 'Pendiente'}
            </div>
          </div>
        </div>

        {/* General Information */}
        <div className="payment-detail__section">
          <h3>Information General</h3>
          <div className="payment-detail__grid">
            <div className="payment-detail__item">
              <label>Income Code</label>
              <span>{payment.incomeCode || 'N/A'}</span>
            </div>
            <div className="payment-detail__item">
              <label>Clave Catastral</label>
              <span>{payment.cadastralKey || 'N/A'}</span>
            </div>
            <div className="payment-detail__item">
              <label>Card ID (Cédula)</label>
              <span>{payment.cardId || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="payment-detail__section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={16} /> Desglose Financiero
          </h3>
          <div className="payment-detail__tags">
            <span className="payment-detail__tag payment-detail__tag--money">
              Title Value: {formatCurrency(payment.titleValue)}
            </span>
            <span className="payment-detail__tag payment-detail__tag--money">
              Third Party: {formatCurrency(payment.thirdPartyValue)}
            </span>
            <span className="payment-detail__tag payment-detail__tag--highlight">
              Surcharge: {formatCurrency(payment.surcharge)}
            </span>
            <span className="payment-detail__tag payment-detail__tag--money">
              Trash Rate: {formatCurrency(payment.trashRate)}
            </span>
            {payment.orderValue !== undefined && (
              <span className="payment-detail__tag payment-detail__tag--money">
                Order Value: {formatCurrency(payment.orderValue)}
              </span>
            )}
            <span className="payment-detail__tag payment-detail__tag--total">
              Total: {formatCurrency(payment.total)}
            </span>
          </div>
        </div>

        {/* Tracking & Audit */}
        <div className="payment-detail__section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TextSelect size={16} /> Pagos y Auditoría
          </h3>
          <div className="payment-detail__grid">
            <div className="payment-detail__item">
              <label>Código Título</label>
              <span>{payment.titleCode || 'N/A'}</span>
            </div>
            <div className="payment-detail__item">
              <label>Usuario de Pago</label>
              <span>{payment.paymentUser || 'N/A'}</span>
            </div>
            <div className="payment-detail__item">
              <label>Fecha de Pago</label>
              <span>{formatDate(payment.paymentDate)}</span>
            </div>
            <div className="payment-detail__item">
              <label>Fecha de Ingreso</label>
              <span>{formatDate(payment.incomeDate)}</span>
            </div>
            <div className="payment-detail__item">
              <label>Fecha de Vencimiento</label>
              <span>{formatDate(payment.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
