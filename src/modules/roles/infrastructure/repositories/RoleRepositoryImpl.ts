import type { Role } from '@/modules/roles/domain/models/Role';
import type { RoleRepository } from '@/modules/roles/domain/repositories/RoleRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class RoleRepositoryImpl implements RoleRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async findAll(limit: number, offset: number): Promise<Role[]> {
    const response = await this.client.get<ApiResponse<Role[]>>(
      '/roles/get-all-rols',
      {
        params: { limit, offset }
      }
    );
    return response.data.data;
  }

  async findById(rolId: number): Promise<Role> {
    const response = await this.client.get<ApiResponse<Role>>(
      `/roles/get-rol-by-id/${rolId}`
    );
    return response.data.data;
  }

  async createRole(role: Omit<Role, 'id' | 'active'>): Promise<Role> {
    const response = await this.client.post<ApiResponse<Role>>(
      '/roles/create-rol',
      role
    );
    return response.data.data;
  }

  async updateRole(rolId: number, role: Partial<Role>): Promise<Role> {
    const response = await this.client.put<ApiResponse<Role>>(
      `/roles/update-rol/${rolId}`,
      role
    );
    return response.data.data;
  }
}
