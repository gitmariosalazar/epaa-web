import { MdOutlineCable } from 'react-icons/md';
import { TiThList } from 'react-icons/ti';
import { BarChart3, LayoutDashboard, ShieldAlert, Map } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getCatastrosSection = (t: any): NavSection => ({
  title: 'Actualizacion de Catastros',
  hideTitle: true,
  items: [
    {
      icon: <MdOutlineCable size={20} />,
      label: 'Actualizacion de Catastros',
      subItems: [
        {
          icon: <TiThList size={18} />,
          label: t('sidebar.connectionsList', 'Lista de Acometidas'),
          to: '/connections/list'
        },
        {
          icon: <BarChart3 size={18} />,
          label: t('sidebar.connectionsMap', 'Mapa de Acometidas'),
          to: '/connections/map'
        },
        {
          icon: <LayoutDashboard size={18} />,
          label: t('sidebar.connectionsDashboard', 'Dashboard de Avance'),
          to: '/connections/dashboard'
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

