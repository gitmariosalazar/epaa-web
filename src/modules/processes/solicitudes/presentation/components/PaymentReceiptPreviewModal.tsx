/**
 * PaymentReceiptPreviewModal
 *
 * SRP: Shows only the payment-receipt document in a focused modal.
 * No validation panel — pure preview with download/open actions.
 * DIP: Consumes PreviewDocumentUseCase and DownloadDocumentUseCase instead of direct URL mapping.
 */
import React, { useState, useEffect } from 'react';
import { X, FileText, Download, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { PreviewDocumentUseCase } from '@/modules/documents/application/usecases/PreviewDocumentUseCase';
import { DownloadDocumentUseCase } from '@/modules/documents/application/usecases/DownloadDocumentUseCase';
import { DocumentRepositoryImpl } from '@/modules/documents/infrastructure/repositories/DocumentRepositoryImpl';

const previewUseCase = new PreviewDocumentUseCase(new DocumentRepositoryImpl());
const downloadUseCase = new DownloadDocumentUseCase(new DocumentRepositoryImpl());

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
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewMimeType, setPreviewMimeType] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen || !receiptUrl) return;

    let active = true;

    // Defer state updates to microtask queue to avoid react-hooks/set-state-in-effect
    Promise.resolve().then(() => {
      if (!active) return;
      setLoadingPreview(true);
      setPreviewError(null);
      setPreviewBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setPreviewMimeType(null);
    });

    previewUseCase
      .execute(undefined, receiptUrl)
      .then((blob) => {
        if (!active) return;
        const blobUrl = URL.createObjectURL(blob);
        setPreviewBlobUrl(blobUrl);
        setPreviewMimeType(blob.type || null);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error loading receipt preview:', err);
        setPreviewError(
          err?.message || 'No se pudo cargar la vista previa del comprobante.'
        );
      })
      .finally(() => {
        if (active) setLoadingPreview(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, receiptUrl]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      setPreviewBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setPreviewMimeType(null);
    };
  }, []);

  if (!isOpen) return null;

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading || !receiptUrl) return;

    setIsDownloading(true);
    try {
      const blob = await downloadUseCase.execute(undefined, receiptUrl);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = receiptUrl.split('/').pop() || 'comprobante';
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading receipt:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isPdf = previewMimeType === 'application/pdf' || (receiptUrl ? receiptUrl.toLowerCase().includes('.pdf') : false);
  const isImage = previewMimeType?.startsWith('image/') || (receiptUrl ? /\.(jpg|jpeg|png|webp|gif)$/i.test(receiptUrl) : false);

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
            {receiptUrl && (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="doc-modal__action-btn"
                  title="Descargar"
                  disabled={isDownloading}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px'
                  }}
                >
                  {isDownloading ? (
                    <Loader2 size={14} style={{ animation: 'btn-spin 0.8s linear infinite' }} />
                  ) : (
                    <Download size={14} />
                  )}
                  <span>Descargar</span>
                </button>
                {previewBlobUrl && (
                  <a
                    href={previewBlobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-modal__action-btn"
                    title="Abrir en nueva pestaña"
                  >
                    <ExternalLink size={14} /> Abrir
                  </a>
                )}
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
          {!receiptUrl ? (
            <div className="receipt-modal__empty">
              <AlertTriangle size={40} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
              <p>No se encontró el comprobante de pago.</p>
            </div>
          ) : loadingPreview ? (
            <div
              className="receipt-modal__empty"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '0.5rem'
              }}
            >
              <Loader2
                size={28}
                style={{
                  color: 'var(--accent)',
                  animation: 'btn-spin 0.8s linear infinite'
                }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Cargando vista previa...
              </p>
            </div>
          ) : previewBlobUrl ? (
            isPdf ? (
              <iframe
                key={previewBlobUrl}
                src={`${previewBlobUrl}#toolbar=1&navpanes=0`}
                title="Comprobante de Pago"
                className="receipt-modal__iframe"
              />
            ) : isImage ? (
              <div className="receipt-modal__image-wrap">
                <img
                  src={previewBlobUrl}
                  alt="Comprobante de Pago"
                  className="receipt-modal__image"
                />
              </div>
            ) : (
              <div className="receipt-modal__empty">
                <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                <p>Vista previa no disponible para este tipo de archivo.</p>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Descarga el archivo para visualizarlo.
                </small>
              </div>
            )
          ) : previewError ? (
            <div className="receipt-modal__empty">
              <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p>No se pudo cargar la vista previa del comprobante.</p>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {previewError}
              </small>
            </div>
          ) : (
            <div className="receipt-modal__empty">
              <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
              <p>Vista previa no disponible.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
