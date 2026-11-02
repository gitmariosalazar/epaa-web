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
    return response.data.data;
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
  ): Promise<RouteGeoJsonFeatureCollection> {
    const params = new URLSearchParams();
    if (sectorId !== undefined && sectorId !== null) {
      params.append('sectorId', String(sectorId));
    }
    if (activa !== undefined && activa !== null) {
      params.append('activa', String(activa));
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await this.client.get<
      ApiResponse<RouteGeoJsonFeatureCollection>
    >(`/reading-routes/geojson${qs}`);
    return response.data.data;
  }

  async getRouteCentroids(
    activaOnly: boolean = true,
  ): Promise<RouteCentroidFeatureCollection> {
    const response = await this.client.get<
      ApiResponse<RouteCentroidFeatureCollection>
    >(`/reading-routes/centroids?activa=${activaOnly}`);
    return response.data.data;
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
