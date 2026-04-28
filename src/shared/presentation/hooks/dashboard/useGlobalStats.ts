import { useMemo } from 'react';
import type { GlobalStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import {
  Activity,
  Droplet,
  MapPin,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { MdCable } from 'react-icons/md';
import { TbListNumbers } from 'react-icons/tb';

interface UseGlobalStatsProps {
  stats: GlobalStatsReport | null;
}

export const useGlobalStats = ({ stats }: UseGlobalStatsProps) => {
  const cards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: 'Lecturas Totales',
        value: stats.totalReadings,
        icon: FileText,
        desc: 'Lecturas asociadas este mes',
        color: 'icon-blue'
      },
      {
        title: 'Promedio de Lecturas/Día',
        value: Number(stats.averageReadingsPerDay).toFixed(2),
        icon: Activity,
        desc: 'Promedio de lecturas procesadas diariamente',
        color: 'icon-green'
      },
      {
        title: 'Consumo Total',
        value: `${Number(stats.totalConsumption).toFixed(2)} m³`,
        icon: Droplet,
        desc: 'Volumen de consumo de agua',
        color: 'icon-cyan'
      },
      {
        title: 'Ingreso Total',
        value: `$${Number(stats.totalReadingValue).toFixed(2)}`,
        icon: TrendingUp,
        desc: 'Valor total de la lectura calculada',
        color: 'icon-yellow'
      },
      {
        title: 'Tasa Alcantarillado',
        value: `$${Number(stats.totalSewerRate).toFixed(2)}`,
        icon: AlertCircle,
        desc: 'Total de la tasa de alcantarillado cobrada',
        color: 'icon-indigo'
      },
      {
        title: 'Sectores Activos',
        value: stats.uniqueSectors,
        icon: MapPin,
        desc: 'Sectores únicos monitoreados',
        color: 'icon-red'
      },
      {
        title: 'Acometidas Completadas',
        value: stats.uniqueConnections,
        icon: MdCable,
        desc: 'Acometidas únicas',
        color: 'icon-green'
      },
      {
        title: 'Total de Acometidas',
        value: stats.totalConnections,
        icon: TbListNumbers,
        desc: 'Total de acometidas',
        color: 'icon-purple'
      }
    ];
  }, [stats]);

  return { cards };
};
