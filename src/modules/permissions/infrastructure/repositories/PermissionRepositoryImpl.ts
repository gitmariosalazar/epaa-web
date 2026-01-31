import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { PermissionRepository } from '@/modules/permissions/domain/repositories/PermissionRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class PermissionRepositoryImpl implements PermissionRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async findAll(): Promise<Permission[]> {
    const response = await this.client.get<ApiResponse<Permission[]>>(
      '/permissions/get-all-permissions'
    );
    return response.data.data;
  }

  async findById(permissionId: number): Promise<Permission> {
    const response = await this.client.get<ApiResponse<Permission>>(
      `/permissions/get-permission/${permissionId}`
    );
    return response.data.data;
  }

  async createPermission(
    permission: Omit<Permission, 'permissionId'>
  ): Promise<Permission> {
    const response = await this.client.post<ApiResponse<Permission>>(
      '/permissions/create-permission',
      permission
    );
    return response.data.data;
  }

  async updatePermission(
    permissionId: number,
    permission: Partial<Permission>
  ): Promise<Permission> {
    const response = await this.client.put<ApiResponse<Permission>>(
      `/permissions/update-permission/${permissionId}`,
      permission
    );
    return response.data.data;
  }

  async deletePermission(permissionId: number): Promise<boolean> {
    const response = await this.client.delete<ApiResponse<boolean>>(
      `/permissions/delete-permission/${permissionId}`
    );
    return response.data.data;
  }

  async verifyPermissionExists(name: string): Promise<boolean> {
    const response = await this.client.get<ApiResponse<boolean>>(
      `/permissions/verify-permission-exists/${name}`
    );
    return response.data.data;
  }
}
