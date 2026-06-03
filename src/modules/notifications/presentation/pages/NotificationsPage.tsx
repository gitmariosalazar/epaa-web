/**
 * NotificationsPage
 * Orchestrates the notification inbox UI.
 * SRP: only composes components — no business logic.
 * OCP: adding new filter types requires no changes here, only in the hook.
 */
import React, { useEffect } from 'react';
import { CheckCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { Button } from '@/shared/presentation/components/Button/Button';
import { NotificationsProvider } from '../context/NotificationsContext';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationToolbar } from '../components/NotificationToolbar/NotificationToolbar';
import { NotificationList } from '../components/NotificationList/NotificationList';
import './NotificationsPage.css';

// ── Inner page (must be inside provider) ─────────────────────────────────────

const NotificationsInner: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    items, unreadCount, isLoading, error,
    tab, setTab,
    sortOrder, setSortOrder,
    filter, setFilter, activeFilterCount, clearFilters,
    markAsRead, markAllAsRead, refresh,
  } = useNotifications();

  useEffect(() => { refresh(userId); }, [userId, refresh]);

  const handleMarkAsRead = (id: string) => markAsRead(id, userId);
  const handleMarkAll    = () => markAllAsRead(userId);

  return (
    <div className="notif-page">
      {/* Header */}
      <div className="notif-page__header">
        <div className="notif-page__title-row">
          <h1 className="notif-page__title">Notificaciones</h1>
          {unreadCount > 0 && (
            <span className="notif-page__badge">{unreadCount}</span>
          )}
        </div>
        <Button
          variant="outline"
          size="compact"
          leftIcon={<CheckCheck size={15} />}
          onClick={handleMarkAll}
          disabled={unreadCount === 0 || isLoading}
          aria-label="Marcar todas como leídas"
        >
          Marcar todo como leído
        </Button>
      </div>

      {/* Card */}
      <div className="notif-page__card">
        {/* Error */}
        {error && (
          <div className="notif-page__error" role="alert">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Toolbar — fully functional */}
        <NotificationToolbar
          tab={tab}
          onTabChange={setTab}
          unreadCount={unreadCount}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          filter={filter}
          onFilterChange={setFilter}
          activeFilterCount={activeFilterCount}
          onClearFilters={clearFilters}
        />

        {/* List */}
        <NotificationList
          items={items}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </div>
  );
};

// ── Public page ───────────────────────────────────────────────────────────────

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  if (!user?.userId) return null;

  return (
    <NotificationsProvider userId={user.userId} pollInterval={60_000}>
      <NotificationsInner userId={user.userId} />
    </NotificationsProvider>
  );
};
