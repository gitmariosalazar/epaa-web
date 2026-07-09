import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class FindByEmailUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string): Promise<User> {
    if (!email) throw new Error('Email is required');
    return this.userRepository.findByEmail(email);
  }
}
