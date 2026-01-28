import type { User } from '@/modules/users/domain/models/User';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class GetUsersUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(limit: number = 20, offset: number = 0): Promise<User[]> {
    return this.userRepository.findAll(limit, offset);
  }
}
