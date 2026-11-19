import React, { useEffect, useState } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { Select } from '@/shared/presentation/components/Input/Select';
import {
  MapPin,
  Upload,
  FileCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { useStateHistoryContext } from '../context/StateHistoryContext';
import {
  getStateMeta,
  renderStateChip
} from '../utils/stateCatalogUtils';
import type { AllowedTransitionOption } from '../../domain/models/AllowedTransitions';
import type { StateHistory } from '../../domain/models/StateHistory';
import { useChangeConnectionStateModal } from '../hooks/useChangeConnectionStateModal';
import '../styles/StateHistoryModal.css';

export interface ChangeConnectionStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  currentStatusName?: string | null;
  onSuccess?: (historyRecord: StateHistory) => void;
}

export const ChangeConnectionStateModal: React.FC<ChangeConnectionStateModalProps> = ({
  isOpen,
  onClose,
  connectionId,
  currentStatusName,
  onSuccess
}) => {
  const { useCases, catalog } = useStateHistoryContext();
  const modalHook = useChangeConnectionStateModal({
    onSuccess: (record) => {
      if (onSuccess) onSuccess(record);
      onClose();
    }
  });

  const [allowedTransitions, setAllowedTransitions] = useState<AllowedTransitionOption[]>([]);
  const [isLoadingTransitions, setIsLoadingTransitions] = useState(false);

  useEffect(() => {
    if (isOpen && connectionId) {
      modalHook.openModal(connectionId, currentStatusName);

      setIsLoadingTransitions(true);
      useCases.getAllowedTransitionsUseCase
        .execute(connectionId)
        .then((res) => {
          setAllowedTransitions(res.allowedTransitions || []);
        })
        .catch(() => {
          // Si falla, permitimos seleccionar del catálogo estándar
          setAllowedTransitions([]);
        })
        .finally(() => {
          setIsLoadingTransitions(false);
        });
    }
  }, [isOpen, connectionId]);

  if (!isOpen) return null;

  const currentMeta = getStateMeta(null, currentStatusName);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Cambio Operativo de Estado</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ({connectionId})
          </span>
        </div>
      }
      description="Registra una transición formal de estado para esta acometida en el libro mayor inmutable."
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <Button variant="subtle" onClick={onClose} disabled={modalHook.isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => modalHook.handleSubmit()}
            disabled={modalHook.isSubmitting || !modalHook.newStateId || !modalHook.reason.trim()}
          >
            {modalHook.isSubmitting ? 'Guardando Transición...' : 'Confirmar Cambio de Estado'}
          </Button>
        </div>
      }
    >
      <form onSubmit={modalHook.handleSubmit} className="state-modal-form">
        {/* Banner de Estado Actual */}
        <div className="state-current-banner">
          <div className="state-current-label">
            <span>Acometida: <strong>{connectionId}</strong></span>
            <span>Estado Actual en Sistema</span>
          </div>
          <div>{renderStateChip(currentMeta.id, currentStatusName || currentMeta.label, 'md')}</div>
        </div>

        {/* Selección de Estado Destino */}
        <div className="state-modal-col">
          <label className="state-modal-label">
            Seleccionar Estado Destino <span style={{ color: 'var(--error, #ef4444)' }}>*</span>
          </label>

          {isLoadingTransitions ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px' }}>
              <CircularProgress size={24} strokeWidth={3} progress={70} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Evaluando matriz de transiciones permitidas...
              </span>
            </div>
          ) : allowedTransitions.length > 0 ? (
            <div className="state-grid-options">
              {allowedTransitions.map((opt) => {
                const optMeta = getStateMeta(opt.targetStateId, opt.targetStateName);
                const isSelected = modalHook.newStateId === opt.targetStateId;
                const isForbidden = opt.status === 'FORBIDDEN';

                return (
                  <div
                    key={opt.targetStateId}
                    className={`state-option-card ${isSelected ? 'selected' : ''} ${
                      isForbidden ? 'disabled' : ''
                    }`}
                    onClick={() => {
                      if (!isForbidden) {
                        modalHook.setNewStateId(opt.targetStateId);
                      }
                    }}
                  >
                    <div className="state-option-header">
                      <span className="state-option-name">{optMeta.label}</span>
                      <ColorChip
                        label={opt.status}
                        status={
                          opt.status === 'ALLOWED'
                            ? 'success'
                            : opt.status === 'RESTRICTED'
                            ? 'warning'
                            : 'error'
                        }
                        size="xs"
                        variant="soft"
                      />
                    </div>
                    {opt.note && <span className="state-option-note">{opt.note}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <Select
              label="Estado Destino"
              value={String(modalHook.newStateId)}
              onChange={(e) => modalHook.setNewStateId(Number(e.target.value))}
              options={catalog.map((c) => ({
                value: c.stateId,
                label: `${c.name} - ${c.description.slice(0, 40)}...`
              }))}
            />
          )}
        </div>

        {/* Motivo / Justificación */}
        <div className="state-modal-col">
          <Input
            label="Motivo o Justificación Operativa *"
            placeholder="Ej: Corte de servicio por mora acumulada > 2 meses / Reconexión física"
            value={modalHook.reason}
            onChange={(e) => modalHook.setReason(e.target.value)}
            required
          />
        </div>

        {/* Documento de Respaldo y Canal */}
        <div className="state-modal-row">
          <div className="state-modal-col">
            <Input
              label="Documento de Respaldo / OT"
              placeholder="Ej: OT-CORTE-2026-0045"
              value={modalHook.supportDocument}
              onChange={(e) => modalHook.setSupportDocument(e.target.value)}
            />
          </div>

          <div className="state-modal-col">
            <Select
              label="Canal de Origen"
              value={modalHook.origin}
              onChange={(e) =>
                modalHook.setOrigin(
                  e.target.value as 'WEB' | 'APP_MOVIL' | 'CUADRILLA' | 'SISTEMA'
                )
              }
              options={[
                { value: 'WEB', label: 'Web Portal' },
                { value: 'CUADRILLA', label: 'Cuadrilla Campo' },
                { value: 'APP_MOVIL', label: 'App Móvil' },
                { value: 'SISTEMA', label: 'Sistema' }
              ]}
            />
          </div>
        </div>

        {/* Coordenadas GPS y Fecha Efectiva */}
        <div className="state-modal-row">
          <div className="state-modal-col">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <Input
                label="Latitud"
                type="number"
                step="any"
                placeholder="-0.1806"
                value={modalHook.latitude ?? ''}
                onChange={(e) =>
                  modalHook.setLatitude(e.target.value ? parseFloat(e.target.value) : null)
                }
              />
              <Input
                label="Longitud"
                type="number"
                step="any"
                placeholder="-78.4678"
                value={modalHook.longitude ?? ''}
                onChange={(e) =>
                  modalHook.setLongitude(e.target.value ? parseFloat(e.target.value) : null)
                }
              />
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={modalHook.captureGeolocation}
                title="Capturar coordenadas GPS actuales"
              >
                <MapPin size={16} />
              </Button>
            </div>
          </div>

          <div className="state-modal-col">
            <Input
              label="Fecha Efectiva en Campo"
              type="datetime-local"
              value={modalHook.effectiveDate}
              onChange={(e) => modalHook.setEffectiveDate(e.target.value)}
            />
          </div>
        </div>

        {/* Archivo de Evidencia Documental o Fotográfica */}
        <div className="state-modal-col">
          <label className="state-modal-label">Evidencia Documental o Fotográfica (Opcional)</label>
          {modalHook.file ? (
            <div className="state-file-preview">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={18} color="var(--success, #10b981)" />
                <span className="state-file-name">{modalHook.file.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ({(modalHook.file.size / 1024).toFixed(1)} KB)
                </span>
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
              <Upload size={22} />
              <span>Haz clic o arrastra una foto o acta en PDF / JPG / PNG</span>
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

        {/* Observaciones Técnicas */}
        <div className="state-modal-col">
          <Input
            label="Observaciones Técnicas Adicionales"
            placeholder="Ej: Se colocó precinto de seguridad #4421. Lectura retiro: 320 m3"
            value={modalHook.observations}
            onChange={(e) => modalHook.setObservations(e.target.value)}
          />
        </div>

        {/* Mensaje de Error si ocurre */}
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
