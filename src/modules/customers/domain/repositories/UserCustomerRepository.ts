import type { CustomerWithRolesAndPermissionsResponse } from '../models/User';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';

/**
 * UserRepository — Profile only
 *
 * SRP: this repository only handles the current user's own profile.
 * User management (CRUD for other users) is an admin concern and
 * belongs in a separate admin module.
 */
export interface UserCustomerRepository {
  /**
   * GET /users-gateway/get-customer-profile/:usernameOrEmail
   * Returns the full profile with nested person/company and roles.
   */
  getProfile(usernameOrEmail: string): Promise<CustomerWithRolesAndPermissionsResponse>;

  /**
   * POST /users-gateway/change-password
   */
  changePassword(userId: string, data: ChangePasswordRequest): Promise<void>;
}
