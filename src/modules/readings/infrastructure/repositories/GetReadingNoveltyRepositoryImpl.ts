import type { ReadingNovelty } from '../../domain/models/ReadingNovelty';
import type { GetReadingNoveltyRepository } from '../../domain/repositories/GetReadingNoveltyRepository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class GetReadingNoveltyRepositoryImpl implements GetReadingNoveltyRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getReadingByNovelty(
    dateMonth: string,
    novelty?: string,
    sector?: number
  ): Promise<ReadingNovelty[]> {
    // http://192.168.0.111:3005/Readings/get-reading-by-novelty/NORMAL/2026-05?sector=12'
    let url = `/Readings/get-reading-by-novelty/${dateMonth}`;
    const params = new URLSearchParams();

    if (novelty && novelty !== 'TODAS') {
      params.append('novelty', novelty);
    }
    if (sector !== undefined && sector !== null) {
      params.append('sector', sector.toString());
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await this.client.get<ApiResponse<ReadingNovelty[]>>(url);
    return response.data.data;
  }
}
