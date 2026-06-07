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
} from '../../domain/schemas/dto/process-work-order.commands';
import type {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking,
  OrdenTrabajoVistaCliente,
} from '../../domain/schemas/dto/response/work-orders.get.response';

// ── Base path (matches @Controller('process-work-orders') in the gateway) ──────
const BASE = '/process-work-orders';

export class ProcessWorkOrderRepositoryImpl implements ProcessWorkOrderRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  // ─── Fase 1 — Creación ────────────────────────────────────────────────────
  // POST /process-work-orders/create-work-order

  async createWorkOrder(
    createWorkOrder: CreateWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/create-work-order`,
      createWorkOrder,
    );
    return response.data ?? null;
  }

  // ─── processWorkOrder — alias interno sobre process-work-order ────────────
  // Kept in the interface for backward compatibility with older use-cases.
  // Maps to the same transition endpoint using the model's internal fields.

  async processWorkOrder(
    processWorkOrder: ProcessWorkOrderModel,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/receive-work-order`,
      {
        workOrderId: processWorkOrder.workOrderId,
        newStatus:   processWorkOrder.newStatus,
        userId:      processWorkOrder.userId,
        comment:     processWorkOrder.comment,
      },
    );
    return response.data ?? null;
  }

  // ─── Fase 2 — Recepción ───────────────────────────────────────────────────
  // POST /process-work-orders/receive-work-order

  async receiveWorkOrder(
    receiveWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/receive-work-order`,
      receiveWorkOrder,
    );
    return response.data ?? null;
  }

  // ─── Fase 2 — Asignación a cuadrilla ─────────────────────────────────────
  // POST /process-work-orders/assign-work-order-to-crew

  async assignWorkOrderToCrew(
    assignWorkOrderToCrew: AssignWorkOrderToCrewCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/assign-work-order-to-crew`,
      assignWorkOrderToCrew,
    );
    return response.data ?? null;
  }

  // ─── Fase 2 — Asignación a técnico individual ────────────────────────────
  // POST /process-work-orders/assign-work-order-to-worker

  async assignWorkOrderToWorker(
    assignWorkOrderToWorker: AssignWorkOrderToWorkerCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/assign-work-order-to-worker`,
      assignWorkOrderToWorker,
    );
    return response.data ?? null;
  }

  // ─── Fase 3 — Inicio de preparación ──────────────────────────────────────
  // POST /process-work-orders/start-preparation

  async startPreparation(
    startPreparation: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/start-preparation`,
      startPreparation,
    );
    return response.data ?? null;
  }

  // ─── Fase 3 — Crear inspección de preparación ────────────────────────────
  // POST /process-work-orders/create-preparation-inspection

  async createPreparationInspection(
    createPreparationInspection: CreatePreparationInspectionCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/create-preparation-inspection`,
      createPreparationInspection,
    );
    return response.data ?? null;
  }

  // ─── Fase 3 — Agregar detalle de inspección de preparación ───────────────
  // POST /process-work-orders/add-preparation-inspection-detail

  async addPreparationInspectionDetail(
    addPreparationInspectionDetail: AddPreparationInspectionDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-preparation-inspection-detail`,
      addPreparationInspectionDetail,
    );
    return response.data ?? null;
  }

  // ─── Fase 3 — Resolver inspección de preparación ─────────────────────────
  // POST /process-work-orders/resolve-preparation-inspection

  async resolvePreparationInspection(
    resolvePreparationInspection: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/resolve-preparation-inspection`,
      resolvePreparationInspection,
    );
    return response.data ?? null;
  }

  // ─── Fase 4 — Marcar inicio de ejecución en campo ────────────────────────
  // POST /process-work-orders/start-execution

  async markWorkOrderExecutionStarted(
    markWorkOrderExecutionStarted: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/start-execution`,
      markWorkOrderExecutionStarted,
    );
    return response.data ?? null;
  }

  // ─── Fase 4 — Agregar material ────────────────────────────────────────────
  // POST /process-work-orders/add-work-order-material

  async addWorkOrderMaterial(
    addWorkOrderMaterial: AddWorkOrderMaterialCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-work-order-material`,
      addWorkOrderMaterial,
    );
    return response.data ?? null;
  }

  // ─── Fase 4 — Agregar costo adicional ────────────────────────────────────
  // POST /process-work-orders/add-additional-cost

  async addAdditionalCost(
    addAdditionalCost: AddAdditionalCostCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-additional-cost`,
      addAdditionalCost,
    );
    return response.data ?? null;
  }

  // ─── Fase 4 — Agregar adjunto / evidencia ────────────────────────────────
  // POST /process-work-orders/add-work-order-attachment

  async addWorkOrderAttachment(
    addWorkOrderAttachment: AddWorkOrderAttachmentCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-work-order-attachment`,
      addWorkOrderAttachment,
    );
    return response.data ?? null;
  }

  // ─── Fase 5 — Crear control de calidad ───────────────────────────────────
  // POST /process-work-orders/create-quality-control

  async createQualityControl(
    createQualityControl: CreateQualityControlCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/create-quality-control`,
      createQualityControl,
    );
    return response.data ?? null;
  }

  // ─── Fase 5 — Agregar detalle de control de calidad ──────────────────────
  // POST /process-work-orders/add-quality-control-detail

  async addQualityControlDetail(
    addQualityControlDetail: AddQualityControlDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/add-quality-control-detail`,
      addQualityControlDetail,
    );
    return response.data ?? null;
  }

  // ─── Fase 5 — Resolver control de calidad ────────────────────────────────
  // POST /process-work-orders/resolve-quality-control

  async resolveQualityControl(
    resolveQualityControl: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/resolve-quality-control`,
      resolveQualityControl,
    );
    return response.data ?? null;
  }

  // ─── Fase 6 — Completar OT ───────────────────────────────────────────────
  // POST /process-work-orders/complete-work-order

  async completeWorkOrder(
    completeWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/complete-work-order`,
      completeWorkOrder,
    );
    return response.data ?? null;
  }

  // ─── Fase 6 — Registrar encuesta de satisfacción ─────────────────────────
  // POST /process-work-orders/register-satisfaction-survey

  async registerSatisfactionSurvey(
    registerSatisfactionSurvey: RegisterSatisfactionSurveyCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    const response = await this.client.post<ProcessWorkOrderResponse>(
      `${BASE}/register-satisfaction-survey`,
      registerSatisfactionSurvey,
    );
    return response.data ?? null;
  }

  // ─── Consultas GET ────────────────────────────────────────────────────────

  // GET /process-work-orders/get-detalle-by-numero-orden?numeroOrden=OT-2026-…

  async getOrdenTrabajoDetalleByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoDetalle | null> {
    const response = await this.client.get<OrdenTrabajoDetalle>(
      `${BASE}/get-detalle-by-numero-orden?numeroOrden=${encodeURIComponent(numeroOrden)}`,
    );
    return response.data ?? null;
  }

  // GET /process-work-orders/get-tracking-by-numero-orden?numeroOrden=OT-2026-…

  async getOrdenTrabajoTrackingByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoTracking | null> {
    const response = await this.client.get<OrdenTrabajoTracking>(
      `${BASE}/get-tracking-by-numero-orden?numeroOrden=${encodeURIComponent(numeroOrden)}`,
    );
    return response.data ?? null;
  }

  // GET /process-work-orders/get-ordenes-by-solicitud-id?solicitudId=…

  async getOrdenesTrabajoBySolicitudId(
    solicitudId: string,
  ): Promise<OrdenTrabajoVistaCliente[]> {
    const response = await this.client.get<OrdenTrabajoVistaCliente[]>(
      `${BASE}/get-ordenes-by-solicitud-id?solicitudId=${encodeURIComponent(solicitudId)}`,
    );
    return response.data ?? [];
  }
}
