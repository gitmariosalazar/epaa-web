import type {
  RequestDetailByClientResponse,
  Solicitud,
  TrackingSolicitudResponse
} from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';
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
  solicitudNumero: string | null; // optional at API level — may be null until backend adds it
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

  async getExpedientesByCliente(clienteId: string): Promise<Solicitud[]> {
    if (!clienteId) throw new Error('Cliente ID is required');

    let rawList: ExpedienteResponse[];
    try {
      const response = await this.client.get<ApiResponse<ExpedienteResponse[]>>(
        `/requests/${clienteId}/expedientes`
      );
      rawList = response.data?.data || [];
    } catch (err: any) {
      // Business rule: 404 = no expedientes yet — return empty list.
      if (isNotFoundError(err)) return [];
      throw err;
    }

    return rawList.map((exp): Solicitud => {
      const dbEstado = (exp.estado || '').toUpperCase();
      let estado = 'en_proceso';

      if (dbEstado === 'REJECTED') {
        estado = 'rechazada';
      } else if (dbEstado === 'APPROVED' || dbEstado === 'ACTIVE') {
        estado = 'aprobada';
      } else if (dbEstado === 'COMPLETED') {
        estado = 'completada';
      }

      return {
        ...exp,
        estado,
        solicitudNumero: exp.solicitudNumero ?? exp.solicitudId
      };
    });
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
      // Business rule: 404 = no expedientes yet — return empty list.
      if (isNotFoundError(err)) return [];
      throw err;
    }

    return rawList.map((exp): Solicitud => {
      const dbEstado = (exp.estado || '').toUpperCase();
      let estado = 'en_proceso';

      if (dbEstado === 'REJECTED') {
        estado = 'rechazada';
      } else if (dbEstado === 'APPROVED' || dbEstado === 'ACTIVE') {
        estado = 'aprobada';
      } else if (dbEstado === 'COMPLETED') {
        estado = 'completada';
      }

      return {
        ...exp,
        estado,
        solicitudNumero: exp.solicitudNumero ?? exp.solicitudId
      };
    });
  }

  // ── DIP: satisfies the contract declared in SolicitudRepository ───────────────
  async getTrackingByClienteId(
    clienteId: string
  ): Promise<TrackingSolicitudResponse[]> {
    if (!clienteId) throw new Error('Cliente ID is required');

    try {
      const response = await this.client.get<
        ApiResponse<TrackingSolicitudResponse[]>
      >(`/requests/${clienteId}/tracking`);
      return response.data?.data || [];
    } catch (err: any) {
      // Business rule: 404 = no tracking data yet — return empty list.
      if (isNotFoundError(err)) return [];
      throw err;
    }
  }

  async getTrackingBySolicitudId(
    solicitudId: string
  ): Promise<TrackingSolicitudResponse | null> {
    if (!solicitudId) throw new Error('Solicitud ID is required');

    try {
      const response = await this.client.get<
        ApiResponse<TrackingSolicitudResponse>
      >(`/requests/${solicitudId}/tracking-by-solicitud-id`);
      return response.data?.data || null;
    } catch (err: any) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  }

  async getTrackingByAnalistaId(
    analistaId: string
  ): Promise<TrackingSolicitudResponse[]> {
    if (!analistaId) throw new Error('Analista ID is required');

    try {
      const response = await this.client.get<
        ApiResponse<TrackingSolicitudResponse[]>
      >(`/requests/${analistaId}/tracking-internal-user`);
      return response.data?.data || [];
    } catch (err: any) {
      if (isNotFoundError(err)) return [];
      throw err;
    }
  }

  async getRequestDetailByRequestIdOrNumber(
    requestNumberOrId: string
  ): Promise<RequestDetailByClientResponse | null> {
    if (!requestNumberOrId) {
      throw new Error('El número o ID de la solicitud es requerido');
    }
    try {
      const response = await this.client.get<
        ApiResponse<RequestDetailByClientResponse>
      >(`/requests/${requestNumberOrId}/detail-by-id-or-number`);
      return response.data?.data || null;
    } catch (err: any) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  }

  async validateDocuments(
    solicitudId: string,
    decisions: {
      documentId: string;
      validationStatus: 'APROBADO' | 'RECHAZADO';
      observation?: string;
    }[],
    validatorId: string
  ): Promise<void> {
    if (!solicitudId) throw new Error('Solicitud ID is required');
    if (!validatorId) throw new Error('Validator ID is required');
    if (!decisions || decisions.length === 0) {
      throw new Error('At least one decision is required');
    }

    await this.client.patch<void>('/document-validation/solicitudes/validar', {
      solicitudId,
      dto: {
        decisions,
        validatorId
      }
    });
  }
}
