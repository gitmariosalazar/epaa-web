import type { User } from '@/modules/users/domain/models/User';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class UpdateUserUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string, data: UpdateUserRequest): Promise<User> {
    if (!userId) throw new Error('User ID is required');
    return this.userRepository.updateUser(userId, data);
  }
}
