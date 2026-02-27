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
  Lock,
  Receipt,
  BarChart3
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
        }
      ]
    },
    {
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
            }
          ]
        }
      ]
    },
    {
      title: t('sidebar.customers'),
      hideTitle: true,
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
      title: 'Connections',
      hideTitle: true,
      items: [
        {
          icon: <MdOutlineCable size={20} />,
          label: 'Connections',
          subItems: [
            {
              icon: <TiThList size={18} />,
              label: 'List',
              to: '/connections'
            }
          ]
        }
      ]
    },
    {
      title: 'Accounting',
      hideTitle: true,
      items: [
        {
          icon: <Receipt size={20} />,
          label: 'Contabilidad',
          subItems: [
            {
              icon: <Receipt size={18} />,
              label: 'Pagos',
              to: '/accounting'
            },
            {
              icon: <BarChart3 size={18} />,
              label: 'Reportes de Ingreso',
              to: '/accounting/entry-data'
            }
          ]
        }
      ]
    },
    {
      title: 'Readings',
      hideTitle: true,
      items: [
        {
          icon: <TbClock24 size={20} />,
          label: 'Readings',
          subItems: [
            {
              icon: <MdAssignmentAdd size={18} />,
              label: 'Add Reading',
              to: '/readings/add'
            },
            {
              icon: <TiThList size={18} />,
              label: 'Foto Lecturas',
              to: '/readings/photo'
            },
            {
              icon: <TiThList size={18} />,
              label: 'List',
              to: '/readings'
            }
          ]
        }
      ]
    }
  ];

  return navSections;
};
