import { Lock, Users, Shield, CheckCircle, Settings, FileText } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getAdministrationSection = (t: any): NavSection => ({
  title: t('sidebar.administration'),
  hideTitle: true,
  items: [
    {
      icon: <Lock size={20} />,
      label: t('sidebar.security'),
      subItems: [
        {
          icon: <Users size={18} />,
          label: t('sidebar.users'),
          to: '/users'
        },
        {
          icon: <Shield size={18} />,
          label: t('sidebar.roles'),
          to: '/roles'
        },
        {
          icon: <CheckCircle size={18} />,
          label: t('sidebar.permissions'),
          to: '/permissions'
        },
        {
          icon: <Settings size={18} />,
          label: t('sidebar.settings'),
          to: '/settings'
        },
        {
          icon: <FileText size={18} />,
          label: t('sidebar.audit', 'Auditoría'),
          to: '/audit'
        }
      ]
    }
  ]
});
