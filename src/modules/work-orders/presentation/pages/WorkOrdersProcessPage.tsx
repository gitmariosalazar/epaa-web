/**
 * WorkOrdersProcessPage — Proceso fase-a-fase de una OT
 *
 * Clean Architecture — Presentation layer.
 * Espejo exacto de SolicitudDetailPage para el módulo de work-orders.
 *
 * SOLID:
 *   SRP: orquesta sub-paneles y modales; sin lógica de negocio.
 *   OCP: nueva fase → nuevo modal + nuevo PhaseActionBtn; nada más cambia.
 *   DIP: depende de Use Cases (interfaces), no de repos concretos.
 *
 * BPMN de la OT — fases implementadas:
 *   NOTIFICADA       → Recepcionar OT (inline quick-action)
 *   PENDIENTE        → Asignar técnico responsable (inline WorkersCard)
 *   ASIGNADA         → Iniciar Preparación (inline quick-action)
 *   PREPARACION      → Crear Checklist (CreateChecklistModal)
 *   REVISION_RECHAZADA → informativo / reiniciar
 *   EN_PROCESO       → Iniciar Ejecución en Campo (inline)
 *   EN_PROCESO       → Registrar Material (inline MaterialsCard)
 *   EN_PROCESO       → Registrar Costo (inline MaterialsCard)
 *   EN_PROCESO       → Adjuntar Evidencia (inline AttachmentsCard)
 *   EJECUTADA        → Control de Calidad (CreateQualityControlModal)
 *   EJECUTADA        → Completar OT (inline quick-action)
 *   COMPLETADA       → Encuesta Satisfacción (RegisterSurveyModal)
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useAuth } from '@/shared/presentation/context/AuthContext';

// ── Use Cases ──────────────────────────────────────────────────────────────────
import { GetOrdenTrabajoDetalleByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoDetalleByNumeroOrdenUseCase';
import { GetOrdenTrabajoTrackingByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoTrackingByNumeroOrdenUseCase';
import { ReceiveWorkOrderUseCase } from '../../application/usecases/ReceiveWorkOrderUseCase';
import { AssignWorkOrderToWorkerUseCase } from '../../application/usecases/AssignWorkOrderToWorkerUseCase';
import { StartPreparationUseCase } from '../../application/usecases/StartPreparationUseCase';
import { CreatePreparationInspectionUseCase } from '../../application/usecases/CreatePreparationInspectionUseCase';
import { ResolvePreparationInspectionUseCase } from '../../application/usecases/ResolvePreparationInspectionUseCase';
import { FinishExecutionUseCase } from '../../application/usecases/FinishExecutionUseCase';
import { AddWorkersBatchToWorkOrderUseCase } from '../../application/usecases/AddWorkersBatchToWorkOrderUseCase';
import { RemoveWorkerFromWorkOrderUseCase } from '../../application/usecases/RemoveWorkerFromWorkOrderUseCase';
import { AddWorkOrderMaterialsBatchUseCase } from '../../application/usecases/AddWorkOrderMaterialsBatchUseCase';
import { AddAdditionalCostsBatchUseCase } from '../../application/usecases/AddAdditionalCostsBatchUseCase';
import { AddWorkOrderAttachmentUseCase } from '../../application/usecases/AddWorkOrderAttachmentUseCase';
import { CreateQualityControlUseCase } from '../../application/usecases/CreateQualityControlUseCase';
import { CompleteWorkOrderUseCase } from '../../application/usecases/CompleteWorkOrderUseCase';
import { RegisterSatisfactionSurveyUseCase } from '../../application/usecases/RegisterSatisfactionSurveyUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

// ── Request DTO ────────────────────────────────────────────────────────────────
import { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';

// ── Domain types ───────────────────────────────────────────────────────────────
import type { OrdenTrabajoDetalle } from '../../domain/schemas/dto/response/work-orders.get.response';
import type { OrdenTrabajoTracking } from '../../domain/schemas/dto/response/work-orders.get.response';

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
import { WorkOrderWorkersCard } from '../components/detail/WorkOrderWorkersCard';

// ── Modales ────────────────────────────────────────────────────────────────────
import { CreateChecklistModal } from '../components/modals/CreateChecklistModal';
import { CreateQualityControlModal } from '../components/modals/CreateQualityControlModal';
import { RegisterSurveyModal } from '../components/modals/RegisterSurveyModal';
import { SubmitInspectionReportModal } from '@/modules/processes/solicitudes/presentation/components/SubmitInspectionReportModal';

// ── Icons ──────────────────────────────────────────────────────────────────────
import {
  Search,
  Inbox,
  User,
  Play,
  ClipboardCheck,
  Zap,
  ShieldCheck,
  Star,
  AlertTriangle,
  X,
  FileText,
  Wrench,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import '../styles/WorkOrdersProcessPage.css';
import { Input } from '@/shared/presentation/components/Input/Input';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

const STEPS = [
  { label: 'Recepción', icon: Inbox },
  { label: 'Asignación', icon: User },
  { label: 'Preparación', icon: ClipboardCheck },
  { label: 'Personal y Materiales', icon: Wrench },
  { label: 'Evidencias', icon: FileText },
  { label: 'Calidad', icon: ShieldCheck },
  { label: 'Cierre', icon: Star }
];

const getActiveStepIndex = (estado: string, executionSubStep: number): number => {
  const upper = (estado || '').toUpperCase();
  if (upper === 'NOTIFICADA') return 0;
  if (upper === 'PENDIENTE') return 1;
  if (['ASIGNADA', 'PREPARACION', 'REVISION_RECHAZADA'].includes(upper)) return 2;
  if (['EN_PROCESO', 'EN_PROCESO_INSPECCION', 'EN_PROCESO_INSTALACION'].includes(upper)) {
    return 3 + executionSubStep;
  }
  if (['EJECUTADA', 'INSPECCION_EJECUTADA', 'INSTALACION_EJECUTADA'].includes(upper)) return 5;
  if (['COMPLETADA', 'INSPECCION_COMPLETADA', 'INSTALACION_COMPLETADA'].includes(upper)) return 6;
  return 0;
};

// ─────────────────────────────────────────────────────────────────────────────
export const WorkOrdersProcessPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const pickSolicitudId = (source: unknown): string | null => {
    if (!source || typeof source !== 'object') return null;
    const data = source as Record<string, unknown>;
    const metadata =
      data.metadata && typeof data.metadata === 'object'
        ? (data.metadata as Record<string, unknown>)
        : null;

    const candidates = [
      data.idEntidadOrigen,
      data.id_entidad_origen,
      data.solicitudId,
      data.idSolicitud,
      data.id_solicitud,
      metadata?.idEntidadOrigen,
      metadata?.id_entidad_origen,
      metadata?.solicitudId,
      metadata?.idSolicitud,
      metadata?.id_solicitud
    ];

    for (const value of candidates) {
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
      if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
      }
    }
    return null;
  };

  const esOTInspeccionAcometida = (workOrder: OrdenTrabajoDetalle): boolean => {
    const nombre = (workOrder.tipoTrabajo ?? '').toUpperCase();
    return (
      (nombre.includes('INSPECCION') ||
        nombre.includes('INSPECCIÓN') ||
        nombre.includes('FACTIBILIDAD')) &&
      (workOrder.origen ?? '').toUpperCase() === 'SOLICITUD' &&
      !!pickSolicitudId(workOrder)
    );
  };

  // ── Data state ──────────────────────────────────────────────────────────────
  const [orden, setOrden] = useState<OrdenTrabajoDetalle | null>(null);
  const [tracking, setTracking] = useState<OrdenTrabajoTracking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [executionSubStep, setExecutionSubStep] = useState(0); // 0: Personal y Materiales, 1: Evidencias

  // ── Search state ────────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [currentCode, setCurrentCode] = useState('');

  // ── Modal state (uno por fase) ──────────────────────────────────────────────
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [isResolvingChecklist, setIsResolvingChecklist] = useState(false);
  const [qualityControlOpen, setQualityControlOpen] = useState(false);
  const [registerSurveyOpen, setRegisterSurveyOpen] = useState(false);
  const [submitReportOpen, setSubmitReportOpen] = useState(false);

  // ── Quick-action loading (inline buttons) ───────────────────────────────────
  const [isReceiving, setIsReceiving] = useState(false);
  const [isStartingPrep, setIsStartingPrep] = useState(false);
  const [isRestartingPrep, setIsRestartingPrep] = useState(false);
  const [isFinishingExec, setIsFinishingExec] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // ── Modal action loading ────────────────────────────────────────────────────
  const [isModalLoading, setIsModalLoading] = useState(false);

  // ── Status groups (flujo estándar + inspección + instalación) ─────────────
  const isExecutionState = (status?: string | null) =>
    ['EN_PROCESO', 'EN_PROCESO_INSPECCION', 'EN_PROCESO_INSTALACION'].includes(
      status ?? ''
    );

  const isExecutedState = (status?: string | null) =>
    ['EJECUTADA', 'INSPECCION_EJECUTADA', 'INSTALACION_EJECUTADA'].includes(
      status ?? ''
    );

  const isCompletedState = (status?: string | null) =>
    ['COMPLETADA', 'INSPECCION_COMPLETADA', 'INSTALACION_COMPLETADA'].includes(
      status ?? ''
    );

  // ── Use cases (memoized, DIP) ───────────────────────────────────────────────
  const repo = useMemo(() => new ProcessWorkOrderRepositoryImpl(), []);

  const detalleUseCase = useMemo(
    () => new GetOrdenTrabajoDetalleByNumeroOrdenUseCase(repo),
    [repo]
  );
  const trackingUseCase = useMemo(
    () => new GetOrdenTrabajoTrackingByNumeroOrdenUseCase(repo),
    [repo]
  );
  const receiveUseCase = useMemo(
    () => new ReceiveWorkOrderUseCase(repo),
    [repo]
  );
  const assignWorkerUseCase = useMemo(
    () => new AssignWorkOrderToWorkerUseCase(repo),
    [repo]
  );
  const startPrepUseCase = useMemo(
    () => new StartPreparationUseCase(repo),
    [repo]
  );
  const checklistUseCase = useMemo(
    () => new CreatePreparationInspectionUseCase(repo),
    [repo]
  );
  const resolveChecklistUseCase = useMemo(
    () => new ResolvePreparationInspectionUseCase(repo),
    [repo]
  );
  const finishExecUseCase = useMemo(
    () => new FinishExecutionUseCase(repo),
    [repo]
  );
  const addWorkersBatchUseCase = useMemo(
    () => new AddWorkersBatchToWorkOrderUseCase(repo),
    [repo]
  );
  const removeWorkerUseCase = useMemo(
    () => new RemoveWorkerFromWorkOrderUseCase(repo),
    [repo]
  );
  const materialsBatchUseCase = useMemo(
    () => new AddWorkOrderMaterialsBatchUseCase(repo),
    [repo]
  );
  const costsBatchUseCase = useMemo(
    () => new AddAdditionalCostsBatchUseCase(repo),
    [repo]
  );
  const attachmentUseCase = useMemo(
    () => new AddWorkOrderAttachmentUseCase(repo),
    [repo]
  );
  const qcUseCase = useMemo(
    () => new CreateQualityControlUseCase(repo),
    [repo]
  );
  const completeUseCase = useMemo(
    () => new CompleteWorkOrderUseCase(repo),
    [repo]
  );
  const surveyUseCase = useMemo(
    () => new RegisterSatisfactionSurveyUseCase(repo),
    [repo]
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const reload = useCallback(() => setReloadTrigger((p) => p + 1), []);

  const currentUserId = user?.userId ?? '';
  const esFlujoAcometidaSolicitud =
    orden !== null && esOTInspeccionAcometida(orden);
  const requiereInformeSolicitud =
    esFlujoAcometidaSolicitud && orden?.estado === 'EN_PROCESO_INSPECCION';
  const solicitudOrigenId = useMemo(
    () => pickSolicitudId(orden) ?? pickSolicitudId(tracking),
    [orden, tracking]
  );

  const currentStepGuide = useMemo(() => {
    if (!orden) return null;
    const estado = orden.estado ?? '';
    if (estado === 'NOTIFICADA') {
      return {
        phase: 'Fase 2',
        title: 'Recepción Operativa',
        action: 'Acción actual: Recepcionar Orden de Trabajo.'
      };
    }
    if (estado === 'PENDIENTE') {
      return {
        phase: 'Fase 2',
        title: 'Asignación de Personal',
        action: 'Acción actual: Asignar técnico responsable.'
      };
    }
    if (estado === 'ASIGNADA') {
      return {
        phase: 'Fase 3',
        title: 'Preparación de Campo',
        action: 'Acción actual: Iniciar preparación.'
      };
    }
    if (estado === 'PREPARACION' && !orden.idInspeccion) {
      return {
        phase: 'Fase 3',
        title: 'Checklist de Preparación',
        action: 'Acción actual: Registrar inspección de preparación.'
      };
    }
    if (estado === 'PREPARACION' && orden.idInspeccion) {
      return {
        phase: 'Fase 3',
        title: 'Resolución de Checklist',
        action: 'Acción actual: Aprobar o rechazar inspección.'
      };
    }
    if (estado === 'REVISION_RECHAZADA') {
      return {
        phase: 'Fase 3',
        title: 'Corrección de Preparación',
        action: 'Acción actual: Reiniciar preparación.'
      };
    }
    if (isExecutionState(estado)) {
      if (executionSubStep === 0) {
        return {
          phase: 'Fase 4 - Ejecución',
          title: 'Personal y Materiales',
          action: 'Paso 1: Asigna personal de apoyo y registra materiales o costos adicionales consumidos.'
        };
      }
      return {
        phase: 'Fase 4 - Ejecución',
        title: 'Evidencias de Campo',
        action: requiereInformeSolicitud
          ? 'Paso 2: Sube fotos/documentos de evidencia y envía el informe técnico obligatorio.'
          : 'Paso 2: Sube fotos/documentos de evidencia y finaliza la ejecución.'
      };
    }
    if (isExecutedState(estado)) {
      return {
        phase: 'Fase 5',
        title: 'Control de Calidad y Cierre',
        action: 'Acción actual: Emitir control de calidad y completar OT.'
      };
    }
    if (isCompletedState(estado) && !orden.idEncuesta) {
      return {
        phase: 'Fase 6',
        title: 'Cierre con Cliente',
        action: 'Acción actual: Registrar encuesta de satisfacción.'
      };
    }
    return {
      phase: 'Proceso',
      title: 'Orden en Estado Final',
      action: 'No hay acciones pendientes para esta OT.'
    };
  }, [orden, requiereInformeSolicitud, executionSubStep]);

  // ── Optional prefill from route query (?code=OT-...) ───────────────────────
  useEffect(() => {
    const codeParam = searchParams.get('code')?.trim().toUpperCase();
    if (!codeParam) return;
    setSearchInput(codeParam);
    setCurrentCode(codeParam);
  }, [searchParams]);

  // ── Load orden (detail + tracking en paralelo) ──────────────────────────────
  useEffect(() => {
    if (!currentCode) return;
    let isMounted = true;
    // Si ya hay una orden cargada, es un reload (agregar material/personal/costo)
    // No mostrar loading spinner para evitar desmontaje del contenido y scroll jump
    const isReload = orden !== null;
    const load = async () => {
      if (!isReload) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const [det, trk] = await Promise.all([
          detalleUseCase.execute(currentCode),
          trackingUseCase.execute(currentCode)
        ]);
        if (isMounted) {
          setOrden(det);
          setTracking(trk);
          if (!isReload) {
            setExecutionSubStep(0);
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCode, detalleUseCase, trackingUseCase, reloadTrigger]);

  // ── Search handler ───────────────────────────────────────────────────────────
  const handleSearch = () => {
    const code = searchInput.trim().toUpperCase();
    if (!code) return;
    setCurrentCode(code);
  };

  const handleClear = () => {
    setSearchInput('');
    setCurrentCode('');
    setOrden(null);
    setTracking(null);
    setError(null);
  };

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

  // ── Fase 2: Asignar a técnico ────────────────────────────────────────────────
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

  // ── Fase 3: Iniciar preparación ──────────────────────────────────────────────
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

  // ── Fase 3: Reiniciar preparación (desde REVISION_RECHAZADA → PREPARACION) ────────
  const handleRestartPrep = async () => {
    if (!orden) return;
    setIsRestartingPrep(true);
    try {
      await startPrepUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          'PREPARACION',
          currentUserId,
          'Reinicio de preparación tras revisión rechazada'
        )
      );
      MessageToastCustom(
        'success',
        'Preparación Reiniciada',
        'La OT volvio al estado PREPARACION.'
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

  // ── Fase 3: Crear checklist ──────────────────────────────────────────────────
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

  // ── Fase 3: Aprobar / Rechazar checklist ───────────────────────────────────────
  const handleResolveChecklist = async (approved: boolean) => {
    if (!orden) return;
    setIsResolvingChecklist(true);
    const newStatus = approved ? 'EN_PROCESO' : 'REVISION_RECHAZADA';
    try {
      await resolveChecklistUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          newStatus,
          currentUserId,
          approved
            ? 'Inspección de preparación aprobada — iniciando ejecución'
            : 'Inspección de preparación rechazada'
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

  // ── Fase 4: Finalizar ejecución en campo (EN_PROCESO → EJECUTADA) ────────────────
  const executeFinishExec = async () => {
    if (!orden) return;
    if (requiereInformeSolicitud) {
      MessageToastCustom(
        'warning',
        'Paso requerido',
        'Para esta OT primero debes registrar el informe técnico en el flujo de Solicitudes.'
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
        'La OT pasó al siguiente estado de ejecución. Procede al control de calidad.'
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
    if (requiereInformeSolicitud) {
      if (!solicitudOrigenId) {
        MessageToastCustom(
          'error',
          'Error',
          'No se encontró la solicitud origen para abrir el informe técnico.'
        );
        return;
      }
      setSubmitReportOpen(true);
      return;
    }
    await executeFinishExec();
  };

  const handleInspectionReportSuccess = async () => {
    if (!orden) {
      reload();
      return;
    }
    if (!esFlujoAcometidaSolicitud) {
      reload();
      return;
    }

    try {
      await finishExecUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          'INSPECCION_EJECUTADA',
          currentUserId,
          'Informe técnico enviado. Inspección ejecutada.'
        )
      );

      try {
        await completeUseCase.execute(
          new ProcessWorkOrderRequest(
            orden.idOrdenTrabajo,
            'INSPECCION_COMPLETADA',
            currentUserId,
            'Inspección completada tras envío de informe técnico.'
          )
        );
        MessageToastCustom(
          'success',
          'Proceso Completado',
          'Informe enviado y OT movida a INSPECCION_COMPLETADA.'
        );
      } catch {
        MessageToastCustom(
          'success',
          'Informe Enviado',
          'La OT avanzó a INSPECCION_EJECUTADA. Continúa con el cierre.'
        );
      }
    } catch {
      MessageToastCustom(
        'info',
        'Informe Enviado',
        'Se recargará la OT para reflejar el estado actualizado.'
      );
    } finally {
      reload();
    }
  };

  // ── Personal en campo: Agregar / Remover trabajador ─────────────────────────
  const handleSaveWorkersBatch = async (
    workers: { workerId: string; roleId?: number | null; isResponsible?: boolean }[]
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await addWorkersBatchUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        assignedByUserId: currentUserId,
        workers
      });
      MessageToastCustom(
        'success',
        'Personal Agregado',
        `Se agregaron ${workers.length} trabajador(es) a la OT.`
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo agregar al personal.'
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

  // ── Fase 4: Registrar materiales en lote ───────────────────────────────────────
  const handleSaveMaterialsBatch = async (
    materials: { materialId: number; quantity: number; unitCost: number; codigoMaterial?: string; nombreMaterial?: string }[]
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await materialsBatchUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        createdByUserId: currentUserId,
        materials
      });
      MessageToastCustom(
        'success',
        'Materiales Registrados',
        `Se agregaron ${materials.length} material(es) a la OT.`
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo registrar los materiales.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  // ── Fase 4: Registrar costos adicionales en lote ─────────────────────────────
  const handleSaveCostsBatch = async (
    costs: { concept: string; quantity: number; unitCost: number }[]
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await costsBatchUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        createdByUserId: currentUserId,
        costs
      });
      MessageToastCustom(
        'success',
        'Costos Registrados',
        `Se agregaron ${costs.length} costo(s) adicional(es).`
      );
      reload();
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error',
        e.message || 'No se pudo registrar los costos.'
      );
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleRemoveMaterial = async (_idDetalle: string | number) => {
    MessageToastCustom(
      'info',
      'En desarrollo',
      'La función para remover materiales está en desarrollo.'
    );
  };

  const handleRemoveCost = async (_idCosto: string | number) => {
    MessageToastCustom(
      'info',
      'En desarrollo',
      'La función para remover costos adicionales está en desarrollo.'
    );
  };

  // ── Fase 4: Adjuntar evidencia ───────────────────────────────────────────────
  const handleAddAttachment = async (
    files: File[]
  ) => {
    if (!orden) return;
    setIsModalLoading(true);
    try {
      await attachmentUseCase.execute({
        workOrderId: orden.idOrdenTrabajo,
        files,
        createdByUserId: currentUserId
      });
      MessageToastCustom(
        'success',
        'Evidencia Adjuntada',
        `${files.length} archivo(s) adjuntado(s) a la OT.`
      );
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
    setIsCompleting(true);
    const nextStatus =
      orden.estado === 'INSPECCION_EJECUTADA'
        ? 'INSPECCION_COMPLETADA'
        : orden.estado === 'INSTALACION_EJECUTADA'
          ? 'INSTALACION_COMPLETADA'
          : 'COMPLETADA';
    try {
      await completeUseCase.execute(
        new ProcessWorkOrderRequest(
          orden.idOrdenTrabajo,
          nextStatus,
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

  const renderStepper = (estado: string) => {
    let activeIndex = getActiveStepIndex(estado, executionSubStep);

    // Si la orden ya tiene encuesta registrada y estamos en la fase de Cierre, 
    // forzamos el índice a 7 para que el paso 6 (Cierre) aparezca como "isCompleted" con el check verde.
    if (activeIndex === 6 && orden?.idEncuesta) {
      activeIndex = 7;
    }

    return (
      <div className="wo-stepper" role="progressbar" aria-label="Progreso de la Orden de Trabajo">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isPending = idx > activeIndex;

          let statusClass = 'wo-step-item--pending';
          if (isCompleted) statusClass = 'wo-step-item--completed';
          if (isActive) statusClass = 'wo-step-item--active';

          return (
            <div key={idx} className={`wo-step-item ${statusClass}`}>
              <div className="wo-step-container">
                <div className="wo-step-circle">
                  <StepIcon size={18} />
                  {isCompleted && (
                    <div className="wo-step-badge wo-step-badge--completed">
                      <Check size={8} strokeWidth={3} />
                    </div>
                  )}
                  {isPending && (
                    <div className="wo-step-badge wo-step-badge--pending">
                      <X size={8} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="wo-step-label">{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`wo-step-line ${idx < activeIndex ? 'wo-step-line--completed' : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStepContent = (estado: string) => {
    if (!orden) return null;
    const stepIndex = getActiveStepIndex(estado, executionSubStep);

    switch (stepIndex) {
      case 0: // Recepción (NOTIFICADA)
        return (
          <>
            <div className="wo-process-phase-actions">
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
            </div>
            <WorkOrderInfoCard orden={orden} />
          </>
        );

      case 1: // Asignación (PENDIENTE)
        return (
          <>
            <div className="wo-process-info-banner wo-process-info-banner--warn">
              <User size={16} />
              <div>
                <strong>Asignación Pendiente</strong>
                <span>Usa el formulario inline a continuación para asignar al Técnico Responsable de la orden de trabajo.</span>
              </div>
            </div>
            <WorkOrderInfoCard orden={orden} />
            <WorkOrderWorkersCard
              codigoOrden={orden.codigoOrden}
              personalAsignado={orden.personalAsignado ?? []}
              onSaveWorkersBatch={async (workers) => {
                if (workers.length > 0) {
                  // 1. Guardar todos los trabajadores en el lote para que se registren en la base de datos
                  await handleSaveWorkersBatch(workers);
                  
                  // 2. Transicionar el estado de la OT a ASIGNADA usando el workerId del responsable
                  const responsible = workers.find(w => w.isResponsible || w.roleId === 1) || workers[0];
                  await handleAssignWorker(responsible.workerId, 'Asignación de personal y transición a estado ASIGNADA');
                }
              }}
              isLoading={isModalLoading}
            />
          </>
        );

      case 2: // Preparación (ASIGNADA, PREPARACION, REVISION_RECHAZADA)
        return (
          <>
            <div className="wo-process-phase-actions">
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

              {orden.estado === 'REVISION_RECHAZADA' && (
                <>
                  <div className="wo-process-info-banner wo-process-info-banner--warn">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>Preparación Rechazada</strong>
                      <span>Corrige las deficiencias y vuelve a iniciar la preparación de campo.</span>
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
            </div>

            <WorkOrderInfoCard orden={orden} />

            <WorkOrderWorkersCard
              codigoOrden={orden.codigoOrden}
              personalAsignado={orden.personalAsignado ?? []}
              onSaveWorkersBatch={handleSaveWorkersBatch}
              onRemoveWorker={handleRemoveWorker}
              isLoading={isModalLoading}
            />
          </>
        );

      case 3: // Personal y Materiales (EN_PROCESO, subStep = 0)
        return (
          <>
            <WorkOrderInfoCard orden={orden} />

            <WorkOrderWorkersCard
              codigoOrden={orden.codigoOrden}
              personalAsignado={orden.personalAsignado ?? []}
              onSaveWorkersBatch={handleSaveWorkersBatch}
              onRemoveWorker={handleRemoveWorker}
              isLoading={isModalLoading}
            />

            <WorkOrderMaterialsCard
              materiales={orden.materiales ?? []}
              costosAdicionales={orden.costosAdicionales ?? []}
              onSaveMaterialsBatch={handleSaveMaterialsBatch}
              onRemoveMaterial={handleRemoveMaterial}
              onSaveCostsBatch={handleSaveCostsBatch}
              onRemoveCost={handleRemoveCost}
              isLoading={isModalLoading}
            />

            <div className="wo-substep-nav" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <Button
                variant="primary"
                onClick={() => setExecutionSubStep(1)}
                rightIcon={<ChevronRight size={14} />}
              >
                Siguiente: Registrar Evidencias
              </Button>
            </div>
          </>
        );

      case 4: // Evidencias (EN_PROCESO, subStep = 1)
        return (
          <>
            <div className="wo-process-phase-actions">
              <WorkOrderPhaseActionBtn
                id="wo-btn-finish-exec"
                color={requiereInformeSolicitud ? '#a855f7' : '#10b981'}
                bg={requiereInformeSolicitud ? 'rgba(168,85,247,0.1)' : 'rgba(16,185,129,0.12)'}
                icon={requiereInformeSolicitud ? <FileText size={18} /> : <Zap size={18} />}
                label={requiereInformeSolicitud ? 'Enviar Informe Técnico de Campo' : 'Finalizar Ejecución en Campo'}
                sublabel={requiereInformeSolicitud ? 'Fase 4 — Paso actual obligatorio para acometidas' : 'Fase 4 — Marcar trabajo técnico completado'}
                onClick={handleFinishExec}
                loading={!requiereInformeSolicitud && isFinishingExec}
              />
            </div>

            <WorkOrderInfoCard orden={orden} />

            <WorkOrderAttachmentsCard
              adjuntos={orden.adjuntos ?? []}
              onAddAttachment={handleAddAttachment}
              isLoading={isModalLoading}
            />

            <div className="wo-substep-nav" style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.5rem', marginTop: '1rem' }}>
              <Button
                variant="outline"
                onClick={() => setExecutionSubStep(0)}
                leftIcon={<ChevronLeft size={14} />}
              >
                Anterior: Personal y Materiales
              </Button>
            </div>
          </>
        );

      case 5: // Control de Calidad (EJECUTADA, INSPECCION_EJECUTADA, INSTALACION_EJECUTADA)
        return (
          <>
            <div className="wo-process-phase-actions">
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
            </div>

            <WorkOrderInfoCard orden={orden} />

            <WorkOrderWorkersCard
              codigoOrden={orden.codigoOrden}
              personalAsignado={orden.personalAsignado ?? []}
              isLoading={false}
            />

            <WorkOrderMaterialsCard
              materiales={orden.materiales ?? []}
              costosAdicionales={orden.costosAdicionales ?? []}
              isLoading={false}
            />

            <WorkOrderAttachmentsCard
              adjuntos={orden.adjuntos ?? []}
              isLoading={false}
            />

            <WorkOrderQualityCard orden={orden} />
          </>
        );

      case 6: // Cierre (COMPLETADA, INSPECCION_COMPLETADA, INSTALACION_COMPLETADA)
        return (
          <>
            <div className="wo-process-phase-actions">
              {!orden.idEncuesta && (
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
              {orden.idEncuesta && (
                <div className="wo-process-info-banner wo-process-info-banner--success">
                  <Zap size={16} />
                  <div>
                    <strong>Proceso Completado ✓</strong>
                    <span>Encuesta de satisfacción registrada. La OT está cerrada.</span>
                  </div>
                </div>
              )}
            </div>

            <WorkOrderInfoCard orden={orden} />

            <WorkOrderWorkersCard
              codigoOrden={orden.codigoOrden}
              personalAsignado={orden.personalAsignado ?? []}
              isLoading={false}
            />

            <WorkOrderMaterialsCard
              materiales={orden.materiales ?? []}
              costosAdicionales={orden.costosAdicionales ?? []}
              isLoading={false}
            />

            <WorkOrderAttachmentsCard
              adjuntos={orden.adjuntos ?? []}
              isLoading={false}
            />

            <WorkOrderQualityCard orden={orden} />

            <WorkOrderSatisfactionCard orden={orden} />
          </>
        );

      default:
        return null;
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const updatedStr = orden?.updatedAt
    ? new Date(orden.updatedAt).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : '—';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <PageLayout
      header={
        <div className="wo-process-header">
          <div className="wo-process-header__info">
            <h2 className="wo-process-header__title">
              Proceso de Órdenes de Trabajo
            </h2>
            <p className="wo-process-header__subtitle">
              Busca una OT por código y avanza cada fase del proceso operativo
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="wo-process-search">
            <Input
              id="wo-process-search-input"
              width={'350px'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Código OT — Ej: OT-2026-0000001"
              autoComplete="off"
              leftIcon={<Search size={14} />}
              size='compact'
            />
            <Button
              id="wo-process-search-btn"
              onClick={handleSearch}
              variant="primary"
              leftIcon={<Search size={14} />}
              disabled={!searchInput.trim() || isLoading}
              size="compact"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
            {currentCode && (
              <Button
                variant="dashed"
                color='warning'
                size="compact"
                leftIcon={<X size={14} />}
                onClick={handleClear}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* ── Empty state ── */}
      {!currentCode && !isLoading && (
        <div className="wo-process-empty">
          <EmptyState
            icon={
              <div className="wo-process-empty__icon">
                <Search size={48} opacity={0.3} />
              </div>
            }
            message="Ingresa un código de OT para comenzar"
            description="Escribe el código de la orden (Ej: OT-2026-0000001) y presiona Buscar"
          />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="wo-process-error">
          <AlertTriangle size={40} />
          <h3>No se pudo cargar la OT</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={handleSearch}>
            Reintentar
          </Button>
        </div>
      )}

      {/* ── Loading ── */}
      {isLoading && (
        <div className="wo-process-loading">
          <div className="wo-process-loading__spinner" />
          <span>Cargando orden de trabajo...</span>
        </div>
      )}

      {/* ── Contenido principal ── */}
      {!isLoading && !error && orden && (
        <div className="wo-process-container">
          {/* ══ COLUMNA PRINCIPAL ══ */}
          <div className="wo-process-main-col">
            {/* Stepper horizontal */}
            {renderStepper(orden.estado ?? '')}

            {/* Hero: estado + SLA + datos clave */}
            <WorkOrderHeroCard orden={orden} updatedStr={updatedStr} />

            {currentStepGuide && (
              <div
                className="wo-process-step-guide"
                role="status"
                aria-live="polite"
              >
                <span className="wo-process-step-guide__phase">
                  {currentStepGuide.phase}
                </span>
                <strong className="wo-process-step-guide__title">
                  {currentStepGuide.title}
                </strong>
                <span className="wo-process-step-guide__action">
                  {currentStepGuide.action}
                </span>
              </div>
            )}

            {/* Renderizar contenido específico del paso activo */}
            {renderStepContent(orden.estado ?? '')}
          </div>

          {/* ══ COLUMNA SIDEBAR ══ */}
          <div className="wo-process-sidebar-col">
            <WorkOrderMetricsCard orden={orden} />
            <WorkOrderTimelineCard
              historial={tracking?.historial ?? null}
              title="Historial de Estados"
            />
          </div>
        </div>
      )}

      {/* ══ MODALES ══ */}

      {checklistOpen && orden && (
        <CreateChecklistModal
          isOpen={checklistOpen}
          onClose={() => setChecklistOpen(false)}
          workOrderId={orden.idOrdenTrabajo}
          onSubmit={handleCreateChecklist}
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

      {submitReportOpen && orden && (
        <SubmitInspectionReportModal
          isOpen={submitReportOpen}
          onClose={() => setSubmitReportOpen(false)}
          solicitudId={solicitudOrigenId ?? ''}
          solicitudNumero={orden.codigoOrden}
          workOrderId={orden.idOrdenTrabajo}
          technicianId={currentUserId}
          allowInconsistentSuccess
          onSuccess={() => {
            setSubmitReportOpen(false);
            void handleInspectionReportSuccess();
          }}
        />
      )}
    </PageLayout>
  );
};
