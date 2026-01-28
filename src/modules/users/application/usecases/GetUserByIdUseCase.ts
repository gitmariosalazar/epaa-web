import type { User } from '@/modules/users/domain/models/User';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class GetUserByIdUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<User> {
    return await this.userRepository.findById(userId);
  }
}
