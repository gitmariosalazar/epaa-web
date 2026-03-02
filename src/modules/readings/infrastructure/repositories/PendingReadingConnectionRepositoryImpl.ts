import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { PendingReadingConnection } from '../../domain/models/Reading';
import type { PendingReadingConnectionRepository } from '../../domain/repositories/PendingReadingConnectionRepository';

export class PendingReadingConnectionRepositoryImpl implements PendingReadingConnectionRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }
  async getPendingReadingsByMonth(
    dateMonth: string,
    sector?: number
  ): Promise<PendingReadingConnection[]> {
    const params = [dateMonth, sector].filter((p) => p !== undefined).join('/');
    const path = `/Readings/get-pending-readings-by-month/${params}`;

    const response =
      await this.client.get<ApiResponse<PendingReadingConnection[]>>(path);
    return response.data.data;
  }
}
