import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { RouteDispatchRepository } from '../../domain/repositories/RouteDispatchRepository';
import type { RouteAssignment } from '../../domain/models/RouteAssignment';
import type {
  AssignSingleRouteRequest,
  BatchMorningDispatchRequest,
  ReassignRouteSegmentRequest,
} from '../../domain/dto/request/route-requests.dto';
import type {
  BatchDispatchResponse,
  ReassignSegmentResponse,
} from '../../domain/dto/response/route-responses.dto';

export class RouteDispatchRepositoryImpl implements RouteDispatchRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async executeBatchMorningDispatch(
    request: BatchMorningDispatchRequest,
  ): Promise<BatchDispatchResponse> {
    const lecturistaIds =
      request.lecturistaIds && request.lecturistaIds.length > 0
        ? request.lecturistaIds
        : Array.from(
            new Set(
              (request.asignaciones || [])
                .map(a => a.lecturistaId)
                .filter(Boolean),
            ),
          );

    const sectorOrZona = request.zonaId ?? request.sectorId ?? request.sector;

    const payload: Record<string, unknown> = {
      periodo: request.periodo,
      fechaProgramada: request.fechaProgramada,
      lecturistaIds,
      observaciones: request.observaciones || 'Despacho matutino masivo',
    };

    if (sectorOrZona !== undefined && sectorOrZona !== null) {
      payload.zonaId = Number(sectorOrZona);
      payload.sectorId = Number(sectorOrZona);
    }

    if (request.asignaciones && request.asignaciones.length > 0) {
      payload.asignaciones = request.asignaciones;
    }

    const response = await this.client.post<ApiResponse<BatchDispatchResponse>>(
      '/route-assignments/bulk-dispatch',
      payload,
    );
    return response.data.data;
  }

  async assignSingleRoute(
    request: AssignSingleRouteRequest,
  ): Promise<{ idAsignacion: number; message: string }> {
    const payload = {
      rutaId: Number(request.rutaId),
      usuarioId: String(request.usuarioId),
      periodo: request.periodo,
      fechaProgramada: request.fechaProgramada,
    };
    const response = await this.client.post<
      ApiResponse<{ idAsignacion: number; message: string }>
    >('/route-assignments/single', payload);
    return response.data.data;
  }

  async reassignRouteSegment(
    request: ReassignRouteSegmentRequest,
  ): Promise<ReassignSegmentResponse> {
    const asignacionId = Number(
      request.asignacionId ?? request.idAsignacionOrigen,
    );
    const nuevoUsuarioId = String(
      request.nuevoUsuarioId ?? request.nuevoLecturistaId,
    );
    const payload = {
      asignacionId,
      nuevoUsuarioId,
      motivo: request.motivo,
    };
    const response = await this.client.post<
      ApiResponse<ReassignSegmentResponse>
    >('/route-assignments/reassign-segment', payload);
    return response.data.data;
  }

  async getLiveTracking(
    periodo?: string,
    fecha?: string,
  ): Promise<RouteAssignment[]> {
    const params = new URLSearchParams();
    if (periodo) {
      params.append('periodo', periodo);
    }
    if (fecha) {
      params.append('fecha', fecha);
    }
    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await this.client.get<ApiResponse<RouteAssignment[]>>(
      `/route-assignments/live-tracking${qs}`,
    );
    return response.data.data;
  }

  async cancelAssignment(
    idAsignacion: number,
    motivo?: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.client.put<
      ApiResponse<{ success: boolean; message: string }>
    >(`/route-assignments/${idAsignacion}/cancel`, { motivo });
    return response.data.data;
  }

  async resumeAssignment(
    idAsignacion: number,
    motivo?: string,
  ): Promise<{ success: boolean; message: string; nuevoEstado?: string }> {
    const response = await this.client.put<
      ApiResponse<{ success: boolean; message: string; nuevoEstado?: string }>
    >(`/route-assignments/${idAsignacion}/resume`, { motivo });
    return response.data.data;
  }
}
