
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { UserCustomerRepository } from '../../domain/repositories/UserCustomerRepository';
import type { CustomerWithRolesAndPermissionsResponse } from '../../domain/models/User';
import type { ChangePasswordRequest } from '../../domain/models/ChangePasswordRequest';

/**
 * UserRepositoryImpl — Profile only
 *
 * Clean Architecture: infrastructure concern only — no business logic.
 * SOLID (DIP): depends on HttpClientInterface, not on a concrete HTTP client.
 * SRP: only handles the current authenticated user's own profile/password.
 */
export class UserCustomerRepositoryImpl implements UserCustomerRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  // ── GET /users-gateway/get-customer-profile/:usernameOrEmail ───────────────
  async getProfile(usernameOrEmail: string): Promise<CustomerWithRolesAndPermissionsResponse> {
    const response = await this.client.get<ApiResponse<CustomerWithRolesAndPermissionsResponse>>(
      `/users-gateway/get-customer-profile/${usernameOrEmail}`
    );
    return response.data.data;
  }

  // ── PUT /users-gateway/update-password/:userId ─────────────────────────────
  async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    await this.client.put<ApiResponse<void>>(
      `/users-gateway/update-password/${userId}`,
      data
    );
  }
}
