/**
 * NotificationList — scrollable list of NotificationItem rows
 * SRP: only renders a list or empty/loading states.
 */
import React from 'react';
import { Bell } from 'lucide-react';
import type { Notification } from '../../../domain/model/Notification';
import { NotificationItem } from '../NotificationItem/NotificationItem';
import './NotificationList.css';

// ── Skeleton ──────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <div className="notif-skeleton">
    <div className="notif-skeleton__circle" />
    <div className="notif-skeleton__lines">
      <div className="notif-skeleton__line notif-skeleton__line--long" />
      <div className="notif-skeleton__line notif-skeleton__line--short" />
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────

export interface NotificationListProps {
  items: Notification[];
  isLoading: boolean;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  items,
  isLoading,
  onMarkAsRead,
}) => {
  if (isLoading) {
    return (
      <div className="notif-list" role="status" aria-label="Cargando notificaciones">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="notif-list">
        <div className="notif-list__empty">
          <div className="notif-list__empty-icon">
            <Bell size={28} />
          </div>
          <p className="notif-list__empty-title">Sin notificaciones</p>
          <p className="notif-list__empty-desc">
            Cuando tengas nuevas notificaciones aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="notif-list" role="list" aria-label="Notificaciones">
      {items.map((n) => (
        <NotificationItem
          key={n.notificationId}
          notification={n}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};
