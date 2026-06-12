/**
 * AssignToWorkerModal — Fase 2
 *
 * SRP: formulario para asignar OT a técnico individual.
 * Command: AssignWorkOrderToWorkerCommand { workOrderId, workerId, assignedByUserId, comment? }
 */
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface AssignToWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (workerId: string, comment: string) => Promise<void>;
  isLoading?: boolean;
}

export const AssignToWorkerModal: React.FC<AssignToWorkerModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [workerId, setWorkerId] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId.trim()) return;
    await onSubmit(workerId.trim(), comment.trim());
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar a Técnico"
      subtitle={`OT: ${workOrderId}`}
      color="#6366f1"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">
            <User size={13} /> ID del Técnico <span className="wo-modal-required">*</span>
          </label>
          <input
            id="wo-assign-worker-id"
            className="wo-modal-input"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            placeholder="UUID del técnico"
            required
            autoFocus
          />
        </div>
        <div className="wo-modal-field">
          <label className="wo-modal-label">Comentario (opcional)</label>
          <textarea
            id="wo-assign-worker-comment"
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
            style={{ '--btn-color': '#6366f1' } as React.CSSProperties}
            disabled={!workerId.trim() || isLoading}
          >
            {isLoading ? 'Asignando...' : 'Asignar Técnico'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
