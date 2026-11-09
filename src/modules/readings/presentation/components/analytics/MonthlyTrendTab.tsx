import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { MonthlyTrendAnalytics } from '../../../domain/models/readings-analytics';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatVolume,
} from '../../utils/analytics-formatters';

interface MonthlyTrendTabProps {
  data: MonthlyTrendAnalytics[] | null;
  isLoading: boolean;
}

export const MonthlyTrendTab: React.FC<MonthlyTrendTabProps> = ({
  data,
  isLoading,
}) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      periodo: item.monthName || item.readingMonth || `Mes ${item.monthNumber}`,
      facturado: item.totalBilledUsd,
      volumen: item.totalVolumeM3,
    }));
  }, [data]);

  const columns: Column<MonthlyTrendAnalytics>[] = useMemo(
    () => [
      {
        header: 'Mes / Periodo',
        accessor: (item) => (
          <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
            {item.monthName || item.readingMonth || `Mes ${item.monthNumber}`}
          </span>
        ),
      },
      {
        header: 'Lecturas',
        accessor: (item) => formatNumber(item.totalReadings),
        isNumeric: true,
      },
      {
        header: 'Volumen',
        accessor: (item) => formatVolume(item.totalVolumeM3),
        isNumeric: true,
      },
      {
        header: 'Δ Volumen (m³)',
        accessor: (item) => {
          if (item.deltaVolumeM3 === null || item.deltaVolumeM3 === undefined) return '-';
          const isPos = item.deltaVolumeM3 >= 0;
          return (
            <span style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {isPos ? '+' : ''}
              {formatVolume(item.deltaVolumeM3)}
            </span>
          );
        },
        isNumeric: true,
      },
      {
        header: '% Crec. m³',
        accessor: (item) => {
          if (
            item.growthVolumePercentage === null ||
            item.growthVolumePercentage === undefined
          )
            return '-';
          const isPos = item.growthVolumePercentage >= 0;
          return (
            <span
              style={{
                color: isPos ? '#10b981' : '#ef4444',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              {isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {formatPercent(item.growthVolumePercentage)}
            </span>
          );
        },
        isNumeric: true,
      },
      {
        header: 'Total Facturado ($)',
        accessor: (item) => (
          <span style={{ fontWeight: 700, color: '#059669' }}>
            {formatCurrency(item.totalBilledUsd)}
          </span>
        ),
        isNumeric: true,
      },
      {
        header: 'Δ Facturación ($)',
        accessor: (item) => {
          if (item.deltaRevenueUsd === null || item.deltaRevenueUsd === undefined) return '-';
          const isPos = item.deltaRevenueUsd >= 0;
          return (
            <span style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {isPos ? '+' : ''}
              {formatCurrency(item.deltaRevenueUsd)}
            </span>
          );
        },
        isNumeric: true,
      },
      {
        header: '% Crec. USD',
        accessor: (item) => {
          if (
            item.growthRevenuePercentage === null ||
            item.growthRevenuePercentage === undefined
          )
            return '-';
          const isPos = item.growthRevenuePercentage >= 0;
          return (
            <span
              style={{
                color: isPos ? '#10b981' : '#ef4444',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              {isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {formatPercent(item.growthRevenuePercentage)}
            </span>
          );
        },
        isNumeric: true,
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '350px',
        }}
      >
        <CircularProgress size={40} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message="Sin registros históricos"
        description="No se encontró serie histórica de tendencia mensual para los parámetros seleccionados."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Chart Section */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <h4 className="analytics-card-title">
            <TrendingUp size={18} color="var(--primary-color, #2563eb)" />
            Evolución Intermensual de Facturación ($) y Volumen (m³)
          </h4>
          <span className="analytics-card-badge">Dinámica MoM</span>
        </div>
        <div className="analytics-chart-wrapper" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorFacturado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="periodo" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                formatter={(value: any, name: string) => [
                  name === 'Facturado Total ($)'
                    ? formatCurrency(Number(value))
                    : formatVolume(Number(value)),
                  name,
                ]}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="facturado"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#colorFacturado)"
                name="Facturado Total ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Table */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <h4 className="analytics-card-title">
            <Calendar size={18} color="var(--primary-color, #2563eb)" />
            Detalle Intermensual de Crecimiento y Variaciones (MoM)
          </h4>
          <span className="analytics-card-badge">{data.length} Periodos</span>
        </div>
        <Table<MonthlyTrendAnalytics>
          data={data}
          columns={columns}
          pagination={false}
          width="100"
        />
      </div>
    </div>
  );
};
