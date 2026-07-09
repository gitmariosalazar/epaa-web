import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class GetUsersByRoleUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(roleId: number): Promise<User[]> {
    if (roleId === undefined || roleId === null) throw new Error('Role ID is required');
    return this.userRepository.getUsersByRole(roleId);
  }
}
