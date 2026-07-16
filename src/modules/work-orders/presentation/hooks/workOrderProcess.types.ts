import type {
  AddAdditionalCostCommand,
  AddPreparationInspectionDetailCommand,
  AddQualityControlDetailCommand,
  AddWorkOrderAttachmentCommand,
  AddWorkOrderMaterialCommand,
  AssignWorkOrderToCrewCommand,
  AssignWorkOrderToWorkerCommand,
  CreatePreparationInspectionCommand,
  CreateQualityControlCommand,
  CreateWorkOrderCommand,
  RegisterSatisfactionSurveyCommand
} from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
import type {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking,
  OrdenTrabajoVistaCliente
} from '../../domain/schemas/dto/response/work-orders.get.response';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export type WorkOrderPhaseId =
  | 'all'
  | 'phase-1'
  | 'phase-2'
  | 'phase-3'
  | 'phase-4'
  | 'phase-5'
  | 'phase-6';

export type WorkOrderActionKey =
  | 'create-work-order'
  | 'receive-work-order'
  | 'assign-work-order-to-crew'
  | 'assign-work-order-to-worker'
  | 'start-preparation'
  | 'create-preparation-inspection'
  | 'add-preparation-inspection-detail'
  | 'resolve-preparation-inspection'
  | 'start-execution'
  | 'add-work-order-material'
  | 'add-additional-cost'
  | 'add-work-order-attachment'
  | 'create-quality-control'
  | 'add-quality-control-detail'
  | 'resolve-quality-control'
  | 'complete-work-order'
  | 'complete-inspection-work-order'
  | 'complete-installation-work-order'
  | 'register-satisfaction-survey';

export type WorkOrderActionPayload =
  | CreateWorkOrderCommand
  | ProcessWorkOrderRequest
  | AssignWorkOrderToCrewCommand
  | AssignWorkOrderToWorkerCommand
  | CreatePreparationInspectionCommand
  | AddPreparationInspectionDetailCommand
  | AddWorkOrderMaterialCommand
  | AddAdditionalCostCommand
  | AddWorkOrderAttachmentCommand
  | CreateQualityControlCommand
  | AddQualityControlDetailCommand
  | RegisterSatisfactionSurveyCommand
  | Record<string, unknown>;

export interface WorkOrderActionDefinition {
  key: WorkOrderActionKey;
  phase: WorkOrderPhaseId;
  title: string;
  description: string;
  defaultPayload: WorkOrderActionPayload;
}

export type SortKey = 'fecha_desc' | 'fecha_asc' | 'estado' | 'codigo';

export interface WorkOrderHistoryRow {
  estado: string;
  fecha: string;
  comentario: string;
  usuarioId: string;
}

export interface WorkOrderProcessState {
  numeroOrden: string;
  solicitudId: string;
  selectedPhase: WorkOrderPhaseId;
  selectedAction: WorkOrderActionKey;
  payloadDraft: string;
  tracking: OrdenTrabajoTracking | null;
  detail: OrdenTrabajoDetalle | null;
  ordenesBySolicitud: OrdenTrabajoVistaCliente[];
  lastResponse: ProcessWorkOrderResponse | null;
  isLoadingQueries: boolean;
  isSubmittingAction: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}
