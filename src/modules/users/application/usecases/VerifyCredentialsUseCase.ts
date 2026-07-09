import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import type { User } from '@/modules/users/domain/models/User';

export class VerifyCredentialsUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(username: string, password: string): Promise<User> {
    if (!username) throw new Error('Username is required');
    if (!password) throw new Error('Password is required');
    return this.userRepository.verifyCredentials(username, password);
  }
}
