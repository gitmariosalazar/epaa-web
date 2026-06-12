/**
 * AssignToCrewModal — Fase 2
 *
 * SRP: formulario para asignar técnico responsable a la OT.
 * DIP: recibe onSubmit (de la página) que llama al UseCase.
 * Command: AssignWorkOrderToCrewCommand { workOrderId, crewId, assignedByUserId, comment? }
 */
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface AssignToCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  assignedByUserId: string;
  onSubmit: (crewId: string, comment: string) => Promise<void>;
  isLoading?: boolean;
}

export const AssignToCrewModal: React.FC<AssignToCrewModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [crewId, setCrewId] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewId.trim()) return;
    await onSubmit(crewId.trim(), comment.trim());
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar Técnico Responsable"
      subtitle={`OT: ${workOrderId}`}
      color="#3b82f6"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">
            <Users size={13} /> Usuario ID del Técnico <span className="wo-modal-required">*</span>
          </label>
          <input
            id="wo-assign-crew-id"
            className="wo-modal-input"
            value={crewId}
            onChange={(e) => setCrewId(e.target.value)}
            placeholder="UUID del técnico responsable"
            required
            autoFocus
          />
        </div>
        <div className="wo-modal-field">
          <label className="wo-modal-label">Comentario (opcional)</label>
          <textarea
            id="wo-assign-crew-comment"
            className="wo-modal-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Observaciones de asignación..."
            rows={3}
          />
        </div>
        <div className="wo-modal-actions">
          <button type="button" className="wo-modal-btn wo-modal-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#3b82f6' } as React.CSSProperties}
            disabled={!crewId.trim() || isLoading}
          >
            {isLoading ? 'Asignando...' : 'Asignar Técnico'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
