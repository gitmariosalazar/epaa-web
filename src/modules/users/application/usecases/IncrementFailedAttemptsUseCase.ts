import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class IncrementFailedAttemptsUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    return this.userRepository.incrementFailedAttempts(userId);
  }
}
