import React from 'react';
import type { PaymentReading } from '@/modules/accounting/domain/models/PaymentReading';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import {
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Activity
} from 'lucide-react';
import './PaymentReadingDetailModal.css';

interface PaymentReadingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: PaymentReading | null;
}

export const PaymentReadingDetailModal: React.FC<
  PaymentReadingDetailModalProps
> = ({ isOpen, onClose, reading }) => {
  if (!isOpen) return null;
  if (!reading) return null;

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' // Prevent offset bugs
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (val: number | string | undefined | null) => {
    if (val === undefined || val === null) return '$0.00';
    return `$${Number(val).toFixed(2)}`;
  };

  const isPaid = reading.incomeStatus?.toLowerCase() === 'p';

  console.log(reading.incomeStatus);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Reading Details"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      }
    >
      <div className="reading-detail-modal">
        {/* Header Section */}
        <div className="reading-detail__header">
          <Avatar name={`${reading.name} ${reading.lastName}`} size="lg" />
          <div className="reading-detail__info-main">
            <h2>
              {reading.name} {reading.lastName}
            </h2>
            <div
              className="reading-detail__status"
              style={{
                color: isPaid
                  ? 'var(--success)'
                  : reading.incomeStatus === 'PENDIENTE'
                    ? 'var(--warning)'
                    : 'var(--error)'
              }}
            >
              {isPaid ? (
                <CheckCircle size={16} />
              ) : reading.incomeStatus === 'PENDIENTE' ? (
                <Clock size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {reading.incomeStatus || 'Unknown Status'}
            </div>
          </div>
        </div>

        {/* General Information */}
        <div className="reading-detail__section">
          <h3>Información General</h3>
          <div className="reading-detail__grid">
            <div className="reading-detail__item">
              <label>Código Ingreso</label>
              <span>{reading.incomeCode || 'N/A'}</span>
            </div>
            <div className="reading-detail__item">
              <label>Cadastral Key</label>
              <span>{reading.cadastralKey || 'N/A'}</span>
            </div>
            <div className="reading-detail__item">
              <label>Card ID (Cédula)</label>
              <span>{reading.cardId || 'N/A'}</span>
            </div>
            <div className="reading-detail__item">
              <label>Address</label>
              <span>{reading.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Reading Metrics */}
        <div className="reading-detail__section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} /> Métricas de Lectura
          </h3>
          <div className="reading-detail__tags">
            <span className="reading-detail__tag reading-detail__tag--info">
              Mes: {reading.month}
            </span>
            <span className="reading-detail__tag reading-detail__tag--info">
              Año: {reading.year}
            </span>
            <span className="reading-detail__tag reading-detail__tag--info">
              Anterior: {reading.previousReading}
            </span>
            <span className="reading-detail__tag reading-detail__tag--info">
              Actual: {reading.currentReading}
            </span>
            <span className="reading-detail__tag reading-detail__tag--highlight">
              Consumo: {reading.consumption}
            </span>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="reading-detail__section">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={16} /> Desglose Financiero
          </h3>
          <div className="reading-detail__tags">
            <span className="reading-detail__tag reading-detail__tag--money">
              Valor Lectura: {formatCurrency(reading.readingValue)}
            </span>
            <span className="reading-detail__tag reading-detail__tag--money">
              EPAA Value: {formatCurrency(reading.epaaValue)}
            </span>
            <span className="reading-detail__tag reading-detail__tag--money">
              Trash Rate: {formatCurrency(reading.trashRate)}
            </span>
            <span className="reading-detail__tag reading-detail__tag--money">
              Third Party: {formatCurrency(reading.thirdPartyValue)}
            </span>
            <span className="reading-detail__tag reading-detail__tag--total">
              Total: {formatCurrency(reading.total)}
            </span>
          </div>
        </div>

        {/* Tracking & Audit */}
        <div className="reading-detail__section">
          <h3>Pagos y Auditoría</h3>
          <div className="reading-detail__grid">
            <div className="reading-detail__item">
              <label>Código Título</label>
              <span>{reading.titleCode || 'N/A'}</span>
            </div>
            <div className="reading-detail__item">
              <label>Estado Ingreso</label>
              <span>{reading.incomeStatus || 'N/A'}</span>
            </div>
            <div className="reading-detail__item">
              <label>Usuario de Pago</label>
              <span>{reading.paymentUser || 'N/A'}</span>
            </div>
            <div className="reading-detail__item">
              <label>Fecha de Pago</label>
              <span>{formatDate(reading.paymentDate)}</span>
            </div>
            <div className="reading-detail__item">
              <label>Fecha de Ingreso</label>
              <span>{formatDate(reading.incomeDate)}</span>
            </div>
            <div className="reading-detail__item">
              <label>Fecha de Vencimiento</label>
              <span>{formatDate(reading.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
