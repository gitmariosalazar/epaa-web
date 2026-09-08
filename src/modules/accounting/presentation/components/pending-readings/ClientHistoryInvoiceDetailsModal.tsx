import React from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { type PendingReading } from '../../../domain/models/PendingReading';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { FileText, MapPin, User, Calendar, Droplets, IdCard, UserCheck } from 'lucide-react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import './ClientHistoryInvoiceDetailsModal.css';
import { ConverDateTime, ConverDate } from '@/shared/utils/datetime/ConverDate';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { getColorIncomeStatus, getLabelIncomeStatus, type TypeIncomeStatus } from '@/shared/utils/IncomeStatus';
import { Divider } from '@/shared/presentation/components/divider/Divider';

interface ClientHistoryInvoiceDetailsModalProps {
  reading: PendingReading | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClientHistoryInvoiceDetailsModal: React.FC<ClientHistoryInvoiceDetailsModalProps> = ({
  reading,
  isOpen,
  onClose
}) => {
  if (!reading) return null;

  console.log(reading);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de Factura Pagada"
      description={`Período: ${reading.month}-${reading.year}`}
      size="md"
      icon={<FileText size={24} />}
      headerColor="indigo"
    >
      <div className="reading-details-container">
        <div className="header-info-reading-detail">
          <Tooltip content='Fecha de Ingreso' followCursor={false}>
            <ColorChip
              label={`${ConverDate(reading.incomeDate)}`}
              size="xs"
              variant="soft"
              color="indigo"
              icon={<Calendar size={16} />}
            />
          </Tooltip>
          <Tooltip content='Estado de pago' followCursor={false} themeColor={getColorIncomeStatus(reading.incomeStatus.trim() as TypeIncomeStatus)}>
            <ColorChip
              label={`${getLabelIncomeStatus(reading.incomeStatus.trim() as TypeIncomeStatus)}`}
              size="xs"
              variant="soft"
              color={reading.incomeStatus.trim() === "" ? 'red' : 'green'}
            />
          </Tooltip>
        </div>

        {/* Client Info Section */}
        <section className="details-section">
          <h4>
            <User size={20} className="details-section-icon-indigo" />
            Información del Cliente
          </h4>
          <div className="details-grid">
            <div className="details-grid-item">
              <span className="details-label">
                <UserCheck size={16} />Nombres y Apellidos</span>
              <p className="details-value">{reading.name} {reading.lastName}</p>
            </div>
            <div className="details-grid-item">
              <span className="details-label">
                <IdCard size={16} />Cédula</span>
              <p className="details-value">{reading.cardId}</p>
            </div>
            <div className="details-grid-item full-width">
              <span className="details-label">
                <MapPin size={16} /> Dirección
              </span>
              <p className="details-value">{reading.address}</p>
            </div>
          </div>
        </section>

        {/* Service Info Section */}
        <section className="details-section">
          <h4>
            <Droplets size={20} className="details-section-icon-teal" />
            Detalles del Servicio
          </h4>
          <div className="details-grid">
            <div className="details-grid-item">
              <span className="details-label">Clave Catastral</span>
              <p className="details-value">{reading.cadastralKey}</p>
            </div>
            <div className="details-grid-item">
              <span className="details-label">Tarifa</span>
              <div style={{ marginTop: '2px' }}>
                <ColorChip label={reading.rate} size="sm" variant="soft" color="teal" />
              </div>
            </div>
            <div className="details-grid-item">
              <span className="details-label">Consumo</span>
              <p className="details-value">{reading.consumption} m³</p>
            </div>
            <div className="details-grid-item">
              <span className="details-label">Lectura Act. / Ant.</span>
              <p className="details-value">{reading.currentReading} / {reading.previousReading}</p>
            </div>
          </div>
        </section>

        {/* Financial Info Section */}
        <section className="details-section">
          <h4>
            <Calendar size={20} className="details-section-icon-green" />
            Desglose de Valores
          </h4>
          <div className="details-financial-card">
            <div className="financial-row">
              <span className="details-label">Valor Consumo Agua EPAA-AA</span>
              <span className="details-value">{CurrencyFormatter.format(Number(reading.epaaValue) || 0)}</span>
            </div>
            <div className="financial-row">
              <span className="details-label">Tasa de Recoleccion de Basura</span>
              <span className="details-value">{CurrencyFormatter.format(Number(reading.totalTrashRate) || 0)}</span>
            </div>
            <div className="financial-row">
              <span className="details-label">Recargos</span>
              <span className="details-value">{CurrencyFormatter.format(Number(reading.surcharge) || 0)}</span>
            </div>

            <Divider variant='dashed' />

            <div className={`financial-row total ${reading.incomeStatus?.trim() ? 'is-paid' : 'is-pending'}`}>
              <span>{reading.incomeStatus?.trim() ? "Total Pagado" : "Total a Pagar"}</span>
              <span className="total-value">{CurrencyFormatter.format(Number(reading.adjustedTotal || reading.total) || 0)}</span>
            </div>

            <div className={`financial-footer ${reading.incomeStatus?.trim() ? 'is-paid' : 'is-pending'}`}>
              <span className="financial-footer-label">{reading.incomeStatus?.trim() ? "Fecha de Pago" : "Fecha de Vencimiento"}</span>
              <span className="financial-footer-value">{reading.incomeStatus?.trim() ? ConverDateTime(reading.paymentDate) : ConverDate(reading.dueDate)}</span>
            </div>
          </div>
        </section>

      </div>
    </Modal>
  );
};
