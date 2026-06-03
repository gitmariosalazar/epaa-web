/**
 * SendNotificationUseCase
 * SRP: dispatches a new notification via the backend API.
 */
import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import type { SendNotificationDto } from '../../domain/model/Notification';

export class SendNotificationUseCase {
  private readonly repository: NotificationRepository;

  constructor(repository: NotificationRepository) {
    this.repository = repository;
  }

  /** Returns the generated notificationId (or comma-separated IDs for multi-channel). */
  async execute(dto: SendNotificationDto): Promise<string> {
    return this.repository.send(dto);
  }
}
