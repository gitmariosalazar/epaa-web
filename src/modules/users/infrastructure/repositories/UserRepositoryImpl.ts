import type { User } from '@/modules/users/domain/models/User';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import type { CreateUserEmployeeRequest } from '@/modules/users/domain/models/CreateUserRequest';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import { api } from '@/shared/infrastructure/http/api';

export class UserRepositoryImpl implements UserRepository {
  async findAll(limit: number, offset: number): Promise<User[]> {
    const response = await api.get('/users-gateway/find-all', {
      params: { limit, offset }
    });
    return response.data.data;
  }

  async findById(userId: string): Promise<User> {
    const response = await api.get(`/users-gateway/find-by-id/${userId}`);
    return response.data.data;
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User> {
    const response = await api.get('/users-gateway/find-by-username-or-email', {
      params: { username, email }
    });
    return response.data.data;
  }

  async getDetail(usernameOrEmail: string): Promise<User> {
    const response = await api.get(
      `/users-gateway/get-profile/${usernameOrEmail}`
    );
    return response.data.data;
  }

  async getProfile(usernameOrEmail: string): Promise<User> {
    const response = await api.get(
      `/users-gateway/get-profile/${usernameOrEmail}`
    );
    return response.data.data;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const response = await api.get(
      `/users-gateway/exists-by-username/${username}`
    );
    return response.data.data?.exists || false;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const response = await api.get(`/users-gateway/exists-by-email/${email}`);
    return response.data.data?.exists || false;
  }

  async createUser(user: CreateUserEmployeeRequest): Promise<User> {
    const response = await api.post('/users-gateway/create-user', user);
    return response.data.data;
  }

  async updateUser(userId: string, updates: UpdateUserRequest): Promise<User> {
    const response = await api.put(
      `/users-gateway/update-user/${userId}`,
      updates
    );
    return response.data.data;
  }

  async changePassword(
    userId: string,
    data: ChangePasswordRequest
  ): Promise<void> {
    await api.put(`/users-gateway/update-password/${userId}`, data);
  }

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users-gateway/soft-delete/${userId}`);
  }

  async restoreUser(userId: string): Promise<User> {
    const response = await api.put(`/users-gateway/restore/${userId}`);
    return response.data.data;
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await api.put(`/users-gateway/reset-failed-attempts/${userId}`);
  }
}
