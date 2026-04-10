import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer } from 'recharts';
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
  MonthlyDebtSummary,
  OverdueSummary,
  YearlyOverdueSummary
} from '../../domain/models/OverdueReading';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import { DynamicBarChart } from '@/shared/presentation/components/Charts/DynamicBarChart';
import '../styles/OverdueDashboard.css';
import { MdCable } from 'react-icons/md';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
/*
const fmtMoney = (n: number) =>
  `$${Number(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
*/
interface YearlyOverdueDashboardProps {
  yearlyData: YearlyOverdueSummary[]; // All years for charts
  selectedYearData: YearlyOverdueSummary | null; // Specific year for KPIs
  monthlyDebtData: MonthlyDebtSummary[];
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

// ── Dashboard Component (Anual Focus) ──
export const YearlyOverdueDashboard: React.FC<YearlyOverdueDashboardProps> = ({
  yearlyData,
  selectedYearData,
  monthlyDebtData,
  globalSummary,
  isLoading
}) => {
  const { t } = useTranslation();
  const loadingProgress = useSimulatedProgress(isLoading);

  const [isCompact, setIsCompact] = useState(true);
  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 1380); // Strict threshold to ensure perfect clarity
    handleResize(); // trigger once immediately
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = useMemo(() => {
    return [...(yearlyData || [])].sort((a, b) => a.year - b.year);
  }, [yearlyData]);

  const metrics = useMemo(() => {
    if (!selectedYearData) return null;
    return {
      totalDebt: selectedYearData.totalDebtAmount,
      totalClients: selectedYearData.clientsWithDebt,
      totalMonths: selectedYearData.totalMonthsPastDue,
      totalEpaa: selectedYearData.totalEpaaValue,
      totalTrash: selectedYearData.totalTrashRate,
      totalSurcharge: selectedYearData.totalSurcharge,
      totalKeys: selectedYearData.totalUniqueCadastralKeysByYear,
      clientsOver6: selectedYearData.clientsOver6Months,
      clientsOver12: selectedYearData.clientsOver1Year,
      maxMonths: selectedYearData.maxMonthsInDebt,
      avgMonths: selectedYearData.avgMonthsPastDue,
      avgDebt: selectedYearData.avgDebtPerClient
    };
  }, [selectedYearData]);

  const chartDataMonthly = useMemo(() => {
    if (!monthlyDebtData) return [];
    const selectedYear = monthlyDebtData.filter(
      (m) => m.year === selectedYearData?.year
    );
    return [...(selectedYear || [])].sort((a, b) => a.month - b.month);
  }, [monthlyDebtData]);

  /*
  const revenueStatus = useMemo(() => {
    if (!selectedYearData) return [];
    const totalTrashRate = selectedYearData.totalTrashRate;
    const totalSurcharge = selectedYearData.totalSurcharge;
    const totalEpaaValue = selectedYearData.totalEpaaValue;
    const totalDebtAmount = selectedYearData.totalDebtAmount;
    const totalDebtAmountP =
      totalDebtAmount - totalTrashRate - totalSurcharge - totalEpaaValue;
    return {
      P: totalDebtAmountP,
      B: totalTrashRate,
      S: totalSurcharge
    };
  }, [selectedYearData]);
  */

