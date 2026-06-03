import type {
  RequestDetailByClientResponse,
  Solicitud,
  TrackingSolicitudResponse
} from '../../domain/models/Solicitud';
import type {
  SolicitudRepository,
  CreateInspectionInvoiceDto,
  ConfirmPaymentDto,
  EmitInspectionOrderDto,
  StartInspectionDto,
  SubmitInspectionReportDto,
  ApproveInspectionReportDto,
  GenerateContractDto,
  SignContractDto,
  EmitInstallationOrderDto,
  StartInstallationDto,
  RegisterCadastralDto
} from '../../domain/repositories/SolicitudRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

// ─── API DTO definitions ──────────────────────────────────────────────────────
export interface DocumentoAdjuntoResponse {
  id: string;
  tipodocumento: string;
  url: string;
  estadoValidacion: string;
  observacion: string | null;
}

export interface ExpedienteResponse {
  solicitudId: string;
  estado: string;
  tipoPersona: string;
  tipoAcometida: string;
  usoPredio: string;
  direccion: string;
  claveCatastral: string;
  coordenadas: string | null;
  datosAdicionales: Record<string, any>;
  fechaSolicitud: Date | string;
  updatedAt: Date | string;
  diasEnProceso: number;
  clienteId: string;
  analistaUsername: string | null;
  documentos: DocumentoAdjuntoResponse[];
  facturaId: string | null;
  numeroFactura: string | null;
  montofactura: number | null;
  estadoPago: string | null;
  fechaVencimiento: Date | string | null;
  fechaPago: Date | string | null;
  metodoPago: string | null;
  urlComprobante: string | null;
  informeId: string | null;
  resultadoInforme: string | null;
  costoMateriales: number | null;
  costoManoObra: number | null;
  costoTotal: number | null;
  informeAprobado: boolean | null;
  motivoRechazo: string | null;
  contratoId: string | null;
  numeroContrato: string | null;
  estadoFirma: string | null;
  valorTotal: number | null;
  urlContratoFirmado: string | null;
  numeroCuenta: string | null;
  numeroMedidor: string | null;
  servicioActivo: boolean | null;
  fechaActivacion: Date | string | null;
  solicitudNumero: string | null;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const isNotFoundError = (err: any): boolean => {
  const msg = (err?.message ?? '').toLowerCase();
  return (
    msg.includes('no encontrado') ||
    msg.includes('not found') ||
    msg.includes('404')
  );
};

export class SolicitudRepositoryImpl implements SolicitudRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  async getExpedientesByCliente(clienteId: string): Promise<Solicitud[]> {
    if (!clienteId) throw new Error('Cliente ID is required');
    let rawList: ExpedienteResponse[];
    try {
      const response = await this.client.get<ApiResponse<ExpedienteResponse[]>>(
        `/requests/${clienteId}/expedientes`
      );
      rawList = response.data?.data || [];
    } catch (err: any) {
      if (isNotFoundError(err)) return [];
      throw err;
    }
    return rawList.map((exp): Solicitud => ({
      ...exp,
      estado: mapEstado(exp.estado),
      solicitudNumero: exp.solicitudNumero ?? exp.solicitudId
    }));
  }

  async getExpedientesByAnalista(analistaId: string): Promise<Solicitud[]> {
    if (!analistaId) throw new Error('Analista ID is required');
    let rawList: ExpedienteResponse[];
    try {
      const response = await this.client.get<ApiResponse<ExpedienteResponse[]>>(
        `/requests/${analistaId}/expedientes-internal-user`
      );
      rawList = response.data?.data || [];
    } catch (err: any) {
      if (isNotFoundError(err)) return [];
      throw err;
    }
    return rawList.map((exp): Solicitud => ({
      ...exp,
      estado: mapEstado(exp.estado),
      solicitudNumero: exp.solicitudNumero ?? exp.solicitudId
    }));
  }

  async getTrackingByClienteId(clienteId: string): Promise<TrackingSolicitudResponse[]> {
    if (!clienteId) throw new Error('Cliente ID is required');
    try {
      const response = await this.client.get<ApiResponse<TrackingSolicitudResponse[]>>(
        `/requests/${clienteId}/tracking`
      );
      return response.data?.data || [];
    } catch (err: any) {
      if (isNotFoundError(err)) return [];
      throw err;
    }
  }

  async getTrackingBySolicitudId(solicitudId: string): Promise<TrackingSolicitudResponse | null> {
    if (!solicitudId) throw new Error('Solicitud ID is required');
    try {
      const response = await this.client.get<ApiResponse<TrackingSolicitudResponse>>(
        `/requests/${solicitudId}/tracking-by-solicitud-id`
      );
      return response.data?.data || null;
    } catch (err: any) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  }

