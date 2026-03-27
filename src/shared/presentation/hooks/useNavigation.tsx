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
  BarChart3,
  List
} from 'lucide-react';
import { MdAssignmentAdd, MdOutlineCable } from 'react-icons/md';
import { TiThList } from 'react-icons/ti';
import { TbClock24 } from 'react-icons/tb';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { FaEdit } from 'react-icons/fa';
import { IoMdPhotos } from 'react-icons/io';
import {
  IconAccounting,
  IconOverduePayments,
  IconPayments
} from '../components/icons/custom-icons';

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
      title: 'Conexiones',
      hideTitle: true,
      items: [
        {
          icon: <MdOutlineCable size={20} />,
          label: 'Conexiones',
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
      title: 'Contabilidad',
      hideTitle: true,
      items: [
        {
          icon: <IconAccounting size={20} />,
          label: 'Contabilidad',
          subItems: [
            {
              icon: <IconPayments size={18} />,
              label: 'Pagos',
              to: '/accounting'
            },
            {
              icon: <BarChart3 size={18} />,
              label: 'Reportes de Ingreso',
              to: '/accounting/entry-data'
            },
            {
              icon: <IconOverduePayments />,
              label: 'Cartera Vencida',
              to: '/accounting/overdue'
            }
          ]
        }
      ]
    },
    {
      title: 'Lecturas',
      hideTitle: true,
      items: [
        {
          icon: <TbClock24 size={20} />,
          label: 'Lecturas',
          subItems: [
            {
              icon: <MdAssignmentAdd size={18} />,
              label: 'Agregar Lectura',
              to: '/readings/add'
            },
            {
              icon: <IoMdPhotos size={18} />,
              label: 'Foto Lecturas',
              to: '/readings/images'
            },
            {
              icon: <TiThList size={18} />,
              label: 'Lecturas',
              to: '/readings/list'
            },
            {
              icon: <FaEdit size={18} />,
              label: 'Actualizar Lectura',
              to: '/readings/update'
            }
          ]
        }
      ]
    },
    {
      title: 'Recolección de Basura',
      hideTitle: true,
      items: [
        {
          icon: <TbClock24 size={20} />,
          label: 'Recolección de Basura',
          subItems: [
            {
              icon: <List size={18} />,
              label: 'Auditoría de Recolección',
              to: '/trash-rate/trash-report-audit'
            },
            {
              icon: <BarChart3 size={18} />,
              label: 'KPI de Recolección',
              to: '/trash-rate/trash-rate-kpi'
            }
          ]
        }
      ]
    },
    {
      title: 'Propiedades',
      hideTitle: true,
      items: [
        {
          icon: <Building2 size={20} />,
          label: 'Propiedades',
          subItems: [
            {
              icon: <TiThList size={18} />,
              label: 'List',
              to: '/properties/list'
            }
          ]
        }
      ]
    }
  ];

  return navSections;
};
