/**
 * ApproveInspectionReportModal — Fase 9
 * SRP: gestiona la aprobación/rechazo del informe técnico por jefatura.
 */
import React, { useState } from 'react';
import { ApproveInspectionReportUseCase } from '../../application/usecases/ApproveInspectionReportUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { ShieldCheck, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import '../styles/ActionModal.css';

interface ApproveInspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  solicitudNumero: string;
  approverId: string;
  onSuccess: () => void;
}

const useCase = new ApproveInspectionReportUseCase(new SolicitudRepositoryImpl());

export const ApproveInspectionReportModal: React.FC<ApproveInspectionReportModalProps> = ({
  isOpen, onClose, reportId, solicitudNumero, approverId, onSuccess
}) => {
  const [approved, setApproved] = useState<boolean | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (approved === null) {
      MessageToastCustom('error', 'Selección requerida', 'Debe seleccionar Aprobar o Rechazar el informe.');
      return;
    }
    if (!approved && !rejectionReason.trim()) {
      MessageToastCustom('error', 'Campo requerido', 'Debe ingresar el motivo de rechazo.');
      return;
    }
    if (!reportId) {
      MessageToastCustom('error', 'Error', 'No se encontró el ID del informe. Recargue la página.');
      return;
    }
    setLoading(true);
    try {
      await useCase.execute({
        reportId,
        approved,
        rejectionReason: !approved ? rejectionReason.trim() : undefined,
        approverId
      });
      MessageToastCustom(
        'success',
        approved ? 'Informe Aprobado' : 'Informe Rechazado',
        approved
          ? 'El informe fue aprobado. La solicitud avanza a generación de contrato.'
          : 'El informe fue rechazado. La solicitud pasa a estado rechazada técnica.'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      MessageToastCustom('error', 'Error', err.message || 'No se pudo procesar el dictamen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-modal-overlay" onClick={onClose}>
      <div className="action-modal" onClick={e => e.stopPropagation()}>
        <div className="action-modal__header action-modal__header--teal">
          <div className="action-modal__header-icon"><ShieldCheck size={20} /></div>
          <div>
            <h3 className="action-modal__title">Dictamen Técnico del Informe</h3>
            <p className="action-modal__subtitle">Solicitud {solicitudNumero} · Fase 9 — Jefatura</p>
          </div>
          <button className="action-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="action-modal__body" onSubmit={handleSubmit}>
          <p className="action-modal__description">
            Como jefe de operaciones, emita su dictamen sobre el informe técnico de campo
            presentado por el inspector.
          </p>

          <div className="action-modal__decision-buttons">
            <button
              type="button"
              className={`action-modal__decision-btn action-modal__decision-btn--approve${approved === true ? ' action-modal__decision-btn--selected' : ''}`}
              onClick={() => setApproved(true)}
            >
              <CheckCircle size={22} />
              <span>Aprobar Informe</span>
              <small>El trámite avanza a contrato</small>
            </button>
            <button
              type="button"
              className={`action-modal__decision-btn action-modal__decision-btn--reject${approved === false ? ' action-modal__decision-btn--selected' : ''}`}
              onClick={() => setApproved(false)}
            >
              <XCircle size={22} />
              <span>Rechazar Informe</span>
              <small>La solicitud pasa a RECHAZADA_TECNICA</small>
            </button>
          </div>

          {approved === false && (
            <div className="action-modal__field" style={{ marginTop: '1rem' }}>
              <label className="action-modal__label">Motivo de Rechazo *</label>
              <textarea
                className="action-modal__textarea action-modal__textarea--error"
                placeholder="Describa en detalle el motivo del rechazo técnico..."
                rows={4}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {approved === true && (
            <div className="action-modal__info-box action-modal__info-box--success">
              <CheckCircle size={14} />
              <span>Al aprobar, se procederá a la generación del contrato de servicio.</span>
            </div>
          )}

          <div className="action-modal__actions">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading || approved === null}
              leftIcon={loading ? <Clock size={15} className="spin-icon" /> : approved === false ? <XCircle size={15} /> : <CheckCircle size={15} />}
              style={approved === false ? { background: 'linear-gradient(135deg,#ef4444,#dc2626)', borderColor: '#ef4444' } : {}}
            >
              {loading ? 'Procesando...' : approved === false ? 'Rechazar Informe' : 'Aprobar Informe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
