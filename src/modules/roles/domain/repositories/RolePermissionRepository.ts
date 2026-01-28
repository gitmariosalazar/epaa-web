// import type { Role } from '../models/Role';
import type { Permission } from '@/modules/permissions/domain/models/Permission';

export interface RolePermissionRepository {
  createRolPermission(rolId: number, permissionId: number): Promise<void>;
  deleteRolPermission(rolPermissionId: number): Promise<void>;
  getPermissionsByRole(rolId: number): Promise<Permission[]>;
  // Helper to find the logic ID relating a role and permission if needed for deletion
  findRolPermissionId(
    rolId: number,
    permissionId: number
  ): Promise<number | null>;
}
