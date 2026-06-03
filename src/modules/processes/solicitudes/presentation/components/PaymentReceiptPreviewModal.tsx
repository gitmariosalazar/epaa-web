/**
 * PaymentReceiptPreviewModal
 *
 * SRP: Shows only the payment-receipt document in a focused modal.
 * No validation panel — pure preview with download/open actions.
 */
import React from 'react';
import { X, FileText, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import { environments } from '@/settings/environments/environments';

const API_BASE = (environments.API_URL || '')
  .replace(/\/api$/, '')
  .replace(/\/$/, '');

interface PaymentReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Relative or absolute URL returned by the backend, e.g. /uploads/connection-documents/file.pdf */
  receiptUrl: string | null;
  /** Human-readable label shown in the header, e.g. invoice number */
  facturaLabel?: string;
}

export const PaymentReceiptPreviewModal: React.FC<PaymentReceiptPreviewModalProps> = ({
  isOpen,
  onClose,
  receiptUrl,
  facturaLabel,
}) => {
  if (!isOpen) return null;

  const resolvedUrl = receiptUrl
    ? receiptUrl.startsWith('http')
      ? receiptUrl
      : `${API_BASE}${receiptUrl}`
    : null;

  const isPdf = resolvedUrl
    ? resolvedUrl.toLowerCase().includes('.pdf')
    : false;

  const isImage = resolvedUrl
    ? /\.(jpg|jpeg|png|webp|gif)$/i.test(resolvedUrl)
    : false;

  return (
    <div
      className="receipt-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa del comprobante de pago"
    >
      <div className="receipt-modal__panel">
        {/* ── Header ── */}
        <div className="receipt-modal__header">
          <div className="receipt-modal__header-left">
            <FileText size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <div>
              <span className="receipt-modal__title">Comprobante de Pago</span>
              {facturaLabel && (
                <span className="receipt-modal__subtitle">{facturaLabel}</span>
              )}
            </div>
          </div>

          <div className="receipt-modal__header-actions">
            {resolvedUrl && (
              <>
                <a
                  href={resolvedUrl}
                  download
                  className="doc-modal__action-btn"
                  title="Descargar"
                >
                  <Download size={14} /> Descargar
                </a>
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-modal__action-btn"
                  title="Abrir en nueva pestaña"
                >
                  <ExternalLink size={14} /> Abrir
                </a>
              </>
            )}
            <button
              className="doc-modal__close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Viewer ── */}
        <div className="receipt-modal__viewer">
          {!resolvedUrl ? (
            <div className="receipt-modal__empty">
              <AlertTriangle size={40} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
              <p>No se encontró el comprobante de pago.</p>
            </div>
          ) : isPdf ? (
            <iframe
              key={resolvedUrl}
              src={`${resolvedUrl}#toolbar=1&navpanes=0`}
              title="Comprobante de Pago"
              className="receipt-modal__iframe"
            />
          ) : isImage ? (
            <div className="receipt-modal__image-wrap">
              <img
                src={resolvedUrl}
                alt="Comprobante de Pago"
                className="receipt-modal__image"
              />
            </div>
          ) : (
            <div className="receipt-modal__empty">
              <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p>Vista previa no disponible para este tipo de archivo.</p>
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-modal__action-btn"
                style={{ marginTop: '0.75rem' }}
              >
                <ExternalLink size={14} /> Ver archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
