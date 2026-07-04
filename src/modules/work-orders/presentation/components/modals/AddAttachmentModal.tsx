/**
 * AddAttachmentModal — Fase 4 (Ejecución)
 *
 * SRP: formulario para adjuntar evidencia de campo.
 * Command: AddWorkOrderAttachmentCommand {
 *   workOrderId, fileName, fileType, fileUrl, createdByUserId
 * }
 * Nota: por ahora acepta URL directa (no multipart upload).
 *       Cuando se requiera upload real, solo cambia la implementación aquí.
 */
import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface AddAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (files: File[]) => Promise<void>;
  isLoading?: boolean;
}

export const AddAttachmentModal: React.FC<AddAttachmentModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    await onSubmit(selectedFiles);
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Adjuntar Evidencia de Campo"
      subtitle={`OT: ${workOrderId}`}
      color="#0891b2"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">
            <Paperclip size={13} /> Seleccionar Archivos (Max. 10) <span className="wo-modal-required">*</span>
          </label>
          <input
            type="file"
            className="wo-modal-input"
            style={{ padding: '0.5rem', background: 'var(--surface-color)' }}
            onChange={(e) => {
              if (e.target.files) {
                const filesArray = Array.from(e.target.files);
                if (filesArray.length > 10) {
                  alert('Máximo 10 archivos a la vez.');
                  e.target.value = '';
                  return;
                }
                setSelectedFiles(filesArray);
              }
            }}
            multiple
            required
            disabled={isLoading}
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className="wo-modal-field" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Se subirán {selectedFiles.length} archivo(s).
          </div>
        )}
        <div className="wo-modal-actions">
          <button type="button" className="wo-modal-btn wo-modal-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#0891b2' } as React.CSSProperties}
            disabled={selectedFiles.length === 0 || isLoading}
          >
            {isLoading ? 'Subiendo...' : 'Adjuntar Evidencia'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
