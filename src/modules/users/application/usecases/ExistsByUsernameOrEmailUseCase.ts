import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class ExistsByUsernameOrEmailUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(username: string, email: string): Promise<boolean> {
    if (!username && !email) throw new Error('Username or email is required');
    return this.userRepository.existsByUsernameOrEmail(username, email);
  }
}
