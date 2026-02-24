import type { CreateReadingRequest } from '../../domain/dto/request/CreateReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { CreateReadingRepository } from '../../domain/repositories/CreateReadingRepository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class CreateReadingRepositoryImpl implements CreateReadingRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }
  async createReading(
    request: CreateReadingRequest
  ): Promise<ReadingResponse | null> {
    const response = await this.client.post<ApiResponse<ReadingResponse>>(
      `/Readings/create-reading`,
      request
    );
    return response.data.data;
  }
}
