import { useState, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useReadingRoutesContext } from '../context/ReadingRoutesContext';
import type { RouteAssignment } from '../../domain/models/RouteAssignment';
import type { ReadingRoute } from '../../domain/models/ReadingRoute';
import type {
  AssignSingleRouteRequest,
  BatchMorningDispatchRequest,
  ReassignRouteSegmentRequest,
} from '../../domain/dto/request/route-requests.dto';
import type {
  AssignSingleRouteResponse,
  BatchMorningDispatchResponse,
  ReassignRouteSegmentResponse,
} from '../../domain/dto/response/route-responses.dto';
import { notify } from '../utils/notify';

export interface UseRouteDispatchViewModelReturn {
  periodo: string;
  setPeriodo: Dispatch<SetStateAction<string>>;
  fecha: string;
  setFecha: Dispatch<SetStateAction<string>>;
  assignments: RouteAssignment[];
  isLoading: boolean;
  isMorningDispatchModalOpen: boolean;
  setIsMorningDispatchModalOpen: Dispatch<SetStateAction<boolean>>;
  isReassignModalOpen: boolean;
  selectedAssignmentForReassign: RouteAssignment | null;
  openReassignModal: (assignment: RouteAssignment) => void;
  closeReassignModal: () => void;
  isSingleAssignModalOpen: boolean;
  selectedRouteForAssign: ReadingRoute | null;
  openSingleAssignModal: (route: ReadingRoute) => void;
  closeSingleAssignModal: () => void;
  executeSingleAssign: (request: AssignSingleRouteRequest) => Promise<AssignSingleRouteResponse>;
  executeMorningDispatch: (request: BatchMorningDispatchRequest) => Promise<BatchMorningDispatchResponse>;
  executeReassignment: (request: ReassignRouteSegmentRequest) => Promise<ReassignRouteSegmentResponse>;
  cancelAssignment: (idAsignacion: number, motivo?: string) => Promise<void>;
  resumeAssignment: (idAsignacion: number, motivo?: string) => Promise<void>;
  refreshLiveTracking: () => Promise<void>;
}

