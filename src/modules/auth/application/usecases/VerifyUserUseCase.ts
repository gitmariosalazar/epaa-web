import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';
import type {
  VerifyUserRequest,
  VerifyUserResult,
} from '@/modules/auth/domain/models/Auth';

/**
 * VerifyUserUseCase — Single Responsibility
 *
 * Verifies that a user account still exists and is active on the backend.
 * This must be called on every app startup (after reading a cached session)
 * to prevent stale or revoked sessions from granting access.
 *
 * Throws a named DomainError so callers can react appropriately:
 * - UserNotFoundError  → account deleted from the system
 * - UserInactiveError  → account exists but has been disabled
 */
export class UserNotFoundError extends Error {
  constructor() {
    super('User account no longer exists in the system.');
    this.name = 'UserNotFoundError';
  }
}

export class UserInactiveError extends Error {
  constructor() {
    super('User account is inactive. Please contact the administrator.');
    this.name = 'UserInactiveError';
  }
}

export class VerifyUserUseCase {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  /**
   * @param payload - { username_or_email } — the identifier stored in the
   *   cached session, sourced from the authenticated User object.
   * @returns VerifyUserResult if the account is valid.
   * @throws UserNotFoundError | UserInactiveError on security violations.
   */
  async execute(payload: VerifyUserRequest): Promise<VerifyUserResult> {
    const result = await this.authRepository.verifyUser(payload);

    if (!result.exists) {
      throw new UserNotFoundError();
    }

    if (result.isActive === false) {
      throw new UserInactiveError();
    }

    return result;
  }
}
