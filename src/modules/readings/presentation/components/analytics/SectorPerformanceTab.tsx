import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';
import type { SectorPerformanceAnalytics } from '../../../domain/models/readings-analytics';
import {
  Table,
  type Column,
  type SummaryRow,
  type TotalRow
} from '@/shared/presentation/components/Table/Table';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  formatCurrency,
  formatNumber,
  formatVolume
} from '../../utils/analytics-formatters';

interface SectorPerformanceTabProps {
  data: SectorPerformanceAnalytics[] | null;
  isLoading: boolean;
}

export const SectorPerformanceTab: React.FC<SectorPerformanceTabProps> = ({
  data,
  isLoading
}) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data]
      .sort((a, b) => a.sector - b.sector)
      .map((item) => ({
        sector: `Sec ${item.sector}`,
        facturado: item.totalBilledUsd,
        volumen: item.consumedVolumeM3
      }));
  }, [data]);

  const columns: Column<SectorPerformanceAnalytics>[] = useMemo(
    () => [
      {
        id: 'sector',
        header: 'Sector',
        accessor: (item) => (
          <span
            style={{ fontWeight: 700, color: 'var(--primary-color, #2563eb)' }}
          >
            Sector {item.sector}
          </span>
        ),
        sortable: true,
        sortKey: 'sector'
      },
      {
        id: 'totalReadings',
        header: 'Lecturas',
        accessor: (item) => formatNumber(item.totalReadings),
        sortable: true,
        sortKey: 'totalReadings',
        isNumeric: true
      },
      {
        id: 'consumedVolumeM3',
        header: 'Volumen',
        accessor: (item) => formatVolume(item.consumedVolumeM3),
        sortable: true,
        sortKey: 'consumedVolumeM3',
        isNumeric: true
      },
      {
        id: 'averageConsumptionM3',
        header: 'Promedio m³',
        accessor: (item) =>
          `${item.averageConsumptionM3?.toFixed(2) ?? '0.00'} m³`,
        sortable: true,
        sortKey: 'averageConsumptionM3',
        isNumeric: true
      },
      {
        id: 'waterBilledUsd',
        header: 'Agua ($)',
        accessor: (item) => formatCurrency(item.waterBilledUsd),
        sortable: true,
        sortKey: 'waterBilledUsd',
        isNumeric: true
      },
      {
        id: 'sewerBilledUsd',
        header: 'Alcantarillado ($)',
        accessor: (item) => formatCurrency(item.sewerBilledUsd),
        sortable: true,
        sortKey: 'sewerBilledUsd',
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
        sortable: true,
        sortKey: 'totalBilledUsd',
        isNumeric: true
      },
      ...(data?.some((d) => d.totalCollectedUsd !== undefined)
        ? ([
            {
              id: 'totalCollectedUsd',
              header: 'Cobrado ($)',
              accessor: (item: SectorPerformanceAnalytics) => (
                <span style={{ fontWeight: 600, color: '#059669' }}>
                  {formatCurrency(item.totalCollectedUsd ?? 0)}
                </span>
              ),
              sortable: true,
              sortKey: 'totalCollectedUsd' as keyof SectorPerformanceAnalytics,
              isNumeric: true
            },
            {
              id: 'totalOverdueDebtUsd',
              header: 'En Mora ($)',
              accessor: (item: SectorPerformanceAnalytics) => (
                <span style={{ fontWeight: 600, color: '#dc2626' }}>
                  {formatCurrency(item.totalOverdueDebtUsd ?? 0)}
                </span>
              ),
              sortable: true,
              sortKey:
                'totalOverdueDebtUsd' as keyof SectorPerformanceAnalytics,
              isNumeric: true
            }
          ] as Column<SectorPerformanceAnalytics>[])
        : []),
      {
        id: 'revenueSharePercentage',
        header: '% Cuota USD',
        accessor: (item) =>
          `${item.revenueSharePercentage?.toFixed(2) ?? '0.00'}%`,
        sortable: true,
        sortKey: 'revenueSharePercentage',
        isNumeric: true
      },
      {
        id: 'volumeSharePercentage',
        header: '% Cuota m³',
        accessor: (item) =>
          `${item.volumeSharePercentage?.toFixed(2) ?? '0.00'}%`,
        sortable: true,
        sortKey: 'volumeSharePercentage',
        isNumeric: true
      },
      {
        id: 'averageTariffUsdPerM3',
        header: 'Tarifa Media ($/m³)',
        accessor: (item) =>
          `$${item.averageTariffUsdPerM3?.toFixed(3) ?? '0.000'}`,
        sortable: true,
        sortKey: 'averageTariffUsdPerM3',
        isNumeric: true
      },
      {
        id: 'noveltiesCount',
        header: 'Novedades',
        accessor: (item) => (
          <span>
            {formatNumber(item.noveltiesCount)}{' '}
            <small style={{ color: 'var(--text-secondary, #64748b)' }}>
              ({item.noveltyPercentage?.toFixed(1) ?? '0.0'}%)
            </small>
          </span>
        ),
        sortable: true,
        sortKey: 'noveltiesCount',
        isNumeric: true
      },
      {
        id: 'revenueRank',
        header: 'Rank USD',
        accessor: (item) => `#${item.revenueRank}`,
        sortable: true,
        sortKey: 'revenueRank',
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
    const totalVolume = data.reduce(
      (acc, curr) => acc + curr.consumedVolumeM3,
      0
    );
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
    const totalOverdue = data.reduce(
      (acc, curr) => acc + (curr.totalOverdueDebtUsd ?? 0),
      0
    );
    const totalNovelties = data.reduce(
      (acc, curr) => acc + curr.noveltiesCount,
      0
    );
    const avgConsumption = totalReadings > 0 ? totalVolume / totalReadings : 0;
    const avgTariff =
      totalVolume > 0 ? (totalWater + totalSewer) / totalVolume : 0;

    const rows: TotalRow[] = [
      { columnId: 'sector', label: 'Sector', value: 'TOTAL' },
      {
        columnId: 'totalReadings',
        label: 'Lecturas',
        value: formatNumber(totalReadings)
      },
      {
        columnId: 'consumedVolumeM3',
        label: 'Volumen',
        value: formatVolume(totalVolume)
      },
      {
        columnId: 'averageConsumptionM3',
        label: 'Promedio m³',
        value: `${avgConsumption.toFixed(2)} m³`
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
        columnId: 'revenueSharePercentage',
        label: '% Cuota USD',
        value: '100.00%'
      },
      {
        columnId: 'volumeSharePercentage',
        label: '% Cuota m³',
        value: '100.00%'
      },
      {
        columnId: 'averageTariffUsdPerM3',
        label: 'Tarifa Media ($/m³)',
        value: `$${avgTariff.toFixed(3)}`
      },
      {
        columnId: 'noveltiesCount',
        label: 'Novedades',
        value: formatNumber(totalNovelties)
      },
      { columnId: 'revenueRank', label: 'Rank USD', value: '-' }
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

    return rows;
  }, [data]);

  const summaryRows: SummaryRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const totalReadings = data.reduce(
      (acc, curr) => acc + curr.totalReadings,
      0
    );
    const totalVolume = data.reduce(
      (acc, curr) => acc + curr.consumedVolumeM3,
      0
    );
    const totalBilled = data.reduce(
      (acc, curr) => acc + curr.totalBilledUsd,
      0
    );

    return [
      {
        label: 'Lecturas Totales Consolidadas',
        value: formatNumber(totalReadings),
        highlight: true
      },
      {
        label: 'Volumen Total Consolidado',
        value: formatVolume(totalVolume),
        highlight: true
      },
      {
        label: 'Facturación Total Consolidada',
        value: formatCurrency(totalBilled),
        highlight: true
      }
    ];
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
        message="Sin registros de sectores"
        description="No se encontraron datos de rendimiento por sector para el periodo seleccionado."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Charts Section */}
      <div
        style={{
          display: 'column',
          gap: '1.25rem'
        }}
      >
        <div className="analytics-card-section">
          <div className="analytics-card-header">
            <h4 className="analytics-card-title">
              <BarChart3 size={18} color="var(--primary-color, #2563eb)" />
              Facturación por Sector ($ USD)
            </h4>
            <span className="analytics-card-badge">Recaudación Neta</span>
          </div>
          <div className="analytics-chart-wrapper" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val: number) =>
                    `$${(val / 1000).toFixed(0)}k`
                  }
                />
                <RechartsTooltip
                  formatter={(value: any) => [
                    formatCurrency(Number(value)),
                    'Facturado Total'
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
                <Bar
                  dataKey="facturado"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  name="Facturado Total ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card-section">
          <div className="analytics-card-header">
            <h4 className="analytics-card-title">
              <TrendingUp size={18} color="#059669" />
              Volumen Consumido por Sector (m³)
            </h4>
            <span className="analytics-card-badge">Demanda Física</span>
          </div>
          <div className="analytics-chart-wrapper" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val: number) => `${(val / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip
                  formatter={(value: any) => [
                    formatVolume(Number(value)),
                    'Volumen Consumido'
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
                <Bar
                  dataKey="volumen"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  name="Volumen (m³)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Sector Data Table */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <h4 className="analytics-card-title">
            <Layers size={18} color="var(--primary-color, #2563eb)" />
            Matriz de Desempeño Operativo y Comercial por Sector
          </h4>
          <span className="analytics-card-badge">
            {data.length} Sectores analizados
          </span>
        </div>
        <Table<SectorPerformanceAnalytics>
          data={data}
          columns={columns}
          totalRows={totalRows}
          summaryRows={summaryRows}
          pagination={true}
          summaryLayout="horizontal"
          width="100"
        />
      </div>
    </div>
  );
};
