import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class FindByRefreshTokenUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(token: string): Promise<User> {
    if (!token) throw new Error('Token is required');
    return this.userRepository.findByRefreshToken(token);
  }
}
