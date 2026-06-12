import { useCallback, useMemo, useState } from 'react';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  AlertCircle,
  ClipboardCheck,
  FileCheck2,
  Hammer,
  Layers,
  ListTodo,
  Send
} from 'lucide-react';
import {
  createWorkOrderProcessDependencies,
  type WorkOrderProcessDependencies
} from '../context/workOrderProcess.dependencies';
import type {
  WorkOrderActionDefinition,
  WorkOrderActionKey,
  WorkOrderPhaseId,
  WorkOrderProcessState
} from './workOrderProcess.types';

const PHASE_LABELS: Record<WorkOrderPhaseId, string> = {
  all: 'Todas las fases',
  'phase-1': 'Fase 1 - Creacion',
  'phase-2': 'Fase 2 - Recepcion y asignacion',
  'phase-3': 'Fase 3 - Preparacion',
  'phase-4': 'Fase 4 - Ejecucion',
  'phase-5': 'Fase 5 - Calidad',
  'phase-6': 'Fase 6 - Cierre'
};

export const WORK_ORDER_PHASE_TABS: TabItem<WorkOrderPhaseId>[] = [
  { id: 'all', label: PHASE_LABELS.all, icon: <Layers size={16} /> },
  { id: 'phase-1', label: PHASE_LABELS['phase-1'], icon: <Send size={16} /> },
  {
    id: 'phase-2',
    label: PHASE_LABELS['phase-2'],
    icon: <ListTodo size={16} />
  },
  {
    id: 'phase-3',
    label: PHASE_LABELS['phase-3'],
    icon: <ClipboardCheck size={16} />
  },
  { id: 'phase-4', label: PHASE_LABELS['phase-4'], icon: <Hammer size={16} /> },
  {
    id: 'phase-5',
    label: PHASE_LABELS['phase-5'],
    icon: <FileCheck2 size={16} />
  },
  {
    id: 'phase-6',
    label: PHASE_LABELS['phase-6'],
    icon: <AlertCircle size={16} />
  }
];