  const epaaPct = metrics ? (metrics.totalEpaa / metrics.totalDebt) * 100 : 0;

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
          label={t('common.loading', 'Sincronizando análisis...')}
        />
      </div>
    );
  }

  return (
    <div className="overdue-dashboard">
      {/* ── Charts Grid - Only Evolution Monthly debts ── */}

      <div className="overdue-charts-grid">
        <div className="overdue-chart-card">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t(
                'accounting.dashboard.trendTitle',
                `Tendencia Mensual - Deuda - ${chartDataMonthly[0]?.year || selectedYearData?.year || ''}`
              )}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.trendSubtitle',
                'Evolución de clientes con mora'
              )}
            </p>
          </div>
          {selectedYearData && (
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-clients">
                <div className="year-tooltip-evolution-icon">
                  <Users size={22} color="blue" />
                </div>
                <span>
                  {t('accounting.overdue.clientsWithDebt', 'Total Clientes')}
                  <p>
                    {NumberFormatter.formatInteger(
                      selectedYearData.clientsWithDebt
                    )}
                  </p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <MdCable size={22} color="green" />
                </div>
                <span>
                  {t('accounting.overdue.cadastralKeys', 'T. Acometidas')}
                  <p>
                    {NumberFormatter.formatInteger(
                      selectedYearData.totalUniqueCadastralKeys
                    )}
                  </p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-debt">
                <div className="year-tooltip-evolution-icon">
                  <DollarSign size={22} color="red" />
                </div>
                <span>
                  {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                  <p>
                    {CurrencyFormatter.format(selectedYearData.totalDebtAmount)}
                  </p>
                </span>
              </div>
            </div>
          )}
          <div className="overdue-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <GradientAreaChart
                data={chartDataMonthly}
                tooltipFormatterOrComponent={(payload: MonthlyDebtSummary) => {
                  return (
                    <div className="year-tooltip">
                      <span>
                        {t('accounting.overdue.month', 'Mes')}
                        <p>{payload.monthName}</p>
                      </span>
                      <span>
                        {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                        <p>
                          {CurrencyFormatter.format(payload.totalDebtAmount)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalTrashRate',
                          'T. Tasa Basura'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalTrashRate)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalEpaaValue',
                          'T. Deuda EPAA'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalEpaaValue)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.clientsWithDebtThisMonth',
                          'N° Clientes'
                        )}
                        <p>
                          {NumberFormatter.formatInteger(
                            payload.clientsWithDebtThisMonth
                          )}
                        </p>
                      </span>
                    </div>
                  );
                }}
                dataKeyX="monthName"
                dataKeyY="clientsWithDebtThisMonth"
                yAxisFormatter={(val) => NumberFormatter.formatInteger(val)}
                nameY="N° Clientes"
                nameX="Meses"
                startColor="#a855f7"
                endColor="#06b6d4"
                valuePosition={isCompact ? 'none' : 'top'}
                customLabel={({
                  x,
                  y,
                  payload,
                  index
                }: {
                  x: number;
                  y: number;
                  payload: MonthlyDebtSummary;
                  index: number;
                }) => {
                  // Dynamic anchoring so the first and last labels don't get clipped or overlap the Y-axis
                  let anchor = 'middle';
                  let xOffset = x;
                  if (index === 0) {
                    anchor = 'start';
                    xOffset = x - 5; // Push slightly right of the start dot line
                  } else if (index === chartData.length - 1) {
                    anchor = 'end';
                    xOffset = x + 5; // Push slightly left of the end dot line
                  }

                  // Zig-zag pattern: one directly ABOVE the dot, the next directly BELOW the dot
                  const isEven = index % 2 === 0;
                  const yPosition = isEven ? y - 25 : y + 15;

                  return (
                    <text
                      x={xOffset}
                      y={yPosition} /* Exactly alternating up and down */
                      textAnchor={anchor as any}
                      className="responsive-chart-label"
                      style={{
                        paintOrder: 'stroke fill',
                        stroke: 'var(--surface)',
                        strokeLinejoin: 'round',
                        strokeWidth: 3
                      }}
                    >
                      <tspan
                        x={xOffset}
                        fill="#10b981" /* Green elegant color for the amount */
                        fontSize={10}
                        fontWeight={800}
                      >
                        {payload
                          ? CurrencyFormatter.format(payload.totalDebtAmount)
                          : ''}
                      </tspan>
                      <tspan
                        x={xOffset}
                        dy={14}
                        fill="var(--text-main)"
                        fontSize={11}
                        fontWeight={700}
                      >
                        {NumberFormatter.formatInteger(
                          payload.clientsWithDebtThisMonth
                        )}
                      </tspan>
                      <tspan
                        fill="var(--text-secondary)"
                        fontSize={10}
                        fontWeight={500}
                        dx={3}
                      >
                        {t('common.clients', 'Clientes')}
                      </tspan>
                    </text>
                  );
                }}
              />
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overdue-chart-card">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t(
                'accounting.dashboard.evolutionTitle',
                `Evolución Mensual - ${chartDataMonthly[0]?.year || selectedYearData?.year || ''}`
              )}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.evolutionSubtitle',
                'Deuda mensual comparada'
              )}
            </p>
          </div>
          {selectedYearData && (
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-clients">
                <div className="year-tooltip-evolution-icon">
                  <Users size={22} color="blue" />
                </div>
                <span>
                  {t('accounting.overdue.clientsWithDebt', 'Total Clientes')}
                  <p>
                    {NumberFormatter.formatInteger(
                      selectedYearData.clientsWithDebt
                    )}
                  </p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <MdCable size={22} color="green" />
                </div>
                <span>
                  {t('accounting.overdue.cadastralKeys', 'T. Acometidas')}
                  <p>
                    {NumberFormatter.formatInteger(
                      selectedYearData.totalUniqueCadastralKeys
                    )}
                  </p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-debt">
                <div className="year-tooltip-evolution-icon">
                  <DollarSign size={22} color="red" />
                </div>
                <span>
                  {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                  <p>
                    {CurrencyFormatter.format(selectedYearData.totalDebtAmount)}
                  </p>
                </span>
              </div>
            </div>
          )}
          <div className="overdue-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <DynamicBarChart
                data={chartDataMonthly}
                dataKeyX="monthName"
                dataKeyY="totalDebtAmount"
                nameY={t(
                  'accounting.overdue.totalDebtAmountMonthly',
                  'Deuda Mensual'
                )}
                nameX="Meses"
                yAxisFormatter={(val) => CurrencyFormatter.format(val, false)}
                tooltipFormatterOrComponent={(payload: MonthlyDebtSummary) => {
                  return (
                    <div className="year-tooltip">
                      <span>
                        {t('accounting.overdue.month', 'Mes')}
                        <p>{payload.monthName}</p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalDebtAmountMonthly',
                          'Deuda Mensual'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalDebtAmount)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalTrashRate',
                          'T. Tasa Basura'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalTrashRate)}
                        </p>
                      </span>
                      <span>
                        {t('accounting.overdue.totalEpaaValue', 'Deuda EPAA')}
                        <p>
                          {CurrencyFormatter.format(payload.totalEpaaValue)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.clientsWithDebtThisMonth',
                          'N° Clientes'
                        )}
                        <p>
                          {NumberFormatter.formatInteger(
                            payload.clientsWithDebtThisMonth
                          )}
                        </p>
                      </span>
                    </div>
                  );
                }}
                valuePosition="top"
                labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
              />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* ── 10 KPI Grid ── */}
      <div className="overdue-dashboard-kpi-grid">
        <KpiCard
          label={t('accounting.overdue.totalDebtAmount', 'Deuda Anual')}
          value={CurrencyFormatter.format(metrics.totalDebt)}
          icon={<DollarSign size={18} />}
          color="blue"
          description={t(
            'accounting.overdue.totalDebtYearDesc',
            `Deuda en ${selectedYearData?.year}`
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsWithDebt', 'Clientes Mora')}
          value={CurrencyFormatter.format(metrics.totalClients)}
          icon={<Users size={18} />}
          color="purple"
          description={t(
            'accounting.overdue.clientsYearDesc',
            'Clientes en este periodo'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.avgDebtPerClient', 'Deuda Prom.')}
          value={CurrencyFormatter.format(metrics.avgDebt)}
          icon={<TrendingUp size={18} />}
          color="green"
          description={t(
            'accounting.overdue.avgDebtYearDesc',
            'Promedio por deudor'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.totalMonthsPastDue', 'Meses Mora')}
          value={CurrencyFormatter.format(metrics.totalMonths)}
          icon={<Calendar size={18} />}
          color="amber"
          description={t(
            'accounting.overdue.totalMonthsYearDesc',
            'Acumulado del año'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.cadastralKeys', 'Claves Cat.')}
          value={CurrencyFormatter.format(metrics.totalKeys)}
          icon={<Map size={18} />}
          color="indigo"
          description={t(
            'accounting.overdue.keysYearDesc',
            'Predios involucrados'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsOver6', '> 6 Meses')}
          value={CurrencyFormatter.format(metrics.clientsOver6)}
          icon={<ShieldAlert size={18} />}
          color="rose"
          description={t(
            'accounting.overdue.clients6mYearDesc',
            'Mora media-alta'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsOver12', '> 1 Año')}
          value={CurrencyFormatter.format(metrics.clientsOver12)}
          icon={<AlertOctagon size={18} />}
          color="red"
          description={t(
            'accounting.overdue.clients1yYearDesc',
            'Mora crítica'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.maxMonths', 'Máxima Mora')}
          value={metrics.maxMonths}
          icon={<History size={18} />}
          color="teal"
          description={t(
            'accounting.overdue.maxMonthsYearDesc',
            'Récord meses deuda'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.avgMonths', 'Mora Prom.')}
          value={`${metrics.avgMonths.toFixed(1)} ${t('common.months', 'Meses')}`}
          icon={<Clock size={18} />}
          color="cyan"
          description={t(
            'accounting.overdue.avgMonthsYearDesc',
            'Media de morosidad'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.epaaConcentration', 'Monto EPAA %')}
          value={`${epaaPct.toFixed(1)}%`}
          icon={<Percent size={18} />}
          color="orange"
          description={t(
            'accounting.overdue.epaaPctYearDesc',
            'Peso de la deuda principal'
          )}
        />
      </div>

      {/* ── Charts Grid - Only Evolution and Trend as requested ── */}
      <div className="overdue-charts-grid">
        <div className="overdue-chart-card">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t('accounting.dashboard.evolutionTitle', 'Evolución')}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.evolutionSubtitle',
                'Deuda anual comparada'
              )}
            </p>
          </div>
          {globalSummary && (
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-clients">
                <div className="year-tooltip-evolution-icon">
                  <Users size={22} color="blue" />
                </div>
                <span>
                  {t('accounting.overdue.clientsWithDebt', 'Total Clientes')}
                  <p>{globalSummary.totalClientsWithDebt}</p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <MdCable size={22} color="green" />
                </div>
                <span>
                  {t('accounting.overdue.cadastralKeys', 'T. Acometidas')}
                  <p>{globalSummary.totalUniqueCadastralKeys}</p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-debt">
                <div className="year-tooltip-evolution-icon">
                  <DollarSign size={22} color="red" />
                </div>
                <span>
                  {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                  <p>
                    {CurrencyFormatter.format(globalSummary.totalDebtAmount)}
                  </p>
                </span>
              </div>
            </div>
          )}
          <div className="overdue-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <DynamicBarChart
                data={chartData}
                dataKeyX="year"
                dataKeyY="totalDebtAmount"
                nameY={t('accounting.overdue.totalDebtAmount', 'Deuda Anual')}
                nameX="Año"
                yAxisFormatter={(val) => CurrencyFormatter.formatAxis(val)}
                tooltipFormatterOrComponent={(
                  payload: YearlyOverdueSummary
                ) => {
                  return (
                    <div className="year-tooltip">
                      <span>
                        {t('accounting.overdue.year', 'Año')}
                        <p>{payload.year}</p>
                      </span>
                      <span>
                        {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                        <p>
                          {CurrencyFormatter.format(payload.totalDebtAmount)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalTrashRate',
                          'T. Tasa Basura'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalTrashRate)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalEpaaValue',
                          'T. Deuda EPAA'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalEpaaValue)}
                        </p>
                      </span>
                      <span>
                        {t('accounting.overdue.clientsWithDebt', 'N° Clientes')}
                        <p>
                          {NumberFormatter.formatInteger(
                            payload.clientsWithDebt
                          )}
                        </p>
                      </span>
                    </div>
                  );
                }}
                valuePosition="top"
                labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
              />
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overdue-chart-card">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t('accounting.dashboard.trendTitle', 'Tendencia Meses Mora')}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.trendSubtitle',
                'Evolución de meses acumulados'
              )}
            </p>
          </div>
          {globalSummary && (
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-clients">
                <div className="year-tooltip-evolution-icon">
                  <Users size={22} color="blue" />
                </div>
                <span>
                  {t('accounting.overdue.clientsWithDebt', 'Total Clientes')}
                  <p>{globalSummary.totalClientsWithDebt}</p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <MdCable size={22} color="green" />
                </div>
                <span>
                  {t('accounting.overdue.cadastralKeys', 'T. Acometidas')}
                  <p>{globalSummary.totalUniqueCadastralKeys}</p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-debt">
                <div className="year-tooltip-evolution-icon">
                  <DollarSign size={22} color="red" />
                </div>
                <span>
                  {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                  <p>
                    {CurrencyFormatter.format(globalSummary.totalDebtAmount)}
                  </p>
                </span>
              </div>
            </div>
          )}
          <div className="overdue-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <GradientAreaChart
                data={chartData}
                tooltipFormatterOrComponent={(
                  payload: YearlyOverdueSummary
                ) => {
                  return (
                    <div className="year-tooltip">
                      <span>
                        {t('accounting.overdue.year', 'Año')}
                        <p>{payload.year}</p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalDebtAmount',
                          'T. Deuda Anual'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalDebtAmount)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalTrashRate',
                          'T. Tasa Basura'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalTrashRate)}
                        </p>
                      </span>
                      <span>
                        {t(
                          'accounting.overdue.totalEpaaValue',
                          'T. Deuda EPAA'
                        )}
                        <p>
                          {CurrencyFormatter.format(payload.totalEpaaValue)}
                        </p>
                      </span>
                      <span>
                        {t('accounting.overdue.clientsWithDebt', 'N° Clientes')}
                        <p>
                          {NumberFormatter.formatInteger(
                            payload.clientsWithDebt
                          )}
                        </p>
                      </span>
                    </div>
                  );
                }}
                dataKeyX="year"
                dataKeyY="totalMonthsPastDue"
                nameY="Meses Mora"
                nameX="Año"
                startColor="#a855f7"
                endColor="#06b6d4"
                valuePosition={isCompact ? 'none' : 'top'}
                customLabel={({
                  x,
                  y,
                  payload,
                  index
                }: {
                  x: number;
                  y: number;
                  payload: YearlyOverdueSummary;
                  index: number;
                }) => {
                  // Dynamic anchoring so the first and last labels don't get clipped or overlap the Y-axis
                  let anchor = 'middle';
                  let xOffset = x;
                  if (index === 0) {
                    anchor = 'start';
                    xOffset = x - 5; // Push slightly right of the start dot line
                  } else if (index === chartData.length - 1) {
                    anchor = 'end';
                    xOffset = x + 5; // Push slightly left of the end dot line
                  }

                  // Zig-zag pattern: one directly ABOVE the dot, the next directly BELOW the dot
                  const isEven = index % 2 === 0;
                  const yPosition = isEven ? y - 25 : y + 15;

                  return (
                    <text
                      x={xOffset}
                      y={yPosition} /* Exactly alternating up and down */
                      textAnchor={anchor as any}
                      className="responsive-chart-label"
                      style={{
                        paintOrder: 'stroke fill',
                        stroke: 'var(--surface)',
                        strokeLinejoin: 'round',
                        strokeWidth: 3
                      }}
                    >
                      <tspan
                        x={xOffset}
                        fill="#10b981" /* Green elegant color for the amount */
                        fontSize={10}
                        fontWeight={800}
                      >
                        {payload
                          ? CurrencyFormatter.format(payload.totalDebtAmount)
                          : ''}
                      </tspan>
                      <tspan
                        x={xOffset}
                        dy={14}
                        fill="var(--text-main)"
                        fontSize={11}
                        fontWeight={700}
                      >
                        {NumberFormatter.formatInteger(payload.clientsWithDebt)}
                      </tspan>
                      <tspan
                        fill="var(--text-secondary)"
                        fontSize={10}
                        fontWeight={500}
                        dx={3}
                      >
                        {t('common.clients', 'Clientes')}
                      </tspan>
                    </text>
                  );
                }}
              />
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
