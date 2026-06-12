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

const FILE_TYPES = ['FOTO', 'VIDEO', 'DOCUMENTO', 'INFORME', 'OTRO'];

interface AddAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (fileName: string, fileType: string, fileUrl: string) => Promise<void>;
  isLoading?: boolean;
}

export const AddAttachmentModal: React.FC<AddAttachmentModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('FOTO');
  const [fileUrl, setFileUrl]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) return;
    await onSubmit(fileName.trim(), fileType, fileUrl.trim());
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
            <Paperclip size={13} /> Nombre del archivo <span className="wo-modal-required">*</span>
          </label>
          <input
            id="wo-attach-name"
            className="wo-modal-input"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Ej: evidencia-campo-01.jpg"
            required
            autoFocus
          />
        </div>
        <div className="wo-modal-field">
          <label className="wo-modal-label">Tipo de archivo <span className="wo-modal-required">*</span></label>
          <select
            id="wo-attach-type"
            className="wo-modal-select"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            {FILE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="wo-modal-field">
          <label className="wo-modal-label">URL del archivo <span className="wo-modal-required">*</span></label>
          <input
            id="wo-attach-url"
            type="url"
            className="wo-modal-input"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://storage.empresa.com/..."
            required
          />
        </div>
        <div className="wo-modal-actions">
          <button type="button" className="wo-modal-btn wo-modal-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#0891b2' } as React.CSSProperties}
            disabled={!fileName.trim() || !fileUrl.trim() || isLoading}
          >
            {isLoading ? 'Subiendo...' : 'Adjuntar Evidencia'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
