import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Droplets,
  DollarSign,
  Activity
} from 'lucide-react';
import type { AnnualTrendAnalytics } from '../../../domain/models/readings-analytics';
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
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import '../../styles/AnnualTrendTab.css';

interface AnnualTrendTabProps {
  data: AnnualTrendAnalytics[] | null;
  isLoading: boolean;
}

export const AnnualTrendTab: React.FC<AnnualTrendTabProps> = ({
  data,
  isLoading
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      anio: String(item.year),
      facturado: item.totalBilledUsd,
      cobrado: item.totalCollectedUsd ?? 0,
      volumen: item.totalVolumeM3,
      acometidas: item.totalActiveConnections
    }));
  }, [data]);

  const kpis = useMemo(() => {
    if (!data || data.length === 0) return null;
    const totalVolume = data.reduce((acc, curr) => acc + curr.totalVolumeM3, 0);
    const totalBilled = data.reduce(
      (acc, curr) => acc + curr.totalBilledUsd,
      0
    );
    const totalCollected = data.reduce(
      (acc, curr) => acc + (curr.totalCollectedUsd ?? 0),
      0
    );
    const totalPending = data.reduce(
      (acc, curr) => acc + (curr.totalPendingDebtUsd ?? 0),
      0
    );

    const firstItem = data[0];
    const lastItem = data[data.length - 1];

    const netVolumeGrowth =
      data.length > 1 && firstItem.totalVolumeM3 > 0
        ? ((lastItem.totalVolumeM3 - firstItem.totalVolumeM3) /
            firstItem.totalVolumeM3) *
          100
        : 0;

    const netRevenueGrowth =
      data.length > 1 && firstItem.totalBilledUsd > 0
        ? ((lastItem.totalBilledUsd - firstItem.totalBilledUsd) /
            firstItem.totalBilledUsd) *
          100
        : 0;

    const overallCollectionEfficiency =
      totalCollected + totalPending > 0
        ? (totalCollected / (totalCollected + totalPending)) * 100
        : 0;

    return {
      totalVolume,
      totalBilled,
      totalCollected,
      totalPending,
      netVolumeGrowth,
      netRevenueGrowth,
      overallCollectionEfficiency,
      firstYear: firstItem.year,
      lastYear: lastItem.year
    };
  }, [data]);

  const columns: Column<AnnualTrendAnalytics>[] = useMemo(
    () => [
      {
        id: 'year',
        header: 'Año / Periodo',
        accessor: (item) => (
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {item.year}
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
        id: 'totalActiveConnections',
        header: 'Acometidas Activas',
        accessor: (item) => formatNumber(item.totalActiveConnections),
        isNumeric: true
      },
      {
        id: 'totalVolumeM3',
        header: 'Volumen (m³)',
        accessor: (item) => formatVolume(item.totalVolumeM3),
        isNumeric: true
      },
      {
        id: 'averageConsumptionPerAccountM3',
        header: 'Prom. m³/cta',
        accessor: (item) => formatVolume(item.averageConsumptionPerAccountM3),
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
              className={
                isPos ? 'annual-trend-growth--pos' : 'annual-trend-growth--neg'
              }
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
              className={
                isPos ? 'annual-trend-growth--pos' : 'annual-trend-growth--neg'
              }
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
        id: 'waterBilledUsd',
        header: 'Agua ($)',
        accessor: (item) => formatCurrency(item.waterBilledUsd),
        isNumeric: true
      },
      {
        id: 'sewerBilledUsd',
        header: 'Alcantarillado ($)',
        accessor: (item) => formatCurrency(item.sewerBilledUsd),
        isNumeric: true
      },
      {
        id: 'totalBilledUsd',
        header: 'Total Facturado ($)',
        accessor: (item) => (
          <span className="annual-trend-text-billed">
            {formatCurrency(item.totalBilledUsd)}
          </span>
        ),
        isNumeric: true
      },
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
              className={
                isPos ? 'annual-trend-growth--pos' : 'annual-trend-growth--neg'
              }
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
              className={
                isPos ? 'annual-trend-growth--pos' : 'annual-trend-growth--neg'
              }
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
      },
      {
        id: 'effectiveAverageTariffUsdPerM3',
        header: 'Tarifa Media ($/m³)',
        accessor: (item) =>
          `$${item.effectiveAverageTariffUsdPerM3.toFixed(4)}`,
        isNumeric: true
      },
      ...(data?.some((d) => d.totalCollectedUsd !== undefined)
        ? ([
            {
              id: 'totalCollectedUsd',
              header: 'Cobrado ($)',
              accessor: (item: AnnualTrendAnalytics) => (
                <span className="annual-trend-text-collected">
                  {formatCurrency(item.totalCollectedUsd ?? 0)}
                </span>
              ),
              isNumeric: true
            },
            {
              id: 'totalPendingDebtUsd',
              header: 'Pendiente ($)',
              accessor: (item: AnnualTrendAnalytics) => (
                <span className="annual-trend-text-pending">
                  {formatCurrency(item.totalPendingDebtUsd ?? 0)}
                </span>
              ),
              isNumeric: true
            },
            {
              id: 'totalOverdueDebtUsd',
              header: 'En Mora ($)',
              accessor: (item: AnnualTrendAnalytics) => (
                <span className="annual-trend-text-overdue">
                  {formatCurrency(item.totalOverdueDebtUsd ?? 0)}
                </span>
              ),
              isNumeric: true
            },
            {
              id: 'collectionEfficiencyPercentage',
              header: 'Efic. Recaudación',
              accessor: (item: AnnualTrendAnalytics) => {
                if (
                  item.collectionEfficiencyPercentage === null ||
                  item.collectionEfficiencyPercentage === undefined
                )
                  return '-';
                const eff = item.collectionEfficiencyPercentage;
                const isGood = eff >= 80;
                const isWarning = eff >= 50 && eff < 80;
                return (
                  <span
                    className={`annual-trend-badge ${
                      isGood
                        ? 'annual-trend-badge--good'
                        : isWarning
                          ? 'annual-trend-badge--warning'
                          : 'annual-trend-badge--danger'
                    }`}
                  >
                    {isGood ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <AlertCircle size={12} />
                    )}
                    {formatPercent(eff)}
                  </span>
                );
              },
              isNumeric: true
            }
          ] as Column<AnnualTrendAnalytics>[])
        : [])
    ],
    [data]
  );

  const totalRows: TotalRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    const totalReadings = data.reduce(
      (acc, curr) => acc + curr.totalReadings,
      0
    );
    const totalConnectionsLatest = data[data.length - 1].totalActiveConnections;
    const totalVolume = data.reduce((acc, curr) => acc + curr.totalVolumeM3, 0);
    const avgConsumption =
      totalConnectionsLatest > 0
        ? totalVolume / (data.length * totalConnectionsLatest)
        : 0;
    const totalWater = data.reduce((acc, curr) => acc + curr.waterBilledUsd, 0);
    const totalSewer = data.reduce((acc, curr) => acc + curr.sewerBilledUsd, 0);
    const totalBilled = data.reduce(
      (acc, curr) => acc + curr.totalBilledUsd,
      0
    );
    const totalCollected = data.reduce(
      (acc, curr) => acc + (curr.totalCollectedUsd ?? 0),
      0
    );
    const totalPending = data.reduce(
      (acc, curr) => acc + (curr.totalPendingDebtUsd ?? 0),
      0
    );
    const totalOverdue = data.reduce(
      (acc, curr) => acc + (curr.totalOverdueDebtUsd ?? 0),
      0
    );

    const firstItem = data[0];
    const lastItem = data[data.length - 1];
    const netDeltaVolume =
      data.length > 1 ? lastItem.totalVolumeM3 - firstItem.totalVolumeM3 : null;
    const netGrowthVolume =
      netDeltaVolume !== null && firstItem.totalVolumeM3 > 0
        ? (netDeltaVolume / firstItem.totalVolumeM3) * 100
        : null;
    const netDeltaRevenue =
      data.length > 1
        ? lastItem.totalBilledUsd - firstItem.totalBilledUsd
        : null;
    const netGrowthRevenue =
      netDeltaRevenue !== null && firstItem.totalBilledUsd > 0
        ? (netDeltaRevenue / firstItem.totalBilledUsd) * 100
        : null;

    const overallTariff = totalVolume > 0 ? totalWater / totalVolume : 0;
    const overallEfficiency =
      totalCollected + totalPending > 0
        ? (totalCollected / (totalCollected + totalPending)) * 100
        : null;

    const rows: TotalRow[] = [
      { columnId: 'year', label: 'Año / Periodo', value: 'TOTAL / ACUMULADO' },
      {
        columnId: 'totalReadings',
        label: 'Lecturas',
        value: formatNumber(totalReadings)
      },
      {
        columnId: 'totalActiveConnections',
        label: 'Acometidas Activas',
        value: formatNumber(totalConnectionsLatest)
      },
      {
        columnId: 'totalVolumeM3',
        label: 'Volumen (m³)',
        value: formatVolume(totalVolume)
      },
      {
        columnId: 'averageConsumptionPerAccountM3',
        label: 'Prom. m³/cta',
        value: formatVolume(avgConsumption)
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
        columnId: 'waterBilledUsd',
        label: 'Agua ($)',
        value: formatCurrency(totalWater)
      },
      {
        columnId: 'sewerBilledUsd',
        label: 'Alcantarillado ($)',
        value: formatCurrency(totalSewer)
      },
      {
        columnId: 'totalBilledUsd',
        label: 'Total Facturado ($)',
        value: formatCurrency(totalBilled),
        highlight: true
      },
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
      },
      {
        columnId: 'effectiveAverageTariffUsdPerM3',
        label: 'Tarifa Media ($/m³)',
        value: `$${overallTariff.toFixed(4)}`
      }
    ];

    if (data.some((d) => d.totalCollectedUsd !== undefined)) {
      rows.push({
        columnId: 'totalCollectedUsd',
        label: 'Cobrado ($)',
        value: formatCurrency(totalCollected)
      });
      rows.push({
        columnId: 'totalPendingDebtUsd',
        label: 'Pendiente ($)',
        value: formatCurrency(totalPending)
      });
      rows.push({
        columnId: 'totalOverdueDebtUsd',
        label: 'En Mora ($)',
        value: formatCurrency(totalOverdue)
      });
      rows.push({
        columnId: 'collectionEfficiencyPercentage',
        label: 'Efic. Recaudación',
        value:
          overallEfficiency !== null ? formatPercent(overallEfficiency) : '-'
      });
    }

    return rows;
  }, [data]);

  if (isLoading) {
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message="No hay datos multianuales disponibles"
        description="Ajusta el rango de años o los filtros para visualizar la serie histórica de consumos y recaudación."
      />
    );
  }

  return (
    <div className="annual-trend-container">
      {/* KPI Highlights */}
      {kpis && (
        <div className="annual-trend-kpi-grid">
          {/* Facturación Total */}
          <div className="annual-trend-kpi-card">
            <div className="annual-trend-kpi-header">
              <div className="annual-trend-icon-wrapper annual-trend-icon-wrapper--billed">
                <DollarSign size={20} />
              </div>
              <span className="annual-trend-kpi-title">
                Facturación Total Histórica
              </span>
            </div>
            <div className="annual-trend-kpi-value">
              {formatCurrency(kpis.totalBilled)}
            </div>
            <div className="annual-trend-kpi-footer">
              <span
                className={
                  kpis.netRevenueGrowth >= 0
                    ? 'annual-trend-growth--pos'
                    : 'annual-trend-growth--neg'
                }
              >
                {kpis.netRevenueGrowth >= 0 ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {formatPercent(kpis.netRevenueGrowth)}
              </span>
              <span>
                crecimiento neto ({kpis.firstYear} → {kpis.lastYear})
              </span>
            </div>
          </div>

          {/* Volumen Total */}
          <div className="annual-trend-kpi-card">
            <div className="annual-trend-kpi-header">
              <div className="annual-trend-icon-wrapper annual-trend-icon-wrapper--volume">
                <Droplets size={20} />
              </div>
              <span className="annual-trend-kpi-title">
                Volumen Total Suministrado
              </span>
            </div>
            <div className="annual-trend-kpi-value">
              {formatVolume(kpis.totalVolume)}
            </div>
            <div className="annual-trend-kpi-footer">
              <span
                className={
                  kpis.netVolumeGrowth >= 0
                    ? 'annual-trend-growth--pos'
                    : 'annual-trend-growth--neg'
                }
              >
                {kpis.netVolumeGrowth >= 0 ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {formatPercent(kpis.netVolumeGrowth)}
              </span>
              <span>
                variación de consumo ({kpis.firstYear} → {kpis.lastYear})
              </span>
            </div>
          </div>

          {/* Recaudación Cobrada */}
          <div className="annual-trend-kpi-card">
            <div className="annual-trend-kpi-header">
              <div className="annual-trend-icon-wrapper annual-trend-icon-wrapper--collected">
                <CheckCircle2 size={20} />
              </div>
              <span className="annual-trend-kpi-title">
                Recaudación Cobrada
              </span>
            </div>
            <div className="annual-trend-kpi-value annual-trend-kpi-value--collected">
              {formatCurrency(kpis.totalCollected)}
            </div>
            <div className="annual-trend-kpi-footer">
              <span>Eficiencia global:</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {formatPercent(kpis.overallCollectionEfficiency)}
              </strong>
            </div>
          </div>

          {/* Cartera Pendiente */}
          <div className="annual-trend-kpi-card">
            <div className="annual-trend-kpi-header">
              <div className="annual-trend-icon-wrapper annual-trend-icon-wrapper--pending">
                <Activity size={20} />
              </div>
              <span className="annual-trend-kpi-title">Cartera Pendiente</span>
            </div>
            <div className="annual-trend-kpi-value annual-trend-kpi-value--pending">
              {formatCurrency(kpis.totalPending)}
            </div>
            <div className="annual-trend-kpi-footer">
              <span>Saldo no liquidado en el periodo analizado</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <h4 className="analytics-card-title">
            <TrendingUp size={18} color="var(--primary-color, #2563eb)" />
            Evolución Multianual de Facturación, Recaudación y Volumen
            Suministrado
          </h4>
          <span className="analytics-card-badge">Histórico Anual</span>
        </div>

        <div style={{ width: '100%', height: '350px', marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#334155' : '#e2e8f0'}
                opacity={isDark ? 0.6 : 0.8}
              />
              <XAxis
                dataKey="anio"
                stroke={isDark ? '#475569' : '#cbd5e1'}
                tick={{
                  fill: isDark ? '#94a3b8' : '#64748b',
                  fontSize: 12,
                  fontWeight: 600
                }}
              />
              <YAxis
                yAxisId="left"
                stroke={isDark ? '#10b981' : '#059669'}
                tickFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={isDark ? '#3b82f6' : '#2563eb'}
                tickFormatter={(val: number) =>
                  `${(val / 1000).toFixed(0)}k m³`
                }
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              />
              <RechartsTooltip
                formatter={(value: unknown, name: unknown) => {
                  const strName = String(name ?? '');
                  const numVal = Number(value ?? 0);
                  if (
                    strName === 'Facturado Total' ||
                    strName === 'Recaudado Cobrado'
                  ) {
                    return [formatCurrency(numVal), strName];
                  }
                  if (strName === 'Volumen Consumido') {
                    return [formatVolume(numVal), strName];
                  }
                  return [formatNumber(numVal), strName];
                }}
                contentStyle={{
                  backgroundColor: 'var(--surface)', // o var(--bg-card) según tu CSS
                  borderColor: 'var(--border-color)',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{
                  color: 'hsl(var(--foreground))',
                  fontWeight: 600,
                  marginBottom: '4px'
                }}
                itemStyle={{
                  fontSize: '13px'
                }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  color: isDark ? '#cbd5e1' : '#475569',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="facturado"
                name="Facturado Total"
                fill={isDark ? '#f59e0b' : '#d97706'}
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                yAxisId="left"
                dataKey="cobrado"
                name="Recaudado Cobrado"
                fill={isDark ? '#10b981' : '#059669'}
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volumen"
                name="Volumen Consumido"
                stroke={isDark ? '#60a5fa' : '#2563eb'}
                strokeWidth={3}
                dot={{ r: 5, fill: isDark ? '#60a5fa' : '#2563eb' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <div>
            <h4 className="analytics-card-title">
              <Activity size={18} color="var(--primary-color, #2563eb)" />
              Matriz Consolidada de Crecimiento y Desempeño Interanual
            </h4>
            <p className="annual-trend-subtitle">
              Auditoría histórica con desglose de acometidas, consumos m³,
              facturación agua/tasas, recaudación y eficiencia de cobranza.
            </p>
          </div>
          <span className="analytics-card-badge">
            {data.length} {data.length === 1 ? 'Año' : 'Años'}
          </span>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Table<AnnualTrendAnalytics>
            columns={columns}
            data={data}
            totalRows={totalRows}
            pagination={false}
            width="100"
          />
        </div>
      </div>
    </div>
  );
};
