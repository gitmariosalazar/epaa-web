/**
 * NotificationRepository — Domain contract
 * Defines every operation the infrastructure must implement.
 * ISP: each caller only depends on the methods it needs.
 */
import type {
  Notification,
  SendNotificationDto,
  UnreadCount,
} from '../model/Notification';

export interface NotificationRepository {
  /** GET /notifications/unread — campanita */
  findUnreadByUserId(userId: string, limit?: number, offset?: number): Promise<Notification[]>;

  /** GET /notifications/all — bandeja completa */
  findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Notification[]>;

  /** GET /notifications/count — badge numérico */
  countUnread(userId: string): Promise<UnreadCount>;

  /** PATCH /notifications/:id/read — marcar una como leída */
  markAsRead(notificationId: string, userId: string): Promise<boolean>;

  /** PATCH /notifications/read-all — marcar todas como leídas */
  markAllAsRead(userId: string): Promise<number>;

  /** POST /notifications/send — enviar notificación */
  send(dto: SendNotificationDto): Promise<string>;
}