import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { UpdateReadingRequest } from '../../domain/dto/request/UpdateReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { UpdateReadingRepository } from '../../domain/repositories/UpdateReadingRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class UpdateReadingRepositoryImpl implements UpdateReadingRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async updateReading(
    readingId: number,
    request: UpdateReadingRequest
  ): Promise<ReadingResponse | null> {
    const response = await this.client.put<ApiResponse<ReadingResponse>>(
      `/Readings/update-current-reading/${readingId}`,
      request
    );
    return response.data.data;
  }
}
