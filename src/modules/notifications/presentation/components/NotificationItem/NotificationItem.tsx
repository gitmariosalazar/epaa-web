/**
 * NotificationItem — single notification row
 * SRP: only renders one notification row.
 */
import React, { useCallback } from 'react';
import {
  Bell, Mail, MessageCircle, Smartphone, Wifi,
} from 'lucide-react';

import type { Notification, NotificationPriority } from '../../../domain/model/Notification';
import './NotificationItem.css';

// ── helpers ────────────────────────────────────────────────────────────────

const CHANNEL_COLORS: Record<string, string> = {
  IN_APP:   '#3b82f6',
  EMAIL:    '#ea4335',
  SMS:      '#10b981',
  PUSH:     '#8b5cf6',
  WHATSAPP: '#25D366',
};

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  LOW:    '#94a3b8',
  NORMAL: '#3b82f6',
  HIGH:   '#f59e0b',
  URGENT: '#ef4444',
};

const ChannelIcon: React.FC<{ channel: string; color: string }> = ({ channel, color }) => {
  const props = { size: 20, color: '#fff' };
  const icons: Record<string, React.ReactNode> = {
    IN_APP:   <Bell {...props} />,
    EMAIL:    <Mail {...props} />,
    SMS:      <MessageCircle {...props} />,
    PUSH:     <Smartphone {...props} />,
    WHATSAPP: <Wifi {...props} />,
  };
  return (
    <div className="notif-item__icon" style={{ background: color }}>
      {icons[channel] ?? <Bell {...props} />}
    </div>
  );
};

/** Formats createdAt relative to now (e.g. "24m ago", "2h ago") */
const formatRelativeTime = (date: Date | string): string => {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1)  return 'Ahora';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)   return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
};

// ── Component ─────────────────────────────────────────────────────────────

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const color = notification.isRead
    ? CHANNEL_COLORS[notification.channel] ?? '#64748b'
    : (PRIORITY_COLORS[notification.priority] ?? CHANNEL_COLORS[notification.channel] ?? '#3b82f6');

  const handleClick = useCallback(() => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.notificationId);
    }
  }, [notification, onMarkAsRead]);

  return (
    <div
      className={`notif-item ${notification.isRead ? 'notif-item--read' : 'notif-item--unread'}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={notification.title}
    >
      <ChannelIcon channel={notification.channel} color={color} />

      <div className="notif-item__content">
        <h4 className="notif-item__title">{notification.title}</h4>
        <p className="notif-item__body">{notification.body}</p>
      </div>

      <div className="notif-item__meta">
        <span className="notif-item__time">
          {formatRelativeTime(notification.createdAt)}
        </span>
        <span className={`notif-item__dot ${notification.isRead ? 'notif-item__dot--read' : ''}`} />
      </div>
    </div>
  );
};
