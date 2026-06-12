/**
 * SubmitInspectionReportModal — Fase 8
 * SRP: gestiona el formulario del informe técnico de campo.
 */
import React, { useState } from 'react';
import { SubmitInspectionReportUseCase } from '../../application/usecases/SubmitInspectionReportUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  FileText,
  X,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import '../styles/ActionModal.css';

interface SubmitInspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  workOrderId: string;
  technicianId: string;
  onSuccess: () => void;
  allowInconsistentSuccess?: boolean;
}

const useCase = new SubmitInspectionReportUseCase(
  new SolicitudRepositoryImpl()
);

const RESULTS = [
  { value: 'FACTIBLE', label: 'Factible - Se puede realizar la acometida' },
  {
    value: 'NO_FACTIBLE',
    label: 'No Factible - No es posible realizar la acometida'
  },
  {
    value: 'CONDICIONADA',
    label: 'Condicionada - Viable con condiciones especiales'
  }
];

export const SubmitInspectionReportModal: React.FC<
  SubmitInspectionReportModalProps
> = ({
  isOpen,
  onClose,
  solicitudId,
  solicitudNumero,
  workOrderId,
  technicianId,
  onSuccess,
  allowInconsistentSuccess = false
}) => {
  const [result, setResult] = useState('VIABLE');
  const [networkDistanceM, setNetworkDistanceM] = useState('');
  const [connectionDiameter, setConnectionDiameter] = useState('');
  const [terrainConditions, setTerrainConditions] = useState('');
  const [observations, setObservations] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workOrderId) {
      MessageToastCustom(
        'error',
        'Error',
        'No se encontró el ID de la orden de trabajo. Recargue la página.'
      );
      return;
    }
    setLoading(true);
    try {
      await useCase.execute({
        workOrderId,
        solicitudId,
        result,
        networkDistanceM: networkDistanceM
          ? Number(networkDistanceM)
          : undefined,
        connectionDiameter: connectionDiameter.trim() || undefined,
        terrainConditions: terrainConditions.trim() || undefined,
        observations: observations.trim() || undefined,
        materialCost: materialCost ? Number(materialCost) : undefined,
        laborCost: laborCost ? Number(laborCost) : undefined,
        technicianId,
        completedStatusId: 1
      });
      MessageToastCustom(
        'success',
        'Informe Enviado',
        'El informe técnico fue subido y está en revisión.'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      const message = String(err?.message ?? 'No se pudo enviar el informe.');
      const looksInconsistent =
        /transici|estado|already|duplicate|duplicad|ya existe|P0001/i.test(
          message
        );

      if (allowInconsistentSuccess && looksInconsistent) {
        MessageToastCustom(
          'warning',
          'Informe registrado',
          'El backend devolvió una respuesta inconsistente. Se actualizará el estado de la OT.'
        );
        onSuccess();
        onClose();
        return;
      }

      MessageToastCustom('error', 'Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div
        className="action-modal action-modal--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="action-modal__header action-modal__header--purple">
          <div className="action-modal__header-icon">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="action-modal__title">Enviar Informe Técnico</h3>
            <p className="action-modal__subtitle">
              Solicitud {solicitudNumero} · Fase 8
            </p>
          </div>
          <button className="action-modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="action-modal__body" onSubmit={handleSubmit}>
          <div className="action-modal__section-title">
            Resultado de la Inspección
          </div>
          <div className="action-modal__field">
            <label className="action-modal__label">
              <CheckCircle size={13} /> Dictamen Técnico
            </label>
            <div className="action-modal__radio-group">
              {RESULTS.map((r) => (
                <label
                  key={r.value}
                  className={`action-modal__radio${result === r.value ? ' action-modal__radio--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="result"
                    value={r.value}
                    checked={result === r.value}
                    onChange={(e) => setResult(e.target.value)}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="action-modal__row">
            <div className="action-modal__field">
              <label className="action-modal__label">
                <MapPin size={13} /> Distancia a la Red (m)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="action-modal__input"
                placeholder="Ej: 25.5"
                value={networkDistanceM}
                onChange={(e) => setNetworkDistanceM(e.target.value)}
              />
            </div>
            <div className="action-modal__field">
              <label className="action-modal__label">
                Diámetro de Conexión
              </label>
              <input
                type="text"
                className="action-modal__input"
                placeholder='Ej: 1/2"'
                value={connectionDiameter}
                onChange={(e) => setConnectionDiameter(e.target.value)}
              />
            </div>
          </div>

          <div className="action-modal__row">
            <div className="action-modal__field">
              <label className="action-modal__label">
                <DollarSign size={13} /> Costo Materiales ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="action-modal__input"
                placeholder="0.00"
                value={materialCost}
                onChange={(e) => setMaterialCost(e.target.value)}
              />
            </div>
            <div className="action-modal__field">
              <label className="action-modal__label">
                <DollarSign size={13} /> Costo Mano de Obra ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="action-modal__input"
                placeholder="0.00"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
              />
            </div>
          </div>

          <div className="action-modal__field">
            <label className="action-modal__label">
              Condiciones del Terreno
            </label>
            <input
              type="text"
              className="action-modal__input"
              placeholder="Ej: Terreno rocoso, acceso complicado..."
              value={terrainConditions}
              onChange={(e) => setTerrainConditions(e.target.value)}
            />
          </div>

          <div className="action-modal__field">
            <label className="action-modal__label">
              <FileText size={13} /> Observaciones del Campo
            </label>
            <textarea
              className="action-modal__textarea"
              placeholder="Detalle cualquier observación relevante de la inspección..."
              rows={4}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>

          <div className="action-modal__actions">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              leftIcon={
                loading ? (
                  <Clock size={15} className="spin-icon" />
                ) : (
                  <CheckCircle size={15} />
                )
              }
            >
              {loading ? 'Enviando...' : 'Enviar Informe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
