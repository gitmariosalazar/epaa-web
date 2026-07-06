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
import React, { useState, useEffect } from 'react';
import {
  X, FileText, Download, ExternalLink, AlertTriangle,
  Loader2, CheckCircle, Clock, CreditCard, Upload, Trash2
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
  handleConfirmPayment: (file?: File) => void;
  /** Loading state while rejecting payment */
  isRejectingPayment?: boolean;
  /** Reject payment handler */
  handleRejectPayment?: (reason: string) => void;
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
  isRejectingPayment = false,
  handleRejectPayment,
}) => {
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [forceUpload, setForceUpload] = useState<boolean>(false);
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');

  useEffect(() => {
    if (localFile) {
      const url = URL.createObjectURL(localFile);
      setLocalPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLocalPreviewUrl(null);
    }
  }, [localFile]);

  // ── Document preview & download (delegated to dedicated hooks) ───────────────

  const {
    blobUrl: previewBlobUrl,
    mimeType: previewMimeType,
    loading: loadingPreview,
    error: previewError
  } = useDocumentPreview(documento?.id, documento?.url);

  const { download, isDownloading } = useDocumentDownload();

  const isPdf   = (localFile ? localFile.type === 'application/pdf' : previewMimeType === 'application/pdf');
  const isImage = (localFile ? localFile.type.startsWith('image/') : previewMimeType?.startsWith('image/') ?? false);

  const activePreviewUrl = localPreviewUrl || previewBlobUrl;

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!documento) return;
    const filename = documento.url?.split('/').pop()?.split('.')[0] || 'comprobante';
    download(documento.id, documento.url, filename);
  };

  // ── Early exit ────────────────────────────────────────────────────────────────

  if (!isOpen) {
    if (showRejectForm) setShowRejectForm(false);
    return null;
  }

  const hasDocument = (!!documento || !!localFile) && !forceUpload;

  const onRejectSubmit = () => {
    if (handleRejectPayment && rejectReason.trim()) {
      handleRejectPayment(rejectReason);
    }
  };

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
              {!hasDocument ? (
                <div className="doc-modal__no-preview" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
                  <AlertTriangle size={48} style={{ color: '#f59e0b' }} />
                  <p>El comprobante de pago no ha sido cargado aún.</p>
                  
                  <label
                    htmlFor="admin-receipt-upload"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: '0.5rem', padding: '1.5rem', border: '2px dashed var(--border-color)', borderRadius: '8px',
                      cursor: 'pointer', background: 'var(--bg-secondary)', transition: 'all 0.2s', marginTop: '1rem'
                    }}
                  >
                    <input
                      type="file"
                      id="admin-receipt-upload"
                      style={{ display: 'none' }}
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLocalFile(file);
                          setForceUpload(false);
                        }
                      }}
                    />
                    <Upload size={24} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent)' }}>Cargar Comprobante</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Haga clic para seleccionar una imagen o PDF</span>
                  </label>
                </div>
              ) : !localFile && loadingPreview ? (
                <div className="doc-modal__no-preview"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem' }}>
                  <Loader2 size={28} style={{ color: 'var(--accent)', animation: 'btn-spin 0.8s linear infinite' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cargando vista previa...</p>
                </div>
              ) : activePreviewUrl ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {localFile && (
                    <button
                      onClick={() => setLocalFile(null)}
                      style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'var(--error)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  )}
                  {isPdf ? (
                    <iframe
                      key={activePreviewUrl}
                      src={`${activePreviewUrl}#toolbar=1&navpanes=0`}
                      title="Comprobante de Pago"
                      className="doc-modal__iframe"
                    />
                  ) : isImage ? (
                    <div className="doc-modal__no-preview"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '1rem', boxSizing: 'border-box' }}>
                      <img
                        src={activePreviewUrl}
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
                  )}
                </div>
              ) : previewError ? (
                <div className="doc-modal__no-preview">
                  <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                  <p>No se pudo cargar la vista previa.</p>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>{previewError}</small>
                  <Button size="sm" variant="outline" onClick={() => setForceUpload(true)} leftIcon={<Upload size={14} />}>
                    Volver a subir comprobante
                  </Button>
                </div>
              ) : (
                <div className="doc-modal__no-preview">
                  <FileText size={48} style={{ color: 'var(--text-muted)' }} />
                  <p>Vista previa no disponible.</p>
                  <Button size="sm" variant="outline" onClick={() => setForceUpload(true)} leftIcon={<Upload size={14} />} style={{ marginTop: '1rem' }}>
                    Subir nuevo comprobante
                  </Button>
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
              {!showRejectForm ? (
                <>
                  <Button
                    type="button"
                    disabled={isConfirmingPayment || !paymentReference.trim() || !hasDocument}
                    onClick={() => handleConfirmPayment(localFile ?? undefined)}
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
                  
                  {handleRejectPayment && hasDocument && (
                    <Button
                      type="button"
                      disabled={isConfirmingPayment}
                      onClick={() => setShowRejectForm(true)}
                      color="error"
                      variant="outline"
                      size="sm"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                    >
                      Rechazar Comprobante
                    </Button>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <label className="doc-validation__label" style={{ color: 'var(--error)' }}>Motivo del Rechazo</label>
                  <textarea
                    className="sol-detail-payment-confirm-field__input"
                    rows={3}
                    placeholder="Escriba el motivo (ej. El comprobante está borroso o incompleto)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      type="button"
                      disabled={isRejectingPayment}
                      onClick={() => setShowRejectForm(false)}
                      variant="ghost"
                      size="sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      disabled={isRejectingPayment || !rejectReason.trim()}
                      onClick={onRejectSubmit}
                      isLoading={isRejectingPayment}
                      color="error"
                      size="sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {isRejectingPayment ? 'Rechazando...' : 'Rechazar'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
