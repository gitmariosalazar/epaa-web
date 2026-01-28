import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { RolePermissionRepository } from '@/modules/roles/domain/repositories/RolePermissionRepository';
import type { PermissionRepository } from '@/modules/permissions/domain/repositories/PermissionRepository';

export class ManageRolePermissionsUseCase {
  private rolePermissionRepository: RolePermissionRepository;
  private permissionRepository: PermissionRepository;

  constructor(
    rolePermissionRepository: RolePermissionRepository,
    permissionRepository: PermissionRepository
  ) {
    this.rolePermissionRepository = rolePermissionRepository;
    this.permissionRepository = permissionRepository;
  }

  async getRolePermissions(
    rolId: number
  ): Promise<{ assigned: Permission[]; all: Permission[] }> {
    const all = await this.permissionRepository.findAll();
    const assigned =
      await this.rolePermissionRepository.getPermissionsByRole(rolId);

    // Ensure assigned permissions have full details if they were just IDs,
    // by matching with 'all' list.
    const assignedFull = assigned.map((p) => {
      if (p.permissionName) return p; // Already populated
      const found = all.find((ap) => ap.permissionId === p.permissionId);
      return found || p;
    });

    return {
      assigned: assignedFull,
      all
    };
  }

  async assignPermission(rolId: number, permissionId: number): Promise<void> {
    await this.rolePermissionRepository.createRolPermission(
      rolId,
      permissionId
    );
  }

  async removePermission(rolId: number, permissionId: number): Promise<void> {
    const rolPermissionId =
      await this.rolePermissionRepository.findRolPermissionId(
        rolId,
        permissionId
      );
    if (rolPermissionId) {
      await this.rolePermissionRepository.deleteRolPermission(rolPermissionId);
    } else {
      throw new Error('Assignment not found');
    }
  }
}
