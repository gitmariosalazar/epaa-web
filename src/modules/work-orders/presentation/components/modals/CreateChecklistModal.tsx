/**
 * CreateChecklistModal — Fase 3 (Preparación)
 *
 * SRP: formulario para crear inspección de preparación (checklist).
 * Command: CreatePreparationInspectionCommand {
 *   workOrderId, createdByUserId, passed, observations?
 * }
 */
import React, { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface CreateChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (passed: boolean, observations: string) => Promise<void>;
  isLoading?: boolean;
}

export const CreateChecklistModal: React.FC<CreateChecklistModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [passed, setPassed] = useState<boolean>(true);
  const [observations, setObservations] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(passed, observations.trim());
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Inspección de Preparación"
      subtitle={`OT: ${workOrderId}`}
      color="#8b5cf6"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">
            <ClipboardCheck size={13} /> Resultado del Checklist <span className="wo-modal-required">*</span>
          </label>
          <div className="wo-modal-radio-group">
            <label className={`wo-modal-radio ${passed ? 'wo-modal-radio--selected' : ''}`}>
              <input
                type="radio"
                id="wo-checklist-passed-yes"
                checked={passed === true}
                onChange={() => setPassed(true)}
              />
              ✓ Aprobado — proceder a ejecución
            </label>
            <label className={`wo-modal-radio wo-modal-radio--danger ${!passed ? 'wo-modal-radio--selected' : ''}`}>
              <input
                type="radio"
                id="wo-checklist-passed-no"
                checked={passed === false}
                onChange={() => setPassed(false)}
              />
              ✗ Rechazado — revisar antes de proceder
            </label>
          </div>
        </div>
        <div className="wo-modal-field">
          <label className="wo-modal-label">Observaciones de preparación</label>
          <textarea
            id="wo-checklist-observations"
            className="wo-modal-textarea"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Detalle del estado de preparación..."
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
            style={{ '--btn-color': '#8b5cf6' } as React.CSSProperties}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Registrar Checklist'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
