import { LayoutDashboard, FileText, Bell } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getGeneralSection = (t: any): NavSection => ({
  title: t('sidebar.general'),
  hideTitle: true,
  items: [
    {
      icon: <LayoutDashboard size={20} />,
      label: t('sidebar.dashboard'),
      to: '/'
    },
    {
      icon: <FileText size={20} />,
      label: t('sidebar.reports'),
      to: '/reports'
    },
    {
      icon: <Bell size={20} />,
      label: 'Notificaciones',
      to: '/notifications'
    }
  ]
});
