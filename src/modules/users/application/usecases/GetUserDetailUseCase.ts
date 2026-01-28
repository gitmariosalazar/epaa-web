import type { User } from '@/modules/users/domain/models/User';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class GetUserDetailUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(username: string, email: string): Promise<User> {
    console.log('GetUserDetailUseCase execute:', { username, email });
    const user = await this.userRepository.getDetail(
      username === '' ? email : username
    );
    return user;
  }
}
