/**
 * ApproveInspectionReportModal — Fase 9
 * SRP: gestiona la aprobación/rechazo del informe técnico por jefatura.
 */
import React, { useState, useEffect } from 'react';
import { ApproveInspectionReportUseCase } from '../../application/usecases/ApproveInspectionReportUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { ShieldCheck, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useWorkOrderRequestViewModel } from '../hooks/useWorkOrderRequestViewModel';
import { WorkOrderRequestProvider } from '../context/WorkOrderRequestProvider';
import '../styles/ActionModal.css';
import '../styles/ApproveInspectionReportModal.css';
import { Alert } from '@/shared/presentation/components/Alert';
import type { EvidenceAttachmentResponse, MaterialResponse, WorkerResponse, WorkOrderObservationResponse } from '../../domain/dto/WorkOrderReportResponse';
import WorkOrderDetails from './WorkOrderDetails';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { MdMessage } from 'react-icons/md';

interface ApproveInspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  solicitudNumero: string;
  approverId: string;
  onSuccess: () => void;
}

const useCase = new ApproveInspectionReportUseCase(new SolicitudRepositoryImpl());

const ApproveInspectionReportModalInner: React.FC<ApproveInspectionReportModalProps> = ({
  isOpen, onClose, reportId, solicitudNumero, approverId, onSuccess
}) => {
  const [approved, setApproved] = useState<boolean | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Inyectamos el ViewModel de Clean Architecture
  const { fetchInspectionReport, inspectionReport, loading: loadingReport, error } = useWorkOrderRequestViewModel();

  // Cargamos el informe apenas se abre el modal
  useEffect(() => {
    if (isOpen && solicitudNumero) {
      fetchInspectionReport(solicitudNumero);
      // Reset state
      setApproved(null);
      setRejectionReason('');
    }
  }, [isOpen, solicitudNumero, fetchInspectionReport]);

  if (!isOpen) return null;
  console.log("Materiales: ", inspectionReport?.workOrder.materials);
  console.log(" Trabajadores: ", inspectionReport?.workOrder.workers);
  console.log("Evidencias: ", inspectionReport?.workOrder.evidenceAttachments);
  console.log("Observaciones: ", inspectionReport?.workOrder.observations);

  const materialList: MaterialResponse[] = inspectionReport?.workOrder?.materials ?? [];
  const workersList: WorkerResponse[] = inspectionReport?.workOrder?.workers ?? [];
  const evidenceAttachmentsList: EvidenceAttachmentResponse[] = inspectionReport?.workOrder?.evidenceAttachments ?? [];
  const observationsList: WorkOrderObservationResponse[] = inspectionReport?.workOrder?.observations ?? [];

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

  const modalTitle = (
    <div className="approve-modal__header-container">
      <div className="approve-modal__header-icon">
        <ShieldCheck size={24} strokeWidth={2.5} />
      </div>
      <div className="approve-modal__header-text-col">
        <span className="approve-modal__header-title">Dictamen Técnico del Informe de Inspección</span>
        <span className="approve-modal__header-subtitle">Solicitud {solicitudNumero} · Fase 9 — Jefatura</span>
      </div>
    </div>
  );

  const modalFooter = (
    <div className="approve-modal__footer-container">
      <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        type="submit"
        form="approve-form"
        disabled={loading || approved === null || loadingReport}
        leftIcon={loading ? <Clock size={15} className="spin-icon" /> : approved === false ? <XCircle size={15} /> : <CheckCircle size={15} />}
        className={approved === false ? 'approve-modal__footer-btn--reject' : ''}
      >
        {loading ? 'Procesando...' : approved === false ? 'Rechazar Informe' : 'Aprobar Informe'}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} footer={modalFooter} size="lg">
      <form id="approve-form" onSubmit={handleSubmit} className="approve-modal__form">
        <Alert
          type='info'
          size='small'
          dismissible={false}
          className='alert-inspection-info'
          message='El informe técnico fue enviado por el inspector de campo y está pendiente de su revisión y aprobación. Como jefe de operaciones, revise el informe técnico de campo y emita su dictamen.'
        />

        {/* ── INFO DEL INFORME (Clean Architecture) ── */}
        {loadingReport ? (
          <div className="approve-modal__loading">
            <Clock className="spin-icon" size={18} /> <span>Cargando datos del informe...</span>
          </div>
        ) : error ? (
          <div className="approve-modal__error">
            <XCircle size={18} /> <span>{error}</span>
          </div>
        ) : inspectionReport ? (
          <div className="approve-modal__report-box">
            <h4 className="approve-modal__report-title">
              <FileText size={15} /> Detalles del Informe
            </h4>
            <div className="approve-modal__report-grid">
              <div>
                <strong className="approve-modal__report-label">RESULTADO TÉCNICO</strong>
                <span className={inspectionReport.result === 'FACTIBLE' ? 'approve-modal__report-value--success' : 'approve-modal__report-value--error'}>
                  {inspectionReport.result}
                </span>
              </div>
              {inspectionReport.networkDistanceMeters != null && (
                <div>
                  <strong className="approve-modal__report-label">DISTANCIA A LA RED</strong>
                  <span className="approve-modal__report-value">{inspectionReport.networkDistanceMeters} m</span>
                </div>
              )}
              {inspectionReport.connectionDiameter && (
                <div>
                  <strong className="approve-modal__report-label">DIÁMETRO ACOMETIDA</strong>
                  <span className="approve-modal__report-value">{inspectionReport.connectionDiameter}</span>
                </div>
              )}
              {inspectionReport.terrainConditions && (
                <div>
                  <strong className="approve-modal__report-label">TIPO DE TERRENO</strong>
                  <span className="approve-modal__report-value">{inspectionReport.terrainConditions}</span>
                </div>
              )}
              {inspectionReport.totalCost != null && (
                <div>
                  <strong className="approve-modal__report-label">COSTO ESTIMADO (OBRA)</strong>
                  <span className="approve-modal__report-value">${Number(inspectionReport.totalCost).toFixed(2)}</span>
                </div>
              )}
            </div>
            {inspectionReport.observations && (
              <div className="approve-modal__report-observations">
                <strong className="approve-modal__report-label">OBSERVACIONES DEL TÉCNICO</strong>
                <Alert icon={<MdMessage size={12} />} type='info' dismissible={false} size='xsmall' message={inspectionReport.observations} />
              </div>
            )}
            <Divider variant='dashed' />

            <WorkOrderDetails
              materialList={materialList}
              workersList={workersList}
              evidenceAttachmentsList={evidenceAttachmentsList}
              observationsList={observationsList}
            />
          </div>
        ) : null}

        <div className="action-modal__decision-buttons approve-modal__decisions-grid">
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
          <div className="approve-modal__reject-reason">
            <label className="approve-modal__reject-label">Motivo de Rechazo *</label>
            <textarea
              className="action-modal__textarea action-modal__textarea--error approve-modal__reject-textarea"
              placeholder="Describa en detalle el motivo del rechazo técnico..."
              rows={4}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {approved === true && (
          <div className="approve-modal__success-msg">
            <CheckCircle size={18} />
            <span>Al aprobar, se procederá a la generación del contrato de servicio.</span>
          </div>
        )}
      </form>
    </Modal>
  );
};

// Wrapper Provider para inyectar el contexto de Clean Architecture a este modal
export const ApproveInspectionReportModal: React.FC<ApproveInspectionReportModalProps> = (props) => {
  return (
    <WorkOrderRequestProvider>
      <ApproveInspectionReportModalInner {...props} />
    </WorkOrderRequestProvider>
  );
};
