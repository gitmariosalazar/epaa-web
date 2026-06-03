// ============================================================
// PRESENTATION — DocumentUploadCard (SRP)
// Renders ONE uploadable document card for the solicitud wizard.
// Handles drag-drop, file selection, validation, and removal.
// ============================================================

import React, { useRef, useState, useCallback } from 'react';
import {
  UploadCloud, X, AlertTriangle,
  FileImage, FileText, Paperclip, Info, Check
} from 'lucide-react';
import { ValidateDocumentoUseCase } from '@/modules/tramites/application/usecases/ValidateDocumentoUseCase';
import type { Requisito } from '@/modules/tramites/domain/models/Tramite';
import type { DocumentoAdjunto } from '@/modules/tramites/domain/models/DocumentoAdjunto';
import './DocumentUploadCard.css';

const validateUC = new ValidateDocumentoUseCase();

/* helpers */
const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const FileIcon = ({ type }: { type: string }) => {
  if (type.startsWith('image/')) return <FileImage size={16} />;
  if (type === 'application/pdf') return <FileText size={16} />;
  return <Paperclip size={16} />;
};

/* Color config per tipo */
const TIPO: Record<string, { color: string; bg: string; label: string; uploadLabel: string }> = {
  documento: {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    label: 'Documento',
    uploadLabel: 'Subir documento'
  },
  pago: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    label: 'Pago',
    uploadLabel: 'Subir comprobante'
  },
  formulario: {
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    label: 'Formulario',
    uploadLabel: 'Subir formulario'
  }
};

interface DocumentUploadCardProps {
  requisito: Requisito;
  index: number;
  adjunto?: DocumentoAdjunto;
  onAttach: (requisitoId: string, file: File) => void;
  onRemove: (requisitoId: string) => void;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  requisito,
  index,
  adjunto,
  onAttach,
  onRemove
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const config = TIPO[requisito.tipo];
  const isUploaded = Boolean(adjunto);

  const processFile = useCallback((file: File) => {
    setLocalError(null);
    const res = validateUC.execute(file);
    if (!res.valid) { setLocalError(res.error ?? 'Archivo inválido'); return; }
    onAttach(requisito.id, file);
  }, [requisito.id, onAttach]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div
      className={`doc-card ${isUploaded ? 'doc-card--uploaded' : 'doc-card--required-empty'}`}
      style={{ '--doc-color': config.color } as React.CSSProperties}
      id={`doc-card-${requisito.id}`}
    >
      {/* Top color strip */}
      <div
        className="doc-card__strip"
        style={{ background: isUploaded ? '#10b981' : config.color }}
      />

      {/* Success check badge */}
      {isUploaded && (
        <div className="doc-card__uploaded-badge">
          <Check size={13} />
        </div>
      )}

      {/* Header */}
      <div className="doc-card__header">
        <div
          className="doc-card__icon-wrap"
          style={{ background: isUploaded ? 'rgba(16,185,129,0.12)' : config.bg, color: isUploaded ? '#10b981' : config.color }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{index + 1}</span>
        </div>
        <div className="doc-card__meta">
          <p className="doc-card__name" title={requisito.descripcion}>{requisito.descripcion}</p>
          {requisito.nota && (
            <p className="doc-card__note">
              <Info size={10} />
              {requisito.nota}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="doc-card__badges">
        <span
          className="doc-card__badge"
          style={{ background: config.bg, color: config.color }}
        >
          {config.label}
        </span>
        {requisito.obligatorio
          ? <span className="doc-card__required">Obligatorio</span>
          : <span className="doc-card__optional">Opcional</span>
        }
        {requisito.costo !== undefined && (
          <span className="doc-card__cost">${requisito.costo.toFixed(2)}</span>
        )}
      </div>

      {/* File area */}
      {isUploaded && adjunto ? (
        <div className="doc-card__file-preview">
          <span className="doc-card__file-icon">
            <FileIcon type={adjunto.file.type} />
          </span>
          <span className="doc-card__file-name" title={adjunto.file.name}>
            {adjunto.file.name}
          </span>
          <span className="doc-card__file-size">{formatSize(adjunto.file.size)}</span>
          <button
            type="button"
            className="doc-card__file-remove"
            onClick={() => onRemove(requisito.id)}
            title="Quitar archivo"
            id={`btn-remove-doc-${requisito.id}`}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            style={{ display: 'none' }}
            id={`input-file-${requisito.id}`}
          />
          {/* Full-height clickable upload zone */}
          <div
            className={`doc-card__dropzone ${isDragging ? 'doc-card__dropzone--dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            aria-label={config.uploadLabel}
          >
            <div className="doc-card__upload-btn">
              <UploadCloud size={18} />
              <span>{config.uploadLabel}</span>
            </div>
            <span className="doc-card__dropzone-hint">PDF · JPG · PNG · Máx 10 MB</span>
          </div>

          {localError && (
            <div className="doc-card__error">
              <AlertTriangle size={12} /> {localError}
            </div>
          )}
        </>
      )}
    </div>
  );
};
