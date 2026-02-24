import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import type { ReadingInfoRepository } from '../../domain/repositories/ReadingInfoRepository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class ReadingInfoRepositoryImpl implements ReadingInfoRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }
  async getReadingInfo(cadastralKey: string): Promise<ReadingInfo[]> {
    const response = await this.client.get<ApiResponse<ReadingInfo[]>>(
      `/Readings/find-reading-info/${cadastralKey}?t=${new Date().getTime()}`
    );
    return response.data.data;
  }
}
