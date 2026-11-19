import React, { useEffect } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import {
  RotateCcw,
  AlertTriangle,
  FileCheck,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useRevertStateHistoryModal } from '../hooks/useRevertStateHistoryModal';
import { renderStateChip, formatStateHistoryDate } from '../utils/stateCatalogUtils';
import type { StateHistory } from '../../domain/models/StateHistory';
import '../styles/StateHistoryModal.css';

export interface RevertStateHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  specificHistorialId?: number;
  onSuccess?: (historyRecord: StateHistory) => void;
}

export const RevertStateHistoryModal: React.FC<RevertStateHistoryModalProps> = ({
  isOpen,
  onClose,
  connectionId,
  specificHistorialId,
  onSuccess
}) => {
  const modalHook = useRevertStateHistoryModal({
    onSuccess: (record) => {
      if (onSuccess) onSuccess(record);
      onClose();
    }
  });

  useEffect(() => {
    if (isOpen && connectionId) {
      modalHook.openModal(connectionId, specificHistorialId);
    }
  }, [isOpen, connectionId, specificHistorialId]);

  if (!isOpen) return null;

  const { reversibleRecord, isCheckingEligibility } = modalHook;
  const isReversible = reversibleRecord?.isReversible ?? false;
  const targetRecord = reversibleRecord?.record;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={18} color="var(--error, #ef4444)" />
          <span>Revertir Transición Errónea de Estado</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ({connectionId})
          </span>
        </div>
      }
      description="Operación de compensación y auditoría (es_reverso=true). Restaura la acometida a su estado anterior."
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <Button variant="subtle" onClick={onClose} disabled={modalHook.isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => modalHook.handleSubmit()}
            disabled={
              modalHook.isSubmitting ||
              !isReversible ||
              !modalHook.historialId ||
              !modalHook.reason.trim()
            }
            style={{ backgroundColor: 'var(--error, #ef4444)' }}
          >
            {modalHook.isSubmitting ? 'Ejecutando Reverso...' : 'Confirmar y Revertir Estado'}
          </Button>
        </div>
      }
    >
      <form onSubmit={modalHook.handleSubmit} className="state-modal-form">
        {isCheckingEligibility ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px' }}>
            <CircularProgress size={24} strokeWidth={3} progress={70} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Verificando elegibilidad de reverso...
            </span>
          </div>
        ) : !isReversible ? (
          <div className="revert-warning-banner">
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Reversión Bloqueada</strong>
              <p style={{ margin: '4px 0 0 0' }}>
                {reversibleRecord?.message ||
                  'Esta acometida no tiene un cambio de estado activo susceptible de reversión bajo las reglas de auditoría.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Registro a Revertir */}
            {targetRecord && (
              <div className="state-current-banner">
                <div className="state-current-label">
                  <span>Registro de Historial #{targetRecord.historialId}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Aplicado el {formatStateHistoryDate(targetRecord.changeDate)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {renderStateChip(targetRecord.newStateId, targetRecord.newStateName, 'sm')}
                  <span>→</span>
                  {renderStateChip(
                    targetRecord.previousStateId,
                    targetRecord.previousStateName || 'Anterior',
                    'sm'
                  )}
                </div>
              </div>
            )}

            {/* Justificación obligatoria */}
            <div className="state-modal-col">
              <Input
                label="Motivo / Justificación de la Reversión *"
                placeholder="Ej: Se cortó predio equivocado; subsanación de error operativo de cuadrilla"
                value={modalHook.reason}
                onChange={(e) => modalHook.setReason(e.target.value)}
                required
              />
            </div>

            {/* Resolución de Supervisión */}
            <div className="state-modal-col">
              <Input
                label="Resolución de Supervisión / Documento de Respaldo"
                placeholder="Ej: RES-SUPERVISOR-2026-009"
                value={modalHook.supportDocument}
                onChange={(e) => modalHook.setSupportDocument(e.target.value)}
              />
            </div>

            {/* Archivo de Evidencia */}
            <div className="state-modal-col">
              <label className="state-modal-label">
                Acta de Supervisión o Evidencia Física (Opcional)
              </label>
              {modalHook.file ? (
                <div className="state-file-preview">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck size={18} color="var(--success, #10b981)" />
                    <span className="state-file-name">{modalHook.file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    circle
                    onClick={() => modalHook.setFile(null)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <label className="state-file-dropzone">
                  <Upload size={20} />
                  <span>Adjuntar PDF o imagen de autorización</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        modalHook.setFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Observaciones */}
            <div className="state-modal-col">
              <Input
                label="Observaciones del Supervisor"
                placeholder="Ej: Se restablece servicio inmediatamente en sitio."
                value={modalHook.observations}
                onChange={(e) => modalHook.setObservations(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Error si ocurre */}
        {modalHook.error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--error, #ef4444)',
              fontSize: '0.85rem',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              padding: '10px 14px',
              borderRadius: '6px'
            }}
          >
            <AlertCircle size={16} />
            <span>{modalHook.error}</span>
          </div>
        )}
      </form>
    </Modal>
  );
};
