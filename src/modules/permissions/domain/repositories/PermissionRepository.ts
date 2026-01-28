import type { Permission } from '../models/Permission';

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;
  findById(permissionId: number): Promise<Permission>;
  createPermission(
    permission: Omit<Permission, 'permissionId'>
  ): Promise<Permission>;
  updatePermission(
    permissionId: number,
    permission: Partial<Permission>
  ): Promise<Permission>;
  deletePermission(permissionId: number): Promise<boolean>;
  verifyPermissionExists(name: string): Promise<boolean>;
}
