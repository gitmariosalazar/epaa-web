import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { PermissionRepository } from '@/modules/permissions/domain/repositories/PermissionRepository';
import { api } from '@/shared/infrastructure/http/api';

export class PermissionRepositoryImpl implements PermissionRepository {
  async findAll(): Promise<Permission[]> {
    const response = await api.get('/permissions/get-all-permissions');
    return response.data.data;
  }

  async findById(permissionId: number): Promise<Permission> {
    const response = await api.get(
      `/permissions/get-permission/${permissionId}`
    );
    return response.data.data;
  }

  async createPermission(
    permission: Omit<Permission, 'permissionId'>
  ): Promise<Permission> {
    const response = await api.post(
      '/permissions/create-permission',
      permission
    );
    return response.data.data;
  }

  async updatePermission(
    permissionId: number,
    permission: Partial<Permission>
  ): Promise<Permission> {
    const response = await api.put(
      `/permissions/update-permission/${permissionId}`,
      permission
    );
    return response.data.data;
  }

  async deletePermission(permissionId: number): Promise<boolean> {
    const response = await api.delete(
      `/permissions/delete-permission/${permissionId}`
    );
    return response.data.data;
  }

  async verifyPermissionExists(name: string): Promise<boolean> {
    const response = await api.get(
      `/permissions/verify-permission-exists/${name}`
    );
    return response.data.data;
  }
}
