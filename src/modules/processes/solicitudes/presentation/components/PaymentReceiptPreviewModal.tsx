/**
 * PaymentReceiptPreviewModal
 *
 * Layout: left = document preview, right = payment confirmation form.
 *
 * SRP: handles receipt preview display and payment confirmation UI only.
 *      Blob/preview/download concerns are delegated to dedicated hooks.
 * DIP: consumes useDocumentPreview and useDocumentDownload (hook abstractions),
 *      never depends on concrete repositories directly.
 */
import React from 'react';
import {
  X, FileText, Download, ExternalLink, AlertTriangle,
  Loader2, CheckCircle, Clock, CreditCard
} from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { DocumentoAdjuntoResponse } from '../../domain/models/Solicitud';
import { useDocumentPreview } from '@/modules/documents/presentation/hooks/useDocumentPreview';
import { useDocumentDownload } from '@/modules/documents/presentation/hooks/useDocumentDownload';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PaymentReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The comprobante document — same shape as used in SolicitudDocumentPreviewModal */
  documento: DocumentoAdjuntoResponse | null;
  /** Human-readable label shown in the header */
  facturaLabel?: string;
  /** Invoice number shown in the right panel */
  numeroFactura?: string | null;
  /** Invoice amount shown in the right panel */
  montofactura?: number | null;
  /** Payment method state */
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  /** Payment reference state */
  paymentReference: string;
  setPaymentReference: (val: string) => void;
  /** Loading state while confirming payment */
  isConfirmingPayment: boolean;
  /** Confirm payment handler */
  handleConfirmPayment: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const PaymentReceiptPreviewModal: React.FC<PaymentReceiptPreviewModalProps> = ({
  isOpen,
  onClose,
  documento,
  facturaLabel,
  numeroFactura,
  montofactura,
  paymentMethod,
  setPaymentMethod,
  paymentReference,
  setPaymentReference,
  isConfirmingPayment,
  handleConfirmPayment,
}) => {
  // ── Document preview & download (delegated to dedicated hooks) ───────────────

  const {
    blobUrl: previewBlobUrl,
    mimeType: previewMimeType,
    loading: loadingPreview,
    error: previewError
  } = useDocumentPreview(documento?.id, documento?.url);

  const { download, isDownloading } = useDocumentDownload();

  const isPdf   = previewMimeType === 'application/pdf';
  const isImage = previewMimeType?.startsWith('image/') ?? false;

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!documento) return;
    const filename = documento.url?.split('/').pop()?.split('.')[0] || 'comprobante';
    download(documento.id, documento.url, filename);
  };

  // ── Early exit ────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div
      className="doc-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Comprobante de Pago — Confirmación"
    >
      <div className="doc-modal__panel">

        {/* ── Header ── */}
        <div className="doc-modal__header">
          <div className="doc-modal__header-left">
            <FileText size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <span className="doc-modal__title">Comprobante de Pago</span>
              {facturaLabel && (
                <span className="doc-modal__subtitle">{facturaLabel}</span>
              )}
            </div>
          </div>
          <button className="doc-modal__close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="doc-modal__body">

          {/* ── LEFT: Document preview ── */}
          <div className="doc-modal__preview" style={{ flex: 1 }}>
            <div className="doc-modal__meta-bar">
              <span className="doc-modal__meta-tipo">Comprobante de Pago</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                {documento && (
                  <Button onClick={handleDownload} title="Descargar" disabled={isDownloading} size="xs">
                    {isDownloading
                      ? <Loader2 size={14} style={{ animation: 'btn-spin 0.8s linear infinite' }} />
                      : <Download size={14} />}
                    Descargar
                  </Button>
                )}
                {previewBlobUrl && (
                  <Button variant="ghost" color="info" size="xs" title="Abrir en nueva pestaña"
                    onClick={() => window.open(previewBlobUrl, '_blank')}>
                    <ExternalLink size={14} /> Abrir
                  </Button>
                )}
              </div>
            </div>

            <div className="doc-modal__viewer">
              {!documento ? (
                <div className="doc-modal__no-preview">
                  <AlertTriangle size={48} style={{ color: '#f59e0b' }} />
                  <p>El cliente aún no ha subido el comprobante de pago.</p>
                </div>
              ) : loadingPreview ? (
                <div className="doc-modal__no-preview"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem' }}>
                  <Loader2 size={28} style={{ color: 'var(--accent)', animation: 'btn-spin 0.8s linear infinite' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cargando vista previa...</p>
                </div>
              ) : previewBlobUrl ? (
                isPdf ? (
                  <iframe
                    key={previewBlobUrl}
                    src={`${previewBlobUrl}#toolbar=1&navpanes=0`}
                    title="Comprobante de Pago"
                    className="doc-modal__iframe"
                  />
                ) : isImage ? (
                  <div className="doc-modal__no-preview"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '1rem', boxSizing: 'border-box' }}>
                    <img
                      src={previewBlobUrl}
                      alt="Comprobante de Pago"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    />
                  </div>
                ) : (
                  <div className="doc-modal__no-preview">
                    <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                    <p>Vista previa no disponible para este tipo de archivo.</p>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Descarga el archivo para visualizarlo.</small>
                  </div>
                )
              ) : previewError ? (
                <div className="doc-modal__no-preview">
                  <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                  <p>No se pudo cargar la vista previa.</p>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{previewError}</small>
                </div>
              ) : (
                <div className="doc-modal__no-preview">
                  <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                  <p>Vista previa no disponible.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Payment confirmation panel ── */}
          <div className="doc-modal__validation-panel">
            <div className="doc-validation__header">
              <h4 className="doc-validation__title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CreditCard size={16} /> Confirmar Pago
              </h4>
              <p className="doc-validation__subtitle">Revise el comprobante y registre los datos del pago.</p>
            </div>

            <div className="doc-validation__form">
              {/* Invoice info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {numeroFactura && (
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>N° Factura</span>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{numeroFactura}</p>
                  </div>
                )}
                {montofactura != null && (
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monto a Validar</span>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0, color: 'var(--accent)' }}>${montofactura.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <label className="doc-validation__label">Método de Pago</label>
              <select
                className="sol-detail-payment-confirm-field__select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginBottom: '0.75rem' }}
              >
                <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                <option value="VENTANILLA">Depósito en Ventanilla</option>
                <option value="ONLINE">Pago en Línea</option>
              </select>

              <label className="doc-validation__label">Referencia / N° Transacción</label>
              <input
                type="text"
                className="sol-detail-payment-confirm-field__input"
                placeholder="Ej: DEP-109283"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
            </div>

            <div className="doc-validation__footer">
              <Button
                type="button"
                disabled={isConfirmingPayment || !paymentReference.trim()}
                onClick={handleConfirmPayment}
                leftIcon={isConfirmingPayment
                  ? <Clock size={15} className="sol-detail-loading__spinner" />
                  : <CheckCircle size={15} />}
                isLoading={isConfirmingPayment}
                color="primary"
                size="sm"
                style={{ width: '100%', justifyContent: 'center' }}
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
