import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class RemovePermissionFromUserUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string, permissionId: number): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    if (permissionId === undefined || permissionId === null) throw new Error('Permission ID is required');
    return this.userRepository.removePermissionFromUser(userId, permissionId);
  }
}
