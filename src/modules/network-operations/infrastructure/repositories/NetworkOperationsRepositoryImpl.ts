import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { NetworkOperationsRepository } from '../../domain/repositories/NetworkOperationsRepository';
import type { MapGeojsonResponse } from '../../domain/models/GeoJsonFeature';
import type { ScadaTelemetryResponse } from '../../domain/models/ScadaTelemetry';

export class NetworkOperationsRepositoryImpl implements NetworkOperationsRepository {
  private readonly client: HttpClientInterface;
  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getNetworkMapGeoJson(): Promise<MapGeojsonResponse> {
    const response = await this.client.get<ApiResponse<MapGeojsonResponse>>(
      '/NetworkMap/get-network-map'
    );
    return response.data.data;
  }

  async getScadaTelemetry(): Promise<ScadaTelemetryResponse[]> {
    const response = await this.client.get<ApiResponse<ScadaTelemetryResponse[]>>(
      '/NetworkMap/get-scada-telemetry'
    );
    return response.data.data;
  }
}
