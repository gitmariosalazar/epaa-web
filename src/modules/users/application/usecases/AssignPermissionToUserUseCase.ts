import type {
  UserRepository,
  UserPermissionBatchItem,
} from '@/modules/users/domain/repositories/UserRepository';

export class AssignPermissionToUserUseCase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(
    userId: string,
    permissionId: number,
    expirationDate?: string | Date
  ): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    if (permissionId === undefined || permissionId === null)
      throw new Error('Permission ID is required');
    return this.userRepository.assignPermissionToUser(
      userId,
      permissionId,
      expirationDate
    );
  }

  async executeBatch(
    userId: string,
    permissions: UserPermissionBatchItem[]
  ): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    if (!Array.isArray(permissions) || permissions.length === 0) {
      throw new Error('Permissions list cannot be empty');
    }
    return this.userRepository.assignPermissionsBatchToUser(userId, permissions);
  }
}
