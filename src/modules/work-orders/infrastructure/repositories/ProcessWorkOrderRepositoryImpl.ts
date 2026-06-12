/**
 * ProcessWorkOrderRepositoryImpl
 *
 * Clean Architecture — Infrastructure layer.
 *   Implements ProcessWorkOrderRepository (domain interface).
 *   All HTTP calls delegated to HttpClientInterface (DIP).
 *   Zero business logic: each method maps 1-to-1 with a backend endpoint.
 *
 * Backend controller prefix: /process-work-orders
 * Source: process-work-order.gateway.controller.ts
 *
 * SOLID:
 *   SRP : one class, one concern — HTTP transport for work-order commands.
 *   OCP : add a new endpoint → add one method, nothing else changes.
 *   DIP : depends on HttpClientInterface, not on a concrete HTTP library.
 */
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';

import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { ProcessWorkOrderModel } from '../../domain/schemas/models/process-work-order.model';
import type { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type {
  CreateWorkOrderCommand,
  AssignWorkOrderToCrewCommand,
  AssignWorkOrderToWorkerCommand,
  CreatePreparationInspectionCommand,
  AddPreparationInspectionDetailCommand,
  AddWorkOrderMaterialCommand,
  AddAdditionalCostCommand,
  AddWorkOrderAttachmentCommand,
  CreateQualityControlCommand,
  AddQualityControlDetailCommand,
  RegisterSatisfactionSurveyCommand,
  AddWorkerToWorkOrderCommand,
  RemoveWorkerFromWorkOrderCommand
} from '../../domain/schemas/dto/process-work-order.commands';
import type {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking,
  OrdenTrabajoVistaCliente,
  WorkOrderListItem
} from '../../domain/schemas/dto/response/work-orders.get.response';
import type { SubmitInspectionReportCommand } from '../../domain/schemas/dto/commands/submit-inspection-report.command';

// ── Base paths ──────────────────────────────────────────────────────────────
const BASE = '/process-work-orders';
/** Rutas del módulo inspection-report (connection-service gateway) */
const INSPECTION_REPORT_BASE = '/inspection-report';

const normalizeEntityOrigin = <T extends { idEntidadOrigen?: string | null }>(
  payload: T | null
): T | null => {
  if (!payload) return payload;
  const source = payload as T & { id_entidad_origen?: string | null };
  return {
    ...payload,
    idEntidadOrigen: source.idEntidadOrigen ?? source.id_entidad_origen ?? null
  };
};

export class ProcessWorkOrderRepositoryImpl implements ProcessWorkOrderRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  // ─── Fase 1 — Creación ────────────────────────────────────────────────────
  // POST /process-work-orders/create-work-order

  async createWorkOrder(
    createWorkOrder: CreateWorkOrderCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/create-work-order`,
      createWorkOrder
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Avance genérico de estado ───────────────────────────────────────────
  // POST /process-work-orders/advance-state
  //
  // SRP : único método que no hardcodea newStatus — delega validación a la BD.
  // OCP : nuevos estados no requieren cambios aquí ni en el gateway.
  // DIP : depende de ProcessWorkOrderRepository (interface), no de fetch directamente.
  //
  // NOTA: receiveWorkOrder() sobreescribe newStatus → 'PENDIENTE' en el gateway.
  //       Este método usa el endpoint /advance-state que pasa newStatus sin modificar.
  async advanceState(payload: {
    workOrderId: string;
    newStatus: string;
    userId: string;
    comment: string;
  }): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/advance-state`,
      payload
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── processWorkOrder — alias interno sobre process-work-order ────────────
  // Kept in the interface for backward compatibility with older use-cases.
  // Maps to the same transition endpoint using the model's internal fields.

  async processWorkOrder(
    processWorkOrder: ProcessWorkOrderModel
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/receive-work-order`,
      {
        workOrderId: processWorkOrder.workOrderId,
        newStatus: processWorkOrder.newStatus,
        userId: processWorkOrder.userId,
        comment: processWorkOrder.comment
      }
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 2 — Recepción ───────────────────────────────────────────────────
  // POST /process-work-orders/receive-work-order

  async receiveWorkOrder(
    receiveWorkOrder: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/receive-work-order`,
      receiveWorkOrder
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 2 — Asignación de personal ─────────────────────────────────────
  // POST /process-work-orders/assign-work-order-to-crew

  async assignWorkOrderToCrew(
    assignWorkOrderToCrew: AssignWorkOrderToCrewCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/assign-work-order-to-crew`,
      assignWorkOrderToCrew
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 2 — Asignación a técnico individual ────────────────────────────
  // POST /process-work-orders/assign-work-order-to-worker

  async assignWorkOrderToWorker(
    assignWorkOrderToWorker: AssignWorkOrderToWorkerCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/assign-work-order-to-worker`,
      assignWorkOrderToWorker
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 3 — Inicio de preparación ──────────────────────────────────────
  // POST /process-work-orders/start-preparation

  async startPreparation(
    startPreparation: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/start-preparation`,
      startPreparation
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 3 — Crear inspección de preparación ────────────────────────────
  // POST /process-work-orders/create-preparation-inspection

  async createPreparationInspection(
    createPreparationInspection: CreatePreparationInspectionCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/create-preparation-inspection`,
      createPreparationInspection
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 3 — Agregar detalle de inspección de preparación ───────────────
  // POST /process-work-orders/add-preparation-inspection-detail

  async addPreparationInspectionDetail(
    addPreparationInspectionDetail: AddPreparationInspectionDetailCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-preparation-inspection-detail`,
      addPreparationInspectionDetail
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 3 — Resolver inspección de preparación ─────────────────────────
  // POST /process-work-orders/resolve-preparation-inspection

  async resolvePreparationInspection(
    resolvePreparationInspection: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    // El gateway espera { workOrderId, userId, passed: boolean, comment }
    // passed=true → EN_PROCESO, passed=false → REVISION_RECHAZADA
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/resolve-preparation-inspection`,
      {
        workOrderId: resolvePreparationInspection.workOrderId,
        userId: resolvePreparationInspection.userId,
        passed: resolvePreparationInspection.newStatus === 'EN_PROCESO',
        comment: resolvePreparationInspection.comment
      }
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 4 — Marcar inicio de ejecución en campo ────────────────────────
  // POST /process-work-orders/start-execution

  async markWorkOrderExecutionStarted(
    markWorkOrderExecutionStarted: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/start-execution`,
      markWorkOrderExecutionStarted
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 4 — Finalizar ejecución en campo (EN_PROCESO → EJECUTADA) ──────
  // POST /process-work-orders/finish-execution

  async finishExecution(
    finishExecution: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/finish-execution`,
      finishExecution
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 4 — Agregar material ────────────────────────────────────────────
  // POST /process-work-orders/add-work-order-material

  async addWorkOrderMaterial(
    addWorkOrderMaterial: AddWorkOrderMaterialCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-work-order-material`,
      addWorkOrderMaterial
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 4 — Agregar costo adicional ────────────────────────────────────
  // POST /process-work-orders/add-additional-cost

  async addAdditionalCost(
    addAdditionalCost: AddAdditionalCostCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-additional-cost`,
      addAdditionalCost
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 4 — Agregar adjunto / evidencia ────────────────────────────────
  // POST /process-work-orders/add-work-order-attachment

  async addWorkOrderAttachment(
    addWorkOrderAttachment: AddWorkOrderAttachmentCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-work-order-attachment`,
      addWorkOrderAttachment
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 5 — Crear control de calidad ───────────────────────────────────
  // POST /process-work-orders/create-quality-control

  async createQualityControl(
    createQualityControl: CreateQualityControlCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/create-quality-control`,
      createQualityControl
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 5 — Agregar detalle de control de calidad ──────────────────────
  // POST /process-work-orders/add-quality-control-detail

  async addQualityControlDetail(
    addQualityControlDetail: AddQualityControlDetailCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-quality-control-detail`,
      addQualityControlDetail
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 5 — Resolver control de calidad ────────────────────────────────
  // POST /process-work-orders/resolve-quality-control

  async resolveQualityControl(
    resolveQualityControl: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/resolve-quality-control`,
      resolveQualityControl
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 6 — Completar OT ───────────────────────────────────────────────
  // POST /process-work-orders/complete-work-order

  async completeWorkOrder(
    completeWorkOrder: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/complete-work-order`,
      completeWorkOrder
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Fase 6 — Registrar encuesta de satisfacción ─────────────────────────
  // POST /process-work-orders/register-satisfaction-survey

  async registerSatisfactionSurvey(
    registerSatisfactionSurvey: RegisterSatisfactionSurveyCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/register-satisfaction-survey`,
      registerSatisfactionSurvey
    );
    return (response.data as any)?.data ?? null;
  }

  // ─── Consultas GET ────────────────────────────────────────────────────────

  // GET /process-work-orders/get-detalle-by-numero-orden?numeroOrden=OT-2026-…

  async getOrdenTrabajoDetalleByNumeroOrden(
    numeroOrden: string
  ): Promise<OrdenTrabajoDetalle | null> {
    const response = await this.client.get<OrdenTrabajoDetalle>(
      `${BASE}/get-detalle-by-numero-orden?numeroOrden=${encodeURIComponent(numeroOrden)}`
    );
    const payload = ((response.data as any)?.data ?? null) as
      | (OrdenTrabajoDetalle & { id_entidad_origen?: string | null })
      | null;
    return normalizeEntityOrigin(payload);
  }

  // GET /process-work-orders/get-tracking-by-numero-orden?numeroOrden=OT-2026-…

  async getOrdenTrabajoTrackingByNumeroOrden(
    numeroOrden: string
  ): Promise<OrdenTrabajoTracking | null> {
    const response = await this.client.get<OrdenTrabajoTracking>(
      `${BASE}/get-tracking-by-numero-orden?numeroOrden=${encodeURIComponent(numeroOrden)}`
    );
    const payload = ((response.data as any)?.data ?? null) as
      | (OrdenTrabajoTracking & { id_entidad_origen?: string | null })
      | null;
    return normalizeEntityOrigin(payload);
  }

  // GET /process-work-orders/get-ordenes-by-solicitud-id?solicitudId=…

  async getOrdenesTrabajoBySolicitudId(
    solicitudId: string
  ): Promise<OrdenTrabajoVistaCliente[]> {
    const response = await this.client.get<OrdenTrabajoVistaCliente[]>(
      `${BASE}/get-ordenes-by-solicitud-id?solicitudId=${encodeURIComponent(solicitudId)}`
    );
    return (response.data as any)?.data ?? [];
  }

  // ─── Personal en campo () ──────────────────────────────────────────

  // POST /process-work-orders/add-worker
  async addWorkerToWorkOrder(
    cmd: AddWorkerToWorkOrderCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-worker`,
      cmd
    );
    return (response.data as any)?.data ?? null;
  }

  // POST /process-work-orders/remove-worker
  async removeWorkerFromWorkOrder(
    cmd: RemoveWorkerFromWorkOrderCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/remove-worker`,
      cmd
    );
    return (response.data as any)?.data ?? null;
  }

  // GET /process-work-orders/get-all-work-orders

  async getAllWorkOrders(
    limit?: number,
    offset?: number
  ): Promise<WorkOrderListItem[]> {
    // ✅ Solo incluimos los parámetros si tienen valor numérico válido.
    //    Si son undefined, enviamos los defaults que acepta el backend.
    const params = new URLSearchParams();
    params.set('limit', String(limit ?? 100));
    params.set('offset', String(offset ?? 0));

    const response = await this.client.get<WorkOrderListItem[]>(
      `${BASE}/get-all-work-orders?${params.toString()}`
    );
    return (response.data as any)?.data ?? [];
  }

  // ── Fase 8 Acometidas — Informe técnico de inspección ──────────────────────
  // POST /inspection-report/ordenes/informe

  async submitInspectionReport(
    cmd: SubmitInspectionReportCommand
  ): Promise<void> {
    await this.client.post<void>(
      `${INSPECTION_REPORT_BASE}/ordenes/informe`,
      cmd
    );
  }
}
