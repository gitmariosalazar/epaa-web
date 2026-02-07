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
        title: 'Total Readings',
        value: stats.totalReadings,
        icon: FileText,
        desc: 'Readings associated this month',
        color: 'icon-blue'
      },
      {
        title: 'Avg Readings/Day',
        value: Number(stats.averageReadingsPerDay).toFixed(2),
        icon: Activity,
        desc: 'Average readings processed daily',
        color: 'icon-green'
      },
      {
        title: 'Total Consumption',
        value: `${Number(stats.totalConsumption).toFixed(2)} m³`,
        icon: Droplet,
        desc: 'Water consumption volume',
        color: 'icon-cyan'
      },
      {
        title: 'Total Revenue',
        value: `$${Number(stats.totalReadingValue).toFixed(2)}`,
        icon: TrendingUp,
        desc: 'Total reading value calculated',
        color: 'icon-yellow'
      },
      {
        title: 'Tasa Alcantarillado',
        value: `$${Number(stats.totalSewerRate).toFixed(2)}`,
        icon: AlertCircle,
        desc: 'Total sewer rate collected',
        color: 'icon-indigo'
      },
      {
        title: 'Active Sectors',
        value: stats.uniqueSectors,
        icon: MapPin,
        desc: 'Unique sectors monitored',
        color: 'icon-red'
      },
      {
        title: 'Connections Completed',
        value: stats.uniqueConnections,
        icon: MdCable,
        desc: 'Unique meters/connections',
        color: 'icon-green'
      },
      {
        title: 'Total Connections',
        value: stats.totalConnections,
        icon: TbListNumbers,
        desc: 'Total connections',
        color: 'icon-purple'
      }
    ];
  }, [stats]);

  return { cards };
};
