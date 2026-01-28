import type { PermissionRepository } from '@/modules/permissions/domain/repositories/PermissionRepository';

export class DeletePermissionUseCase {
  private permissionRepository: PermissionRepository;
  constructor(permissionRepository: PermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(permissionId: number): Promise<boolean> {
    return this.permissionRepository.deletePermission(permissionId);
  }
}
