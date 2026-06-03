/**
 * useNotifications — presentation hook
 * Bridges the NotificationsContext to page-level concerns:
 *  - tab filtering (all | unread)
 *  - channel / priority filter
 *  - sort order (recent | oldest)
 * SRP: only orchestrates UI state, no business logic.
 */
import { useMemo, useState } from 'react';
import { useNotificationsContext } from '../context/NotificationsContext';
import type { Notification, NotificationChannel, NotificationPriority } from '../../domain/model/Notification';

export type NotificationTab  = 'all' | 'unread';
export type SortOrder        = 'recent' | 'oldest';

export interface NotificationFilter {
  channel:  NotificationChannel | '';
  priority: NotificationPriority | '';
}

export interface UseNotificationsReturn {
  // Data
  items:        Notification[];
  unreadCount:  number;
  isLoading:    boolean;
  error:        string | null;
  // Tab
  tab:          NotificationTab;
  setTab:       (t: NotificationTab) => void;
  // Sort
  sortOrder:    SortOrder;
  setSortOrder: (s: SortOrder) => void;
  // Filter
  filter:       NotificationFilter;
  setFilter:    (f: NotificationFilter) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  // Actions
  markAsRead:   (id: string, userId: string) => Promise<void>;
  markAllAsRead:(userId: string) => Promise<void>;
  refresh:      (userId: string) => Promise<void>;
}

const DEFAULT_FILTER: NotificationFilter = { channel: '', priority: '' };

export const useNotifications = (): UseNotificationsReturn => {
  const ctx = useNotificationsContext();

  const [tab, setTab]             = useState<NotificationTab>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [filter, setFilter]       = useState<NotificationFilter>(DEFAULT_FILTER);

  const activeFilterCount = [filter.channel, filter.priority].filter(Boolean).length;
  const clearFilters = () => setFilter(DEFAULT_FILTER);

  const items = useMemo<Notification[]>(() => {
    let list = tab === 'unread' ? ctx.unreadNotifications : ctx.notifications;

    if (filter.channel)  list = list.filter((n) => n.channel  === filter.channel);
    if (filter.priority) list = list.filter((n) => n.priority === filter.priority);

    return [...list].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'recent' ? db - da : da - db;
    });
  }, [ctx.notifications, ctx.unreadNotifications, tab, filter, sortOrder]);

  return {
    items,
    unreadCount:       ctx.unreadCount,
    isLoading:         ctx.isLoading,
    error:             ctx.error,
    tab,       setTab,
    sortOrder, setSortOrder,
    filter,    setFilter,
    activeFilterCount, clearFilters,
    markAsRead:    ctx.markAsRead,
    markAllAsRead: ctx.markAllAsRead,
    refresh:       ctx.refresh,
  };
};
