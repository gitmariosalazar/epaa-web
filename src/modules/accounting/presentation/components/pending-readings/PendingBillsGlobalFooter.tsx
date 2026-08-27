import React from 'react';
import { Droplets, Recycle, Building, Hash, DollarSign, Gauge } from 'lucide-react';
import {
  type GlobalSummary,
  formatCurrency,
  formatConsumption,
} from '../../hooks/pending-readings/usePendingBillsSummary';
import './PendingBillsGlobalFooter.css';

interface PendingBillsGlobalFooterProps {
  summary: GlobalSummary;
}

interface GlobalItem {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
  highlight?: boolean;
}

/**
 * Footer de totales globales — todas las acometidas.
 * Diseño propio compacto, renderizado DENTRO del pending-bill-card.
 */
export const PendingBillsGlobalFooter: React.FC<PendingBillsGlobalFooterProps> = ({ summary }) => {
  const items: GlobalItem[] = [
    {
      icon: Hash,
      label: 'Acometidas',
      value: `${summary.totalConnections} (${summary.totalBills} planillas)`,
      accent: '#a78bfa',
    },
    {
      icon: Droplets,
      label: 'EPAA Global',
      value: `${formatCurrency(summary.totalEpaa)} · ${formatConsumption(summary.totalConsumption)}`,
      accent: '#22d3ee',
    },
    {
      icon: Recycle,
      label: 'Basura Global',
      value: formatCurrency(summary.totalTrash),
      accent: '#4ade80',
    },
    {
      icon: Building,
      label: 'Mejoras Global',
      value: formatCurrency(summary.totalImprovements),
      accent: '#2dd4bf',
    },
    {
      icon: Gauge,
      label: 'Sin Descuentos',
      value: formatCurrency(summary.totalGeneral),
      accent: '#fb923c',
    },
    {
      icon: DollarSign,
      label: 'TOTAL GLOBAL',
      value: formatCurrency(summary.totalToPay),
      accent: '#f59e0b',
      highlight: true,
    },
  ];

  return (
    <div className="pbgf-wrap">
      <div className="pbgf-title">
        <span className="pbgf-title-dot" />
        Totales Globales — Todas las Acometidas
      </div>
      <div className="pbgf-row">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`pbgf-chip${item.highlight ? ' pbgf-chip--hl' : ''}`}
              style={{
                borderColor: `${item.accent}44`,
                background: `${item.accent}0f`,
              }}
            >
              <span className="pbgf-chip-icon" style={{ color: item.accent, background: `${item.accent}22` }}>
                <Icon size={12} />
              </span>
              <div className="pbgf-chip-body">
                <span className="pbgf-chip-label">{item.label}</span>
                <span className="pbgf-chip-value" style={{ color: item.accent }}>
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
