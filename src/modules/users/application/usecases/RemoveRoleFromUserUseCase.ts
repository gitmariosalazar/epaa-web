import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class RemoveRoleFromUserUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string, roleId: number): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    if (roleId === undefined || roleId === null) throw new Error('Role ID is required');
    return this.userRepository.removeRoleFromUser(userId, roleId);
  }
}
