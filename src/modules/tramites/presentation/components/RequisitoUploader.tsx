// ============================================================
// PRESENTATION — RequisitoUploader (SRP)
// Renders a self-contained file upload area for ONE requisito.
// Handles drag-and-drop, file selection, validation feedback,
// and removal — no coupling to other requisitos.
// ============================================================

import React, { useRef, useState, useCallback } from 'react';
import {
  UploadCloud,
  FileCheck2,
  XCircle,
  AlertTriangle,
  FileImage,
  FileText as FilePdf,
  Paperclip
} from 'lucide-react';
import { ValidateDocumentoUseCase } from '../../application/usecases/ValidateDocumentoUseCase';
import type { DocumentoAdjunto } from '../../domain/models/DocumentoAdjunto';
import type { RequisitoTipo } from '../../domain/models/Tramite';
import './RequisitoUploader.css';

const validateUC = new ValidateDocumentoUseCase();

/** Human-readable file size */
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Accept string per tipo */
const ACCEPT: Record<RequisitoTipo, string> = {
  documento: '.pdf,.jpg,.jpeg,.png,.webp',
  pago:      '.pdf,.jpg,.jpeg,.png,.webp',
  formulario: '.pdf,.jpg,.jpeg,.png,.webp'
};

/** Label per tipo */
const UPLOAD_LABEL: Record<RequisitoTipo, string> = {
  documento:  'Subir documento',
  pago:       'Subir comprobante de pago',
  formulario: 'Subir formulario completado'
};

const FILE_ICON = (type: string): React.ReactNode => {
  if (type.startsWith('image/')) return <FileImage size={16} />;
  if (type === 'application/pdf') return <FilePdf size={16} />;
  return <Paperclip size={16} />;
};

interface RequisitoUploaderProps {
  requisitoId: string;
  tipo: RequisitoTipo;
  descripcion: string;
  adjunto?: DocumentoAdjunto;
  onAttach: (requisitoId: string, file: File) => void;
  onRemove: (requisitoId: string) => void;
  disabled?: boolean;
}

export const RequisitoUploader: React.FC<RequisitoUploaderProps> = ({
  requisitoId,
  tipo,
  descripcion: _descripcion,
  adjunto,
  onRemove,
  onAttach,
  disabled = false
}) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setLocalError(null);
      const result = validateUC.execute(file);
      if (!result.valid) {
        setLocalError(result.error ?? 'Archivo inválido');
        return;
      }
      onAttach(requisitoId, file);
    },
    [requisitoId, onAttach]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // reset input so same file can be re-selected after removal
    e.target.value = '';
  };

  // ── If file already attached ──────────────────────────────
  if (adjunto) {
    const isError = adjunto.estado === 'error';
    const isUploading = adjunto.estado === 'subiendo';
    const isDone = adjunto.estado === 'subido';

    return (
      <div
        className={`req-uploader req-uploader--attached ${isError ? 'req-uploader--error' : ''} ${isDone ? 'req-uploader--done' : ''}`}
        id={`uploader-${requisitoId}`}
      >
        <div className="req-uploader__file-info">
          <span className="req-uploader__file-icon">
            {FILE_ICON(adjunto.file.type)}
          </span>
          <div className="req-uploader__file-meta">
            <span className="req-uploader__file-name">{adjunto.file.name}</span>
            <span className="req-uploader__file-size">{formatSize(adjunto.file.size)}</span>
          </div>
          {isUploading && (
            <span className="req-uploader__badge req-uploader__badge--uploading">
              Subiendo...
            </span>
          )}
          {isDone && (
            <span className="req-uploader__badge req-uploader__badge--done">
              <FileCheck2 size={12} /> Listo
            </span>
          )}
          {isError && (
            <span className="req-uploader__badge req-uploader__badge--error">
              <AlertTriangle size={12} /> Error
            </span>
          )}
          {!isDone && !isUploading && (
            <span className="req-uploader__badge req-uploader__badge--pending">
              Pendiente
            </span>
          )}
        </div>

        {adjunto.errorMsg && (
          <p className="req-uploader__error-msg">{adjunto.errorMsg}</p>
        )}

        <button
          type="button"
          className="req-uploader__remove"
          onClick={() => onRemove(requisitoId)}
          title="Quitar archivo"
          disabled={isUploading}
          id={`btn-remove-${requisitoId}`}
        >
          <XCircle size={16} />
          <span>Cambiar</span>
        </button>
      </div>
    );
  }

  // ── Empty dropzone ─────────────────────────────────────────
  return (
    <div
      className={`req-uploader req-uploader--empty ${isDragging ? 'req-uploader--dragging' : ''} ${disabled ? 'req-uploader--disabled' : ''}`}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
      id={`uploader-${requisitoId}`}
      title={UPLOAD_LABEL[tipo]}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[tipo]}
        onChange={handleChange}
        style={{ display: 'none' }}
        id={`input-file-${requisitoId}`}
        disabled={disabled}
      />

      <UploadCloud size={18} className="req-uploader__cloud-icon" />
      <span className="req-uploader__label">{UPLOAD_LABEL[tipo]}</span>
      <span className="req-uploader__hint">PDF, JPG, PNG · Máx 10 MB</span>

      {localError && (
        <p className="req-uploader__error-msg" onClick={(e) => e.stopPropagation()}>
          <AlertTriangle size={12} /> {localError}
        </p>
      )}
    </div>
  );
};
