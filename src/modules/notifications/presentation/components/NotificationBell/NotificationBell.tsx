/**
 * NotificationBell — header bell icon with floating notification panel
 *
 * Clean Architecture:
 *   - Domain:         Notification model (already defined)
 *   - Application:    Uses GetUnreadNotificationsUseCase, MarkAsReadUseCase,
 *                     MarkAllAsReadUseCase via NotificationsContext
 *   - Presentation:   This component — SRP: only renders the bell + panel
 *
 * SOLID:
 *   SRP  — bell open/close is in useNotificationBell; data in NotificationsContext
 *   OCP  — new panel sections can be added via children without changing core
 *   LSP  — NotificationsProvider wraps this; context is substitutable
 *   ISP  — only consumes the slices it needs from context
 *   DIP  — depends on abstractions (context hook), not concrete repositories
 */
import React, { useMemo } from 'react';
import { Bell, X, Maximize2, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Bell as BellIcon, Mail, MessageCircle, Smartphone, Wifi,
} from 'lucide-react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useNotificationsContext } from '../../context/NotificationsContext';
import { useNotificationBell, groupByDate } from '../../hooks/useNotificationBell';
import type { Notification, NotificationPriority } from '../../../domain/model/Notification';
import './NotificationBell.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';


// ── helpers ──────────────────────────────────────────────────────────────────

const CHANNEL_COLORS: Record<string, string> = {
  IN_APP: '#3b82f6',
  EMAIL: '#ea4335',
  SMS: '#10b981',
  PUSH: '#8b5cf6',
  WHATSAPP: '#25D366',
};

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  LOW: '#94a3b8',
  NORMAL: '#3b82f6',
  HIGH: '#f59e0b',
  URGENT: '#ef4444',
};

const ChannelIcon: React.FC<{ channel: string; color: string }> = ({ channel, color }) => {
  const p = { size: 17, color: '#fff' };
  const map: Record<string, React.ReactNode> = {
    IN_APP: <BellIcon {...p} />,
    EMAIL: <Mail {...p} />,
    SMS: <MessageCircle {...p} />,
    PUSH: <Smartphone {...p} />,
    WHATSAPP: <Wifi {...p} />,
  };
  return (
    <div className="notif-panel__item-icon" style={{ background: color }}>
      {map[channel] ?? <BellIcon {...p} />}
    </div>
  );
};

const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
};

const formatDateLabel = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-EC', { month: 'long', day: '2-digit', year: 'numeric' });
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRows: React.FC = () => (
  <>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="notif-panel__skeleton-row">
        <div className="notif-panel__skeleton-circle" />
        <div className="notif-panel__skeleton-lines">
          <div className="notif-panel__skeleton-line" style={{ width: '80%' }} />
          <div className="notif-panel__skeleton-line" style={{ width: '50%' }} />
        </div>
      </div>
    ))}
  </>
);

