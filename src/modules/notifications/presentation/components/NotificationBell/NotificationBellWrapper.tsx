/**
 * NotificationBellWrapper
 * Provides the NotificationsContext to the NotificationBell.
 * DIP: Header depends on this abstraction, not on the concrete repository.
 * The userId comes from AuthContext internally — Header stays clean.
 */
import React from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { NotificationsProvider } from '../../context/NotificationsContext';
import { NotificationBell } from './NotificationBell';

export const NotificationBellWrapper: React.FC = () => {
  const { user } = useAuth();

  // If not logged in, render nothing
  if (!user?.userId) return null;

  return (
    <NotificationsProvider userId={user.userId} pollInterval={60_000}>
      <NotificationBell />
    </NotificationsProvider>
  );
};
