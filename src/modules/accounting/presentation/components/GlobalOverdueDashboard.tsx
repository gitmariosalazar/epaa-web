import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Map,
  ShieldAlert,
  History,
  AlertOctagon,
  Percent,
  Clock
} from 'lucide-react';
import type {
  YearlyOverdueSummary,
  OverdueSummary
} from '../../domain/models/OverdueReading';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import '../styles/OverdueDashboard.css';

interface GlobalOverdueDashboardProps {
  yearlyData: YearlyOverdueSummary[];
  globalSummary: OverdueSummary | null;
  isLoading: boolean;
}

// ── KPI Card Component ──
interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color:
    | 'blue'
    | 'green'
    | 'red'
    | 'purple'
    | 'amber'
    | 'rose'
    | 'indigo'
    | 'teal'
    | 'cyan'
    | 'orange';
  description?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon,
  color,
  description
}) => (
  <div className={`overdue-kpi-card overdue-kpi-card--${color}`}>
    <div className="overdue-kpi-header">
      <span className="overdue-kpi-label">{label}</span>
      <div className="overdue-kpi-icon">{icon}</div>
    </div>
    <div className="overdue-kpi-value">{value}</div>
    {description && (
      <div className="overdue-kpi-description">{description}</div>
    )}
  </div>
);

