export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export interface UnreadCount {
  userId: string;
  unreadCount: number;
}

export interface SendNotificationDto {
  userId: string;
  title: string;
  body: string;
  channel?: string;
  priority?: NotificationPriority;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}


export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
