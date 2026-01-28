import type { Role } from '@/modules/roles/domain/models/Role';
import type { RoleRepository } from '@/modules/roles/domain/repositories/RoleRepository';

export class GetRolesUseCase {
  private roleRepository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(limit: number, offset: number): Promise<Role[]> {
    return this.roleRepository.findAll(limit, offset);
  }
}
