import type {
  SubmitWithDocumentsRequest,
  SubmitWithDocumentsResponse
} from '../dto/submit-with-documents.request';
import type {
  RequestDetailByClientResponse,
  Solicitud,
  SolicitudOrdenTrabajoResponse,
  TrackingSolicitudResponse
} from '../models/Solicitud';

export interface SolicitudRepository {
  getExpedientesByCliente(clienteId: string): Promise<Solicitud[]>;
  getExpedientesByAnalista(analistaId: string): Promise<Solicitud[]>;
  getTrackingByClienteId(
    clienteId: string
  ): Promise<TrackingSolicitudResponse[]>;
  getTrackingBySolicitudId(
    solicitudId: string
  ): Promise<TrackingSolicitudResponse | null>;
  getTrackingByAnalistaId(
    analistaId: string
  ): Promise<TrackingSolicitudResponse[]>;
  getRequestDetailByRequestIdOrNumber(
    requestNumberOrId: string
  ): Promise<RequestDetailByClientResponse | null>;

  /** Órdenes de trabajo (inspección e instalación) ligadas a una solicitud */
  getOrdenesTrabajoBysSolicitudId(
    solicitudId: string
  ): Promise<SolicitudOrdenTrabajoResponse[]>;

  // Fase 1 y 2: Enviar solicitud con documentos
  /**
   * OPERACIÓN ATÓMICA: Crea la solicitud, inserta documentos y transiciona
   * a DOCS_SUBMITTED en una única transacción PostgreSQL.
   */
  submitWithDocuments(
    dto: SubmitWithDocumentsRequest
  ): Promise<SubmitWithDocumentsResponse>;

  // Fase 3 — Validación documental
  validateDocuments(
    solicitudId: string,
    decisions: {
      documentId: string;
      validationStatus: 'APROBADO' | 'RECHAZADO';
      observation?: string;
    }[],
    validatorId: string
  ): Promise<void>;

  // Fase 4 — Factura de inspección
  createInspectionInvoice(dto: CreateInspectionInvoiceDto): Promise<void>;

  // Fase 5 — Confirmar pago (analista)
  confirmPayment(dto: ConfirmPaymentDto): Promise<void>;

  // Fase 6 — Emitir OT de inspección
  emitInspectionOrder(dto: EmitInspectionOrderDto): Promise<void>;

  // Fase 7 — Iniciar inspección
  startInspection(dto: StartInspectionDto): Promise<void>;

  // Fase 8 — Subir informe técnico
  submitInspectionReport(dto: SubmitInspectionReportDto): Promise<void>;

  // Fase 9 — Aprobar / rechazar informe
  approveInspectionReport(dto: ApproveInspectionReportDto): Promise<void>;

  // Fase 10 — Generar contrato
  generateContract(dto: GenerateContractDto): Promise<void>;

  // Fase 11 — Firmar contrato
  signContract(dto: SignContractDto): Promise<void>;

  // Fase 12 — Emitir OT de instalación
  emitInstallationOrder(dto: EmitInstallationOrderDto): Promise<void>;

  // Fase 13 — Iniciar instalación
  startInstallation(dto: StartInstallationDto): Promise<void>;

  // Fase 14 — Registro catastral y activación
  registerCadastral(dto: RegisterCadastralDto): Promise<void>;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateInspectionInvoiceDto {
  requestId: string;
  invoiceNumber: string;
  conceptId: number;
  amount: number;
  expirationDate: Date | string;
  collectorId?: string;
}

export interface ConfirmPaymentDto {
  invoiceId: string;
  paymentMethod: string;
  paymentReference: string;
  proofOfPaymentUrl?: string;
  collectorId: string;
}

export interface EmitInspectionOrderDto {
  solicitudId: string;
  technicianId: string;
  scheduledDate: string;
  notes?: string; // maps to backend 'description'
  priorityId?: number; // optional, default 1
  emitterId: string; // maps to backend 'creatorId'
}

export interface StartInspectionDto {
  workOrderId: string;
  technicianId: string;
  startStatusId?: number; // optional, default 2 (EN_PROCESO)
}

export interface SubmitInspectionReportDto {
  workOrderId: string;
  solicitudId: string;
  result: string;
  networkDistanceM?: number;
  connectionDiameter?: string;
  terrainConditions?: string;
  observations?: string;
  longitude?: number;
  latitude?: number;
  materialCost?: number;
  laborCost?: number;
  technicianId: string;
  completedStatusId: number;
}

export interface ApproveInspectionReportDto {
  reportId: string;
  approved: boolean;
  rejectionReason?: string;
  approverId: string;
}

export interface GenerateContractDto {
  solicitudId: string;
  contractNumber: string;
  tariffId?: number;
  materialCost: number;
  laborCost: number;
  connectionFee: number;
  generatorId: string;
}

export interface SignContractDto {
  contractId: string;
  signatureStatus: 'FIRMADO_CLIENTE' | 'FIRMADO_EPAA' | 'COMPLETO';
  signedContractUrl: string;
  userId: string;
}

export interface EmitInstallationOrderDto {
  solicitudId: string;
  technicianId: string;
  scheduledDate: string;
  notes?: string; // maps to backend 'description'
  priorityId?: number; // optional, default 1
  emitterId: string; // maps to backend 'creatorId'
}

export interface StartInstallationDto {
  workOrderId: string;
  technicianId: string;
  startStatusId?: number; // optional, default 2 (EN_PROCESO)
}

export interface RegisterCadastralDto {
  solicitudId: string;
  contractId?: string;
  cadastralKey: string;
  meterNumber: string;
  exactAddress: string;
  longitude: number;
  latitude: number;
  connectionDiameter?: string;
  serviceType?: string;
  installationDate: string;
  accountNumber: string;
  registratorId: string;
}
