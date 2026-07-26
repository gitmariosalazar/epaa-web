import React from 'react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { InspectionDetailsPanel } from './inspection-details/InspectionDetailsPanel';
import {
  FileText,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useSubmitInspectionReportViewModel } from '../hooks/useSubmitInspectionReportViewModel';
import '../styles/ActionModal.css';
import '../styles/SubmitInspectionReportModal.css';
import { CheckBox } from '@/shared/presentation/components/Input/CheckBox';


interface SubmitInspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  solicitudId: string;
  solicitudNumero: string;
  workOrderId: string;
  codigoOrden?: string;
  technicianId: string;
  onSuccess: () => void;
  allowInconsistentSuccess?: boolean;
}

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
> = (props) => {
  const {
    isOpen,
    onClose,
    solicitudId,
    solicitudNumero,
    workOrderId,
    codigoOrden,
    technicianId,
    onSuccess,
    allowInconsistentSuccess
  } = props;

  const { state, setters, handlers } = useSubmitInspectionReportViewModel({
    solicitudId,
    solicitudNumero,
    workOrderId,
    codigoOrden,
    technicianId,
    isOpen,
    onSuccess,
    allowInconsistentSuccess,
    onClose
  });

  if (!isOpen) return null;

  const rightForm = (
    <form className="action-modal__body submit-inspection-report-modal__form" onSubmit={handlers.handleSubmit}>
      <div className="action-modal__section-title">
        Resultado de la Inspección
      </div>
      <div className="action-modal__field">
        <label className="action-modal__label">
          <CheckCircle size={13} /> Dictamen Técnico
        </label>
        <div className="action-modal__radio-group">
          {RESULTS.map((r) => (
            <div
              key={r.value}
              className={`action-modal__radio${state.result === r.value ? ' action-modal__radio--selected' : ''}`}
              style={{ alignItems: 'center', padding: '0.75rem 1rem' }}
              onClick={() => setters.setResult(r.value)}
            >
              <CheckBox
                name="result"
                value={r.value}
                checked={state.result === r.value}
                onCheckedChange={(checked) => setters.setResult(checked ? r.value : '')}
                className="action-modal__custom-checkbox"
              />
              <span className="action-modal__radio-title" style={{ margin: 0, fontSize: '0.85rem' }}>
                {r.label}
              </span>
            </div>
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
            value={state.networkDistanceM}
            onChange={(e) => setters.setNetworkDistanceM(e.target.value)}
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
            value={state.connectionDiameter}
            onChange={(e) => setters.setConnectionDiameter(e.target.value)}
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
            value={state.materialCost}
            onChange={(e) => setters.setMaterialCost(e.target.value)}
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
            value={state.laborCost}
            onChange={(e) => setters.setLaborCost(e.target.value)}
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
          value={state.terrainConditions}
          onChange={(e) => setters.setTerrainConditions(e.target.value)}
        />
      </div>

      <div className="action-modal__field submit-inspection-report-modal__field--flex">
        <label className="action-modal__label">
          <FileText size={13} /> Observaciones del Campo
        </label>
        <textarea
          className="action-modal__textarea submit-inspection-report-modal__textarea--flex"
          placeholder="Detalle cualquier observación relevante de la inspección..."
          rows={4}
          value={state.observations}
          onChange={(e) => setters.setObservations(e.target.value)}
        />
      </div>
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={
        <div className="submit-inspection-report-modal__title-container">
          <div className="submit-inspection-report-modal__header-icon">
            <FileText size={16} />
          </div>
          <span>Enviar Informe Técnico</span>
        </div>
      }
      description={`Solicitud ${solicitudNumero || ''} · Fase 8`}
      footer={
        <div className="submit-inspection-report-modal__footer">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={state.loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handlers.handleSubmit}
            disabled={state.loading}
            leftIcon={
              state.loading ? (
                <Clock size={15} className="spin-icon" />
              ) : (
                <CheckCircle size={15} />
              )
            }
          >
            {state.loading ? 'Enviando...' : 'Enviar Informe'}
          </Button>
        </div>
      }
    >
      <div className="submit-inspection-report-modal__content">
        {/* Left side: details */}
        <div className="submit-inspection-report-modal__left-panel">
          {state.loadingDetalle ? (
            <div className="submit-inspection-report-modal__loading-state">
              Cargando detalles...
            </div>
          ) : state.detalle ? (
            <InspectionDetailsPanel
              materiales={state.detalle.materiales}
              costosAdicionales={state.detalle.costosAdicionales}
              personalAsignado={state.detalle.personalAsignado}
              adjuntos={state.detalle.adjuntos}
            />
          ) : (
            <div className="submit-inspection-report-modal__loading-state">
              No se encontraron detalles de la orden.
            </div>
          )}
        </div>

        {/* Right side: form */}
        <div className="submit-inspection-report-modal__right-panel">
          {rightForm}
        </div>
      </div>
    </Modal>
  );
};
