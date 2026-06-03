/**
 * NotificationRepositoryImpl
 * Infrastructure layer — calls the backend REST API.
 * Maps every backend endpoint exactly as documented in NotificationGatewayController.
 *
 * Endpoints:
 *  GET  /notifications/unread?userId=&limit=&offset=
 *  GET  /notifications/all?userId=&limit=&offset=
 *  GET  /notifications/count?userId=
 *  PATCH /notifications/:notificationId/read?userId=
 *  PATCH /notifications/read-all?userId=
 *  POST /notifications/send
 */
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import type {
  Notification,
  SendNotificationDto,
  UnreadCount,
} from '../../domain/model/Notification';

export class NotificationRepositoryImpl implements NotificationRepository {
  private readonly base = '/notifications';

  // ── Queries ───────────────────────────────────────────────────────────────

  async findUnreadByUserId(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<Notification[]> {
    const res = await apiClient.get<Notification[]>(
      `${this.base}/unread`,
      { params: { userId, limit, offset } },
    );
    return res.data ?? [];
  }

  async findAllByUserId(
    userId: string,
    limit = 30,
    offset = 0,
  ): Promise<Notification[]> {
    const res = await apiClient.get<Notification[]>(
      `${this.base}/all`,
      { params: { userId, limit, offset } },
    );
    return res.data ?? [];
  }

  async countUnread(userId: string): Promise<UnreadCount> {
    const res = await apiClient.get<UnreadCount>(
      `${this.base}/count`,
      { params: { userId } },
    );
    return res.data ?? { userId, unreadCount: 0 };
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const res = await apiClient.patch<boolean>(
      `${this.base}/${notificationId}/read`,
      {},
      { params: { userId } },
    );
    return res.data ?? false;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const res = await apiClient.patch<number>(
      `${this.base}/read-all`,
      {},
      { params: { userId } },
    );
    return res.data ?? 0;
  }

  async send(dto: SendNotificationDto): Promise<string> {
    const res = await apiClient.post<{ notificationIds: string }>(
      `${this.base}/send`,
      dto,
    );
    return res.data?.notificationIds ?? '';
  }
}
