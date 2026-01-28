import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { PermissionRepository } from '@/modules/permissions/domain/repositories/PermissionRepository';

export class CreatePermissionUseCase {
  private permissionRepository: PermissionRepository;
  constructor(permissionRepository: PermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(
    permission: Omit<Permission, 'permissionId'>
  ): Promise<Permission> {
    return this.permissionRepository.createPermission(permission);
  }
}