  async getTrackingByAnalistaId(analistaId: string): Promise<TrackingSolicitudResponse[]> {
    if (!analistaId) throw new Error('Analista ID is required');
    try {
      const response = await this.client.get<ApiResponse<TrackingSolicitudResponse[]>>(
        `/requests/${analistaId}/tracking-internal-user`
      );
      return response.data?.data || [];
    } catch (err: any) {
      if (isNotFoundError(err)) return [];
      throw err;
    }
  }

  async getRequestDetailByRequestIdOrNumber(
    requestNumberOrId: string
  ): Promise<RequestDetailByClientResponse | null> {
    if (!requestNumberOrId) throw new Error('El número o ID de la solicitud es requerido');
    try {
      const response = await this.client.get<ApiResponse<RequestDetailByClientResponse>>(
        `/requests/${requestNumberOrId}/detail-by-id-or-number`
      );
      return response.data?.data || null;
    } catch (err: any) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  }

  // ── Fase 3 — Validación documental ────────────────────────────────────────

  async validateDocuments(
    solicitudId: string,
    decisions: { documentId: string; validationStatus: 'APROBADO' | 'RECHAZADO'; observation?: string }[],
    validatorId: string
  ): Promise<void> {
    if (!solicitudId) throw new Error('Solicitud ID is required');
    if (!validatorId) throw new Error('Validator ID is required');
    if (!decisions?.length) throw new Error('At least one decision is required');

    await this.client.patch<void>('/document-validation/solicitudes/validar', {
      solicitudId,
      dto: { decisions, validatorId }
    });
  }

  // ── Fase 4 — Factura de inspección ────────────────────────────────────────

  async createInspectionInvoice(dto: CreateInspectionInvoiceDto): Promise<void> {
    if (!dto.requestId)      throw new Error('El ID de la solicitud es requerido');
    if (!dto.invoiceNumber)  throw new Error('El número de factura es requerido');
    if (dto.conceptId == null) throw new Error('El ID del concepto es requerido');
    if (dto.amount == null)  throw new Error('El monto es requerido');
    if (!dto.expirationDate) throw new Error('La fecha de vencimiento es requerida');

    await this.client.post<void>('/inspection-invoice/create_inspection_invoice', dto);
  }

  // ── Fase 5 — Confirmar pago ────────────────────────────────────────────────

  async confirmPayment(dto: ConfirmPaymentDto): Promise<void> {
    if (!dto.invoiceId)        throw new Error('El ID de la factura es requerido');
    if (!dto.paymentMethod)    throw new Error('El método de pago es requerido');
    if (!dto.paymentReference) throw new Error('La referencia de pago es requerida');
    if (!dto.collectorId)      throw new Error('El ID del recaudador es requerido');

    await this.client.patch<void>('/payment-confirmation/facturas/pagar', dto);
  }

  // ── Fase 6 — Emitir OT de inspección ─────────────────────────────────────

  async emitInspectionOrder(dto: EmitInspectionOrderDto): Promise<void> {
    if (!dto.solicitudId)   throw new Error('El ID de la solicitud es requerido');
    if (!dto.technicianId)  throw new Error('El ID del técnico es requerido');
    if (!dto.scheduledDate) throw new Error('La fecha programada es requerida');
    if (!dto.emitterId)     throw new Error('El ID del emisor es requerido');

    // Backend DTO: IssueInspectionOrderGatewayRequest
    // POST /inspection-order/solicitudes/emitir
    await this.client.post<void>('/inspection-order/solicitudes/emitir', {
      solicitudId:   dto.solicitudId,
      technicianId:  dto.technicianId,
      description:   dto.notes ?? 'Orden de inspección técnica',
      priorityId:    dto.priorityId ?? 1,
      scheduledDate: dto.scheduledDate,
      creatorId:     dto.emitterId,
    });
  }

  // ── Fase 7 — Iniciar inspección ───────────────────────────────────────────

  async startInspection(dto: StartInspectionDto): Promise<void> {
    if (!dto.workOrderId)  throw new Error('El ID de la OT es requerido');
    if (!dto.technicianId) throw new Error('El ID del técnico es requerido');

    // Backend DTO: StartInspectionGatewayRequest
    // PATCH /inspection-order/ordenes/iniciar
    await this.client.patch<void>('/inspection-order/ordenes/iniciar', {
      workOrderId:    dto.workOrderId,
      technicianId:   dto.technicianId,
      startStatusId:  dto.startStatusId ?? 2,
    });
  }

  // ── Fase 8 — Subir informe técnico ────────────────────────────────────────

