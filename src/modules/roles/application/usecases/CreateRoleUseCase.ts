import type { Role } from '@/modules/roles/domain/models/Role';
import type { RoleRepository } from '@/modules/roles/domain/repositories/RoleRepository';

export class CreateRoleUseCase {
  private roleRepository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(role: Omit<Role, 'id' | 'active'>): Promise<Role> {
    return this.roleRepository.createRole(role);
  }
}
