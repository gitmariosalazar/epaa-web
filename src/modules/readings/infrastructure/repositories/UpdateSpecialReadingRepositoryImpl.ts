import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { UpdateSpecialReadingRequest } from '../../domain/dto/request/UpdateSpecialReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { UpdateSpecialReadingRepository } from '../../domain/repositories/UpdateSpecialReadingRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class UpdateSpecialReadingRepositoryImpl implements UpdateSpecialReadingRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async updateSpecialReading(
    readingId: number,
    request: UpdateSpecialReadingRequest
  ): Promise<ReadingResponse | null> {
    const response = await this.client.put<ApiResponse<ReadingResponse>>(
      `/Readings/update-special-reading/${readingId}`,
      request
    );
    return response.data.data;
  }
}
