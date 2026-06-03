import type { ChangePasswordRequest } from "../../domain/models/ChangePasswordRequest";
import type { UserCustomerRepository } from "../../domain/repositories/UserCustomerRepository";


export class ChangePasswordUseCase {
  private readonly userRepository: UserCustomerRepository;

  constructor(userRepository: UserCustomerRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string, data: ChangePasswordRequest): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    if (data.newPassword !== data.confirmNewPassword) {
      throw new Error('Passwords do not match');
    }
    return this.userRepository.changePassword(userId, data);
  }
}
