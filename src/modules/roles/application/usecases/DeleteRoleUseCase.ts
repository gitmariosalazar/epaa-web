import type { RoleRepository } from '../../domain/repositories/RoleRepository';

export class DeleteRoleUseCase {
  private readonly repository: RoleRepository;

  constructor(repository: RoleRepository) {
    this.repository = repository;
  }

  async execute(rolId: number): Promise<void> {
    return this.repository.deleteRole(rolId);
  }
}
