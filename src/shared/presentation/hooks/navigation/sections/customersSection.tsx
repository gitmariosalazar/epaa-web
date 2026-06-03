import { User, Users, Building2 } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getCustomersSection = (t: any): NavSection => ({
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
});
