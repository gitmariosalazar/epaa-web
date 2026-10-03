import { ShieldAlert, Map, LayoutDashboard } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { TbAlertOctagonFilled } from 'react-icons/tb';

export const getIncidentsSection = (t: any): NavSection => ({
  title: 'Reportes e Incidentes',
  hideTitle: true,
  items: [
    {
      icon: <TbAlertOctagonFilled size={20} />,
      label: 'Reportes e Incidentes',
      subItems: [
        {
          icon: <LayoutDashboard size={18} />,
          label: t('sidebar.incidentsDashboard', 'Dashboard de incidentes'),
          to: '/incidents/dashboard'
        },
        {
          icon: <ShieldAlert size={18} />,
          label: t('sidebar.incidentsList', 'Gestión de Incidentes'),
          to: '/incidents/list'
        },
        {
          icon: <Map size={18} />,
          label: t('sidebar.incidentsMap', 'Mapa de Incidencias'),
          to: '/incidents/map'
        }
      ]
    }
  ]
});

