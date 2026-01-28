import type { Role } from '@/modules/roles/domain/models/Role';
import type { RoleRepository } from '@/modules/roles/domain/repositories/RoleRepository';

export class UpdateRoleUseCase {
  private roleRepository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(rolId: number, role: Partial<Role>): Promise<Role> {
    return this.roleRepository.updateRole(rolId, role);
  }
}
