import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class LogoutUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}
