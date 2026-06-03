import type {
  RequestDetailByClientResponse,
  Solicitud,
  TrackingSolicitudResponse
} from '../models/Solicitud';

export interface SolicitudRepository {
  /**
   * Retrieves all expedientes/requests for a specific customer
   * @param clienteId Cédula or RUC of the client
   */
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

  validateDocuments(
    solicitudId: string,
    decisions: {
      documentId: string;
      validationStatus: 'APROBADO' | 'RECHAZADO';
      observation?: string;
    }[],
    validatorId: string
  ): Promise<void>;

  createInspectionInvoice(dto: CreateInspectionInvoiceDto): Promise<void>;
}

export interface CreateInspectionInvoiceDto {
  requestId: string;
  invoiceNumber: string;
  conceptId: number;
  amount: number;
  expirationDate: Date | string;
  collectorId?: string;
}

