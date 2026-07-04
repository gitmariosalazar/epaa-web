import type { User } from '@/modules/users/domain/models/User';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import type { CreateUserEmployeeRequest } from '@/modules/users/domain/models/CreateUserRequest';
import type { UserRepository } from '@/modules/users/domain/repositories/UserRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class UserRepositoryImpl implements UserRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async findAll(limit: number, offset: number): Promise<User[]> {
    const response = await this.client.get<ApiResponse<User[]>>(
      '/users-gateway/find-all',
      {
        params: { limit, offset }
      }
    );
    return response.data.data;
  }

  async findById(userId: string): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(
      `/users-gateway/find-by-id/${userId}`
    );
    return response.data.data;
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(
      '/users-gateway/find-by-username-or-email',
      {
        params: { username, email }
      }
    );
    return response.data.data;
  }

  async getDetail(usernameOrEmail: string): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(
      `/users-gateway/get-profile/${usernameOrEmail}`
    );
    return response.data.data;
  }

  async getProfile(usernameOrEmail: string): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(
      `/users-gateway/get-profile/${usernameOrEmail}`
    );
    return response.data.data;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const response = await this.client.get<ApiResponse<boolean>>(
      `/users-gateway/exists-by-username/${username}`
    );
    return response.data.data;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const response = await this.client.get<ApiResponse<boolean>>(
      `/users-gateway/exists-by-email/${email}`
    );
    return response.data.data;
  }

  async findByIdCard(idCard: string): Promise<User | null> {
    try {
      // El backend retorna UserEmployeeResponse con campos distintos a User
      // (employeeId, fullName, etc.). Mapeamos explícitamente.
      const response = await this.client.get<ApiResponse<Record<string, any>>>(
        `/user-employee-gateway/find-by-id-card/${idCard}`
      );
      const data = response.data.data;
      if (!data) return null;

      // Mapper: UserEmployeeResponse → User
      const user: User = {
        userId: data.userId || data.employeeId || '',
        username: data.username || '',
        email: data.email || data.internalEmail || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateOfBirth: data.dateOfBirth || undefined,
        sexId: data.sexId || undefined,
        idCard: data.idCard || undefined,
        citizenId: data.citizenId || undefined,
        positionId: data.positionId || undefined,
        contractTypeId: data.contractTypeId || undefined,
        employeeStatusId: data.employeeStatusId || undefined,
        hireDate: data.hireDate || undefined,
        terminationDate: data.terminationDate || undefined,
        baseSalary: data.baseSalary || undefined,
        supervisorId: data.supervisorId || undefined,
        assignedZones: data.assignedZones || [],
        driverLicense: data.driverLicense || undefined,
        hasCompanyVehicle: data.hasCompanyVehicle ?? false,
        internalPhone: data.internalPhone || undefined,
        internalEmail: data.internalEmail || undefined,
        photoUrl: data.photoUrl || undefined,
        roles: data.roles || [],
        permissions: data.permissions || [],
        isActive: data.isActive ?? true,
        registeredAt: data.createdAt || new Date(),
        lastLogin: null,
        failedAttempts: 0,
        twoFactorEnabled: false
      };

      return user;
    } catch (error) {
      // Retorna null si no se encuentra (404) — no lanza error
      console.warn('[UserRepository] findByIdCard failed:', error);
      return null;
    }
  }

  async createUser(user: CreateUserEmployeeRequest): Promise<User> {
    const response = await this.client.post<ApiResponse<User>>(
      '/user-employee-gateway/create',
      user
    );
    return response.data.data;
  }

  async updateUser(userId: string, updates: UpdateUserRequest): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>(
      `/users-gateway/update-user/${userId}`,
      updates
    );
    return response.data.data;
  }

  async changePassword(
    userId: string,
    data: ChangePasswordRequest
  ): Promise<void> {
    await this.client.put<ApiResponse<User>>(
      `/users-gateway/update-password/${userId}`,
      data
    );
  }

  async deleteUser(userId: string): Promise<void> {
    await this.client.delete<ApiResponse<void>>(
      `/users-gateway/soft-delete/${userId}`
    );
  }

  async restoreUser(userId: string): Promise<User> {
    const response = await this.client.put<ApiResponse<User>>(
      `/users-gateway/restore/${userId}`
    );
    return response.data.data;
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await this.client.put<ApiResponse<void>>(
      `/users-gateway/reset-failed-attempts/${userId}`
    );
  }
}
