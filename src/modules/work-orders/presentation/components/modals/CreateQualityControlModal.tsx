/**
 * CreateQualityControlModal — Fase 5 (Calidad)
 *
 * SRP: formulario para crear el control de calidad de la OT.
 * Command: CreateQualityControlCommand {
 *   workOrderId, createdByUserId, approved, comments?
 * }
 */
import React, { useState } from 'react';
import { ShieldCheck, ShieldX } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface CreateQualityControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (approved: boolean, comments: string) => Promise<void>;
  isLoading?: boolean;
}

export const CreateQualityControlModal: React.FC<CreateQualityControlModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [approved, setApproved] = useState<boolean>(true);
  const [comments, setComments] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(approved, comments.trim());
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Control de Calidad"
      subtitle={`OT: ${workOrderId}`}
      color="#ec4899"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">Dictamen de Calidad <span className="wo-modal-required">*</span></label>
          <div className="wo-modal-radio-group">
            <label className={`wo-modal-radio ${approved ? 'wo-modal-radio--selected' : ''}`}>
              <input
                type="radio"
                id="wo-qc-approved-yes"
                checked={approved === true}
                onChange={() => setApproved(true)}
              />
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: 4 }} />
              Aprobado — trabajo conforme a norma
            </label>
            <label className={`wo-modal-radio wo-modal-radio--danger ${!approved ? 'wo-modal-radio--selected' : ''}`}>
              <input
                type="radio"
                id="wo-qc-approved-no"
                checked={approved === false}
                onChange={() => setApproved(false)}
              />
              <ShieldX size={14} style={{ display: 'inline', marginRight: 4 }} />
              Rechazado — requiere correcciones
            </label>
          </div>
        </div>
        <div className="wo-modal-field">
          <label className="wo-modal-label">Comentarios técnicos</label>
          <textarea
            id="wo-qc-comments"
            className="wo-modal-textarea"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Observaciones del inspector de calidad..."
            rows={4}
          />
        </div>
        <div className="wo-modal-actions">
          <button type="button" className="wo-modal-btn wo-modal-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#ec4899' } as React.CSSProperties}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Emitir Dictamen'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
