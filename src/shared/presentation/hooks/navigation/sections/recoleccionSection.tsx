import { TbClock24 } from 'react-icons/tb';
import { List, BarChart3 } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getRecoleccionSection = (): NavSection => ({
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
});
