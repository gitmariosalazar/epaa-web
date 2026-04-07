import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type {
  Connection,
  ConnectionWithProperty,
  Rate
} from '../../domain/models/Connection';
import type {
  ConnectionRepository,
  CreateConnectionRequest,
  UpdateConnectionRequest
} from '../../domain/repositories/ConnectionRepository';
import type { DashboardAdvanceResponse } from '../../domain/models/DashboardStats';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class ConnectionRepositoryImpl implements ConnectionRepository {
  private readonly client: HttpClientInterface;
  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getAdvanceDashboardStats(): Promise<DashboardAdvanceResponse> {
    const response = await this.client.get<ApiResponse<DashboardAdvanceResponse>>(
      '/connections/dashboard/advancement-stats'
    );
    return response.data.data;
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
    connection: CreateConnectionRequest
  ): Promise<Connection> {
    const response = await this.client.post<ApiResponse<Connection>>(
      '/connections/create-connection',
      connection
    );
    return response.data.data;
  }

  async updateConnection(
    id: string,
    connection: UpdateConnectionRequest
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
  async getRates(): Promise<Rate[]> {
    const response = await this.client.get<ApiResponse<Rate[]>>(
      '/connection-gateway/get-all-rates'
    );
    return response.data.data;
  }

  async findConnectionWithPropertyByCadastralKey(
    cadastralKey: string
  ): Promise<ConnectionWithProperty | null> {
    const response = await this.client.get<ApiResponse<ConnectionWithProperty>>(
      `/connections/find-connection-with-property-by-cadastral-key/${cadastralKey}`
    );
    return response.data.data;
  }

  async findConnectionsBySector(
    sector: string,
    limit: number,
    offset: number
  ): Promise<Connection[]> {
    const response = await this.client.get<ApiResponse<Connection[]>>(
      `/connections/find-connections-by-sector/${sector}`,
      {
        params: {
          limit,
          offset
        }
      }
    );
    return response.data.data;
  }

  async findAllConnectionsByClientId(
    clientId: string,
    limit: number,
    offset: number
  ): Promise<Connection[]> {
    const response = await this.client.get<ApiResponse<Connection[]>>(
      `/connections/find-connections-by-client-id/${clientId}`,
      {
        params: {
          limit,
          offset
        }
      }
    );
    return response.data.data;
  }
}
