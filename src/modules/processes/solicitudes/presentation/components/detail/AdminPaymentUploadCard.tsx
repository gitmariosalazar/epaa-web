import React from 'react';
import { CreditCard, Upload, Clock } from 'lucide-react';
import './AdminPaymentUploadCard.css';

interface AdminPaymentUploadCardProps {
  numeroFactura?: string | null;
  montofactura?: number | null;
  isUploadingReceipt: boolean;
  onUploadReceipt: (file: File) => void;
}

export const AdminPaymentUploadCard: React.FC<AdminPaymentUploadCardProps> = ({
  numeroFactura,
  montofactura,
  isUploadingReceipt,
  onUploadReceipt
}) => {
  const displayMonto = montofactura ?? 0;

  return (
    <div className="sol-detail-payment-card">
      <div className="sol-detail-payment-card__header">
        <CreditCard size={20} className="sol-detail-payment-card__header-icon" />
        <div>
          <h3 className="sol-detail-payment-card__title">Pago de Tasa de Inspección</h3>
          <p className="sol-detail-payment-card__subtitle">
            Suba el comprobante de pago entregado por el cliente para continuar.
          </p>
        </div>
      </div>
      <div className="sol-detail-payment-card__body">
        <div className="sol-detail-payment-summary">
          <div className="sol-detail-payment-summary__label">
            <span className="sol-detail-payment-summary__title">Tasa de Inspección</span>
            {numeroFactura && (
              <span className="sol-detail-payment-summary__meta">Factura: {numeroFactura}</span>
            )}
          </div>
          <span className="sol-detail-payment-summary__amount">${displayMonto.toFixed(2)}</span>
        </div>

        <div className="sol-detail-payment-upload">
          <label
            htmlFor="admin-receipt-file-upload"
            className={`sol-detail-payment-upload-zone ${isUploadingReceipt ? 'sol-detail-payment-upload-zone--disabled' : ''}`}
          >
            <input
              type="file"
              id="admin-receipt-file-upload"
              style={{ display: 'none' }}
              accept=".pdf,image/*"
              disabled={isUploadingReceipt}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onUploadReceipt(file);
                }
              }}
            />
            {isUploadingReceipt ? (
              <>
                <Clock size={32} className="sol-detail-payment-upload-zone__icon sol-detail-loading__spinner" />
                <p className="sol-detail-payment-upload-zone__text">Subiendo Comprobante...</p>
                <p className="sol-detail-payment-upload-zone__subtext">Por favor espere mientras procesamos su archivo.</p>
              </>
            ) : (
              <>
                <Upload size={32} className="sol-detail-payment-upload-zone__icon" />
                <p className="sol-detail-payment-upload-zone__text">Cargar Comprobante de Pago</p>
                <p className="sol-detail-payment-upload-zone__subtext">Haga clic aquí para seleccionar una imagen o PDF del comprobante.</p>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};
