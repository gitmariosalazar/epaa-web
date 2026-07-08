import type { Position } from '@/modules/roles/domain/models/Position';
import type { PositionRepository } from '@/modules/roles/domain/repositories/PositionRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class PositionRepositoryImpl implements PositionRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async findAll(): Promise<Position[]> {
    const response = await this.client.get<ApiResponse<Position[]>>(
      '/positions/get-all-positions'
    );
    return response.data.data;
  }

  async findById(positionId: number): Promise<Position> {
    const response = await this.client.get<ApiResponse<Position>>(
      `/positions/get-position-by-id/${positionId}`
    );
    return response.data.data;
  }

  async createPosition(position: Omit<Position, 'positionId' | 'creationDate' | 'updatedAt'>): Promise<Position> {
    const response = await this.client.post<ApiResponse<Position>>(
      '/positions/create-position',
      position
    );
    return response.data.data;
  }

  async updatePosition(positionId: number, position: Partial<Position>): Promise<Position> {
    const response = await this.client.put<ApiResponse<Position>>(
      `/positions/update-position/${positionId}`,
      position
    );
    return response.data.data;
  }

  async disablePosition(positionId: number): Promise<boolean> {
    const response = await this.client.delete<ApiResponse<boolean>>(
      `/positions/disable-position/${positionId}`
    );
    return response.data.data;
  }
}
