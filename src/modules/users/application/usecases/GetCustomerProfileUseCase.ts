import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class GetCustomerProfileUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(usernameOrEmail: string): Promise<User> {
    if (!usernameOrEmail) throw new Error('Username or email is required');
    return this.userRepository.getCustomerProfile(usernameOrEmail);
  }
}
