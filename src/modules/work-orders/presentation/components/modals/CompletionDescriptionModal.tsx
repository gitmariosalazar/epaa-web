/**
 * CompletionDescriptionModal — Modal para ingresar descripción y evidencias al completar la OT.
 *
 * Espejo web exacto de `completion_description_dialog.dart` (Mobile).
 *
 * Principios SOLID:
 *   - SRP: responsable únicamente de recolectar la descripción de finalización y evidencias opcionales.
 *   - OCP: extensible mediante props sin alterar la lógica de cierre.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  FileText,
  UploadCloud,
  X,
  FileCheck2,
  Image as ImageIcon
} from 'lucide-react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { TextArea } from '@/shared/presentation/components/TextArea/TextArea';
import './CompletionDescriptionModal.css';

export interface CompletionDescriptionResult {
  description: string;
  files: File[];
}

interface CompletionDescriptionModalProps {
  isOpen: boolean;
  orderCode: string;
  onClose: () => void;
  onSubmit: (result: CompletionDescriptionResult) => void | Promise<void>;
  isLoading?: boolean;
}

export const CompletionDescriptionModal: React.FC<CompletionDescriptionModalProps> = ({
  isOpen,
  orderCode,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpiar object URLs al desmontar o cerrar
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p) URL.revokeObjectURL(p);
      });
    };
  }, [previews]);

  const handleFilesSelected = (newFiles: FileList | File[]) => {
    const list = Array.from(newFiles);
    if (files.length + list.length > 10) {
      setError('Máximo 10 archivos de evidencia a la vez.');
      return;
    }
    setError(null);

    const newPreviews = list.map((file) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });

    setFiles((prev) => [...prev, ...list]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const updated = [...prev];
      if (updated[index]) URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = description.trim();
    if (!clean) {
      setError('Ingresa la descripción de finalización.');
      return;
    }
    setError(null);
    await onSubmit({
      description: clean,
      files,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      headerColor="green"
      icon={<CheckCircle2 size={20} />}
      title="Finalizar trabajo"
      description={`Orden de Trabajo: ${orderCode} — Describe lo realizado y adjunta evidencias`}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={<CheckCircle2 size={16} />}
          >
            Continuar y Completar
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="completion-description-modal__body">
        {/* Campo descripción */}
        <div className="completion-description-modal__section">
          <label className="completion-description-modal__label">
            <FileText size={16} className="completion-description-modal__label-icon" />
            <span>Descripción del trabajo <span style={{ color: 'var(--error, #ef4444)' }}>*</span></span>
          </label>
          <TextArea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error && e.target.value.trim()) setError(null);
            }}
            placeholder="Describe las tareas realizadas, materiales usados y el resultado final..."
            rows={4}
            className="completion-description-modal__textarea"
            autoFocus
          />
          {error && <span className="completion-description-modal__error-text">{error}</span>}
        </div>

        {/* Sección de evidencias */}
        <div className="completion-description-modal__section" style={{ marginTop: '1.25rem' }}>
          <div className="completion-description-modal__evidence-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={16} className="completion-description-modal__label-icon" />
              <span className="completion-description-modal__label">Evidencias del trabajo</span>
            </div>
            {files.length > 0 && (
              <span className="completion-description-modal__badge">
                {files.length} archivo{files.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="completion-description-modal__subtitle">
            Fotos, documentos o archivos que respalden el trabajo realizado
          </p>

          {/* Drag & Drop Area */}
          <div
            className={`completion-description-modal__dropzone ${isDragging ? 'is-dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFilesSelected(e.dataTransfer.files);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={28} className="completion-description-modal__dropzone-icon" />
            <div className="completion-description-modal__dropzone-text">
              <strong>Haz clic para seleccionar</strong> o arrastra y suelta tus archivos aquí
            </div>
            <span className="completion-description-modal__dropzone-hint">
              JPG, PNG, PDF hasta 10 MB (máximo 10 archivos)
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) handleFilesSelected(e.target.files);
              }}
            />
          </div>

          {/* Thumbnails preview */}
          {files.length > 0 && (
            <div className="completion-description-modal__previews-grid">
              {files.map((file, idx) => {
                const preview = previews[idx];
                return (
                  <div key={idx} className="completion-description-modal__preview-item">
                    {preview ? (
                      <img src={preview} alt={file.name} className="completion-description-modal__thumb" />
                    ) : (
                      <div className="completion-description-modal__doc-thumb">
                        <FileCheck2 size={24} color="#3b82f6" />
                        <span className="completion-description-modal__doc-name">{file.name}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="completion-description-modal__remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(idx);
                      }}
                      title="Quitar archivo"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};
