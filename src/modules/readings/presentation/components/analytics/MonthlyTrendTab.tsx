import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { MonthlyTrendAnalytics } from '../../../domain/models/readings-analytics';
import {
  Table,
  type Column,
  type TotalRow
} from '@/shared/presentation/components/Table/Table';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatVolume
} from '../../utils/analytics-formatters';

interface MonthlyTrendTabProps {
  data: MonthlyTrendAnalytics[] | null;
  isLoading: boolean;
}

export const MonthlyTrendTab: React.FC<MonthlyTrendTabProps> = ({
  data,
  isLoading
}) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      periodo: item.monthName || item.readingMonth || `Mes ${item.monthNumber}`,
      facturado: item.totalBilledUsd,
      volumen: item.totalVolumeM3
    }));
  }, [data]);

  const columns: Column<MonthlyTrendAnalytics>[] = useMemo(
    () => [
      {
        id: 'period',
        header: 'Mes / Periodo',
        accessor: (item) => (
          <span
            style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}
          >
            {item.monthName || item.readingMonth || `Mes ${item.monthNumber}`}
          </span>
        )
      },
      {
        id: 'totalReadings',
        header: 'Lecturas',
        accessor: (item) => formatNumber(item.totalReadings),
        isNumeric: true
      },
      {
        id: 'totalVolumeM3',
        header: 'Volumen',
        accessor: (item) => formatVolume(item.totalVolumeM3),
        isNumeric: true
      },
      {
        id: 'deltaVolumeM3',
        header: 'Δ Volumen (m³)',
        accessor: (item) => {
          if (item.deltaVolumeM3 === null || item.deltaVolumeM3 === undefined)
            return '-';
          const isPos = item.deltaVolumeM3 >= 0;
          return (
            <span
              style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 600 }}
            >
              {isPos ? '+' : ''}
              {formatVolume(item.deltaVolumeM3)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        id: 'growthVolumePercentage',
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
                gap: '2px'
              }}
            >
              {isPos ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {formatPercent(item.growthVolumePercentage)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        id: 'totalBilledUsd',
        header: 'Total Facturado ($)',
        accessor: (item) => (
          <span style={{ fontWeight: 700, color: '#059669' }}>
            {formatCurrency(item.totalBilledUsd)}
          </span>
        ),
        isNumeric: true
      },
      ...(data?.some((d) => d.totalCollectedUsd !== undefined)
        ? ([
            {
              id: 'totalCollectedUsd',
              header: 'Cobrado ($)',
              accessor: (item: MonthlyTrendAnalytics) => (
                <span style={{ fontWeight: 600, color: '#059669' }}>
                  {formatCurrency(item.totalCollectedUsd ?? 0)}
                </span>
              ),
              isNumeric: true
            },
            {
              id: 'totalOverdueDebtUsd',
              header: 'En Mora ($)',
              accessor: (item: MonthlyTrendAnalytics) => (
                <span style={{ fontWeight: 600, color: '#dc2626' }}>
                  {formatCurrency(item.totalOverdueDebtUsd ?? 0)}
                </span>
              ),
              isNumeric: true
            }
          ] as Column<MonthlyTrendAnalytics>[])
        : []),
      {
        id: 'deltaRevenueUsd',
        header: 'Δ Facturación ($)',
        accessor: (item) => {
          if (
            item.deltaRevenueUsd === null ||
            item.deltaRevenueUsd === undefined
          )
            return '-';
          const isPos = item.deltaRevenueUsd >= 0;
          return (
            <span
              style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 600 }}
            >
              {isPos ? '+' : ''}
              {formatCurrency(item.deltaRevenueUsd)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        id: 'growthRevenuePercentage',
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
                gap: '2px'
              }}
            >
              {isPos ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {formatPercent(item.growthRevenuePercentage)}
            </span>
          );
        },
        isNumeric: true
      }
    ],
    [data]
  );

  const totalRows: TotalRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const totalReadings = data.reduce(
      (acc, curr) => acc + curr.totalReadings,
      0
    );
    const totalVolume = data.reduce((acc, curr) => acc + curr.totalVolumeM3, 0);
    const totalBilled = data.reduce(
      (acc, curr) => acc + curr.totalBilledUsd,
      0
    );
    const totalCollected = data.reduce(
      (acc, curr) => acc + (curr.totalCollectedUsd ?? 0),
      0
    );
    const totalOverdue = data.reduce(
      (acc, curr) => acc + (curr.totalOverdueDebtUsd ?? 0),
      0
    );

    const firstItem = data[0];
    const lastItem = data[data.length - 1];
    const netDeltaVolume =
      data.length > 1 && firstItem && lastItem
        ? lastItem.totalVolumeM3 - firstItem.totalVolumeM3
        : null;
    const netGrowthVolume =
      netDeltaVolume !== null && firstItem.totalVolumeM3 > 0
        ? (netDeltaVolume / firstItem.totalVolumeM3) * 100
        : null;
    const netDeltaRevenue =
      data.length > 1 && firstItem && lastItem
        ? lastItem.totalBilledUsd - firstItem.totalBilledUsd
        : null;
    const netGrowthRevenue =
      netDeltaRevenue !== null && firstItem.totalBilledUsd > 0
        ? (netDeltaRevenue / firstItem.totalBilledUsd) * 100
        : null;

    const rows: TotalRow[] = [
      { columnId: 'period', label: 'Mes / Periodo', value: 'TOTAL ACUMULADO' },
      {
        columnId: 'totalReadings',
        label: 'Lecturas',
        value: formatNumber(totalReadings)
      },
      {
        columnId: 'totalVolumeM3',
        label: 'Volumen',
        value: formatVolume(totalVolume)
      },
      {
        columnId: 'deltaVolumeM3',
        label: 'Δ Volumen (m³)',
        value:
          netDeltaVolume !== null
            ? `${netDeltaVolume >= 0 ? '+' : ''}${formatVolume(netDeltaVolume)}`
            : '-'
      },
      {
        columnId: 'growthVolumePercentage',
        label: '% Crec. m³',
        value: netGrowthVolume !== null ? formatPercent(netGrowthVolume) : '-'
      },
      {
        columnId: 'totalBilledUsd',
        label: 'Total Facturado ($)',
        value: formatCurrency(totalBilled),
        highlight: true
      }
    ];

    if (data.some((d) => d.totalCollectedUsd !== undefined)) {
      rows.push({
        columnId: 'totalCollectedUsd',
        label: 'Cobrado ($)',
        value: formatCurrency(totalCollected)
      });
    }
    if (data.some((d) => d.totalOverdueDebtUsd !== undefined)) {
      rows.push({
        columnId: 'totalOverdueDebtUsd',
        label: 'En Mora ($)',
        value: formatCurrency(totalOverdue)
      });
    }

    rows.push(
      {
        columnId: 'deltaRevenueUsd',
        label: 'Δ Facturación ($)',
        value:
          netDeltaRevenue !== null
            ? `${netDeltaRevenue >= 0 ? '+' : ''}${formatCurrency(netDeltaRevenue)}`
            : '-'
      },
      {
        columnId: 'growthRevenuePercentage',
        label: '% Crec. USD',
        value: netGrowthRevenue !== null ? formatPercent(netGrowthRevenue) : '-'
      }
    );

    return rows;
  }, [data]);

  if (isLoading) {
    return (
      <div className="circular-progress">
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
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
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
                  name
                ]}
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontSize: '13px' }}
                itemStyle={{ fontSize: '13px' }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="facturado"
                stroke="var(--primary-color, #2563eb)"
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
          totalRows={totalRows}
          pagination={false}
          width="100"
        />
      </div>
    </div>
  );
};
