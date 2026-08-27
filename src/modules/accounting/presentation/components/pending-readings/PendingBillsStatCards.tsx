import React from 'react';
import { Droplets, Recycle, Building, FileText, Zap } from 'lucide-react';
import {
  type ConnectionSummary,
  formatCurrency,
  formatConsumption,
} from '../../hooks/pending-readings/usePendingBillsSummary';
import './PendingBillsStatCards.css';

interface PendingBillsStatCardsProps {
  summary: ConnectionSummary;
}

interface MiniStat {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;         // CSS color value
  accentBg: string;       // translucent background
  highlight?: boolean;
}

/**
 * Tarjetas compactas de resumen por acometida.
 * Diseño propio — no usa el componente StatCard compartido.
 */
export const PendingBillsStatCards: React.FC<PendingBillsStatCardsProps> = ({ summary }) => {
  const stats: MiniStat[] = [
    {
      icon: FileText,
      label: 'Total a Pagar',
      value: formatCurrency(summary.totalToPay),
      sub: `${summary.billCount} planilla${summary.billCount !== 1 ? 's' : ''}`,
      accent: '#f59e0b',
      accentBg: 'rgba(245,158,11,0.12)',
      highlight: true,
    },
    {
      icon: Droplets,
      label: 'EPAA – Agua',
      value: formatCurrency(summary.totalEpaa),
      sub: formatConsumption(summary.totalConsumption),
      accent: '#22d3ee',
      accentBg: 'rgba(34,211,238,0.10)',
    },
    {
      icon: Recycle,
      label: 'Tasa Basura',
      value: formatCurrency(summary.totalTrash),
      sub: 'Ajustado por tarifa',
      accent: '#4ade80',
      accentBg: 'rgba(74,222,128,0.10)',
    },
    {
      icon: Building,
      label: 'Mejoras',
      value: formatCurrency(summary.totalImprovements),
      sub: 'Contribución',
      accent: '#2dd4bf',
      accentBg: 'rgba(45,212,191,0.10)',
    },
    {
      icon: Zap,
      label: 'Sin Descuentos',
      value: formatCurrency(summary.totalGeneral),
      sub: 'Agua + Basura + Recargos',
      accent: '#fb923c',
      accentBg: 'rgba(251,146,60,0.10)',
    },
  ];

  return (
    <div className="pbs-mini-row">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className={`pbs-mini-card${s.highlight ? ' pbs-mini-card--hl' : ''}`}
            style={{
              background: s.accentBg,
              borderColor: `${s.accent}33`,
            }}
          >
            <div className="pbs-mini-icon" style={{ color: s.accent, background: `${s.accent}1a` }}>
              <Icon size={13} />
            </div>
            <div className="pbs-mini-body">
              <span className="pbs-mini-label">{s.label}</span>
              <span className="pbs-mini-value" style={{ color: s.accent }}>{s.value}</span>
              {s.sub && <span className="pbs-mini-sub">{s.sub}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
