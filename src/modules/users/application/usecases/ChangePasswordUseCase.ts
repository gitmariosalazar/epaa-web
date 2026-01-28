import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';

export class ChangePasswordUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
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
