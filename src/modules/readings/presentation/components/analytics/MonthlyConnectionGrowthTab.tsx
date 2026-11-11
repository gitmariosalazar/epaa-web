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
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { MonthlyConnectionGrowthAnalytics } from '../../../domain/models/readings-analytics';
import {
  Table,
  type Column,
  type TotalRow
} from '@/shared/presentation/components/Table/Table';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { formatNumber, formatPercent } from '../../utils/analytics-formatters';

interface MonthlyConnectionGrowthTabProps {
  data: MonthlyConnectionGrowthAnalytics[] | null;
  isLoading: boolean;
  baseYear?: number;
  targetYear?: number;
}

export const MonthlyConnectionGrowthTab: React.FC<
  MonthlyConnectionGrowthTabProps
> = ({ data, isLoading, baseYear = 2025, targetYear = 2026 }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      mes: item.monthName,
      [String(baseYear)]: item.connectionsBaseYear,
      [String(targetYear)]:
        item.connectionsTargetYear > 0 ? item.connectionsTargetYear : null,
      aumentoTarget: item.increaseTargetYear
    }));
  }, [data, baseYear, targetYear]);

  // Closed months summary
  const summary = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        peakYear: 0,
        peakMonth: '-',
        lastClosedBase: 0,
        lastClosedTarget: 0,
        netGrowth: 0,
        growthPct: 0
      };
    }

    const closedMonths = data.filter(
      (d) => d.statusTargetYear === 'CERRADO / FACTURADO'
    );
    const lastClosed = closedMonths[closedMonths.length - 1] ?? null;

    let peak = 0;
    let peakMonthName = '-';
    data.forEach((d) => {
      if (d.connectionsTargetYear > peak) {
        peak = d.connectionsTargetYear;
        peakMonthName = d.monthName;
      }
    });

    const lastClosedBase = lastClosed ? lastClosed.connectionsBaseYear : 0;
    const lastClosedTarget = lastClosed ? lastClosed.connectionsTargetYear : 0;
    const netGrowth = lastClosedTarget - lastClosedBase;
    const growthPct =
      lastClosedBase > 0 ? (netGrowth / lastClosedBase) * 100 : 0;

    return {
      peakYear: peak,
      peakMonth: peakMonthName,
      lastClosedBase,
      lastClosedTarget,
      netGrowth,
      growthPct
    };
  }, [data]);

  const columns: Column<MonthlyConnectionGrowthAnalytics>[] = useMemo(
    () => [
      {
        id: 'monthNumber',
        header: '#',
        accessor: (item) => (
          <span
            style={{ fontWeight: 600, color: 'var(--text-secondary, #64748b)' }}
          >
            {item.monthNumber}
          </span>
        )
      },
      {
        id: 'monthName',
        header: 'Mes',
        accessor: (item) => (
          <span
            style={{ fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}
          >
            {item.monthName}
          </span>
        )
      },
      {
        id: 'connectionsBaseYear',
        header: `Acometidas ${baseYear}`,
        accessor: (item) => formatNumber(item.connectionsBaseYear),
        isNumeric: true
      },
      {
        id: 'increaseBaseYear',
        header: `Aumento Mes ${baseYear}`,
        accessor: (item) => {
          if (item.increaseBaseYear === 0) return '-';
          const isPos = item.increaseBaseYear > 0;
          return (
            <span
              style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 600 }}
            >
              {isPos
                ? `+${formatNumber(item.increaseBaseYear)}`
                : formatNumber(item.increaseBaseYear)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        id: 'connectionsTargetYear',
        header: `Acometidas ${targetYear}`,
        accessor: (item) => (
          <span style={{ fontWeight: 700, color: '#2563eb' }}>
            {item.connectionsTargetYear > 0
              ? formatNumber(item.connectionsTargetYear)
              : '-'}
          </span>
        ),
        isNumeric: true
      },
      {
        id: 'increaseTargetYear',
        header: `Aumento Mes ${targetYear}`,
        accessor: (item) => {
          if (item.connectionsTargetYear === 0 || item.increaseTargetYear === 0)
            return '-';
          const isPos = item.increaseTargetYear > 0;
          return (
            <span
              style={{ color: isPos ? '#10b981' : '#ef4444', fontWeight: 700 }}
            >
              {isPos
                ? `+${formatNumber(item.increaseTargetYear)}`
                : formatNumber(item.increaseTargetYear)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        id: 'differenceTargetVsBase',
        header: `Dif. (${targetYear} vs ${baseYear})`,
        accessor: (item) => {
          if (item.connectionsTargetYear === 0) return '-';
          const isPos = item.differenceTargetVsBase >= 0;
          return (
            <span
              style={{ color: isPos ? '#059669' : '#dc2626', fontWeight: 700 }}
            >
              {isPos
                ? `+${formatNumber(item.differenceTargetVsBase)}`
                : formatNumber(item.differenceTargetVsBase)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        id: 'growthPercentage',
        header: 'Crecimiento (%)',
        accessor: (item) => {
          if (item.connectionsTargetYear === 0) return '-';
          const isPos = item.growthPercentage >= 0;
          return (
            <span
              style={{
                color: isPos ? '#059669' : '#dc2626',
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
              {formatPercent(item.growthPercentage)}
            </span>
          );
        },
        isNumeric: true
      },
      {
        id: 'statusTargetYear',
        header: 'Estado',
        accessor: (item) => {
          if (item.statusTargetYear === 'CERRADO / FACTURADO') {
            return (
              <ColorChip
                label="Emitido"
                status="success"
                icon={<CheckCircle2 size={12} />}
              />
            );
          }
          if (item.statusTargetYear === 'EN PROCESO DE TOMA') {
            return (
              <ColorChip
                label="En proceso de toma"
                status="warning"
                icon={<Clock size={12} />}
              />
            );
          }
          return (
            <ColorChip
              label="No emitido"
              status="secondary"
              icon={<AlertCircle size={12} />}
            />
          );
        }
      }
    ],
    [baseYear, targetYear]
  );

  const totalRows: TotalRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const totalIncreaseBase = data.reduce(
      (acc, c) => acc + c.increaseBaseYear,
      0
    );
    const totalIncreaseTarget = data.reduce(
      (acc, c) => acc + c.increaseTargetYear,
      0
    );

    return [
      { columnId: 'monthNumber', label: '#', value: 'TOTAL' },
      { columnId: 'monthName', label: 'Mes', value: '12 MESES' },
      {
        columnId: 'connectionsBaseYear',
        label: `Acometidas ${baseYear}`,
        value: formatNumber(summary.lastClosedBase)
      },
      {
        columnId: 'increaseBaseYear',
        label: `Aumento Mes ${baseYear}`,
        value: `+${formatNumber(totalIncreaseBase)}`
      },
      {
        columnId: 'connectionsTargetYear',
        label: `Acometidas ${targetYear}`,
        value:
          summary.lastClosedTarget > 0
            ? formatNumber(summary.lastClosedTarget)
            : '-'
      },
      {
        columnId: 'increaseTargetYear',
        label: `Aumento Mes ${targetYear}`,
        value:
          totalIncreaseTarget !== 0
            ? `${totalIncreaseTarget >= 0 ? '+' : ''}${formatNumber(totalIncreaseTarget)}`
            : '-'
      },
      {
        columnId: 'differenceTargetVsBase',
        label: `Dif. (${targetYear} vs ${baseYear})`,
        value: `${summary.netGrowth >= 0 ? '+' : ''}${formatNumber(summary.netGrowth)}`,
        highlight: true
      },
      {
        columnId: 'growthPercentage',
        label: 'Crecimiento (%)',
        value: formatPercent(summary.growthPct)
      },
      { columnId: 'statusTargetYear', label: 'Estado', value: '-' }
    ];
  }, [data, baseYear, targetYear, summary]);

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
        message="Sin registros de acometidas"
        description="No se encontraron datos comparativos de acometidas para los años seleccionados."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '0.5rem',
          marginTop: '0.3rem'
        }}
      >
        <KPICard
          label={`Cartera Activa (${targetYear})`}
          value={formatNumber(summary.lastClosedTarget)}
          description="Último mes cerrado en Rentas"
          icon={<Users size={20} />}
          color="primary"
        />
        <KPICard
          label={`Cartera Activa (${baseYear})`}
          value={formatNumber(summary.lastClosedBase)}
          description="Mismo mes del año base"
          icon={<Users size={20} />}
          color="info"
        />
        <KPICard
          label="Crecimiento Neto Interanual"
          value={
            summary.netGrowth >= 0
              ? `+${formatNumber(summary.netGrowth)}`
              : formatNumber(summary.netGrowth)
          }
          description={`Variación: +${summary.growthPct.toFixed(2)}%`}
          icon={<TrendingUp size={20} />}
          color="success"
        />
        <KPICard
          label="Récord Histórico de Acometidas"
          value={formatNumber(summary.peakYear)}
          description={`Alcanzado en ${summary.peakMonth} ${targetYear}`}
          icon={<CheckCircle2 size={20} />}
          color="purple"
        />
      </div>

      {/* Gráfico comparativo */}
      <div
        style={{
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            Evolución de Acometidas Facturadas ({baseYear} vs {targetYear})
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              color: 'var(--text-secondary, #64748b)'
            }}
          >
            Comparación mensual de cuentas con título de emisión liquidado en
            Rentas EPAA
          </p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis
              domain={['dataMin - 500', 'dataMax + 500']}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatNumber(v)}
            />
            <RechartsTooltip
              formatter={(val: unknown) => [
                typeof val === 'number'
                  ? formatNumber(val)
                  : String(val ?? '-'),
                'Acometidas'
              ]}
              contentStyle={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{
                fontSize: '13px'
              }}
              itemStyle={{
                fontSize: '13px'
              }}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
            />
            <Legend />
            <Bar
              dataKey={String(baseYear)}
              fill="var(--warning)"
              radius={[4, 4, 0, 0]}
              name={`Año ${baseYear}`}
            />
            <Bar
              dataKey={String(targetYear)}
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              name={`Año ${targetYear}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla detallada */}
      <div
        style={{
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            Detalle Mes a Mes de Crecimiento de Acometidas
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              color: 'var(--text-secondary, #64748b)'
            }}
          >
            Acometidas con título emitido en Rentas y su variación intermensual
            ($\Delta$ MoM)
          </p>
        </div>
        <Table<MonthlyConnectionGrowthAnalytics>
          data={data}
          columns={columns}
          totalRows={totalRows}
          emptyState={
            <EmptyState
              message="Sin registros"
              description="No hay datos de acometidas disponibles."
            />
          }
        />
      </div>
    </div>
  );
};
