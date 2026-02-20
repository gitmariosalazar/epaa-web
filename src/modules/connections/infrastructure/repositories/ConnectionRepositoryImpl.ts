import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { Connection } from '../../domain/models/Connection';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class ConnectionRepositoryImpl implements ConnectionRepository {
  private readonly client: HttpClientInterface;
  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getConnections(limit: number, offset: number): Promise<Connection[]> {
    const response = await this.client.get<ApiResponse<Connection[]>>(
      `/connections/get-all-connections`,
      {
        params: {
          limit,
          offset
        }
      }
    );
    return response.data.data;
  }

  async createConnection(
    connection: Omit<Connection, 'connectionId'>
  ): Promise<Connection> {
    const response = await this.client.post<ApiResponse<Connection>>(
      '/connections/create-connection',
      connection
    );
    return response.data.data;
  }

  async updateConnection(
    id: string,
    connection: Partial<Connection>
  ): Promise<Connection> {
    const response = await this.client.put<ApiResponse<Connection>>(
      `/connections/update-connection/${id}`,
      connection
    );
    return response.data.data;
  }

  async deleteConnection(id: string): Promise<void> {
    await this.client.delete<ApiResponse<void>>(
      `/connections/delete-connection/${id}`
    );
  }
}
