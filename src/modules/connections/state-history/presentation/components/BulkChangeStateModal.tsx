import React, { useEffect } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStateHistoryContext } from '../context/StateHistoryContext';
import { useBulkChangeStateModal } from '../hooks/useBulkChangeStateModal';
import type { BulkStateChangeResult } from '../../domain/models/StateHistory';
import '../styles/StateHistoryModal.css';

export interface BulkChangeStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConnectionIds: string[];
  onSuccess?: (result: BulkStateChangeResult) => void;
}

export const BulkChangeStateModal: React.FC<BulkChangeStateModalProps> = ({
  isOpen,
  onClose,
  selectedConnectionIds,
  onSuccess
}) => {
  const { catalog } = useStateHistoryContext();
  const bulkHook = useBulkChangeStateModal({
    onSuccess: (res) => {
      if (onSuccess) onSuccess(res);
    }
  });

  useEffect(() => {
    if (isOpen && selectedConnectionIds.length > 0) {
      bulkHook.openModal(selectedConnectionIds);
    }
  }, [isOpen, selectedConnectionIds]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="var(--primary, #0ea5e9)" />
          <span>Transición Masiva de Estado</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ({selectedConnectionIds.length} acometidas)
          </span>
        </div>
      }
      description="Aplica un cambio de estado en lote garantizando bloqueos ordenados anti-deadlock."
      size="md"
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            width: '100%'
          }}
        >
          <Button
            variant="subtle"
            onClick={onClose}
            disabled={bulkHook.isSubmitting}
          >
            {bulkHook.result ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!bulkHook.result && (
            <Button
              variant="primary"
              onClick={() => bulkHook.handleSubmit()}
              disabled={
                bulkHook.isSubmitting ||
                !bulkHook.newStateId ||
                !bulkHook.reason.trim() ||
                selectedConnectionIds.length === 0
              }
            >
              {bulkHook.isSubmitting
                ? 'Procesando Transición...'
                : `Aplicar a ${selectedConnectionIds.length} Acometidas`}
            </Button>
          )}
        </div>
      }
    >
      <form onSubmit={bulkHook.handleSubmit} className="state-modal-form">
        {bulkHook.result ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#047857'
              }}
            >
              <CheckCircle2 size={24} />
              <div>
                <strong>Transición Masiva Completada</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>
                  {bulkHook.result.totalUpdated} de{' '}
                  {bulkHook.result.totalRequested} acometidas fueron
                  actualizadas exitosamente a {bulkHook.result.newStateName}.
                </p>
              </div>
            </div>

            {bulkHook.result.failedConnectionIds.length > 0 && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#b91c1c'
                }}
              >
                <strong>
                  Acometidas no actualizadas (
                  {bulkHook.result.failedConnectionIds.length}):
                </strong>
                <ul
                  style={{
                    margin: '6px 0 0 0',
                    paddingLeft: '20px',
                    fontSize: '0.825rem'
                  }}
                >
                  {bulkHook.result.failedConnectionIds.map((item) => (
                    <li key={item.connectionId}>
                      <strong>{item.connectionId}:</strong> {item.errorMessage}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Lista de Acometidas seleccionadas */}
            <div className="state-modal-col">
              <label className="state-modal-label">
                Acometidas Seleccionadas
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  padding: '8px',
                  backgroundColor: 'var(--surface-hover, #f8fafc)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #e2e8f0)'
                }}
              >
                {selectedConnectionIds.map((id) => (
                  <ColorChip key={id} label={id} size="xs" variant="outline" />
                ))}
              </div>
            </div>

            {/* Nuevo Estado Destino */}
            <div className="state-modal-col">
              <Select
                label="Nuevo Estado Destino *"
                value={String(bulkHook.newStateId)}
                onChange={(e) => bulkHook.setNewStateId(Number(e.target.value))}
                options={catalog.map((c) => ({
                  value: c.stateId,
                  label: `${c.name} (ID: ${c.stateId}) - ${c.description.slice(0, 35)}...`
                }))}
              />
            </div>

            {/* Justificación */}
            <div className="state-modal-col">
              <Input
                label="Justificación de Campaña *"
                placeholder="Ej: Campaña masiva de corte por cartera vencida > 3 meses"
                value={bulkHook.reason}
                onChange={(e) => bulkHook.setReason(e.target.value)}
                required
              />
            </div>

            {/* Documento de Respaldo */}
            <div className="state-modal-col">
              <Input
                label="Resolución / Documento de Soporte"
                placeholder="Ej: CAMPAIGN-CUT-2026-11"
                value={bulkHook.supportDocument}
                onChange={(e) => bulkHook.setSupportDocument(e.target.value)}
              />
            </div>

            {/* Observaciones */}
            <div className="state-modal-col">
              <Input
                label="Observaciones Adicionales"
                placeholder="Ej: Desconexión automática por lotes según padrón 2026."
                value={bulkHook.observations}
                onChange={(e) => bulkHook.setObservations(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Error */}
        {bulkHook.error && (
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
            <span>{bulkHook.error}</span>
          </div>
        )}
      </form>
    </Modal>
  );
};