// ── Dashboard Component ──
export const GlobalOverdueDashboard: React.FC<GlobalOverdueDashboardProps> = ({
  yearlyData = [],
  globalSummary,
  isLoading
}) => {
  const { t } = useTranslation();
  const loadingProgress = useSimulatedProgress(isLoading);

  const chartData = useMemo(() => {
    return [...(yearlyData || [])].sort((a, b) => a.year - b.year);
  }, [yearlyData]);

  const metrics = useMemo(() => {
    if (!globalSummary) return null;
    return {
      totalDebt: globalSummary.totalDebtAmount,
      totalClients: globalSummary.totalClientsWithDebt,
      totalMonths: globalSummary.totalMonthsPastDue,
      totalEpaa: globalSummary.totalEpaaValue,
      totalTrash: globalSummary.totalTrashRate,
      totalSurcharge: globalSummary.totalSurcharge,
      totalKeys: globalSummary.totalUniqueCadastralKeys,
      clientsOver6: globalSummary.clientsOver6Months,
      clientsOver12: globalSummary.clientsOver1Year,
      maxMonths: globalSummary.maxMonthsInDebt,
      avgMonths: globalSummary.avgMonthsPastDue,
      avgDebt: globalSummary.avgDebtPerClient
    };
  }, [globalSummary]);

  const epaaPct = metrics ? (metrics.totalEpaa / metrics.totalDebt) * 100 : 0;

  const compositionData = metrics
    ? [
        {
          name: t('accounting.overdue.epaaValue', 'Monto EPAA'),
          value: metrics.totalEpaa,
          color: '#3b82f6'
        },
        {
          name: t('accounting.overdue.trashRate', 'Tasa Desecho'),
          value: metrics.totalTrash,
          color: '#10b981'
        },
        {
          name: t('accounting.overdue.surcharge', 'Recargos'),
          value: metrics.totalSurcharge,
          color: '#f59e0b'
        }
      ]
    : [];

  const formatCurrency = (val: number) =>
    `$${(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatNumber = (val: number) => Math.round(val || 0).toLocaleString();

  if (isLoading || !metrics) {
    return (
      <div
        className="overdue-dashboard-loading"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress
          progress={loadingProgress}
          size={140}
          strokeWidth={6}
          label={t('common.loading', 'Cargando...')}
        />
      </div>
    );
  }

  return (
    <div className="overdue-dashboard">
      {/* ── 10 KPI Grid ── */}
      <div className="overdue-dashboard-kpi-grid">
        <KpiCard
          label={t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
          value={formatCurrency(metrics.totalDebt)}
          icon={<DollarSign size={18} />}
          color="blue"
          description={t(
            'accounting.overdue.totalDebtDesc',
            'Suma global vencida'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsWithDebt', 'Clientes Mora')}
          value={formatNumber(metrics.totalClients)}
          icon={<Users size={18} />}
          color="purple"
          description={t(
            'accounting.overdue.clientsWithDebtDesc',
            'Total clientes únicos'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.avgDebtPerClient', 'Deuda Prom.')}
          value={formatCurrency(metrics.avgDebt)}
          icon={<TrendingUp size={18} />}
          color="green"
          description={t(
            'accounting.overdue.avgDebtDesc',
            'Promedio organización'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.totalMonthsPastDue', 'Meses Mora')}
          value={formatNumber(metrics.totalMonths)}
          icon={<Calendar size={18} />}
          color="amber"
          description={t(
            'accounting.overdue.totalMonthsDesc',
            'Suma meses de mora'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.cadastralKeys', 'Claves Cat.')}
          value={formatNumber(metrics.totalKeys)}
          icon={<Map size={18} />}
          color="indigo"
          description={t(
            'accounting.overdue.keysDesc',
            'Predios totales en mora'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsOver6', '> 6 Meses')}
          value={formatNumber(metrics.clientsOver6)}
          icon={<ShieldAlert size={18} />}
          color="rose"
          description={t(
            'accounting.overdue.clientsOver6Desc',
            'Críticos (6+ meses)'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsOver12', '> 1 Año')}
          value={formatNumber(metrics.clientsOver12)}
          icon={<AlertOctagon size={18} />}
          color="red"
          description={t(
            'accounting.overdue.clientsOver12Desc',
            'Muy Críticos (1+ año)'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.maxMonths', 'Máxima Mora')}
          value={metrics.maxMonths}
          icon={<History size={18} />}
          color="teal"
          description={t(
            'accounting.overdue.maxMonthsDesc',
            'Máximo histórico (meses)'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.avgMonths', 'Mora Prom.')}
          value={`${(metrics.avgMonths || 0).toFixed(1)} ${t('common.months', 'Meses')}`}
          icon={<Clock size={18} />}
          color="cyan"
          description={t(
            'accounting.overdue.avgMonthsDesc',
            'Promedio histórico'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.epaaConcentration', 'Monto EPAA %')}
          value={`${epaaPct.toFixed(1)}%`}
          icon={<Percent size={18} />}
          color="orange"
          description={t(
            'accounting.overdue.epaaPctDesc',
            '% Concentración EPAA'
          )}
        />
      </div>

      <div className="overdue-charts-grid">
        <div className="overdue-chart-card">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t('accounting.dashboard.evolutionTitle', 'Evolución Histórica')}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.evolutionSubtitle',
                'Deuda anual 2013-2026'
              )}
            </p>
          </div>
          <div className="overdue-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border-color)"
                />
                <XAxis
                  dataKey="year"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(var(--primary-rgb), 0.05)' }}
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                  formatter={(val: number) => [
                    formatCurrency(val),
                    t('accounting.overdue.totalDebtAmount', 'Deuda Total')
                  ]}
                />
                <Bar
                  dataKey="totalDebtAmount"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overdue-chart-card">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t('accounting.dashboard.compositionTitle', 'Composición Global')}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.compositionSubtitle',
                'Porcentaje de cargos totales'
              )}
            </p>
          </div>
          <div className="overdue-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="40%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="75%"
                  paddingAngle={8}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: number) => formatCurrency(val)}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingRight: '1rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overdue-chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t('accounting.dashboard.trendTitle', 'Tendencia de Morosidad')}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.trendSubtitle',
                'Meses acumulados por año'
              )}
            </p>
          </div>
          <div className="overdue-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="trendGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border-color)"
                />
                <XAxis
                  dataKey="year"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  name="Meses Mora"
                  dataKey="totalMonthsPastDue"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fill="url(#trendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
