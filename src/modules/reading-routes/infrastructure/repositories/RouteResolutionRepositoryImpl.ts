import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { RouteResolutionRepository } from '../../domain/repositories/RouteResolutionRepository';
import type { ResolvedRoute } from '../../domain/models/RouteResolution';
import type {
  InsertConnectionIntoRouteRequest,
  ResolveRouteRequest,
} from '../../domain/dto/request/route-requests.dto';
import type { InsertConnectionIntoRouteResponse } from '../../domain/dto/response/route-responses.dto';

export class RouteResolutionRepositoryImpl
  implements RouteResolutionRepository
{
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async resolveRoute(request: ResolveRouteRequest): Promise<ResolvedRoute> {
    const response = await this.client.post<ApiResponse<ResolvedRoute>>(
      '/reading-routes/resolve-route',
      request,
    );
    return response.data.data;
  }

  async insertConnection(
    request: InsertConnectionIntoRouteRequest,
  ): Promise<InsertConnectionIntoRouteResponse> {
    const response = await this.client.post<
      ApiResponse<InsertConnectionIntoRouteResponse>
    >('/reading-routes/insert-connection', request);
    return response.data.data;
  }
}
