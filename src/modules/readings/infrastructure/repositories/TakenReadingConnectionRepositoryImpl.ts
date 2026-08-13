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
    sector?: number,
    userId?: string
  ): Promise<TakenReadingConnection[]> {
    let path = `/Readings/get-taken-readings-by-month/${dateMonth}`;
    if (sector !== undefined) {
      path += `/${sector}`;
    }
    if (userId !== undefined) {
      path += `?userId=${userId}`;
    }

    const response =
      await this.client.get<ApiResponse<TakenReadingConnection[]>>(path);
    return response.data.data;
  }

  async getTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number,
    userId?: string
  ): Promise<TakenReadingConnection[]> {
    let path = `/Readings/get-taken-reading-estimates-or-average/${month}`;
    if (sector !== undefined) {
      path += `/${sector}`;
    }
    if (userId !== undefined) {
      path += `?userId=${userId}`;
    }

    const response =
      await this.client.get<ApiResponse<TakenReadingConnection[]>>(path);
    return response.data.data;
  }
}
