import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import type { NoveltyEconomicImpactAnalytics } from '../../../domain/models/readings-analytics';
import { Table, type Column, type SummaryRow } from '@/shared/presentation/components/Table/Table';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  formatCurrency,
  formatNumber,
  formatVolume,
} from '../../utils/analytics-formatters';

interface NoveltyEconomicImpactTabProps {
  data: NoveltyEconomicImpactAnalytics[] | null;
  isLoading: boolean;
}

const PALETTE = [
  '#ef4444',
  '#f59e0b',
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#6366f1',
  '#14b8a6',
];

export const NoveltyEconomicImpactTab: React.FC<NoveltyEconomicImpactTabProps> = ({
  data,
  isLoading,
}) => {
  const pieData = useMemo(() => {
    if (!data) return [];
    return data.slice(0, 8).map((item) => ({
      name: item.novelty || 'SIN NOVEDAD',
      value: item.totalBilledUsd,
      cases: item.casesCount,
    }));
  }, [data]);

  const columns: Column<NoveltyEconomicImpactAnalytics>[] = useMemo(
    () => [
      {
        header: 'Tipo de Novedad',
        accessor: (item) => (
          <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
            {item.novelty || 'SIN NOVEDAD'}
          </span>
        ),
      },
      {
        header: 'Casos',
        accessor: (item) => formatNumber(item.casesCount),
        isNumeric: true,
      },
      {
        header: '% Participación',
        accessor: (item) => `${item.shareOfTotalReadingsPercentage?.toFixed(2) ?? '0.00'}%`,
        isNumeric: true,
      },
      {
        header: 'Volumen Total',
        accessor: (item) => formatVolume(item.totalVolumeM3),
        isNumeric: true,
      },
      {
        header: 'Volumen Medio / Caso',
        accessor: (item) => `${item.averageVolumePerCaseM3?.toFixed(2) ?? '0.00'} m³`,
        isNumeric: true,
      },
      {
        header: 'Agua ($)',
        accessor: (item) => formatCurrency(item.waterBilledUsd),
        isNumeric: true,
      },
      {
        header: 'Alcantarillado ($)',
        accessor: (item) => formatCurrency(item.sewerBilledUsd),
        isNumeric: true,
      },
      {
        header: 'Facturado Total ($)',
        accessor: (item) => (
          <span style={{ fontWeight: 700, color: '#059669' }}>
            {formatCurrency(item.totalBilledUsd)}
          </span>
        ),
        isNumeric: true,
      },
    ],
    [],
  );

  const summaryRows: SummaryRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const totalCases = data.reduce((acc, curr) => acc + curr.casesCount, 0);
    const totalVolume = data.reduce((acc, curr) => acc + curr.totalVolumeM3, 0);
    const totalBilled = data.reduce((acc, curr) => acc + curr.totalBilledUsd, 0);

    return [
      {
        label: 'Casos Totales Registrados',
        value: formatNumber(totalCases),
        highlight: true,
      },
      {
        label: 'Volumen Total Asociado',
        value: formatVolume(totalVolume),
        highlight: true,
      },
      {
        label: 'Facturación Total Asociada',
        value: formatCurrency(totalBilled),
        highlight: true,
      },
    ];
  }, [data]);

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
        message="Sin novedades registradas"
        description="No se registraron novedades comerciales u operativas en el periodo."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Chart Section */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <h4 className="analytics-card-title">
            <AlertCircle size={18} color="#f59e0b" />
            Distribución Económica por Novedad Comercial / Operativa
          </h4>
          <span className="analytics-card-badge">Top Novedades</span>
        </div>
        <div className="analytics-chart-wrapper" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={55}
                paddingAngle={3}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: any) => [formatCurrency(Number(value)), 'Facturado ($)']}
              />
              <Legend verticalAlign="bottom" height={40} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <h4 className="analytics-card-title">
            <AlertTriangle size={18} color="var(--primary-color, #2563eb)" />
            Matriz de Impacto Económico y Volumen de Novedades
          </h4>
          <span className="analytics-card-badge">{data.length} Categorías</span>
        </div>
        <Table<NoveltyEconomicImpactAnalytics>
          data={data}
          columns={columns}
          summaryRows={summaryRows}
          pagination={false}
          width="100"
        />
      </div>
    </div>
  );
};
