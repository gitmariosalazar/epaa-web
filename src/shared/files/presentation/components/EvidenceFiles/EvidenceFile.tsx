import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, ImageOff, FileText, FileSpreadsheet, File as FileIcon, Download, ExternalLink, X, Eye } from 'lucide-react';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { useFilePreview } from '../../hooks/useFilePreview';
import { useFileDownload } from '../../hooks/useFileDownload';
import type { FileCategory } from '../../../domain/repositories/FileRepository';
import './EvidenceFile.css';

function extractFilename(filePath: string): string {
  return filePath.split('/').pop() ?? filePath;
}

type FileType = 'image' | 'pdf' | 'spreadsheet' | 'document' | 'other';

function detectFileType(filename: string, typeStr?: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const cleanType = typeStr?.toLowerCase() ?? '';

  if (
    ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'].includes(ext) ||
    cleanType.includes('image') ||
    cleanType.includes('foto') ||
    cleanType.includes('photo') ||
    cleanType.includes('jpg') ||
    cleanType.includes('png') ||
    cleanType.includes('jpeg')
  ) {
    return 'image';
  }
  if (ext === 'pdf' || cleanType.includes('pdf')) {
    return 'pdf';
  }
  if (
    ['xls', 'xlsx', 'csv'].includes(ext) ||
    cleanType.includes('excel') ||
    cleanType.includes('sheet') ||
    cleanType.includes('csv') ||
    cleanType.includes('spreadsheet')
  ) {
    return 'spreadsheet';
  }
  if (
    ['doc', 'docx', 'txt', 'rtf'].includes(ext) ||
    cleanType.includes('word') ||
    cleanType.includes('doc') ||
    cleanType.includes('text') ||
    cleanType.includes('txt')
  ) {
    return 'document';
  }
  return 'other';
}

export interface EvidenceFilesProps {
  /** Identifier used in alt text and aria labels (optional when displaying general files) */
  fileId?: number | string;
  /** Complete or partial path of the stored file (e.g. 'fuga.jpg', 'informe.pdf') */
  filePath: string;
  /** Category for authentication and route resolving (default: 'incidents') */
  category?: FileCategory;
  /** Label/tag to display inside the thumbnail (e.g. 'ANTES', 'CONTRATO', 'IMAGE/PNG') */
  type?: string;
  /** Enables the direct download button in the thumbnail (default: true) */
  allowDownload?: boolean;
  /** Callback triggered when clicking on the loaded thumbnail or document */
  onClick?: () => void;
  /** Optional custom CSS class */
  className?: string;
}

/**
 * EvidenceFiles (Universal Secure Document & Photo Thumbnail with In-App Preview Modal)
 *
 * Displays authenticated photos and documents across the system with full screen modal preview and download support.
 *
 * Clean Architecture Principles:
 * - SRP: Handles loading state, file type detection, preview thumbnail layout, in-app modal presentation, and direct file downloads.
 * - DIP: Relies on useFilePreview and useFileDownload abstractions to interact with the Domain and Backend.
 * - OCP/Extension: Easily displays JPG, PNG, PDF, DOCX, XLSX and general attachments cleanly.
 */
