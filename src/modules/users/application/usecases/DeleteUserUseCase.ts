import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class DeleteUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<void> {
    return this.userRepository.deleteUser(userId);
  }

  async restore(userId: string): Promise<void> {
    await this.userRepository.restoreUser(userId);
  }
}
