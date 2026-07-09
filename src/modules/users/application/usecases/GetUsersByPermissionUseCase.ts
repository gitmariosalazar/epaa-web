import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class GetUsersByPermissionUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(permissionId: number): Promise<User[]> {
    if (permissionId === undefined || permissionId === null) throw new Error('Permission ID is required');
    return this.userRepository.getUsersByPermission(permissionId);
  }
}
