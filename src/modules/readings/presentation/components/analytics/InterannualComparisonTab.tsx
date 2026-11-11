import React, { useMemo, useState } from 'react';
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
  CheckCircle2,
  Columns3,
  Rows3,
  Users,
  Droplets,
  DollarSign
} from 'lucide-react';
import type { InterannualComparisonAnalytics } from '../../../domain/models/readings-analytics';
import {
  Table,
  type Column,
  type SummaryRow,
  type TotalRow
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
  const [summaryLayout, setSummaryLayout] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

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
        id: 'readingsBaseYear',
        header: `Lecturas ${baseYear}`,
        accessor: (item) => formatNumber(item.readingsBaseYear),
        isNumeric: true
      },
      {
        id: 'readingsTargetYear',
        header: `Lecturas ${targetYear}`,
        accessor: (item) => formatNumber(item.readingsTargetYear),
        isNumeric: true
      },
      {
        id: 'deltaReadings',
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
        id: 'volumeBaseYearM3',
        header: `m³ ${baseYear}`,
        accessor: (item) => formatVolume(item.volumeBaseYearM3),
        isNumeric: true
      },
      {
        id: 'volumeTargetYearM3',
        header: `m³ ${targetYear}`,
        accessor: (item) => formatVolume(item.volumeTargetYearM3),
        isNumeric: true
      },
      {
        id: 'deltaVolumeM3',
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
        id: 'varianceVolumePercentage',
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
        id: 'billedBaseYearUsd',
        header: `Facturado ${baseYear} ($)`,
        accessor: (item) => formatCurrency(item.billedBaseYearUsd),
        isNumeric: true
      },
      {
        id: 'billedTargetYearUsd',
        header: `Facturado ${targetYear} ($)`,
        accessor: (item) => (
          <span style={{ fontWeight: 600 }}>
            {formatCurrency(item.billedTargetYearUsd)}
          </span>
        ),
        isNumeric: true
      },
      {
        id: 'deltaBilledUsd',
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
        id: 'varianceBilledPercentage',
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
        id: 'managementDiagnostic',
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

  const totalRows: TotalRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const readingsBase = data.reduce((acc, c) => acc + c.readingsBaseYear, 0);
    const readingsTarget = data.reduce(
      (acc, c) => acc + c.readingsTargetYear,
      0
    );
    const deltaReadings = readingsTarget - readingsBase;

    return [
      { columnId: 'sector', label: 'Sector', value: 'TOTAL' },
      {
        columnId: 'readingsBaseYear',
        label: `Lecturas ${baseYear}`,
        value: formatNumber(readingsBase)
      },
      {
        columnId: 'readingsTargetYear',
        label: `Lecturas ${targetYear}`,
        value: formatNumber(readingsTarget)
      },
      {
        columnId: 'deltaReadings',
        label: 'Δ Lecturas',
        value: `${deltaReadings >= 0 ? '+' : ''}${formatNumber(deltaReadings)}`
      },
      {
        columnId: 'volumeBaseYearM3',
        label: `m³ ${baseYear}`,
        value: formatVolume(totals.volumeBase)
      },
      {
        columnId: 'volumeTargetYearM3',
        label: `m³ ${targetYear}`,
        value: formatVolume(totals.volumeTarget)
      },
      {
        columnId: 'deltaVolumeM3',
        label: 'Δ m³',
        value: `${totals.deltaVolume >= 0 ? '+' : ''}${formatVolume(totals.deltaVolume)}`
      },
      {
        columnId: 'varianceVolumePercentage',
        label: '% Var m³',
        value: formatPercent(totals.pctVolume)
      },
      {
        columnId: 'billedBaseYearUsd',
        label: `Facturado ${baseYear} ($)`,
        value: formatCurrency(totals.billedBase)
      },
      {
        columnId: 'billedTargetYearUsd',
        label: `Facturado ${targetYear} ($)`,
        value: formatCurrency(totals.billedTarget)
      },
      {
        columnId: 'deltaBilledUsd',
        label: 'Δ USD ($)',
        value: `${totals.deltaBilled >= 0 ? '+' : ''}${formatCurrency(totals.deltaBilled)}`,
        highlight: true
      },
      {
        columnId: 'varianceBilledPercentage',
        label: '% Var USD',
        value: formatPercent(totals.pctBilled)
      },
      {
        columnId: 'managementDiagnostic',
        label: 'Diagnóstico de Gestión',
        value: '-'
      }
    ];
  }, [data, baseYear, targetYear, totals]);

  const summaryRows: SummaryRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [
      {
        label: 'Cuentas Homólogas Auditadas',
        value: formatNumber(totals.totalHomologous),
        highlight: true,
        icon: <Users size={16} />,
        description: 'Emparejamiento 1 a 1 verificado',
        color: 'primary'
      },
      {
        label: `Volumen Total (${targetYear})`,
        value: formatVolume(totals.volumeTarget),
        highlight: true,
        icon: <Droplets size={16} />,
        description: `Base ${baseYear}: ${formatVolume(totals.volumeBase)}`,
        color: 'info'
      },
      {
        label: 'Variación Neta Consumo (Δ m³)',
        value: `${totals.deltaVolume >= 0 ? '+' : ''}${formatVolume(totals.deltaVolume)}`,
        percentage: formatPercent(totals.pctVolume),
        highlight: true,
        icon:
          totals.deltaVolume >= 0 ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          ),
        description: 'Balance de extracción y consumo',
        color: totals.deltaVolume >= 0 ? 'success' : 'warning'
      },
      {
        label: `Facturación Total (${targetYear})`,
        value: formatCurrency(totals.billedTarget),
        highlight: true,
        icon: <DollarSign size={16} />,
        description: `Base ${baseYear}: ${formatCurrency(totals.billedBase)}`,
        color: 'purple'
      },
      {
        label: 'Crecimiento Facturación (Δ USD)',
        value: `${totals.deltaBilled >= 0 ? '+' : ''}${formatCurrency(totals.deltaBilled)}`,
        percentage: formatPercent(totals.pctBilled),
        highlight: true,
        icon: <TrendingUp size={16} />,
        description: 'Variación económica interanual',
        color: totals.deltaBilled >= 0 ? 'success' : 'danger'
      }
    ];
  }, [data, baseYear, targetYear, totals]);

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
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="facturadoBase"
                  fill="var(--warning)"
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
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                  contentStyle={{
                    fontSize: '13px',
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ fontSize: '13px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="volumenBase"
                  fill="var(--info)"
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
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
          >
            <GitCompare size={18} color="var(--primary-color, #2563eb)" />
            <h4 className="analytics-card-title" style={{ margin: 0 }}>
              Comparativa Interanual 1 a 1 de Cuentas Homólogas ({baseYear} vs{' '}
              {targetYear})
            </h4>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <span className="analytics-card-badge">
              Auditoría 100% Homóloga (Cuenta, Sector, Catastro)
            </span>
            {/* Optional Layout Toggle for summaryRows */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--surface-subtle, #f1f5f9)',
                borderRadius: '8px',
                padding: '2px',
                border: '1px solid var(--border-color, #e2e8f0)',
                gap: '2px'
              }}
            >
              <button
                type="button"
                onClick={() => setSummaryLayout('horizontal')}
                title="Vista de totales en tarjetas horizontales"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background:
                    summaryLayout === 'horizontal'
                      ? 'var(--surface, #ffffff)'
                      : 'transparent',
                  color:
                    summaryLayout === 'horizontal'
                      ? 'var(--primary-color, #2563eb)'
                      : 'var(--text-secondary, #64748b)',
                  boxShadow:
                    summaryLayout === 'horizontal'
                      ? '0 1px 3px rgba(0,0,0,0.08)'
                      : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Columns3 size={14} />
                <span>Horizontal</span>
              </button>
              <button
                type="button"
                onClick={() => setSummaryLayout('vertical')}
                title="Vista de totales vertical clásica"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background:
                    summaryLayout === 'vertical'
                      ? 'var(--surface, #ffffff)'
                      : 'transparent',
                  color:
                    summaryLayout === 'vertical'
                      ? 'var(--primary-color, #2563eb)'
                      : 'var(--text-secondary, #64748b)',
                  boxShadow:
                    summaryLayout === 'vertical'
                      ? '0 1px 3px rgba(0,0,0,0.08)'
                      : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Rows3 size={14} />
                <span>Vertical</span>
              </button>
            </div>
          </div>
        </div>
        <Table<InterannualComparisonAnalytics>
          data={data}
          columns={columns}
          totalRows={totalRows}
          summaryRows={summaryRows}
          summaryLayout={summaryLayout}
          pagination={true}
          width="100"
        />
      </div>
    </div>
  );
};