// ── Single item ───────────────────────────────────────────────────────────────
const PanelItem: React.FC<{
  n: Notification;
  onRead: (id: string) => void;
}> = ({ n, onRead }) => {
  const color = n.isRead
    ? (CHANNEL_COLORS[n.channel] ?? '#64748b')
    : (PRIORITY_COLORS[n.priority] ?? CHANNEL_COLORS[n.channel] ?? '#3b82f6');

  return (
    <div
      className={`notif-panel__item ${n.isRead ? 'notif-panel__item--read' : 'notif-panel__item--unread'}`}
      onClick={() => !n.isRead && onRead(n.notificationId)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && !n.isRead && onRead(n.notificationId)}
    >
      <ChannelIcon channel={n.channel} color={color} />
      <div className="notif-panel__item-content">
        <p className="notif-panel__item-title">{n.title}</p>
        <span className="notif-panel__item-time">
          {formatDateLabel(n.createdAt)} · {formatTime(n.createdAt)}
        </span>
      </div>
      {!n.isRead && <div className="notif-panel__item-dot" />}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const ctx = useNotificationsContext();
  const bell = useNotificationBell();
  const navigate = useNavigate();
  const userId = user?.userId ?? '';


  const displayed = bell.tab === 'unread'
    ? ctx.unreadNotifications
    : ctx.notifications;

  const groups = useMemo(() => groupByDate(displayed), [displayed]);

  const handleRead = (id: string) => ctx.markAsRead(id, userId);
  const handleReadAll = () => ctx.markAllAsRead(userId);

  const handleExpand = () => { bell.close(); navigate('/notifications'); };

  return (
    <div className="notif-bell">
      {/* ── Bell trigger ── */}
      <Tooltip content="Notificaciones" themeColor="info">
        <Button
          ref={bell.triggerRef}
          className={`notif-bell__btn ${bell.isOpen ? 'notif-bell__btn--active' : ''}`}
          onClick={bell.toggle}
          aria-label={`Notificaciones${ctx.unreadCount > 0 ? ` (${ctx.unreadCount} no leídas)` : ''}`}
          aria-expanded={bell.isOpen}
          aria-haspopup="true"
        >
          <Bell size={20} />
        </Button>
      </Tooltip>
      {ctx.unreadCount > 0 && (
        <span className="notif-bell__badge">
          {ctx.unreadCount > 9 ? '9+' : ctx.unreadCount}
        </span>
      )}

      {/* ── Floating panel ── */}
      {bell.isOpen && (
        <div
          ref={bell.panelRef}
          className="notif-panel"
          role="dialog"
          aria-label="Panel de notificaciones"
        >
          {/* Header */}
          <div className="notif-panel__head">
            <div className="notif-panel__head-top">
              <h2 className="notif-panel__title">Notificaciones</h2>
              <div className="notif-panel__head-actions">
                <Button
                  className="notif-panel__icon-btn"
                  onClick={handleExpand}
                  title="Ver todas"
                  aria-label="Abrir página de notificaciones"
                >
                  <Maximize2 size={15} />
                </Button>
                <Button
                  className="notif-panel__icon-btn"
                  onClick={bell.close}
                  title="Cerrar"
                  aria-label="Cerrar panel"
                >
                  <X size={15} />
                </Button>
              </div>
            </div>
            <p className="notif-panel__subtitle">
              Mantente al día con tus últimas notificaciones
            </p>
          </div>

          {/* Toolbar: tabs + mark all */}
          <div className="notif-panel__toolbar">
            <div className="notif-panel__tabs" role="tablist">
              {(['all', 'unread'] as const).map((t) => (
                <Button
                  key={t}
                  role="tab"
                  aria-selected={bell.tab === t}
                  className={`notif-panel__tab ${bell.tab === t ? 'notif-panel__tab--active' : ''}`}
                  onClick={() => bell.setTab(t)}
                >
                  {t === 'all'
                    ? 'Todas'
                    : `No leídas${ctx.unreadCount > 0 ? ` (${ctx.unreadCount})` : ''}`}
                </Button>
              ))}
            </div>
            <Button
              className="notif-panel__mark-all"
              onClick={handleReadAll}
              disabled={ctx.unreadCount === 0}
              aria-label="Marcar todas como leídas"
            >
              <CheckCheck size={13} /> Marcar todo
            </Button>
          </div>

          {/* Body */}
          <div className="notif-panel__body">
            {ctx.isLoading ? (
              <SkeletonRows />
            ) : groups.length === 0 ? (
              <div className="notif-panel__empty">
                <div className="notif-panel__empty-icon">
                  <Bell size={24} color="var(--text-muted)" />
                </div>
                <p className="notif-panel__empty-text">Sin notificaciones</p>
              </div>
            ) : (
              groups.map(({ label, items }) => (
                <div key={label}>
                  <div className="notif-panel__group-label">{label}</div>
                  {items.map((n) => (
                    <PanelItem key={n.notificationId} n={n} onRead={handleRead} />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="notif-panel__footer">
            <Button
              className="notif-panel__footer-link"
              onClick={handleExpand}
            >
              Ver todas las notificaciones →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
