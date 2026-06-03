/**
 * MarkAsReadUseCase
 * SRP: marks a single notification as read.
 */
import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';

export class MarkAsReadUseCase {
  private readonly repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  async execute(notificationId: string, userId: string): Promise<boolean> {
    return this.repository.markAsRead(notificationId, userId);
  }
}
