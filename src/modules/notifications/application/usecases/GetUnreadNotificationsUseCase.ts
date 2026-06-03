/**
 * GetUnreadNotificationsUseCase
 * SRP: only fetches unread notifications for the bell icon.
 */
import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import type { Notification } from '../../domain/model/Notification';

export class GetUnreadNotificationsUseCase {
  private readonly repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  async execute(userId: string, limit = 20, offset = 0): Promise<Notification[]> {
    return this.repository.findUnreadByUserId(userId, limit, offset);
  }
}
