import { Building2 } from 'lucide-react';
import { TiThList } from 'react-icons/ti';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getPropiedadesSection = (t: any): NavSection => ({
  title: 'Propiedades',
  hideTitle: true,
  items: [
    {
      icon: <Building2 size={20} />,
      label: 'Propiedades',
      subItems: [
        {
          icon: <TiThList size={18} />,
          label: t('sidebar.propertyList', 'Lista de Propiedades'),
          to: '/properties/list'
        }
      ]
    }
  ]
});
