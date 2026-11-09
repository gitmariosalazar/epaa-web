import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { RolePermissionRepository } from '@/modules/roles/domain/repositories/RolePermissionRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

interface RolPermissionResponse {
  rolPermissionId: number;
  rolId: number;
  permissionId: number;
}

export class RolePermissionRepositoryImpl implements RolePermissionRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async createRolPermission(
    rolId: number,
    permissionId: number
  ): Promise<void> {
    await this.client.post('/rol-permission/create-rol-permission', {
      rolId,
      permissionId
    });
  }

  async assignPermissionsBatch(
    rolId: number,
    permissionIds: number[]
  ): Promise<void> {
    await this.client.post('/rol-permission/assign-permissions-batch', {
      rolId,
      permissionIds
    });
  }

  async deleteRolPermission(rolPermissionId: number): Promise<void> {
    await this.client.delete(
      `/rol-permission/delete-rol-permission/${rolPermissionId}`
    );
  }

  async getPermissionsByRole(rolId: number): Promise<Permission[]> {
    try {
      const response = await this.client.get<
        ApiResponse<RolPermissionResponse[]>
      >(`/rol-permission/get-permissions-by-rol-id/${rolId}`);
      const rolePermissions: RolPermissionResponse[] = response.data?.data || [];

      return rolePermissions.map(
        (rp) => ({ permissionId: rp.permissionId } as Permission)
      );
    } catch (error) {
      console.warn('Fallback to get-all-rol-permissions if by-rol-id fails', error);
      const response = await this.client.get<
        ApiResponse<RolPermissionResponse[]>
      >('/rol-permission/get-all-rol-permissions');
      const all: RolPermissionResponse[] = response.data?.data || [];
      const rolePermissions = all.filter((rp) => rp.rolId === Number(rolId));
      return rolePermissions.map(
        (rp) => ({ permissionId: rp.permissionId } as Permission)
      );
    }
  }

  async findRolPermissionId(
    rolId: number,
    permissionId: number
  ): Promise<number | null> {
    try {
      const response = await this.client.get<
        ApiResponse<RolPermissionResponse[]>
      >(`/rol-permission/get-permissions-by-rol-id/${rolId}`);
      const list: RolPermissionResponse[] = response.data?.data || [];
      const match = list.find(
        (rp) =>
          rp.rolId === Number(rolId) && rp.permissionId === Number(permissionId)
      );
      if (match) return match.rolPermissionId;
    } catch {
      // Fallback
    }

    const response = await this.client.get<
      ApiResponse<RolPermissionResponse[]>
    >('/rol-permission/get-all-rol-permissions');
    const all: RolPermissionResponse[] = response.data?.data || [];
    const match = all.find(
      (rp) =>
        rp.rolId === Number(rolId) && rp.permissionId === Number(permissionId)
    );
    return match ? match.rolPermissionId : null;
  }
}
