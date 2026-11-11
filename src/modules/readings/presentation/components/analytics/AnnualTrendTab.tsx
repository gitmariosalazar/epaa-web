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

interface AnnualTrendTabProps {
  data: AnnualTrendAnalytics[] | null;
  isLoading: boolean;
}

export const AnnualTrendTab: React.FC<AnnualTrendTabProps> = ({
  data,
  isLoading
}) => {
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
    const totalBilled = data.reduce((acc, curr) => acc + curr.totalBilledUsd, 0);
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
          <span
            style={{ fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}
          >
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
          <span style={{ fontWeight: 700, color: '#059669' }}>
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
      },
      {
        id: 'effectiveAverageTariffUsdPerM3',
        header: 'Tarifa Media ($/m³)',
        accessor: (item) => `$${item.effectiveAverageTariffUsdPerM3.toFixed(4)}`,
        isNumeric: true
      },
      ...(data?.some((d) => d.totalCollectedUsd !== undefined)
        ? ([
            {
              id: 'totalCollectedUsd',
              header: 'Cobrado ($)',
              accessor: (item: AnnualTrendAnalytics) => (
                <span style={{ fontWeight: 600, color: '#059669' }}>
                  {formatCurrency(item.totalCollectedUsd ?? 0)}
                </span>
              ),
              isNumeric: true
            },
            {
              id: 'totalPendingDebtUsd',
              header: 'Pendiente ($)',
              accessor: (item: AnnualTrendAnalytics) => (
                <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                  {formatCurrency(item.totalPendingDebtUsd ?? 0)}
                </span>
              ),
              isNumeric: true
            },
            {
              id: 'totalOverdueDebtUsd',
              header: 'En Mora ($)',
              accessor: (item: AnnualTrendAnalytics) => (
                <span style={{ fontWeight: 600, color: '#dc2626' }}>
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
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: isGood
                        ? '#dcfce7'
                        : isWarning
                          ? '#fef3c7'
                          : '#fee2e2',
                      color: isGood
                        ? '#166534'
                        : isWarning
                          ? '#b45309'
                          : '#991b1b',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
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
      data.length > 1 ? lastItem.totalBilledUsd - firstItem.totalBilledUsd : null;
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}
      >
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* KPI Highlights */}
      {kpis && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem'
          }}
        >
          <div className="analytics-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669' }}>
                <DollarSign size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                Facturación Total Histórica
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {formatCurrency(kpis.totalBilled)}
            </div>
            <div style={{ fontSize: '0.78rem', color: kpis.netRevenueGrowth >= 0 ? '#10b981' : '#ef4444', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {kpis.netRevenueGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{formatPercent(kpis.netRevenueGrowth)} crecimiento neto ({kpis.firstYear} → {kpis.lastYear})</span>
            </div>
          </div>

          <div className="analytics-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Droplets size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                Volumen Total Suministrado
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {formatVolume(kpis.totalVolume)}
            </div>
            <div style={{ fontSize: '0.78rem', color: kpis.netVolumeGrowth >= 0 ? '#10b981' : '#ef4444', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {kpis.netVolumeGrowth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{formatPercent(kpis.netVolumeGrowth)} variación de consumo ({kpis.firstYear} → {kpis.lastYear})</span>
            </div>
          </div>

          <div className="analytics-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <CheckCircle2 size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                Recaudación Cobrada
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>
              {formatCurrency(kpis.totalCollected)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
              Eficiencia global: <strong>{formatPercent(kpis.overallCollectionEfficiency)}</strong>
            </div>
          </div>

          <div className="analytics-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#fffbeb', color: '#d97706' }}>
                <Activity size={20} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                Cartera Pendiente
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>
              {formatCurrency(kpis.totalPending)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
              Saldo no liquidado en el periodo analizado
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="analytics-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <TrendingUp size={18} color="var(--primary-color, #2563eb)" />
          <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary, #0f172a)' }}>
            Evolución Multianual de Facturación, Recaudación y Volumen Suministrado
          </h4>
        </div>

        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="anio" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis
                yAxisId="left"
                stroke="#059669"
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#2563eb"
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k m³`}
                tick={{ fontSize: 11 }}
              />
              <RechartsTooltip
                formatter={(value: any, name: any) => {
                  if (name === 'Facturado Total' || name === 'Recaudado Cobrado')
                    return [formatCurrency(Number(value)), name];
                  if (name === 'Volumen Consumido')
                    return [formatVolume(Number(value)), name];
                  return [formatNumber(Number(value)), name];
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                yAxisId="left"
                dataKey="facturado"
                name="Facturado Total"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                yAxisId="left"
                dataKey="cobrado"
                name="Recaudado Cobrado"
                fill="#059669"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volumen"
                name="Volumen Consumido"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5, fill: '#2563eb' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="analytics-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary, #0f172a)' }}>
              Matriz Consolidada de Crecimiento y Desempeño Interanual
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Auditoría histórica con desglose de acometidas, consumos m³, facturación agua/tasas, recaudación y eficiencia de cobranza.
            </p>
          </div>
        </div>

        <Table<AnnualTrendAnalytics>
          columns={columns}
          data={data}
          totalRows={totalRows}
          pagination={false}
          width="100"
        />
      </div>
    </div>
  );
};
