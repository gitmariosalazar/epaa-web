import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class GetPermissionsByUserUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<{ id: number; name: string }[]> {
    if (!userId) throw new Error('User ID is required');
    return this.userRepository.getPermissionsByUser(userId);
  }
}
