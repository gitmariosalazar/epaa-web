import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ReadingRouteCatalogRepository } from '../../domain/repositories/ReadingRouteCatalogRepository';
import type {
  ReadingRoute,
  RouteCentroidFeatureCollection,
  RouteGeoJsonFeatureCollection,
} from '../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../domain/models/RouteConnection';
import type {
  FindReadingRoutesQuery,
  OptimizeRouteSequenceRequest,
} from '../../domain/dto/request/route-requests.dto';
import type {
  OptimizeSequenceResponse,
  PaginatedRoutesResponse,
} from '../../domain/dto/response/route-responses.dto';

export class ReadingRouteCatalogRepositoryImpl
  implements ReadingRouteCatalogRepository
{
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getRoutes(
    query?: FindReadingRoutesQuery,
  ): Promise<PaginatedRoutesResponse> {
    const params = new URLSearchParams();
    if (query?.sectorId !== undefined && query.sectorId !== null) {
      params.append('sectorId', String(query.sectorId));
    }
    if (query?.activa !== undefined && query.activa !== null) {
      params.append('activa', String(query.activa));
    }
    if (query?.estado !== undefined && query.estado !== null && query.estado !== '') {
      params.append('estado', String(query.estado));
    }
    if (query?.periodo !== undefined && query.periodo !== null && query.periodo.trim() !== '') {
      params.append('periodo', query.periodo.trim());
    }
    if (query?.search) {
      params.append('search', query.search);
    }
    if (query?.page) {
      params.append('page', String(query.page));
    }
    if (query?.limit) {
      params.append('limit', String(query.limit));
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await this.client.get<
      ApiResponse<PaginatedRoutesResponse>
    >(`/reading-routes${qs}`);

    const rawData = response?.data;
    const body = (rawData as any)?.data ?? rawData;
    if (Array.isArray(body)) {
      return {
        items: body,
        total: body.length,
        page: query?.page ?? 1,
        limit: query?.limit ?? body.length,
      };
    }
    return (body || {
      items: [],
      total: 0,
      page: 1,
      limit: 20,
    }) as PaginatedRoutesResponse;
  }

  async getRouteById(id: number): Promise<ReadingRoute> {
    const response = await this.client.get<ApiResponse<ReadingRoute>>(
      `/reading-routes/${id}`,
    );
    return response.data.data;
  }

  async getRoutesGeoJson(
    sectorId?: number,
    activa?: boolean,
    estado?: string,
    periodo?: string,
  ): Promise<RouteGeoJsonFeatureCollection> {
    const params = new URLSearchParams();
    if (sectorId !== undefined && sectorId !== null) {
      params.append('sectorId', String(sectorId));
    }
    if (activa !== undefined && activa !== null) {
      params.append('activa', String(activa));
    }
    if (estado !== undefined && estado !== null && estado !== '') {
      params.append('estado', estado);
    }
    if (periodo !== undefined && periodo !== null && periodo.trim() !== '') {
      params.append('periodo', periodo.trim());
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await this.client.get<
      ApiResponse<RouteGeoJsonFeatureCollection>
    >(`/reading-routes/geojson${qs}`);

    const rawData = response?.data;
    const data = (rawData as any)?.data ?? rawData;
    return (data || {
      type: 'FeatureCollection',
      features: [],
    }) as RouteGeoJsonFeatureCollection;
  }

  async getRouteCentroids(
    filter?:
      | boolean
      | {
          sectorId?: number;
          activa?: boolean;
          estado?: string;
          periodo?: string;
        },
  ): Promise<RouteCentroidFeatureCollection> {
    const params = new URLSearchParams();

    if (typeof filter === 'boolean') {
      params.append('activaOnly', String(filter));
    } else if (filter) {
      if (filter.activa !== undefined && filter.activa !== null) {
        params.append('activaOnly', String(filter.activa));
      }
      if (filter.sectorId !== undefined && filter.sectorId !== null) {
        params.append('sectorId', String(filter.sectorId));
      }
      if (
        filter.estado !== undefined &&
        filter.estado !== null &&
        filter.estado.trim() !== ''
      ) {
        params.append('estado', filter.estado.trim());
      }
      if (
        filter.periodo !== undefined &&
        filter.periodo !== null &&
        filter.periodo.trim() !== ''
      ) {
        params.append('periodo', filter.periodo.trim());
      }
    } else {
      params.append('activaOnly', 'true');
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await this.client.get<
      ApiResponse<RouteCentroidFeatureCollection>
    >(`/reading-routes/centroids${qs}`);

    const rawData = response?.data;
    const data = (rawData as any)?.data ?? rawData;
    return (data || {
      type: 'FeatureCollection',
      features: [],
    }) as RouteCentroidFeatureCollection;
  }

  async getRouteConnections(idRuta: number): Promise<RouteConnection[]> {
    const response = await this.client.get<ApiResponse<RouteConnection[]>>(
      `/reading-routes/${idRuta}/connections`,
    );
    return response.data.data;
  }

  async optimizeRouteSequence(
    idRuta: number,
    request?: OptimizeRouteSequenceRequest,
  ): Promise<OptimizeSequenceResponse> {
    const response = await this.client.post<
      ApiResponse<OptimizeSequenceResponse>
    >(`/reading-routes/${idRuta}/optimize`, request || {});
    return response.data.data;
  }
}