export const WORK_ORDER_ACTIONS: WorkOrderActionDefinition[] = [
  {
    key: 'create-work-order',
    phase: 'phase-1',
    title: 'Crear orden de trabajo',
    description: 'Fase 1 - Paso 1',
    defaultPayload: {
      origin: 'TRAMITE',
      workTypeId: 1,
      priorityId: 1,
      clientId: 'CLIENT-001',
      cadastralKey: '0101010101',
      description: 'Nueva orden de trabajo desde portal administrativo',
      location: 'Sector Centro',
      longitude: -78.5,
      latitude: -0.2,
      createdByUserId: 'USER-ADMIN',
      metadata: '{"source":"portal"}'
    }
  },
  {
    key: 'receive-work-order',
    phase: 'phase-2',
    title: 'Recibir orden de trabajo',
    description: 'Fase 2 - Paso 1',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      newStatus: 'PENDIENTE',
      userId: 'USER-ADMIN',
      comment: 'OT recibida para gestion administrativa'
    }
  },
  {
    key: 'assign-work-order-to-crew',
    phase: 'phase-2',
    title: 'Asignar técnico',
    description: 'Fase 2 - Paso 2 (opcion A)',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      crewId: 'CREW-001',
      assignedByUserId: 'USER-ADMIN',
      comment: 'Asignación de técnico responsable'
    }
  },
  {
    key: 'assign-work-order-to-worker',
    phase: 'phase-2',
    title: 'Asignar a tecnico',
    description: 'Fase 2 - Paso 2 (opcion B)',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      workerId: 'WORKER-001',
      assignedByUserId: 'USER-ADMIN',
      comment: 'Asignacion operativa a tecnico'
    }
  },
  {
    key: 'start-preparation',
    phase: 'phase-3',
    title: 'Iniciar preparacion',
    description: 'Fase 3 - Paso 1',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      newStatus: 'PREPARACION',
      userId: 'USER-ADMIN',
      comment: 'Inicio de checklist y alistamiento'
    }
  },
  {
    key: 'create-preparation-inspection',
    phase: 'phase-3',
    title: 'Crear inspeccion de preparacion',
    description: 'Fase 3 - Paso 2',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      crewId: 'CREW-001',
      createdByUserId: 'USER-ADMIN',
      passed: true,
      observations: 'Inspeccion creada'
    }
  },
  {
    key: 'add-preparation-inspection-detail',
    phase: 'phase-3',
    title: 'Agregar detalle de inspeccion',
    description: 'Fase 3 - Paso 2',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      inspectionId: 'INSPECTION-001',
      code: 'EPP-01',
      passed: true,
      createdByUserId: 'USER-ADMIN',
      comment: 'EPP verificado correctamente'
    }
  },
  {
    key: 'resolve-preparation-inspection',
    phase: 'phase-3',
    title: 'Resolver inspeccion de preparacion',
    description: 'Fase 3 - Decision',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      userId: 'USER-ADMIN',
      passed: true,
      comment: 'Preparacion aprobada para ejecucion'
    }
  },
  {
    key: 'start-execution',
    phase: 'phase-4',
    title: 'Iniciar ejecucion',
    description: 'Fase 4 - Inicio operativo',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      newStatus: 'EN_PROCESO',
      userId: 'USER-ADMIN',
      comment: 'Inicio de ejecucion en campo'
    }
  },
  {
    key: 'add-work-order-material',
    phase: 'phase-4',
    title: 'Agregar material',
    description: 'Fase 4 - Paso 1',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      materialId: 1,
      quantity: 2,
      unitCost: 5,
      createdByUserId: 'USER-ADMIN'
    }
  },
  {
    key: 'add-additional-cost',
    phase: 'phase-4',
    title: 'Agregar costo adicional',
    description: 'Fase 4 - Paso 2',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      concept: 'Horas extra',
      quantity: 1,
      unitCost: 15,
      createdByUserId: 'USER-ADMIN'
    }
  },
  {
    key: 'add-work-order-attachment',
    phase: 'phase-4',
    title: 'Agregar evidencia',
    description: 'Fase 4 - Paso 3',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      fileName: 'evidencia.jpg',
      fileType: 'FOTO',
      fileUrl: 'https://example.com/evidencia.jpg',
      createdByUserId: 'USER-ADMIN'
    }
  },
  {
    key: 'create-quality-control',
    phase: 'phase-5',
    title: 'Crear control de calidad',
    description: 'Fase 5 - Cabecera de control',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      createdByUserId: 'USER-ADMIN',
      approved: true,
      comments: 'Control de calidad inicial'
    }
  },
  {
    key: 'add-quality-control-detail',
    phase: 'phase-5',
    title: 'Agregar detalle de calidad',
    description: 'Fase 5 - Checklist tecnico',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      controlId: 'QUALITY-001',
      code: 'QC-01',
      passed: true,
      createdByUserId: 'USER-ADMIN',
      comment: 'Validacion tecnica aprobada'
    }
  },
  {
    key: 'resolve-quality-control',
    phase: 'phase-5',
    title: 'Resolver control de calidad',
    description: 'Fase 5 - Decision',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      userId: 'USER-ADMIN',
      approved: true,
      comment: 'Orden aprobada para cierre'
    }
  },
  {
    key: 'complete-work-order',
    phase: 'phase-6',
    title: 'Completar orden de trabajo',
    description: 'Fase 6 - Paso 1',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      newStatus: 'COMPLETADA',
      userId: 'USER-ADMIN',
      comment: 'Cierre administrativo completo'
    }
  },
  {
    key: 'register-satisfaction-survey',
    phase: 'phase-6',
    title: 'Registrar encuesta de satisfaccion',
    description: 'Fase 6 - Paso 3',
    defaultPayload: {
      workOrderId: 'WORK-ORDER-ID',
      rating: 5,
      createdByUserId: 'USER-ADMIN',
      comments: 'Excelente atencion y tiempo de respuesta'
    }
  }
];

const INITIAL_STATE: WorkOrderProcessState = {
  numeroOrden: '',
  solicitudId: '',
  selectedPhase: 'all',
  selectedAction: WORK_ORDER_ACTIONS[0].key,
  payloadDraft: JSON.stringify(WORK_ORDER_ACTIONS[0].defaultPayload, null, 2),
  tracking: null,
  detail: null,
  ordenesBySolicitud: [],
  lastResponse: null,
  isLoadingQueries: false,
  isSubmittingAction: false,
  errorMessage: null,
  successMessage: null
};

// kept for backward compat; not used by the form-based flow
const _parseJsonPayload = (draft: string): Record<string, unknown> => {
  const parsed = JSON.parse(draft);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('El payload debe ser un objeto JSON.');
  }
  return parsed as Record<string, unknown>;
};
void _parseJsonPayload; // suppress unused warning

