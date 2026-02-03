import React from 'react';
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
interface GlobalStatsProps {
  stats: GlobalStatsReport | null;
  loading: boolean;
}

export const GlobalStats: React.FC<GlobalStatsProps> = ({ stats, loading }) => {
  if (loading) return <div className="p-4">Loading Global Stats...</div>;
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Readings',
      value: stats.totalReadings,
      icon: <FileText size={20} />,
      desc: 'Readings associated this month',
      color: 'icon-blue'
    },
    {
      title: 'Avg Readings/Day',
      value: Number(stats.averageReadingsPerDay).toFixed(2),
      icon: <Activity size={20} />,
      desc: 'Average readings processed daily',
      color: 'icon-green'
    },
    {
      title: 'Total Consumption',
      value: `${Number(stats.totalConsumption).toFixed(2)} m³`,
      icon: <Droplet size={20} />,
      desc: 'Water consumption volume',
      color: 'icon-cyan'
    },
    {
      title: 'Total Revenue',
      value: `$${Number(stats.totalReadingValue).toFixed(2)}`,
      icon: <TrendingUp size={20} />,
      desc: 'Total reading value calculated',
      color: 'icon-yellow'
    },
    {
      title: 'Tasa Alcantarillado',
      value: `$${Number(stats.totalSewerRate).toFixed(2)}`,
      icon: <AlertCircle size={20} />,
      desc: 'Total sewer rate collected',
      color: 'icon-indigo'
    },
    {
      title: 'Active Sectors',
      value: stats.uniqueSectors,
      icon: <MapPin size={20} />,
      desc: 'Unique sectors monitored',
      color: 'icon-red'
    },
    {
      title: 'Connections Completed',
      value: stats.uniqueConnections,
      icon: <MdCable size={20} />,
      desc: 'Unique meters/connections',
      color: 'icon-green'
    },
    {
      title: 'Total Connections',
      value: stats.totalConnections,
      icon: <TbListNumbers size={20} />,
      desc: 'Total connections',
      color: 'icon-purple'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="stat-card">
          <div className={`stat-icon-wrapper ${card.color}`}>{card.icon}</div>
          <div className="stat-content">
            <p className="stat-title">{card.title}</p>
            <h3>{card.value}</h3>
            <p className="stat-desc">{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
