import type { AuthSession } from '@/modules/auth/domain/models/Auth';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';

export class RefreshTokenUseCase {
  private authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<AuthSession> {
    return this.authRepository.refreshToken();
  }
}
