import type { CustomerWithRolesAndPermissionsResponse } from '../../domain/models/User';
import type { UserCustomerRepository } from '../../domain/repositories/UserCustomerRepository';

export class GetProfileUseCase {
  private readonly userRepository: UserCustomerRepository;

  constructor(userRepository: UserCustomerRepository) {
    this.userRepository = userRepository;
  }

  async execute(usernameOrEmail: string): Promise<CustomerWithRolesAndPermissionsResponse> {
    if (!usernameOrEmail) {
      throw new Error('Username or email is required');
    }
    const user = await this.userRepository.getProfile(usernameOrEmail);
    return user;
  }
}
