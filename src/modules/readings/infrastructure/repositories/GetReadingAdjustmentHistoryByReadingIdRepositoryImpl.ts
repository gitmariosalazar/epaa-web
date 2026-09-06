import type { GetReadingAdjustmentHistoryByReadingIdRepository } from '../../domain/repositories/GetReadingAdjustmentHistoryByReadingIdRepository';
import type { HistorialAjusteLectura } from '../../domain/models/Reading';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class GetReadingAdjustmentHistoryByReadingIdRepositoryImpl implements GetReadingAdjustmentHistoryByReadingIdRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getReadingAdjustmentHistoryByReadingId(
    readingId: number
  ): Promise<HistorialAjusteLectura[]> {
    const response = await this.client.get<
      ApiResponse<HistorialAjusteLectura[]>
    >(`/Readings/get-reading-adjustment-history-by-reading-id/${readingId}`);
    return response.data.data;
  }
}
