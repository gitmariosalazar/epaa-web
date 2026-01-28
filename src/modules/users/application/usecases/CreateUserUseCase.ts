import type { User } from '@/modules/users/domain/models/User';
import type { CreateUserEmployeeRequest } from '@/modules/users/domain/models/CreateUserRequest';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class CreateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(user: CreateUserEmployeeRequest): Promise<User> {
    return this.userRepository.createUser(user);
  }
}
