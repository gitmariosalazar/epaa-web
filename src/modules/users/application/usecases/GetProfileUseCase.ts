import type { User } from '@/modules/users/domain/models/User';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class GetProfileUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(usernameOrEmail: string): Promise<User> {
    if (!usernameOrEmail) {
      throw new Error('Username or email is required');
    }
    const user = await this.userRepository.getProfile(usernameOrEmail);
    return user;
  }
}