export const useRouteDispatchViewModel = (): UseRouteDispatchViewModelReturn => {
  const {
    getLiveTrackingAssignmentsUseCase,
    executeBatchMorningDispatchUseCase,
    assignSingleRouteUseCase,
    reassignRouteSegmentUseCase,
    cancelRouteAssignmentUseCase,
    resumeRouteAssignmentUseCase,
  } = useReadingRoutesContext();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentDateStr = now.toISOString().split('T')[0];

  const [periodo, setPeriodo] = useState<string>(currentMonthStr);
  const [fecha, setFecha] = useState<string>(currentDateStr);
  const [assignments, setAssignments] = useState<RouteAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals
  const [isMorningDispatchModalOpen, setIsMorningDispatchModalOpen] =
    useState<boolean>(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState<boolean>(false);
  const [selectedAssignmentForReassign, setSelectedAssignmentForReassign] =
    useState<RouteAssignment | null>(null);

  // Single Route Assignment Modal
  const [isSingleAssignModalOpen, setIsSingleAssignModalOpen] =
    useState<boolean>(false);
  const [selectedRouteForAssign, setSelectedRouteForAssign] =
    useState<ReadingRoute | null>(null);

  const loadLiveTracking = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getLiveTrackingAssignmentsUseCase.execute(
        periodo || undefined,
        fecha || undefined,
      );
      setAssignments(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      notify.error('Error al cargar monitoreo en vivo: ' + msg);
    } finally {
      setIsLoading(false);
    }
  }, [getLiveTrackingAssignmentsUseCase, periodo, fecha]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadLiveTracking();
    });
  }, [loadLiveTracking]);

  // Execute bulk morning dispatch
  const executeMorningDispatch = useCallback(
    async (request: BatchMorningDispatchRequest): Promise<BatchMorningDispatchResponse> => {
      try {
        const response =
          await executeBatchMorningDispatchUseCase.execute(request);
        notify.success(
          `Despacho exitoso: ${response.totalRutasAsignadas} rutas asignadas (${response.totalAcometidasDespachadas} medidores).`,
        );
        setIsMorningDispatchModalOpen(false);
        void loadLiveTracking();
        return response;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        notify.error('Error al ejecutar despacho matutino: ' + msg);
        throw err;
      }
    },
    [executeBatchMorningDispatchUseCase, loadLiveTracking],
  );

  // Execute single route assignment
  const executeSingleAssign = useCallback(
    async (request: AssignSingleRouteRequest): Promise<AssignSingleRouteResponse> => {
      try {
        const response = await assignSingleRouteUseCase.execute(request);
        notify.success('Ruta asignada exitosamente al lecturista.');
        setIsSingleAssignModalOpen(false);
        setSelectedRouteForAssign(null);
        void loadLiveTracking();
        return response;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        notify.error('Error al asignar ruta individual: ' + msg);
        throw err;
      }
    },
    [assignSingleRouteUseCase, loadLiveTracking],
  );

  // Execute segment reassignment
  const executeReassignment = useCallback(
    async (request: ReassignRouteSegmentRequest): Promise<ReassignRouteSegmentResponse> => {
      try {
        const response = await reassignRouteSegmentUseCase.execute(request);
        notify.success(
          `Reasignación completada: ${response.prediosTransferidos} predios transferidos (Nueva Asignación #${response.nuevaAsignacionId}).`,
        );
        setIsReassignModalOpen(false);
        setSelectedAssignmentForReassign(null);
        void loadLiveTracking();
        return response;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        notify.error('Error al reasignar segmento: ' + msg);
        throw err;
      }
    },
    [reassignRouteSegmentUseCase, loadLiveTracking],
  );

  // Cancel/Pause assignment
  const cancelAssignment = useCallback(
    async (idAsignacion: number, motivo?: string) => {
      try {
        await cancelRouteAssignmentUseCase.execute(idAsignacion, motivo);
        notify.success(`Asignación #${idAsignacion} pausada/cancelada.`);
        void loadLiveTracking();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        notify.error('Error al pausar asignación: ' + msg);
      }
    },
    [cancelRouteAssignmentUseCase, loadLiveTracking],
  );

  // Resume assignment
  const resumeAssignment = useCallback(
    async (idAsignacion: number, motivo?: string) => {
      try {
        const result = await resumeRouteAssignmentUseCase.execute(idAsignacion, motivo);
        notify.success(result.message || `Asignación #${idAsignacion} reanudada con éxito.`);
        void loadLiveTracking();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        notify.error('Error al reanudar asignación: ' + msg);
      }
    },
    [resumeRouteAssignmentUseCase, loadLiveTracking],
  );

  const openReassignModal = useCallback((assignment: RouteAssignment) => {
    setSelectedAssignmentForReassign(assignment);
    setIsReassignModalOpen(true);
  }, []);

  const closeReassignModal = useCallback(() => {
    setSelectedAssignmentForReassign(null);
    setIsReassignModalOpen(false);
  }, []);

  const openSingleAssignModal = useCallback((route: ReadingRoute) => {
    setSelectedRouteForAssign(route);
    setIsSingleAssignModalOpen(true);
  }, []);

  const closeSingleAssignModal = useCallback(() => {
    setSelectedRouteForAssign(null);
    setIsSingleAssignModalOpen(false);
  }, []);

  return {
    periodo,
    setPeriodo,
    fecha,
    setFecha,
    assignments,
    isLoading,
    isMorningDispatchModalOpen,
    setIsMorningDispatchModalOpen,
    isReassignModalOpen,
    selectedAssignmentForReassign,
    openReassignModal,
    closeReassignModal,
    isSingleAssignModalOpen,
    selectedRouteForAssign,
    openSingleAssignModal,
    closeSingleAssignModal,
    executeSingleAssign,
    executeMorningDispatch,
    executeReassignment,
    cancelAssignment,
    resumeAssignment,
    refreshLiveTracking: loadLiveTracking,
  };
};
