/**
 * NotificationsContext
 * Provides notification state and actions to the whole app tree.
 * OCP: new use cases can be added without modifying consumers.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Notification, SendNotificationDto } from '../../domain/model/Notification';
import { NotificationRepositoryImpl } from '../../infrastructure/repositories/NotificationRepositoryImpl';
import { GetAllNotificationsUseCase } from '../../application/usecases/GetAllNotificationsUseCase';
import { GetUnreadNotificationsUseCase } from '../../application/usecases/GetUnreadNotificationsUseCase';
import { GetUnreadCountUseCase } from '../../application/usecases/GetUnreadCountUseCase';
import { MarkAsReadUseCase } from '../../application/usecases/MarkAsReadUseCase';
import { MarkAllAsReadUseCase } from '../../application/usecases/MarkAllAsReadUseCase';
import { SendNotificationUseCase } from '../../application/usecases/SendNotificationUseCase';

// ── DI: compose use-cases once ───────────────────────────────────────────────
const repo          = new NotificationRepositoryImpl();
const getAllUC       = new GetAllNotificationsUseCase(repo);
const getUnreadUC   = new GetUnreadNotificationsUseCase(repo);
const getCountUC    = new GetUnreadCountUseCase(repo);
const markReadUC    = new MarkAsReadUseCase(repo);
const markAllReadUC = new MarkAllAsReadUseCase(repo);
const sendUC        = new SendNotificationUseCase(repo);

// ── Context shape ─────────────────────────────────────────────────────────────
export interface NotificationsContextValue {
  /** All notifications (inbox) */
  notifications: Notification[];
  /** Unread-only subset */
  unreadNotifications: Notification[];
  /** Badge count */
  unreadCount: number;
  /** Loading / error states */
  isLoading: boolean;
  error: string | null;
  /** Actions */
  refresh(userId: string): Promise<void>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  send(dto: SendNotificationDto): Promise<string>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────────────
export const NotificationsProvider: React.FC<{
  userId?: string;
  /** Poll interval in ms (0 = disabled) */
  pollInterval?: number;
  children: React.ReactNode;
}> = ({ userId, pollInterval = 0, children }) => {
  const [notifications, setNotifications]       = useState<Notification[]>([]);
  const [unreadNotifications, setUnread]        = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount]           = useState(0);
  const [isLoading, setIsLoading]               = useState(false);
  const [error, setError]                       = useState<string | null>(null);
  const intervalRef                             = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async (uid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [all, unread, count] = await Promise.all([
        getAllUC.execute(uid),
        getUnreadUC.execute(uid),
        getCountUC.execute(uid),
      ]);
      setNotifications(all);
      setUnread(unread);
      setUnreadCount(count.unreadCount);
    } catch (err: any) {
      setError(err?.message ?? 'Error al cargar notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + optional polling
  useEffect(() => {
    if (!userId) return;
    refresh(userId);
    if (pollInterval > 0) {
      intervalRef.current = setInterval(() => refresh(userId), pollInterval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, pollInterval, refresh]);

  const markAsRead = useCallback(async (notificationId: string, uid: string) => {
    await markReadUC.execute(notificationId, uid);
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => n.notificationId === notificationId ? { ...n, isRead: true } : n),
    );
    setUnread((prev) => prev.filter((n) => n.notificationId !== notificationId));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async (uid: string) => {
    await markAllReadUC.execute(uid);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread([]);
    setUnreadCount(0);
  }, []);

  const send = useCallback(async (dto: SendNotificationDto): Promise<string> => {
    return sendUC.execute(dto);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadNotifications, unreadCount, isLoading, error, refresh, markAsRead, markAllAsRead, send }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export const useNotificationsContext = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used inside NotificationsProvider');
  return ctx;
};
