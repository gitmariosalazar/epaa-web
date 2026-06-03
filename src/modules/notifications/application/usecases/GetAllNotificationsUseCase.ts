/**
 * GetAllNotificationsUseCase
 * SRP: fetches the full notification inbox (read + unread).
 */
import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import type { Notification } from '../../domain/model/Notification';

export class GetAllNotificationsUseCase {
  private readonly repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  async execute(userId: string, limit = 30, offset = 0): Promise<Notification[]> {
    return this.repository.findAllByUserId(userId, limit, offset);
  }
}
