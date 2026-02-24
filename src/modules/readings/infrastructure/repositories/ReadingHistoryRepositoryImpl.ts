import type { ReadingHistory } from '../../domain/models/ReadingHistory';
import type { ReadingHistoryRepository } from '../../domain/repositories/ReadinHistoryRepository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class ReadingHistoryRepositoryImpl implements ReadingHistoryRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }
  async getReadingHistory(
    cadastralKey: string,
    limit: number,
    offset: number
  ): Promise<ReadingHistory[]> {
    const response = await this.client.get<ApiResponse<ReadingHistory[]>>(
      `/Readings/reading-history/${cadastralKey}/${limit}/${offset}`
    );
    return response.data.data;
  }
}
