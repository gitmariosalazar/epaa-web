import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class UnlockModuleUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Executes the module unlock process by sending the user's PIN to the backend.
   * 
   * @param userId The ID of the current user
   * @param pin The security PIN
   * @returns The elevated token on success
   */
  async execute(userId: string, pin: string): Promise<{ elevated_token: string }> {
    if (!userId || !pin) {
      throw new Error('User ID and PIN are required to unlock the module');
    }
    return this.authRepository.unlockModule(userId, pin);
  }
}
