/**
 * MarkAllAsReadUseCase
 * SRP: marks all notifications for a user as read.
 */
import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';

export class MarkAllAsReadUseCase {
  private readonly repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  /** Returns the number of notifications updated. */
  async execute(userId: string): Promise<number> {
    return this.repository.markAllAsRead(userId);
  }
}
