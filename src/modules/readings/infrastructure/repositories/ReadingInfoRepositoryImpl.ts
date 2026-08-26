import type {
  ReadingDetailed,
  ReadingInfo
} from '../../domain/models/ReadingInfoResponse';
import type { ReadingInfoRepository } from '../../domain/repositories/ReadingInfoRepository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export class ReadingInfoRepositoryImpl implements ReadingInfoRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }
  async getReadingInfo(cadastralKey: string): Promise<ReadingInfo[]> {
    const response = await this.client.get<ApiResponse<ReadingInfo[]>>(
      `/Readings/find-reading-info/${cadastralKey}?t=${dateService.getCurrentDate().getTime()}`
    );
    return response.data.data;
  }

  // 'Readings/get-detailed-reading-info-by-cadastral-key/:cadastralKey/:yearAndMonth
  async getDetailedReadingInfoByCadastralKey(
    cadastralKey: string,
    yearAndMonth: string
  ): Promise<ReadingDetailed | null> {
    const response = await this.client.get<ApiResponse<ReadingDetailed>>(
      `/Readings/get-detailed-reading-info-by-cadastral-key/${cadastralKey}/${yearAndMonth}`
    );
    return response.data.data;
  }
}
