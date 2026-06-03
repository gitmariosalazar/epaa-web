/**
 * GetUnreadCountUseCase
 * SRP: retrieves the badge count for the bell icon.
 */
import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import type { UnreadCount } from '../../domain/model/Notification';

export class GetUnreadCountUseCase {
  private readonly repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  async execute(userId: string): Promise<UnreadCount> {
    return this.repository.countUnread(userId);
  }
}
