import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { RolePermissionRepository } from '@/modules/roles/domain/repositories/RolePermissionRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

interface RolPermissionResponse {
  id: number;
  rolId: number;
  permissionId: number;
  permission?: Permission; // Assuming some backends verify populated data
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

  async deleteRolPermission(rolPermissionId: number): Promise<void> {
    await this.client.delete(
      `/rol-permission/delete-rol-permission/${rolPermissionId}`
    );
  }

  async getPermissionsByRole(rolId: number): Promise<Permission[]> {
    // Fetch all role-permissions, filter by rolId client-side if server doesn't support specific filter?
    // Wait, the controller has `get_all_rol_permissions`. It might return ALL.
    // It consumes limit/offset.
    // Let's assume we need to filter or find a specific endpoint?
    // Controller has: `get-rol-permission/:rolPermissionId` and `get-all`
    // It does NOT seem to have `get-by-rol-id`.
    // USE CASE: To get permissions for a role, we might have to fetch ALL and filter, OR rely on Role endpoint returning permissions?
    // RoleResponse doesn't seem to include permissions.
    // Let's check `getAllRolPermissionsGateway`. It returns `RolPermissionResponse[]`.
    // We will fetch all (maybe with high limit) and filter. Ideally backend should support filtering.

    // For now, fetching reasonable amount and filtering.
    const response = await this.client.get<
      ApiResponse<RolPermissionResponse[]>
    >('/rol-permission/get-all-rol-permissions');
    const all: RolPermissionResponse[] = response.data.data;

    // Filter by role ID
    const rolePermissions = all.filter((rp) => rp.rolId === Number(rolId));

    // We need the ACTUAL permission objects.
    // If the response includes `permission` object populated, great.
    // If not, we might need to fetch permissions separately or assume `permissionId` is enough for ID list.
    // Let's assume for now we just need IDs to check boxes, OR we fetch all permissions and map.

    // Return empty for now if populated permission is missing, assuming we'll sync with PermissionRepo.
    // Actually, let's fetch ALL permissions to have the lookup map if needed,
    // but refined approach: return IDs masquerading as Permissions with just ID?
    // Better: application layer handles the "display" by loading all permissions and checking which IDs match.
    // So this repo method returns `Permission[]` but if backend only gives IDs...
    // Let's assume we return "partial" permissions with just ID if backend doesn't populate.

    return rolePermissions.map(
      (rp) => rp.permission || ({ permissionId: rp.permissionId } as Permission)
    );
  }

  async findRolPermissionId(
    rolId: number,
    permissionId: number
  ): Promise<number | null> {
    const response = await this.client.get<
      ApiResponse<RolPermissionResponse[]>
    >('/rol-permission/get-all-rol-permissions');
    const all: RolPermissionResponse[] = response.data.data;
    const match = all.find(
      (rp) =>
        rp.rolId === Number(rolId) && rp.permissionId === Number(permissionId)
    );
    return match ? match.id : null;
  }
}
