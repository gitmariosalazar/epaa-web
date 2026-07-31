import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class FindByUsernameOrEmailUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(username: string, email: string): Promise<User> {
    if (!username && !email) throw new Error('Username or email is required');
    return this.userRepository.findByUsernameOrEmail(username, email);
  }
}
