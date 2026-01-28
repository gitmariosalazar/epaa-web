import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { PermissionRepository } from '@/modules/permissions/domain/repositories/PermissionRepository';

export class UpdatePermissionUseCase {
  private permissionRepository: PermissionRepository;
  constructor(permissionRepository: PermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(
    permissionId: number,
    permission: Partial<Permission>
  ): Promise<Permission> {
    return this.permissionRepository.updatePermission(permissionId, permission);
  }
}