  async submitInspectionReport(dto: SubmitInspectionReportDto): Promise<void> {
    if (!dto.workOrderId)  throw new Error('El ID de la OT es requerido');
    if (!dto.solicitudId)  throw new Error('El ID de la solicitud es requerido');
    if (!dto.result)       throw new Error('El resultado de la inspección es requerido');
    if (!dto.technicianId) throw new Error('El ID del técnico es requerido');

    await this.client.post<void>('/inspection-report/ordenes/informe', dto);
  }

  // ── Fase 9 — Aprobar / rechazar informe ──────────────────────────────────

  async approveInspectionReport(dto: ApproveInspectionReportDto): Promise<void> {
    if (!dto.reportId)   throw new Error('El ID del informe es requerido');
    if (!dto.approverId) throw new Error('El ID del aprobador es requerido');

    await this.client.patch<void>('/inspection-report/informes/aprobar', dto);
  }

  // ── Fase 10 — Generar contrato ────────────────────────────────────────────

  async generateContract(dto: GenerateContractDto): Promise<void> {
    if (!dto.solicitudId)    throw new Error('El ID de la solicitud es requerido');
    if (!dto.contractNumber) throw new Error('El número de contrato es requerido');
    if (!dto.generatorId)    throw new Error('El ID del generador es requerido');

    await this.client.post<void>('/contracts/solicitudes/generar', dto);
  }

  // ── Fase 11 — Firmar contrato ─────────────────────────────────────────────

  async signContract(dto: SignContractDto): Promise<void> {
    if (!dto.contractId)       throw new Error('El ID del contrato es requerido');
    if (!dto.signatureStatus)  throw new Error('El estado de firma es requerido');
    if (!dto.signedContractUrl) throw new Error('La URL del contrato firmado es requerida');
    if (!dto.userId)           throw new Error('El ID del usuario es requerido');

    await this.client.patch<void>('/contracts/firmar', dto);
  }

  // ── Fase 12 — Emitir OT de instalación ───────────────────────────────────

  async emitInstallationOrder(dto: EmitInstallationOrderDto): Promise<void> {
    if (!dto.solicitudId)   throw new Error('El ID de la solicitud es requerido');
    if (!dto.technicianId)  throw new Error('El ID del técnico es requerido');
    if (!dto.scheduledDate) throw new Error('La fecha programada es requerida');
    if (!dto.emitterId)     throw new Error('El ID del emisor es requerido');

    // Backend DTO: IssueInstallationOrderGatewayRequest
    // POST /installation-order/solicitudes/emitir-ot
    await this.client.post<void>('/installation-order/solicitudes/emitir-ot', {
      solicitudId:   dto.solicitudId,
      technicianId:  dto.technicianId,
      description:   dto.notes ?? 'Orden de instalación de acometida',
      priorityId:    dto.priorityId ?? 1,
      scheduledDate: dto.scheduledDate,
      creatorId:     dto.emitterId,
    });
  }

  // ── Fase 13 — Iniciar instalación ────────────────────────────────────────

  async startInstallation(dto: StartInstallationDto): Promise<void> {
    if (!dto.workOrderId)  throw new Error('El ID de la OT es requerido');
    if (!dto.technicianId) throw new Error('El ID del técnico es requerido');

    await this.client.patch<void>('/installation-order/ordenes/iniciar', dto);
  }

  // ── Fase 14 — Registro catastral y activación ────────────────────────────

  async registerCadastral(dto: RegisterCadastralDto): Promise<void> {
    if (!dto.solicitudId)      throw new Error('El ID de la solicitud es requerido');
    if (!dto.cadastralKey)     throw new Error('La clave catastral es requerida');
    if (!dto.meterNumber)      throw new Error('El número de medidor es requerido');
    if (!dto.exactAddress)     throw new Error('La dirección exacta es requerida');
    if (!dto.accountNumber)    throw new Error('El número de cuenta es requerido');
    if (!dto.installationDate) throw new Error('La fecha de instalación es requerida');
    if (!dto.registratorId)    throw new Error('El ID del registrador es requerido');

    await this.client.post<void>('/cadastral/solicitudes/registro-catastral', dto);
  }
}

// ─── Helper interno ───────────────────────────────────────────────────────────
function mapEstado(raw: string): string {
  const upper = (raw || '').toUpperCase();
  if (upper === 'REJECTED') return 'rechazada';
  if (upper === 'APPROVED' || upper === 'ACTIVE') return 'aprobada';
  if (upper === 'COMPLETED') return 'completada';
  // BPMN states are returned as-is so SolicitudConfig can display them
  return raw;
}
