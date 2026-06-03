import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { CreateInspectionInvoiceUseCase } from '../../application/usecases/CreateInspectionInvoiceUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { X, FileText, Calendar, CreditCard, DollarSign, Loader2 } from 'lucide-react';
import './CreateInspectionInvoiceModal.css';

interface CreateInspectionInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  onSuccess: () => void;
}

export const CreateInspectionInvoiceModal: React.FC<
  CreateInspectionInvoiceModalProps
> = ({ isOpen, onClose, solicitudId, solicitudNumero, onSuccess }) => {
  const { user } = useAuth();
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [amount, setAmount] = useState(25.00);
  const [expirationDate, setExpirationDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const useCase = React.useMemo(
    () => new CreateInspectionInvoiceUseCase(new SolicitudRepositoryImpl()),
    []
  );

  // Set default expiration date (15 days from today) on open
  useEffect(() => {
    if (isOpen) {
      setInvoiceNumber('');
      setAmount(25.00);
      const today = new Date();
      today.setDate(today.getDate() + 15);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setExpirationDate(`${year}-${month}-${day}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim()) {
      MessageToastCustom('error', 'Error', 'El número de factura es requerido.');
      return;
    }
    if (!expirationDate) {
      MessageToastCustom('error', 'Error', 'La fecha de vencimiento es requerida.');
      return;
    }

    setIsSaving(true);
    try {
      // Expiration date formatted as date-time for backend (UTC)
      const dateObj = new Date(expirationDate);
      dateObj.setHours(23, 59, 59, 999);

      await useCase.execute({
        requestId: solicitudId,
        invoiceNumber: invoiceNumber.trim(),
        conceptId: 1, // Inspección técnica — Nueva acometida
        amount,
        expirationDate: dateObj.toISOString(),
        collectorId: user?.userId
      });

      MessageToastCustom(
        'success',
        'Factura Generada',
        `La factura ${invoiceNumber} se generó correctamente.`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error generating inspection invoice:', err);
      MessageToastCustom(
        'error',
        'Error',
        err.message || 'No se pudo generar la factura de inspección.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="invoice-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Generar Factura de Inspección"
    >
      <div className="invoice-modal__panel">
        {/* Header */}
        <div className="invoice-modal__header">
          <div className="invoice-modal__header-left">
            <CreditCard size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <span className="invoice-modal__title">Generar Factura de Inspección</span>
              <span className="invoice-modal__subtitle">Expediente: {solicitudNumero}</span>
            </div>
          </div>
          <button
            className="invoice-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="invoice-modal__form">
          <div className="invoice-modal__body">
            
            {/* Info Concept (Read only) */}
            <div className="invoice-modal__field">
              <label className="invoice-modal__label">Concepto de Facturación</label>
              <div className="invoice-modal__read-only">
                <FileText size={14} className="invoice-modal__field-icon" />
                <span>Inspección técnica — Nueva acometida (Concepto N° 1)</span>
              </div>
            </div>

            {/* Invoice Number */}
            <div className="invoice-modal__field">
              <label htmlFor="invoiceNumber" className="invoice-modal__label invoice-modal__label--required">
                Número de Factura
              </label>
              <div className="invoice-modal__input-wrap">
                <CreditCard size={14} className="invoice-modal__field-icon" />
                <input
                  type="text"
                  id="invoiceNumber"
                  className="invoice-modal__input"
                  placeholder="Ej: 001-002-00000342"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  disabled={isSaving}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Grid for Amount and Date */}
            <div className="invoice-modal__row">
              {/* Amount */}
              <div className="invoice-modal__field">
                <label htmlFor="amount" className="invoice-modal__label invoice-modal__label--required">
                  Monto ($)
                </label>
                <div className="invoice-modal__input-wrap">
                  <DollarSign size={14} className="invoice-modal__field-icon" />
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    className="invoice-modal__input"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>

              {/* Expiration Date */}
              <div className="invoice-modal__field">
                <label htmlFor="expirationDate" className="invoice-modal__label invoice-modal__label--required">
                  Fecha de Vencimiento
                </label>
                <div className="invoice-modal__input-wrap">
                  <Calendar size={14} className="invoice-modal__field-icon" />
                  <input
                    type="date"
                    id="expirationDate"
                    className="invoice-modal__input"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    disabled={isSaving}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Alert info */}
            <div className="invoice-modal__alert">
              <span className="invoice-modal__alert-text">
                * Al generar la factura, se notificará automáticamente al cliente y el estado del expediente pasará a **Factura Emitida**.
              </span>
            </div>

          </div>

          {/* Footer actions */}
          <div className="invoice-modal__footer">
            <button
              type="button"
              className="invoice-modal__btn invoice-modal__btn--secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="invoice-modal__btn invoice-modal__btn--primary"
              disabled={isSaving || !invoiceNumber.trim()}
            >
              {isSaving ? (
                <div className="invoice-modal__spinner-wrap">
                  <Loader2 className="invoice-modal__spinner" size={15} />
                  <span>Generando...</span>
                </div>
              ) : (
                <span>Generar Factura</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
