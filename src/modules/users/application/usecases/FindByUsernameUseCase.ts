import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class FindByUsernameUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(username: string): Promise<User> {
    if (!username) throw new Error('Username is required');
    return this.userRepository.findByUsername(username);
  }
}
