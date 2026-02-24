import { useTranslation } from 'react-i18next';
import {
  Users,
  Shield,
  LayoutDashboard,
  Settings,
  FileText,
  CheckCircle,
  User,
  Building2,
  Lock
} from 'lucide-react';
import { MdAssignmentAdd, MdOutlineCable } from 'react-icons/md';
import { TiThList } from 'react-icons/ti';
import { TbClock24 } from 'react-icons/tb';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const useNavigation = (): NavSection[] => {
  const { t } = useTranslation();

  const navSections: NavSection[] = [
    {
      title: t('sidebar.general'),
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
        }
      ]
    },
    {
      title: t('sidebar.administration'),
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
            }
          ]
        }
      ]
    },
    {
      title: t('sidebar.customers'),
      items: [
        {
          icon: <User size={20} />,
          label: t('sidebar.customers'),
          subItems: [
            {
              icon: <User size={18} />,
              label: t('sidebar.naturalPersons'),
              to: '/customers/natural-persons'
            },
            {
              icon: <Building2 size={18} />,
              label: t('sidebar.companies'),
              to: '/customers/companies'
            },
            {
              icon: <Users size={18} />,
              label: t('sidebar.generalCustomers'),
              to: '/customers/general'
            }
          ]
        }
      ]
    },
    {
      title: 'Connections', // TODO: Add translation key 'sidebar.connections'
      items: [
        {
          icon: <MdOutlineCable size={20} />,
          label: 'Connections', // TODO: Add translation key 'sidebar.connections'
          subItems: [
            {
              icon: <TiThList size={18} />,
              label: 'List', // TODO: Add translation key 'sidebar.list'
              to: '/connections'
            }
          ]
        }
      ]
    },
    {
      title: 'Readings', // TODO: Add translation key 'sidebar.readings'
      items: [
        {
          icon: <TbClock24 size={20} />,
          label: 'Readings', // TODO: Add translation key 'sidebar.readings'
          subItems: [
            {
              icon: <MdAssignmentAdd size={18} />,
              label: 'Add Reading', // TODO: Add translation key 'sidebar.addReading'
              to: '/readings/add'
            },
            {
              icon: <TiThList size={18} />,
              label: 'Foto Lecturas', // TODO: Add translation key 'sidebar.list'
              to: '/readings/photo'
            },
            {
              icon: <TiThList size={18} />,
              label: 'List', // TODO: Add translation key 'sidebar.list'
              to: '/readings'
            }
          ]
        }
      ]
    }
  ];

  return navSections;
};
