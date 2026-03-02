import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { TakenReadingConnection } from '../../domain/models/Reading';
import type { TakenReadingConnectionRepository } from '../../domain/repositories/TakenReadingConnectionRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class TakenReadingConnectionRepositoryImpl implements TakenReadingConnectionRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getTakenReadingsByMonth(
    dateMonth: string,
    sector?: number
  ): Promise<TakenReadingConnection[]> {
    const params = [dateMonth, sector].filter((p) => p !== undefined).join('/');
    const path = `/Readings/get-taken-readings-by-month/${params}`;

    const response =
      await this.client.get<ApiResponse<TakenReadingConnection[]>>(path);
    return response.data.data;
  }

  async getTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number
  ): Promise<TakenReadingConnection[]> {
    const params = [month, sector].filter((p) => p !== undefined).join('/');
    const path = `/Readings/get-taken-reading-estimates-or-average/${params}`;

    const response =
      await this.client.get<ApiResponse<TakenReadingConnection[]>>(path);
    return response.data.data;
  }
}