export const EvidenceFiles: React.FC<EvidenceFilesProps> = ({
  fileId = 'archivo',
  filePath,
  category = 'incidents',
  type,
  allowDownload = true,
  onClick,
  className = ''
}) => {
  const filename = extractFilename(filePath);
  const fileType = detectFileType(filename, type);
  const ext = filename.split('.').pop()?.toUpperCase() || 'ARCHIVO';

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { blobUrl, loading, error } = useFilePreview(category, filename);
  const { download, isDownloading } = useFileDownload();

  // Lock body scroll & handle ESC key when modal opens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };
    if (isPreviewOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isPreviewOpen]);

  const handleContainerClick = () => {
    if (!blobUrl) return;
    if (onClick) {
      onClick();
    } else {
      setIsPreviewOpen(true);
    }
  };

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await download(category, filename);
  };

  const renderDocIcon = () => {
    switch (fileType) {
      case 'pdf':
        return (
          <div className="evidence-photo-doc-icon-wrapper doc-icon--pdf">
            <FileText size={26} />
          </div>
        );
      case 'spreadsheet':
        return (
          <div className="evidence-photo-doc-icon-wrapper doc-icon--spreadsheet">
            <FileSpreadsheet size={26} />
          </div>
        );
      case 'document':
        return (
          <div className="evidence-photo-doc-icon-wrapper doc-icon--document">
            <FileText size={26} />
          </div>
        );
      default:
        return (
          <div className="evidence-photo-doc-icon-wrapper doc-icon--other">
            <FileIcon size={26} />
          </div>
        );
    }
  };

  return (
    <>
      <div
        className={`evidence-photo-wrapper ${className}`}
        onClick={handleContainerClick}
        style={{ cursor: blobUrl ? 'pointer' : 'default' }}
      >
        <Tooltip
          className="evidence-photo-main-tooltip"
          content={blobUrl ? (fileType === 'image' ? 'Clic para ampliar' : 'Clic para previsualizar documento') : ''}
          position="bottom"
          style={{ width: '100%', height: '100%', display: 'flex', flex: 1 }}
        >
          <button
            type="button"
            className="evidence-photo-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleContainerClick();
            }}
            disabled={!blobUrl}
            aria-label={`Ver archivo ${type || filename} #${fileId}`}
          >
            {loading && (
              <div className="evidence-photo-loading-overlay">
                <Loader2 size={24} className="evidence-photo-loader" />
                <span>Cargando...</span>
              </div>
            )}

            {!loading && (error || !blobUrl) && (
              <div className="evidence-photo-error-overlay">
                <ImageOff size={22} className="evidence-photo-error-icon" />
                <span>Error al cargar</span>
              </div>
            )}

            {!loading && blobUrl && (
              <>
                {fileType === 'image' ? (
                  /* --- Image View --- */
                  <>
                    <img
                      src={blobUrl}
                      alt={`Evidencia #${fileId}`}
                      className="evidence-photo-img"
                    />
                    <div className="evidence-photo-zoom-hint">
                      <span>🔍 Ampliar</span>
                    </div>
                  </>
                ) : (
                  /* --- Document View (PDF, DOCX, XLS) --- */
                  <div className="evidence-photo-doc-container">
                    {renderDocIcon()}
                    <span className="evidence-photo-doc-name" title={filename}>
                      {filename}
                    </span>
                    <span className="evidence-photo-doc-ext">{ext}</span>
                    <div className="evidence-photo-zoom-hint">
                      <ExternalLink size={14} />
                      <span>Abrir</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </button>
        </Tooltip>

        {/* Tag Badge (Top-Left) */}
        {type && <span className="evidence-photo-tag">{type}</span>}

        {/* Direct Download Button (Top-Right Always Visible) */}
        {allowDownload && !loading && blobUrl && (
          <Tooltip
            className="evidence-photo-download-tooltip"
            content="Descargar archivo"
            position="top"
            style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, width: 'auto', height: 'auto', flex: 'none' }}
          >
            <button
              type="button"
              className="evidence-photo-download-btn"
              onClick={handleDownloadClick}
              disabled={isDownloading}
              aria-label={`Descargar ${filename}`}
            >
              {isDownloading ? <Loader2 size={15} className="evidence-photo-loader" /> : <Download size={15} />}
            </button>
          </Tooltip>
        )}
      </div>

      {/* In-App Fullscreen Preview Modal */}
      {isPreviewOpen &&
        blobUrl &&
        createPortal(
          <div
            className="evidence-preview-overlay"
            onClick={() => setIsPreviewOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="evidence-preview-topbar" onClick={(e) => e.stopPropagation()}>
              <div className="evidence-preview-title">
                <Eye size={20} style={{ color: '#60a5fa' }} />
                <span>{type || filename}</span>
              </div>
              <div className="evidence-preview-actions">
                <button
                  type="button"
                  className="evidence-preview-action-btn"
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                >
                  {isDownloading ? <Loader2 size={16} className="evidence-photo-loader" /> : <Download size={16} />}
                  <span>Descargar</span>
                </button>
                <button
                  type="button"
                  className="evidence-preview-close-btn"
                  onClick={() => setIsPreviewOpen(false)}
                  aria-label="Cerrar vista"
                >
                  <X size={18} />
                  <span>Cerrar</span>
                </button>
              </div>
            </div>

            <div className="evidence-preview-content" onClick={(e) => e.stopPropagation()}>
              {fileType === 'image' ? (
                <img
                  src={blobUrl}
                  alt={filename}
                  className="evidence-preview-modal-img"
                />
              ) : fileType === 'pdf' ? (
                <iframe
                  src={blobUrl}
                  title={filename}
                  className="evidence-preview-modal-iframe"
                />
              ) : (
                <div className="evidence-photo-doc-container" style={{ borderRadius: '12px', minWidth: '320px', minHeight: '200px', background: '#f8fafc' }}>
                  {renderDocIcon()}
                  <span className="evidence-photo-doc-name" style={{ fontSize: '1.1rem', marginTop: '12px', color: '#334155' }}>
                    {filename}
                  </span>
                  <button
                    type="button"
                    className="evidence-preview-action-btn"
                    style={{ marginTop: '20px', background: '#3b82f6', color: 'white', padding: '10px 20px' }}
                    onClick={handleDownloadClick}
                  >
                    <Download size={18} />
                    <span>Descargar Archivo Ahora</span>
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

