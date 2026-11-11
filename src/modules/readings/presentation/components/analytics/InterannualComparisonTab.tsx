import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  BarChart2,
  GitCompare,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';
import type { InterannualComparisonAnalytics } from '../../../domain/models/readings-analytics';
import {
  Table,
  type Column,
  type SummaryRow
} from '@/shared/presentation/components/Table/Table';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatVolume,
  getDiagnosticStatus
} from '../../utils/analytics-formatters';

interface InterannualComparisonTabProps {
  data: InterannualComparisonAnalytics[] | null;
  isLoading: boolean;
  baseYear?: number;
  targetYear?: number;
}

export const InterannualComparisonTab: React.FC<
  InterannualComparisonTabProps
> = ({ data, isLoading, baseYear = 2025, targetYear = 2026 }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data]
      .sort((a, b) => a.sector - b.sector)
      .map((item) => ({
        sector: `Sec ${item.sector}`,
        facturadoBase: item.billedBaseYearUsd,
        facturadoTarget: item.billedTargetYearUsd,
        volumenBase: item.volumeBaseYearM3,
        volumenTarget: item.volumeTargetYearM3
      }));
  }, [data]);

  const totals = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalHomologous: 0,
        volumeBase: 0,
        volumeTarget: 0,
        deltaVolume: 0,
        pctVolume: 0,
        billedBase: 0,
        billedTarget: 0,
        deltaBilled: 0,
        pctBilled: 0
      };
    }
    const totalHomologous = data.reduce(
      (acc, c) => acc + c.homologousAccountsCount,
      0
    );
    const volumeBase = data.reduce((acc, c) => acc + c.volumeBaseYearM3, 0);
    const volumeTarget = data.reduce((acc, c) => acc + c.volumeTargetYearM3, 0);
    const deltaVolume = volumeTarget - volumeBase;
    const pctVolume = volumeBase > 0 ? (deltaVolume / volumeBase) * 100 : 0;

    const billedBase = data.reduce((acc, c) => acc + c.billedBaseYearUsd, 0);
    const billedTarget = data.reduce(
      (acc, c) => acc + c.billedTargetYearUsd,
      0
    );
    const deltaBilled = billedTarget - billedBase;
    const pctBilled = billedBase > 0 ? (deltaBilled / billedBase) * 100 : 0;

    return {
      totalHomologous,
      volumeBase,
      volumeTarget,
      deltaVolume,
      pctVolume,
      billedBase,
      billedTarget,
      deltaBilled,
      pctBilled
    };
  }, [data]);

  const columns: Column<InterannualComparisonAnalytics>[] = useMemo(
    () => [
      {
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
        header: `Lecturas ${baseYear}`,
        accessor: (item) => formatNumber(item.readingsBaseYear),
        isNumeric: true
      },
      {
        header: `Lecturas ${targetYear}`,
        accessor: (item) => formatNumber(item.readingsTargetYear),
        isNumeric: true
      },
      {
        header: 'Δ Lecturas',
        accessor: (item) => {
          const isPos = item.deltaReadings >= 0;
          return (
            <span
              style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 600 }}
            >
              {isPos ? '+' : ''}
              {formatNumber(item.deltaReadings)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        header: `m³ ${baseYear}`,
        accessor: (item) => formatVolume(item.volumeBaseYearM3),
        isNumeric: true
      },
      {
        header: `m³ ${targetYear}`,
        accessor: (item) => formatVolume(item.volumeTargetYearM3),
        isNumeric: true
      },
      {
        header: 'Δ m³',
        accessor: (item) => {
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
        header: '% Var m³',
        accessor: (item) => {
          const isPos = item.varianceVolumePercentage >= 0;
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
              {formatPercent(item.varianceVolumePercentage)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        header: `Facturado ${baseYear} ($)`,
        accessor: (item) => formatCurrency(item.billedBaseYearUsd),
        isNumeric: true
      },
      {
        header: `Facturado ${targetYear} ($)`,
        accessor: (item) => (
          <span style={{ fontWeight: 600 }}>
            {formatCurrency(item.billedTargetYearUsd)}
          </span>
        ),
        isNumeric: true
      },
      {
        header: 'Δ USD ($)',
        accessor: (item) => {
          const isPos = item.deltaBilledUsd >= 0;
          return (
            <span
              style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 700 }}
            >
              {isPos ? '+' : ''}
              {formatCurrency(item.deltaBilledUsd)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        header: '% Var USD',
        accessor: (item) => {
          const isPos = item.varianceBilledPercentage >= 0;
          return (
            <span
              style={{
                color: isPos ? '#10b981' : '#ef4444',
                fontWeight: 700,
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
              {formatPercent(item.varianceBilledPercentage)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        header: 'Diagnóstico de Gestión',
        accessor: (item) => (
          <ColorChip
            label={item.managementDiagnostic}
            status={getDiagnosticStatus(item.managementDiagnostic)}
            size="sm"
            variant="filled"
          />
        )
      }
    ],
    [baseYear, targetYear]
  );

  const summaryRows: SummaryRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [
      {
        label: 'Cuentas Homólogas Consolidadas',
        value: formatNumber(totals.totalHomologous),
        highlight: true
      },
      {
        label: `Volumen Total ${targetYear}`,
        value: formatVolume(totals.volumeTarget),
        highlight: true
      },
      {
        label: 'Variación Neta Consumo (Δ m³)',
        value: `${totals.deltaVolume >= 0 ? '+' : ''}${formatVolume(totals.deltaVolume)} (${formatPercent(totals.pctVolume)})`,
        highlight: true
      },
      {
        label: `Facturación Total ${targetYear}`,
        value: formatCurrency(totals.billedTarget),
        highlight: true
      },
      {
        label: 'Crecimiento Neto Facturación (Δ USD)',
        value: `${totals.deltaBilled >= 0 ? '+' : ''}${formatCurrency(totals.deltaBilled)} (${formatPercent(totals.pctBilled)})`,
        highlight: true
      }
    ];
  }, [data, targetYear, totals]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '350px'
        }}
      >
        <CircularProgress size={40} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        message="Sin registros comparativos"
        description={`No se encontraron datos homólogos para comparar ${baseYear} vs ${targetYear}.`}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* KPI Cards summary */}
      <div className="analytics-kpi-grid">
        <KPICard
          label="Cuentas Homólogas Auditadas"
          value={formatNumber(totals.totalHomologous)}
          description="Cuentas emparejadas 1 a 1"
          icon={<CheckCircle2 size={20} />}
          color="primary"
        />
        <KPICard
          label={`Crecimiento en Facturación (${baseYear} vs ${targetYear})`}
          value={`${totals.deltaBilled >= 0 ? '+' : ''}${formatCurrency(totals.deltaBilled)}`}
          description={`${formatPercent(totals.pctBilled)} de variación económica`}
          icon={<TrendingUp size={20} />}
          color={totals.deltaBilled >= 0 ? 'success' : 'danger'}
        />
        <KPICard
          label={`Variación en Consumo (${baseYear} vs ${targetYear})`}
          value={`${totals.deltaVolume >= 0 ? '+' : ''}${formatVolume(totals.deltaVolume)}`}
          description={`${formatPercent(totals.pctVolume)} de demanda física`}
          icon={<BarChart2 size={20} />}
          color={totals.deltaVolume >= 0 ? 'info' : 'warning'}
        />
        <KPICard
          label="Facturación Totalizada"
          value={formatCurrency(totals.billedTarget)}
          description={`Periodo comparativo ${targetYear}`}
          icon={<GitCompare size={20} />}
          color="purple"
        />
      </div>

      {/* Side-by-side Comparative Charts */}
      <div
        style={{
          display: 'column',
          gap: '1.25rem'
        }}
      >
        <div className="analytics-card-section">
          <div className="analytics-card-header">
            <h4 className="analytics-card-title">
              <TrendingUp size={18} color="var(--primary-color, #2563eb)" />
              Comparativa Facturación ($ USD) {baseYear} vs {targetYear}
            </h4>
            <span className="analytics-card-badge">Evolución Económica</span>
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
                  formatter={(value: any, name: string) => [
                    formatCurrency(Number(value)),
                    name
                  ]}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="facturadoBase"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  name={`Facturado ${baseYear} ($)`}
                />
                <Bar
                  dataKey="facturadoTarget"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  name={`Facturado ${targetYear} ($)`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card-section">
          <div className="analytics-card-header">
            <h4 className="analytics-card-title">
              <BarChart2 size={18} color="#059669" />
              Comparativa Volumen (m³) {baseYear} vs {targetYear}
            </h4>
            <span className="analytics-card-badge">
              Demanda Física Homóloga
            </span>
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
                  formatter={(value: any, name: string) => [
                    formatVolume(Number(value)),
                    name
                  ]}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="volumenBase"
                  fill="#cbd5e1"
                  radius={[4, 4, 0, 0]}
                  name={`Volumen ${baseYear} (m³)`}
                />
                <Bar
                  dataKey="volumenTarget"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  name={`Volumen ${targetYear} (m³)`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 1-to-1 Homologous Comparison Table */}
      <div className="analytics-card-section">
        <div className="analytics-card-header">
          <h4 className="analytics-card-title">
            <GitCompare size={18} color="var(--primary-color, #2563eb)" />
            Comparativa Interanual 1 a 1 de Cuentas Homólogas ({
              baseYear
            } vs {targetYear})
          </h4>
          <span className="analytics-card-badge">
            Auditoría 100% Homóloga (Cuenta, Sector, Catastro)
          </span>
        </div>
        <Table<InterannualComparisonAnalytics>
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