export const useWorkOrderProcess = (
  providedDependencies?: WorkOrderProcessDependencies
) => {
  const dependencies = useMemo(
    () => providedDependencies ?? createWorkOrderProcessDependencies(),
    [providedDependencies]
  );

  const [state, setState] = useState<WorkOrderProcessState>(INITIAL_STATE);

  const phaseActions = useMemo(() => {
    if (state.selectedPhase === 'all') {
      return WORK_ORDER_ACTIONS;
    }
    return WORK_ORDER_ACTIONS.filter(
      (action) => action.phase === state.selectedPhase
    );
  }, [state.selectedPhase]);

  const selectedActionDef = useMemo(
    () =>
      WORK_ORDER_ACTIONS.find(
        (action) => action.key === state.selectedAction
      ) ?? WORK_ORDER_ACTIONS[0],
    [state.selectedAction]
  );

  const setError = (message: string) => {
    setState((current) => ({
      ...current,
      errorMessage: message,
      successMessage: null
    }));
  };

  const setSuccess = (message: string) => {
    setState((current) => ({
      ...current,
      successMessage: message,
      errorMessage: null
    }));
  };

  const setPhase = useCallback((phase: WorkOrderPhaseId) => {
    const firstAction = WORK_ORDER_ACTIONS.find(
      (action) => phase === 'all' || action.phase === phase
    );

    setState((current) => ({
      ...current,
      selectedPhase: phase,
      selectedAction: firstAction?.key ?? current.selectedAction,
      payloadDraft: JSON.stringify(firstAction?.defaultPayload ?? {}, null, 2),
      successMessage: null,
      errorMessage: null
    }));
  }, []);

  const setSelectedAction = useCallback((key: WorkOrderActionKey) => {
    const selected = WORK_ORDER_ACTIONS.find((action) => action.key === key);
    setState((current) => ({
      ...current,
      selectedAction: key,
      payloadDraft: JSON.stringify(selected?.defaultPayload ?? {}, null, 2),
      successMessage: null,
      errorMessage: null
    }));
  }, []);

  const setNumeroOrden = useCallback((numeroOrden: string) => {
    setState((current) => ({ ...current, numeroOrden }));
  }, []);

  const setSolicitudId = useCallback((solicitudId: string) => {
    setState((current) => ({ ...current, solicitudId }));
  }, []);

  const loadTracking = useCallback(async () => {
    const numero = state.numeroOrden.trim();
    if (!numero) {
      setError('Ingresa un numero de orden para consultar tracking.');
      return;
    }

    setState((current) => ({
      ...current,
      isLoadingQueries: true,
      errorMessage: null,
      successMessage: null
    }));

    try {
      const tracking =
        await dependencies.getOrdenTrabajoTrackingByNumeroOrdenUseCase.execute(
          numero
        );
      setState((current) => ({
        ...current,
        tracking,
        isLoadingQueries: false
      }));
      setSuccess(
        tracking
          ? 'Tracking consultado correctamente.'
          : 'No se encontro tracking para esa OT.'
      );
    } catch (error) {
      setState((current) => ({ ...current, isLoadingQueries: false }));
      setError(
        error instanceof Error ? error.message : 'Error consultando tracking.'
      );
    }
  }, [dependencies, state.numeroOrden]);

  const loadDetail = useCallback(async () => {
    const numero = state.numeroOrden.trim();
    if (!numero) {
      setError('Ingresa un numero de orden para consultar detalle.');
      return;
    }

    setState((current) => ({
      ...current,
      isLoadingQueries: true,
      errorMessage: null,
      successMessage: null
    }));

    try {
      const detail =
        await dependencies.getOrdenTrabajoDetalleByNumeroOrdenUseCase.execute(
          numero
        );
      setState((current) => ({ ...current, detail, isLoadingQueries: false }));
      setSuccess(
        detail
          ? 'Detalle consultado correctamente.'
          : 'No se encontro detalle para esa OT.'
      );
    } catch (error) {
      setState((current) => ({ ...current, isLoadingQueries: false }));
      setError(
        error instanceof Error ? error.message : 'Error consultando detalle.'
      );
    }
  }, [dependencies, state.numeroOrden]);

  const loadBySolicitud = useCallback(async () => {
    const solicitud = state.solicitudId.trim();
    if (!solicitud) {
      setError('Ingresa un ID de solicitud para consultar OTs relacionadas.');
      return;
    }

    setState((current) => ({
      ...current,
      isLoadingQueries: true,
      errorMessage: null,
      successMessage: null
    }));

    try {
      const ordenes =
        await dependencies.getOrdenesTrabajoBySolicitudIdUseCase.execute(
          solicitud
        );
      setState((current) => ({
        ...current,
        ordenesBySolicitud: ordenes,
        isLoadingQueries: false
      }));
      setSuccess(
        `Se encontraron ${ordenes.length} orden(es) para la solicitud.`
      );
    } catch (error) {
      setState((current) => ({ ...current, isLoadingQueries: false }));
      setError(
        error instanceof Error
          ? error.message
          : 'Error consultando por solicitud.'
      );
    }
  }, [dependencies, state.solicitudId]);

  const executeAction = useCallback(
    async (payload: Record<string, unknown>) => {
      setState((current) => ({
        ...current,
        isSubmittingAction: true,
        errorMessage: null,
        successMessage: null
      }));

      try {
        let response = null;

        switch (state.selectedAction) {
          case 'create-work-order':
            response = await dependencies.createWorkOrderUseCase.execute(
              payload as any
            );
            break;
          case 'receive-work-order':
            response = await dependencies.receiveWorkOrderUseCase.execute(
              payload as any
            );
            break;
          case 'assign-work-order-to-crew':
            response = await dependencies.assignWorkOrderToCrewUseCase.execute(
              payload as any
            );
            break;
          case 'assign-work-order-to-worker':
            response =
              await dependencies.assignWorkOrderToWorkerUseCase.execute(
                payload as any
              );
            break;
          case 'start-preparation':
            response = await dependencies.startPreparationUseCase.execute(
              payload as any
            );
            break;
          case 'create-preparation-inspection':
            response =
              await dependencies.createPreparationInspectionUseCase.execute(
                payload as any
              );
            break;
          case 'add-preparation-inspection-detail':
            response =
              await dependencies.addPreparationInspectionDetailUseCase.execute(
                payload as any
              );
            break;
          case 'resolve-preparation-inspection':
            response =
              await dependencies.resolvePreparationInspectionUseCase.execute(
                payload as any
              );
            break;
          case 'start-execution':
            response =
              await dependencies.markWorkOrderExecutionStartedUseCase.execute(
                payload as any
              );
            break;
          case 'add-work-order-material':
            response = await dependencies.addWorkOrderMaterialUseCase.execute(
              payload as any
            );
            break;
          case 'add-additional-cost':
            response = await dependencies.addAdditionalCostUseCase.execute(
              payload as any
            );
            break;
          case 'add-work-order-attachment':
            response = await dependencies.addWorkOrderAttachmentUseCase.execute(
              payload as any
            );
            break;
          case 'create-quality-control':
            response = await dependencies.createQualityControlUseCase.execute(
              payload as any
            );
            break;
          case 'add-quality-control-detail':
            response =
              await dependencies.addQualityControlDetailUseCase.execute(
                payload as any
              );
            break;
          case 'resolve-quality-control':
            response = await dependencies.resolveQualityControlUseCase.execute(
              payload as any
            );
            break;
          case 'complete-work-order':
            response = await dependencies.completeWorkOrderUseCase.execute(
              payload as any
            );
            break;
          case 'register-satisfaction-survey':
            response =
              await dependencies.registerSatisfactionSurveyUseCase.execute(
                payload as any
              );
            break;
          default:
            throw new Error('Accion no soportada en la capa de presentacion.');
        }

        setState((current) => ({
          ...current,
          lastResponse: response,
          isSubmittingAction: false
        }));
        setSuccess('Accion ejecutada exitosamente.');
      } catch (error) {
        setState((current) => ({ ...current, isSubmittingAction: false }));
        setError(
          error instanceof Error ? error.message : 'Error ejecutando la accion.'
        );
      }
    },
    [dependencies, state.selectedAction]
  );

  return {
    state,
    phaseActions,
    selectedActionDef,
    phaseTabs: WORK_ORDER_PHASE_TABS,
    phaseLabels: PHASE_LABELS,
    setNumeroOrden,
    setSolicitudId,
    setPhase,
    setSelectedAction,
    loadTracking,
    loadDetail,
    loadBySolicitud,
    executeAction
  };
};
