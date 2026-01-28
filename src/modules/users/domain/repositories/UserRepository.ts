import type { User } from '../models/User';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { CreateUserEmployeeRequest } from '../models/CreateUserRequest';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';

export interface UserRepository {
  // Queries
  findAll(limit: number, offset: number): Promise<User[]>;
  findById(userId: string): Promise<User>;
  findByUsernameOrEmail(username: string, email: string): Promise<User>;
  getProfile(usernameOrEmail: string): Promise<User>;
  getDetail(usernameOrEmail: string): Promise<User>;
  existsByUsername(username: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  deleteUser(userId: string): Promise<void>;

  // Commands
  createUser(user: CreateUserEmployeeRequest): Promise<User>;

  restoreUser(userId: string): Promise<User>;
  // updateUser(userId: string, updates: Partial<User>): Promise<User>; // Removing generic partial update in favor of strict DTO if possible, or keeping both if overloading is supported but TS interface overloading is tricky without implementation.
  // Let's just keep the generic one but rename the new one or just use the generic one casted?
  // Actually, I will replace `updateUser(userId: string, updates: Partial<User>): Promise<User>;` with the DTO version if the DTO is what we want.
  // But wait, the previous code had `updateUser` using `Partial<User>`.
  // Let's stick to one. The new DTO `UpdateUserRequest` is cleaner.
  updateUser(userId: string, data: UpdateUserRequest): Promise<User>;
  changePassword(userId: string, data: ChangePasswordRequest): Promise<void>;

  // Security
  resetFailedAttempts(userId: string): Promise<void>;
}
