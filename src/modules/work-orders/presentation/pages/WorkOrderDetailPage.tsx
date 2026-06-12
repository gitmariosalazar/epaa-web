/**
 * WorkOrderDetailPage — Proceso completo fase-a-fase de una OT
 *
 * Carga la OT desde el parámetro de ruta `:codigoOrden`.
 * Contiene TODAS las fases del proceso operativo, exactamente como
 * WorkOrdersProcessPage, pero sin necesidad de buscar por código manual.
 *
 * Clean Architecture — Presentation layer.
 * SOLID:
 *   SRP: orquesta sub-paneles y modales; sin lógica de negocio.
 *   OCP: nueva fase → nuevo modal + nuevo PhaseActionBtn; nada más cambia.
 *   DIP: depende de Use Cases (interfaces), no de repos concretos.
 */
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useAuth } from '@/shared/presentation/context/AuthContext';

// ── Use Cases ──────────────────────────────────────────────────────────────────
import { GetOrdenTrabajoDetalleByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoDetalleByNumeroOrdenUseCase';
import { GetOrdenTrabajoTrackingByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoTrackingByNumeroOrdenUseCase';
import { ReceiveWorkOrderUseCase } from '../../application/usecases/ReceiveWorkOrderUseCase';
import { AssignWorkOrderToCrewUseCase } from '../../application/usecases/AssignWorkOrderToCrewUseCase';
import { AssignWorkOrderToWorkerUseCase } from '../../application/usecases/AssignWorkOrderToWorkerUseCase';
import { StartPreparationUseCase } from '../../application/usecases/StartPreparationUseCase';
import { CreatePreparationInspectionUseCase } from '../../application/usecases/CreatePreparationInspectionUseCase';
import { ResolvePreparationInspectionUseCase } from '../../application/usecases/ResolvePreparationInspectionUseCase';
import { FinishExecutionUseCase } from '../../application/usecases/FinishExecutionUseCase';
import { AddWorkerToWorkOrderUseCase } from '../../application/usecases/AddWorkerToWorkOrderUseCase';
import { RemoveWorkerFromWorkOrderUseCase } from '../../application/usecases/RemoveWorkerFromWorkOrderUseCase';
import { AddWorkOrderMaterialUseCase } from '../../application/usecases/AddWorkOrderMaterialUseCase';
import { AddAdditionalCostUseCase } from '../../application/usecases/AddAdditionalCostUseCase';
import { AddWorkOrderAttachmentUseCase } from '../../application/usecases/AddWorkOrderAttachmentUseCase';
import { CreateQualityControlUseCase } from '../../application/usecases/CreateQualityControlUseCase';
import { CompleteWorkOrderUseCase } from '../../application/usecases/CompleteWorkOrderUseCase';
import { RegisterSatisfactionSurveyUseCase } from '../../application/usecases/RegisterSatisfactionSurveyUseCase';
import { SubmitInspectionReportUseCase } from '../../application/usecases/SubmitInspectionReportUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

// ── Catastral (Fase 14 — solo instalación acometida) ──────────────────────────
import { RegisterCadastralUseCase } from '../../../processes/solicitudes/application/usecases/RegisterCadastralUseCase';
import { SolicitudRepositoryImpl } from '../../../processes/solicitudes/infrastructure/repositories/SolicitudRepositoryImpl';
import type { RegisterCadastralDto } from '../../../processes/solicitudes/domain/repositories/SolicitudRepository';



// ── Request DTO ────────────────────────────────────────────────────────────────
import { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';

// ── Domain types ───────────────────────────────────────────────────────────────
import type {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking
} from '../../domain/schemas/dto/response/work-orders.get.response';
import type { SubmitInspectionReportCommand } from '../../domain/schemas/dto/commands/submit-inspection-report.command';

// ── Sub-components ─────────────────────────────────────────────────────────────
import { WorkOrderHeroCard } from '../components/detail/WorkOrderHeroCard';
import { WorkOrderInfoCard } from '../components/detail/WorkOrderInfoCard';
import { WorkOrderMetricsCard } from '../components/detail/WorkOrderMetricsCard';
import { WorkOrderTimelineCard } from '../components/detail/WorkOrderTimelineCard';
import { WorkOrderMaterialsCard } from '../components/detail/WorkOrderMaterialsCard';
import { WorkOrderAttachmentsCard } from '../components/detail/WorkOrderAttachmentsCard';
import { WorkOrderQualityCard } from '../components/detail/WorkOrderQualityCard';
import { WorkOrderSatisfactionCard } from '../components/detail/WorkOrderSatisfactionCard';
import { WorkOrderPhaseActionBtn } from '../components/WorkOrderPhaseActionBtn';

// ── Modales ────────────────────────────────────────────────────────────────────
import { AssignToCrewModal } from '../components/modals/AssignToCrewModal';
import { AssignToWorkerModal } from '../components/modals/AssignToWorkerModal';
import { CreateChecklistModal } from '../components/modals/CreateChecklistModal';
import { AddMaterialModal } from '../components/modals/AddMaterialModal';
import { AddCostModal } from '../components/modals/AddCostModal';
import { AddAttachmentModal } from '../components/modals/AddAttachmentModal';
import { CreateQualityControlModal } from '../components/modals/CreateQualityControlModal';
import { RegisterSurveyModal } from '../components/modals/RegisterSurveyModal';
import { ManageWorkersModal } from '../components/modals/ManageWorkersModal';
import { SubmitInspectionReportModal as WOInspectionModal } from '../components/modals/SubmitInspectionReportModal';
import { RegisterCadastralModal } from '../components/modals/RegisterCadastralModal';
import { SubmitInspectionReportModal as SolicitudInspectionModal } from '../../../processes/solicitudes/presentation/components/SubmitInspectionReportModal';

// ── Icons ──────────────────────────────────────────────────────────────────────
import {
  ArrowLeft,
  Inbox,
  User,
  Play,
  ClipboardCheck,
  Zap,
  ShieldCheck,
  Star,
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';
import '../styles/WorkOrderDetailPage.css';

// ── Helpers ────────────────────────────────────────────────────────────────────
const esOTInspeccionAcometida = (orden: OrdenTrabajoDetalle): boolean => {
  const nombre = (orden.tipoTrabajo ?? '').toUpperCase();
  return (
    (nombre.includes('INSPECCION') ||
      nombre.includes('INSPECCIÓN') ||
      nombre.includes('FACTIBILIDAD')) &&
    (orden.origen ?? '').toUpperCase() === 'SOLICITUD' &&
    !!orden.idEntidadOrigen
  );
};

const esOTInstalacionAcometida = (orden: OrdenTrabajoDetalle): boolean => {
  const nombre = (orden.tipoTrabajo ?? '').toUpperCase();
  return (
    (nombre.includes('INSTALACION') ||
      nombre.includes('INSTALACIÓN') ||
      nombre.includes('MEDIDOR') ||
      nombre.includes('CALIBRACION')) &&
    (orden.origen ?? '').toUpperCase() === 'SOLICITUD' &&
    !!orden.idEntidadOrigen
  );
};

const ESTADOS_TERMINAL = new Set([
  'COMPLETADA',
  'CANCELADA',
  'INSTALACION_COMPLETADA',
  'INSPECCION_COMPLETADA'
]);

// ─────────────────────────────────────────────────────────────────────────────
export const WorkOrderDetailPage: React.FC = () => {
  const { codigoOrden = '' } = useParams<{ codigoOrden: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.userId ?? '';

  // ── Data state ──────────────────────────────────────────────────────────────
  const [orden, setOrden] = useState<OrdenTrabajoDetalle | null>(null);
  const [tracking, setTracking] = useState<OrdenTrabajoTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [assignCrewOpen, setAssignCrewOpen] = useState(false);
  const [assignWorkerOpen, setAssignWorkerOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [isResolvingChecklist, setIsResolvingChecklist] = useState(false);
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [addCostOpen, setAddCostOpen] = useState(false);
  const [addAttachmentOpen, setAddAttachmentOpen] = useState(false);
  const [manageWorkersOpen, setManageWorkersOpen] = useState(false);
  const [qualityControlOpen, setQualityControlOpen] = useState(false);
  const [registerSurveyOpen, setRegisterSurveyOpen] = useState(false);
  const [showWOInspReport, setShowWOInspReport] = useState(false);
  const [showSolicitudReport, setShowSolicitudReport] = useState(false);
  const [showCadastral, setShowCadastral] = useState(false);
  const [pendingNextState, setPendingNextState] = useState<string | null>(null);

  // ── Loading states ──────────────────────────────────────────────────────────
  const [isReceiving, setIsReceiving] = useState(false);
  const [isStartingPrep, setIsStartingPrep] = useState(false);
  const [isRestartingPrep, setIsRestartingPrep] = useState(false);
  const [isFinishingExec, setIsFinishingExec] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // ── Repos & Use Cases ───────────────────────────────────────────────────────
  const repo = React.useMemo(() => new ProcessWorkOrderRepositoryImpl(), []);
  const solicitudRepo = React.useMemo(() => new SolicitudRepositoryImpl(), []);

  const detalleUseCase = React.useMemo(
    () => new GetOrdenTrabajoDetalleByNumeroOrdenUseCase(repo),
    [repo]
  );
  const trackingUseCase = React.useMemo(
    () => new GetOrdenTrabajoTrackingByNumeroOrdenUseCase(repo),
    [repo]
  );
  const receiveUseCase = React.useMemo(
    () => new ReceiveWorkOrderUseCase(repo),
    [repo]
  );
  const assignCrewUseCase = React.useMemo(
    () => new AssignWorkOrderToCrewUseCase(repo),
    [repo]
  );
  const assignWorkerUseCase = React.useMemo(
    () => new AssignWorkOrderToWorkerUseCase(repo),
    [repo]
  );
  const startPrepUseCase = React.useMemo(
    () => new StartPreparationUseCase(repo),
    [repo]
  );
  const checklistUseCase = React.useMemo(
    () => new CreatePreparationInspectionUseCase(repo),
    [repo]
  );
  const resolveChecklistUC = React.useMemo(
    () => new ResolvePreparationInspectionUseCase(repo),
    [repo]
  );
  const finishExecUseCase = React.useMemo(
    () => new FinishExecutionUseCase(repo),
    [repo]
  );
  const addWorkerUseCase = React.useMemo(
    () => new AddWorkerToWorkOrderUseCase(repo),
    [repo]
  );
  const removeWorkerUseCase = React.useMemo(
    () => new RemoveWorkerFromWorkOrderUseCase(repo),
    [repo]
  );
  const materialUseCase = React.useMemo(
    () => new AddWorkOrderMaterialUseCase(repo),
    [repo]
  );
  const costUseCase = React.useMemo(
    () => new AddAdditionalCostUseCase(repo),
    [repo]
  );
  const attachmentUseCase = React.useMemo(
    () => new AddWorkOrderAttachmentUseCase(repo),
    [repo]
  );
  const qcUseCase = React.useMemo(
    () => new CreateQualityControlUseCase(repo),
    [repo]
  );
  const completeUseCase = React.useMemo(
    () => new CompleteWorkOrderUseCase(repo),
    [repo]
  );
  const surveyUseCase = React.useMemo(
    () => new RegisterSatisfactionSurveyUseCase(repo),
    [repo]
  );
  const woInspUseCase = React.useMemo(
    () => new SubmitInspectionReportUseCase(repo),
    [repo]
  );
  const cadastralUseCase = React.useMemo(
    () => new RegisterCadastralUseCase(solicitudRepo),
    [solicitudRepo]
  );


  // ── Helpers ─────────────────────────────────────────────────────────────────
  const reload = useCallback(() => setReloadTrigger((p) => p + 1), []);

  // ── Load orden + tracking ───────────────────────────────────────────────────
  React.useEffect(() => {
    if (!codigoOrden) return;
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [det, trk] = await Promise.all([
          detalleUseCase.execute(codigoOrden),
          trackingUseCase.execute(codigoOrden)
        ]);
        if (isMounted) {
          setOrden(det);
          setTracking(trk);
        }
      } catch (e: any) {
        if (isMounted)
          setError(e.message || 'Error al cargar la orden de trabajo.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [codigoOrden, detalleUseCase, trackingUseCase, reloadTrigger]);

  // ── Derived flags ───────────────────────────────────────────────────────────
  const esInspeccionAcometida =
    orden !== null && esOTInspeccionAcometida(orden);
  const esInstalacionAcometida =
    orden !== null && esOTInstalacionAcometida(orden);

  // ── Fase 2: Recepcionar ──────────────────────────────────────────────────────
  const handleReceive = async () => {
    if (!orden) return;
    setIsReceiving(true);
    try {
      await receiveUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          'PENDIENTE',
          currentUserId,
          'OT recepcionada'
        )
      );
      MessageToastCustom(
        'success',
        'OT Recepcionada',
        'La orden pasó a estado PENDIENTE.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo recepcionar la OT.'
      );
    } finally {
      setIsReceiving(false);
    }
  };

  // ── Fase 2: Asignar técnico ──────────────────────────────────────────────────
  const handleAssignCrew = async (crewId: string, comment: string) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await assignCrewUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        crewId,
        assignedByUserId: currentUserId,
        comment
      });
      MessageToastCustom(
        'success',
        'Técnico Asignado',
        'La OT fue asignada al técnico.'
      );
      setAssignCrewOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo asignar el técnico.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleAssignWorker = async (workerId: string, comment: string) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await assignWorkerUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        workerId,
        assignedByUserId: currentUserId,
        comment
      });
      MessageToastCustom(
        'success',
        'Técnico Asignado',
        'La OT fue asignada al técnico.'
      );
      setAssignWorkerOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo asignar el técnico.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  // ── Fase 3: Preparación ──────────────────────────────────────────────────────
  const handleStartPrep = async () => {
    if (!orden) return;
    setIsStartingPrep(true);
    try {
      await startPrepUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          'PREPARACION',
          currentUserId,
          'Inicio de preparación'
        )
      );
      MessageToastCustom(
        'success',
        'Preparación Iniciada',
        'La OT pasó a estado PREPARACION.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo iniciar la preparación.'
      );
    } finally {
      setIsStartingPrep(false);
    }
  };

  const handleRestartPrep = async () => {
    if (!orden) return;
    setIsRestartingPrep(true);
    try {
      await startPrepUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          'PREPARACION',
          currentUserId,
          'Reinicio de preparación'
        )
      );
      MessageToastCustom(
        'success',
        'Preparación Reiniciada',
        'La OT volvió al estado PREPARACION.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo reiniciar la preparación.'
      );
    } finally {
      setIsRestartingPrep(false);
    }
  };

  const handleCreateChecklist = async (
    passed: boolean,
    observations: string
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await checklistUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        createdByUserId: currentUserId,
        passed,
        observations
      });
      MessageToastCustom(
        'success',
        'Checklist Registrado',
        passed ? 'Preparación aprobada.' : 'Preparación rechazada.'
      );
      setChecklistOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo registrar el checklist.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleResolveChecklist = async (approved: boolean) => {
    if (!orden) return;
    setIsResolvingChecklist(true);
    const newStatus = approved ? 'EN_PROCESO' : 'REVISION_RECHAZADA';
    try {
      await resolveChecklistUC.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          newStatus,
          currentUserId,
          approved
            ? 'Inspección aprobada — iniciando ejecución'
            : 'Inspección rechazada'
        )
      );
      MessageToastCustom(
        'success',
        approved ? 'Checklist Aprobado' : 'Checklist Rechazado',
        approved
          ? 'La OT pasó a EN PROCESO.'
          : 'El técnico debe corregir y reiniciar.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo resolver el checklist.'
      );
    } finally {
      setIsResolvingChecklist(false);
    }
  };

  // ── Fase 4: Ejecución en campo ───────────────────────────────────────────────
  const executeFinishExec = async () => {
    if (!orden) return;
    if (esInspeccionAcometida && orden.estado === 'EN_PROCESO_INSPECCION') {
      MessageToastCustom(
        'warning',
        'Paso requerido',
        'Para esta OT primero debes registrar el informe técnico antes de finalizar ejecución.'
      );
      return;
    }
    setIsFinishingExec(true);
    const nextStatus =
      orden.estado === 'EN_PROCESO_INSPECCION'
        ? 'INSPECCION_EJECUTADA'
        : orden.estado === 'EN_PROCESO_INSTALACION'
          ? 'INSTALACION_EJECUTADA'
          : 'EJECUTADA';
    try {
      await finishExecUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          nextStatus,
          currentUserId,
          'Trabajo técnico finalizado en campo'
        )
      );
      MessageToastCustom(
        'success',
        'Ejecución Finalizada',
        'La OT pasó al siguiente estado de ejecución.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo finalizar la ejecución.'
      );
    } finally {
      setIsFinishingExec(false);
    }
  };

  const handleFinishExec = async () => {
    if (!orden) return;
    if (esInspeccionAcometida) {
      setShowSolicitudReport(true);
      return;
    }
    await executeFinishExec();
  };

  const handleSolicitudReportSuccess = useCallback(async () => {
    setShowSolicitudReport(false);
    reload();
  }, [reload]);

  const handleAddWorker = async (
    workerId: string,
    roleId: number | null,
    isResponsible: boolean
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await addWorkerUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        workerId,
        roleId: roleId ?? undefined,
        isResponsible,
        assignedByUserId: currentUserId
      });
      MessageToastCustom(
        'success',
        'Personal Agregado',
        'El trabajador fue asignado a la OT.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo agregar al trabajador.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleRemoveWorker = async (workerId: string) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await removeWorkerUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        workerId,
        removedByUserId: currentUserId
      });
      MessageToastCustom(
        'success',
        'Personal Removido',
        'El trabajador fue removido de la OT.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo remover al trabajador.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleAddMaterial = async (
    materialId: number,
    quantity: number,
    unitCost: number
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await materialUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        materialId,
        quantity,
        unitCost,
        createdByUserId: currentUserId
      });
      MessageToastCustom(
        'success',
        'Material Registrado',
        'El material fue agregado a la OT.'
      );
      setAddMaterialOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo registrar el material.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleAddCost = async (
    concept: string,
    quantity: number,
    unitCost: number
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await costUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        concept,
        quantity,
        unitCost,
        createdByUserId: currentUserId
      });
      MessageToastCustom(
        'success',
        'Costo Registrado',
        'El costo adicional fue registrado.'
      );
      setAddCostOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo registrar el costo.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleAddAttachment = async (
    fileName: string,
    fileType: string,
    fileUrl: string
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await attachmentUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        fileName,
        fileType,
        fileUrl,
        createdByUserId: currentUserId
      });
      MessageToastCustom(
        'success',
        'Evidencia Adjuntada',
        'El archivo fue adjuntado a la OT.'
      );
      setAddAttachmentOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo adjuntar la evidencia.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  // ── Fase 5: Control de calidad ───────────────────────────────────────────────
  const handleQualityControl = async (approved: boolean, comments: string) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await qcUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        createdByUserId: currentUserId,
        approved,
        comments
      });
      MessageToastCustom(
        'success',
        'QC Registrado',
        approved ? 'OT aprobada en calidad.' : 'OT rechazada — en revisión.'
      );
      setQualityControlOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo registrar el control de calidad.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  // ── Fase 6: Completar OT ─────────────────────────────────────────────────────
  const handleComplete = async () => {
    if (!orden) return;
    // Si es instalación de acometida, abrir catastro primero
    if (esInstalacionAcometida) {
      setPendingNextState('COMPLETADA');
      setShowCadastral(true);
      return;
    }
    setIsCompleting(true);
    try {
      await completeUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          'COMPLETADA',
          currentUserId,
          'Cierre administrativo'
        )
      );
      MessageToastCustom(
        'success',
        'OT Completada',
        'La orden de trabajo fue cerrada exitosamente.'
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo completar la OT.'
      );
    } finally {
      setIsCompleting(false);
    }
  };

  // ── Fase 6: Encuesta de satisfacción ─────────────────────────────────────────
  const handleRegisterSurvey = async (rating: number, comments: string) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await surveyUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        rating,
        createdByUserId: currentUserId,
        comments
      });
      MessageToastCustom(
        'success',
        'Encuesta Registrada',
        `Calificación ${rating}/5 registrada.`
      );
      setRegisterSurveyOpen(false);
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo registrar la encuesta.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  // ── Informe de inspección de la OT (work-orders) ─────────────────────────────
  const handleSubmitWOInspReport = useCallback(
    async (cmd: SubmitInspectionReportCommand) => {
      setIsModalLoading(true);
      try {
        await woInspUseCase.execute(cmd);
        MessageToastCustom(
          'success',
          'Informe Enviado',
          'El informe técnico fue enviado.'
        );
        setShowWOInspReport(false);
        reload();
      } catch (e: any) {
        MessageToastCustom(
          'error',
          'Error',
          e.message || 'No se pudo enviar el informe.'
        );
      } finally {
        setIsModalLoading(false);
      }
    },
    [woInspUseCase, reload]
  );

  // ── Registro catastral + completar instalación (Fase 14) ────────────────────
  const handleCadastralSubmit = useCallback(
    async (dto: RegisterCadastralDto) => {
      if (!orden || !pendingNextState) return;
      setIsModalLoading(true);
      try {
        await cadastralUseCase.execute(dto);
        await completeUseCase.execute(
          new ProcessWorkOrderRequest(
            orden.idOrdenTrabajo,
            pendingNextState,
            currentUserId,
            'Instalación completada con registro catastral.'
          )
        );
        MessageToastCustom(
          'success',
          'Instalación Completada',
          'Servicio activado en el catastro.'
        );
        setShowCadastral(false);
        setPendingNextState(null);
        reload();
      } catch (e: any) {
        MessageToastCustom(
          'error',
          'Error',
          e.message || 'Error al registrar el catastro.'
        );
        throw e;
      } finally {
        setIsModalLoading(false);
      }
    },
    [
      orden,
      pendingNextState,
      cadastralUseCase,
      completeUseCase,
      currentUserId,
      reload
    ]
  );

  // ── Formatted date ───────────────────────────────────────────────────────────
  const updatedStr = orden?.updatedAt
    ? new Date(orden.updatedAt).toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageLayout>
        <div className="wo-detail-loading">
          <Clock className="wo-detail-loading__spinner" size={24} />
          <span>Cargando orden de trabajo...</span>
        </div>
      </PageLayout>
    );
  }

  // ── Error / Not found ────────────────────────────────────────────────────────
  if (error || !orden) {
    return (
      <PageLayout>
        <div className="wo-detail-error">
          <AlertTriangle
            size={48}
            style={{ color: 'var(--error)', opacity: 0.8 }}
          />
          <h3>Orden no encontrada</h3>
          <p>{error || 'No se pudo localizar la orden de trabajo.'}</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Volver Atrás
          </Button>
        </div>
      </PageLayout>
    );
  }

  const isTerminal = ESTADOS_TERMINAL.has(orden.estado ?? '');

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <PageLayout
      header={
        <div className="wo-detail-header-nav">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <div className="wo-detail-header-nav__info">
            <h2 className="wo-detail-header-nav__title">
              Orden de Trabajo: {orden.codigoOrden}
            </h2>
            <span className="wo-detail-header-nav__subtitle">
              {orden.tipoTrabajo} · {orden.departamento}
            </span>
          </div>
        </div>
      }
    >
      <div className="wo-detail-container">
        {/* ══ COLUMNA PRINCIPAL ══ */}
        <div className="wo-detail-main-col">
          {/* Hero: estado + SLA + datos clave */}
          <WorkOrderHeroCard orden={orden} updatedStr={updatedStr} />

          {/* ══ ACCIONES POR FASE ══ */}
          {!isTerminal && (
            <div className="wo-process-phase-actions">
              {/* Fase 2: Recepcionar */}
              {orden.estado === 'NOTIFICADA' && (
                <WorkOrderPhaseActionBtn
                  id="wo-btn-recepcionar"
                  color="#3b82f6"
                  bg="rgba(59,130,246,0.1)"
                  icon={<Inbox size={18} />}
                  label="Recepcionar Orden de Trabajo"
                  sublabel="Fase 2 — Confirmar recepción operativa"
                  onClick={handleReceive}
                  loading={isReceiving}
                />
              )}

              {/* Fase 2: Asignar técnico responsable */}
              {orden.estado === 'PENDIENTE' && (
                <WorkOrderPhaseActionBtn
                  id="wo-btn-assign-worker"
                  color="#3b82f6"
                  bg="rgba(59,130,246,0.08)"
                  icon={<User size={18} />}
                  label="Asignar Técnico Responsable"
                  sublabel="Fase 2 — Asignación de personal"
                  onClick={() => setAssignWorkerOpen(true)}
                />
              )}

              {/* Fase 3: Iniciar preparación */}
              {orden.estado === 'ASIGNADA' && (
                <WorkOrderPhaseActionBtn
                  id="wo-btn-start-prep"
                  color="#8b5cf6"
                  bg="rgba(139,92,246,0.1)"
                  icon={<Play size={18} />}
                  label="Iniciar Preparación de Campo"
                  sublabel="Fase 3 — Checklist de alistamiento"
                  onClick={handleStartPrep}
                  loading={isStartingPrep}
                />
              )}

              {/* Fase 3: PREPARACION — registrar o resolver checklist */}
              {orden.estado === 'PREPARACION' && (
                <>
                  {!orden.idInspeccion && (
                    <WorkOrderPhaseActionBtn
                      id="wo-btn-checklist"
                      color="#8b5cf6"
                      bg="rgba(139,92,246,0.1)"
                      icon={<ClipboardCheck size={18} />}
                      label="Registrar Inspección de Preparación"
                      sublabel="Fase 3 — Checklist de preparación"
                      onClick={() => setChecklistOpen(true)}
                    />
                  )}
                  {orden.idInspeccion && (
                    <>
                      <WorkOrderPhaseActionBtn
                        id="wo-btn-approve-checklist"
                        color="#10b981"
                        bg="rgba(16,185,129,0.1)"
                        icon={<ShieldCheck size={18} />}
                        label="Aprobar Inspección"
                        sublabel="Fase 3 — Pasar a ejecución"
                        onClick={() => handleResolveChecklist(true)}
                        loading={isResolvingChecklist}
                      />
                      <WorkOrderPhaseActionBtn
                        id="wo-btn-reject-checklist"
                        color="#ef4444"
                        bg="rgba(239,68,68,0.08)"
                        icon={<AlertTriangle size={18} />}
                        label="Rechazar Inspección"
                        sublabel="Fase 3 — Requiere correcciones"
                        onClick={() => handleResolveChecklist(false)}
                        loading={isResolvingChecklist}
                      />
                    </>
                  )}
                </>
              )}

              {/* Fase 3: Revisión rechazada — reiniciar preparación */}
              {orden.estado === 'REVISION_RECHAZADA' && (
                <>
                  <div className="wo-process-info-banner wo-process-info-banner--warn">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>Preparación Rechazada</strong>
                      <span>
                        Corrige las deficiencias y vuelve a iniciar la
                        preparación de campo.
                      </span>
                    </div>
                  </div>
                  <WorkOrderPhaseActionBtn
                    id="wo-btn-restart-prep"
                    color="#f59e0b"
                    bg="rgba(245,158,11,0.1)"
                    icon={<Play size={18} />}
                    label="Reiniciar Preparación"
                    sublabel="Fase 3 — Volver a preparación de campo"
                    onClick={handleRestartPrep}
                    loading={isRestartingPrep}
                  />
                </>
              )}

              {/* Fase 4: Acciones durante ejecución */}
              {orden.estado === 'EN_PROCESO' && (
                <>
                  <WorkOrderPhaseActionBtn
                    id="wo-btn-finish-exec"
                    color={esInspeccionAcometida ? '#a855f7' : '#10b981'}
                    bg={
                      esInspeccionAcometida
                        ? 'rgba(168,85,247,0.1)'
                        : 'rgba(16,185,129,0.12)'
                    }
                    icon={
                      esInspeccionAcometida ? (
                        <FileText size={18} />
                      ) : (
                        <Zap size={18} />
                      )
                    }
                    label={
                      esInspeccionAcometida
                        ? 'Finalizar Ejecución en Campo (con Informe)'
                        : 'Finalizar Ejecución en Campo'
                    }
                    sublabel={
                      esInspeccionAcometida
                        ? 'Fase 4 — Primero registrar informe técnico'
                        : 'Fase 4 — Marcar trabajo técnico completado'
                    }
                    onClick={handleFinishExec}
                    loading={isFinishingExec}
                  />
                </>
              )}

              {/* Fase 5: Control de calidad + Completar */}
              {orden.estado === 'EJECUTADA' && (
                <>
                  {!orden.idControl && (
                    <WorkOrderPhaseActionBtn
                      id="wo-btn-quality"
                      color="#ec4899"
                      bg="rgba(236,72,153,0.1)"
                      icon={<ShieldCheck size={18} />}
                      label="Emitir Control de Calidad"
                      sublabel="Fase 5 — Dictamen técnico"
                      onClick={() => setQualityControlOpen(true)}
                    />
                  )}
                  {orden.idControl && (
                    <WorkOrderPhaseActionBtn
                      id="wo-btn-complete"
                      color="#10b981"
                      bg="rgba(16,185,129,0.1)"
                      icon={<Zap size={18} />}
                      label="Completar Orden de Trabajo"
                      sublabel="Fase 6 — Cierre administrativo"
                      onClick={handleComplete}
                      loading={isCompleting}
                    />
                  )}
                </>
              )}

              {/* Fase 6: Encuesta de satisfacción */}
              {orden.estado === 'COMPLETADA' && !orden.idEncuesta && (
                <WorkOrderPhaseActionBtn
                  id="wo-btn-survey"
                  color="#f59e0b"
                  bg="rgba(245,158,11,0.1)"
                  icon={<Star size={18} />}
                  label="Registrar Encuesta de Satisfacción"
                  sublabel="Fase 6 — Cierre con el cliente"
                  onClick={() => setRegisterSurveyOpen(true)}
                />
              )}
            </div>
          )}

          {/* Estado final completado */}
          {isTerminal && orden.idEncuesta && (
            <div
              className="wo-process-info-banner wo-process-info-banner--success"
              style={{ marginBottom: '16px' }}
            >
              <Zap size={16} />
              <div>
                <strong>Proceso Completado ✓</strong>
                <span>
                  Encuesta de satisfacción registrada. La OT está cerrada.
                </span>
              </div>
            </div>
          )}

          {/* Info general */}
          <WorkOrderInfoCard
            orden={orden}
            onManageWorkers={
              !['COMPLETADA', 'CANCELADA', 'EJECUTADA', 'INSPECCION_COMPLETADA', 'INSPECCION_EJECUTADA', 'INSTALACION_COMPLETADA', 'INSTALACION_EJECUTADA'].includes(orden.estado ?? '')
                ? () => setManageWorkersOpen(true)
                : undefined
            }
          />

          {/* Materiales y costos */}
          <WorkOrderMaterialsCard
            materiales={orden.materiales ?? []}
            costosAdicionales={orden.costosAdicionales ?? []}
            costoTotalMateriales={orden.costoTotalMateriales ?? 0}
            costoTotalAdicionales={orden.costoTotalAdicionales ?? 0}
            costoTotalOrden={orden.costoTotalOrden ?? 0}
            onAddMaterial={
              ['EN_PROCESO', 'EN_PROCESO_INSPECCION', 'EN_PROCESO_INSTALACION'].includes(orden.estado ?? '')
                ? handleAddMaterial
                : undefined
            }
            onAddCost={
              ['EN_PROCESO', 'EN_PROCESO_INSPECCION', 'EN_PROCESO_INSTALACION'].includes(orden.estado ?? '')
                ? handleAddCost
                : undefined
            }
          />

          {/* Adjuntos */}
          <WorkOrderAttachmentsCard
            adjuntos={orden.adjuntos ?? []}
            onAddAttachment={
              ['PREPARACION', 'EN_PROCESO', 'EN_PROCESO_INSPECCION', 'EN_PROCESO_INSTALACION'].includes(orden.estado ?? '')
                ? handleAddAttachment
                : undefined
            }
          />

          {/* Control de calidad */}
          <WorkOrderQualityCard orden={orden} />

          {/* Encuesta de satisfacción */}
          <WorkOrderSatisfactionCard orden={orden} />
        </div>

        {/* ══ COLUMNA SIDEBAR ══ */}
        <div className="wo-detail-sidebar-col">
          <WorkOrderMetricsCard orden={orden} />
          <WorkOrderTimelineCard
            historial={tracking?.historial ?? null}
            title="Historial de Estados"
          />
        </div>
      </div>

      {/* ══ MODALES ══ */}

      {assignCrewOpen && orden && (
        <AssignToCrewModal
          isOpen={assignCrewOpen}
          onClose={() => setAssignCrewOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          assignedByUserId={currentUserId}
          onSubmit={handleAssignCrew}
          isLoading={isModalLoading}
        />
      )}

      {assignWorkerOpen && orden && (
        <AssignToWorkerModal
          isOpen={assignWorkerOpen}
          onClose={() => setAssignWorkerOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleAssignWorker}
          isLoading={isModalLoading}
        />
      )}

      {checklistOpen && orden && (
        <CreateChecklistModal
          isOpen={checklistOpen}
          onClose={() => setChecklistOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleCreateChecklist}
          isLoading={isModalLoading}
        />
      )}

      {addMaterialOpen && orden && (
        <AddMaterialModal
          isOpen={addMaterialOpen}
          onClose={() => setAddMaterialOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleAddMaterial}
          isLoading={isModalLoading}
        />
      )}

      {addCostOpen && orden && (
        <AddCostModal
          isOpen={addCostOpen}
          onClose={() => setAddCostOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleAddCost}
          isLoading={isModalLoading}
        />
      )}

      {addAttachmentOpen && orden && (
        <AddAttachmentModal
          isOpen={addAttachmentOpen}
          onClose={() => setAddAttachmentOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleAddAttachment}
          isLoading={isModalLoading}
        />
      )}

      {manageWorkersOpen && orden && (
        <ManageWorkersModal
          isOpen={manageWorkersOpen}
          onClose={() => setManageWorkersOpen(false)}
          workOrderCode={orden.codigoOrden}
          currentWorkers={(orden.personalAsignado ?? []).map((w) => ({
            workerId: w.idTrabajador,
            workerName: w.nombreTrabajador,
            roleId: null,
            roleName: w.rol ?? undefined,
            isResponsible: w.esResponsable
          }))}
          onAddWorker={handleAddWorker}
          onRemoveWorker={handleRemoveWorker}
          isLoading={isModalLoading}
        />
      )}

      {qualityControlOpen && orden && (
        <CreateQualityControlModal
          isOpen={qualityControlOpen}
          onClose={() => setQualityControlOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleQualityControl}
          isLoading={isModalLoading}
        />
      )}

      {registerSurveyOpen && orden && (
        <RegisterSurveyModal
          isOpen={registerSurveyOpen}
          onClose={() => setRegisterSurveyOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleRegisterSurvey}
          isLoading={isModalLoading}
        />
      )}

      {/* Informe técnico de OT (uso interno work-orders) */}
      {esInspeccionAcometida && showWOInspReport && orden && (
        <WOInspectionModal
          isOpen={showWOInspReport}
          onClose={() => setShowWOInspReport(false)}
          workOrderId={orden.idOrdenTrabajo}
          orderCode={orden.codigoOrden}
          solicitudId={orden.idEntidadOrigen ?? ''}
          technicianId={
            orden.personalAsignado?.[0]?.idTrabajador ??
            orden.idUsuarioAsignacion ??
            ''
          }
          onSubmit={handleSubmitWOInspReport}
          isLoading={isModalLoading}
        />
      )}

      {/* Informe técnico de solicitud (acometida) */}
      {esInspeccionAcometida &&
        showSolicitudReport &&
        orden &&
        orden.idEntidadOrigen && (
          <SolicitudInspectionModal
            isOpen={showSolicitudReport}
            onClose={() => setShowSolicitudReport(false)}
            solicitudId={orden.idEntidadOrigen}
            solicitudNumero={orden.codigoOrden}
            workOrderId={orden.idOrdenTrabajo}
            technicianId={currentUserId}
            onSuccess={handleSolicitudReportSuccess}
          />
        )}

      {/* Registro catastral (Fase 14 — solo instalación acometida) */}
      {esInstalacionAcometida && (
        <RegisterCadastralModal
          isOpen={showCadastral}
          onClose={() => {
            setShowCadastral(false);
            setPendingNextState(null);
          }}
          orderCode={orden.codigoOrden}
          solicitudId={orden.idEntidadOrigen ?? ''}
          registratorId={currentUserId}
          contractId={undefined}
          defaultAddress={orden.direccion ?? ''}
          defaultDate={new Date().toISOString().split('T')[0]}
          onSubmit={handleCadastralSubmit}
          isLoading={isModalLoading}
        />
      )}
    </PageLayout>
  );
};
