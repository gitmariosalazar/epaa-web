import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ILocationRepository } from '../../domain/repositories/location.interface.repository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { CenterLocationResponse } from '../../domain/schemas/dto/response/location.response';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class CenterLocationIncidentImpl implements ILocationRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getCenterLLocationMapIncidents(): Promise<CenterLocationResponse> {
    const response = await this.client.get<ApiResponse<CenterLocationResponse>>(
      '/location-global/get-center-location-incidents'
    );
    return response.data.data;
  }
}
