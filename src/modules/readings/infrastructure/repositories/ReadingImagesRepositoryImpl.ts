import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { ReadingImages } from '../../domain/models/ReadingImages';
import type { ReadingImagesRepository } from '../../domain/repositories/ReadingImagesRepository';

export class ReadingImagesRepositoryImpl implements ReadingImagesRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async findReadingImagesByMonth(month: string): Promise<ReadingImages[]> {
    const response = await this.client.get<ApiResponse<ReadingImages[]>>(
      `/ReadingImages/find-reading-images-by-month/${month}`
    );
    return response.data.data;
  }

  async findReadingImagesByMonthAndSector(
    month: string,
    sector: number
  ): Promise<ReadingImages[]> {
    const response = await this.client.get<ApiResponse<ReadingImages[]>>(
      `/ReadingImages/find-reading-images-by-month-and-sector/${month}/${sector}`
    );
    return response.data.data;
  }

  async findReadingImagesByCadastralKey(
    cadastralKey: string
  ): Promise<ReadingImages[]> {
    const response = await this.client.get<ApiResponse<ReadingImages[]>>(
      `/ReadingImages/find-reading-images/${cadastralKey}`
    );
    return response.data.data;
  }

  async findAllReadingImages(): Promise<ReadingImages[]> {
    const response = await this.client.get<ApiResponse<ReadingImages[]>>(
      `/ReadingImages/find-all-reading-images`
    );
    return response.data.data;
  }
}
