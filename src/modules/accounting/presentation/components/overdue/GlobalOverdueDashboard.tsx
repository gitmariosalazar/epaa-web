import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  Clock,
  Trash2
} from 'lucide-react';
import type {
  YearlyOverdueSummary,
  OverdueSummary
} from '../../../domain/models/OverdueReading';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import { DynamicBarChart } from '@/shared/presentation/components/Charts/DynamicBarChart';
import { DynamicPieChart } from '@/shared/presentation/components/Charts/DynamicPieChart';
import '../../styles/overdue/OverdueDashboard.css';
import { MdCable } from 'react-icons/md';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';

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

  // Auto-hide inner labels on tight screens where they inevitably overlap
  const [isCompact, setIsCompact] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 1380); // Strict threshold to ensure perfect clarity
    handleResize(); // trigger once immediately
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      avgDebt: globalSummary.avgDebtPerClient,
      totalImprovementsInterest: globalSummary.totalImprovementsInterest,
      totalInterestCalculated: globalSummary.totalInterestCalculated
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
        },
        {
          name: t('accounting.overdue.improvementsInterest', 'Int. Mejoras'),
          value: metrics.totalImprovementsInterest || 0,
          color: '#8b5cf6'
        },
        {
          name: t('accounting.overdue.totalInterestCalculated', 'Int. Calculado'),
          value: metrics.totalInterestCalculated || 0,
          color: '#ec4899'
        }
      ]
    : [];

  const tableData = useMemo(() => {
    if (!metrics) return [];
    const total = metrics.totalDebt || 1;
    return [
      {
        id: 'epaa',
        concept: t('accounting.overdue.epaaValue', 'Monto EPAA'),
        value: metrics.totalEpaa,
        percentage: (metrics.totalEpaa / total) * 100,
        color: '#3b82f6',
        icon: <DollarSign size={16} />,
        impact: t('accounting.overdue.impactPrincipal', 'Principal'),
        impactClass: 'blue'
      },
      {
        id: 'trash',
        concept: t('accounting.overdue.trashRate', 'Tasa Desecho'),
        value: metrics.totalTrash,
        percentage: (metrics.totalTrash / total) * 100,
        color: '#10b981',
        icon: <Trash2 size={16} />,
        impact: t('accounting.overdue.impactMedium', 'Medio'),
        impactClass: 'green'
      },
      {
        id: 'surcharge',
        concept: t('accounting.overdue.surcharge', 'Recargos'),
        value: metrics.totalSurcharge,
        percentage: (metrics.totalSurcharge / total) * 100,
        color: '#f59e0b',
        icon: <AlertOctagon size={16} />,
        impact: t('accounting.overdue.impactMedium', 'Medio'),
        impactClass: 'amber'
      },
      {
        id: 'improvements',
        concept: t('accounting.overdue.improvementsInterest', 'Int. Mejoras'),
        value: metrics.totalImprovementsInterest || 0,
        percentage: ((metrics.totalImprovementsInterest || 0) / total) * 100,
        color: '#8b5cf6',
        icon: <TrendingUp size={16} />,
        impact: t('accounting.overdue.impactLow', 'Bajo'),
        impactClass: 'purple'
      },
      {
        id: 'calculated',
        concept: t('accounting.overdue.totalInterestCalculated', 'Int. Calculado'),
        value: metrics.totalInterestCalculated || 0,
        percentage: ((metrics.totalInterestCalculated || 0) / total) * 100,
        color: '#ec4899',
        icon: <Clock size={16} />,
        impact: t('accounting.overdue.impactLow', 'Bajo'),
        impactClass: 'rose'
      }
    ];
  }, [metrics, t]);

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
          value={CurrencyFormatter.format(metrics.totalDebt)}
          icon={<DollarSign size={18} />}
          color="blue"
          description={t(
            'accounting.overdue.totalDebtDesc',
            'Suma global vencida'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsWithDebt', 'Clientes Mora')}
          value={NumberFormatter.formatInteger(metrics.totalClients)}
          icon={<Users size={18} />}
          color="purple"
          description={t(
            'accounting.overdue.clientsWithDebtDesc',
            'Total clientes únicos'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.avgDebtPerClient', 'Deuda Prom.')}
          value={CurrencyFormatter.format(metrics.avgDebt)}
          icon={<TrendingUp size={18} />}
          color="green"
          description={t(
            'accounting.overdue.avgDebtDesc',
            'Promedio organización'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.totalMonthsPastDue', 'Meses Mora')}
          value={NumberFormatter.formatInteger(metrics.totalMonths)}
          icon={<Calendar size={18} />}
          color="amber"
          description={t(
            'accounting.overdue.totalMonthsDesc',
            'Suma meses de mora'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.cadastralKeys', 'Claves Cat.')}
          value={NumberFormatter.formatInteger(metrics.totalKeys)}
          icon={<Map size={18} />}
          color="indigo"
          description={t(
            'accounting.overdue.keysDesc',
            'Predios totales en mora'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsOver6', '> 6 Meses')}
          value={NumberFormatter.formatInteger(metrics.clientsOver6)}
          icon={<ShieldAlert size={18} />}
          color="rose"
          description={t(
            'accounting.overdue.clientsOver6Desc',
            'Críticos (6+ meses)'
          )}
        />
        <KpiCard
          label={t('accounting.overdue.clientsOver12', '> 1 Año')}
          value={NumberFormatter.formatInteger(metrics.clientsOver12)}
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
          value={`${NumberFormatter.format(metrics.avgMonths, 1)} ${t('common.monthsNames', 'Meses')}`}
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
            <DynamicBarChart
              data={chartData}
              dataKeyX="year"
              dataKeyY="totalDebtAmount"
              nameY={t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
              nameX={t('accounting.overdue.year', 'Año')}
              yAxisFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              tooltipFormatterOrComponent={(payload: YearlyOverdueSummary) => {
                return (
                  <div className="year-tooltip">
                    <span>
                      {t('accounting.overdue.year', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                      <p>{CurrencyFormatter.format(payload.totalDebtAmount)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalTrashRate', 'T. Tasa Basura')}
                      <p>{CurrencyFormatter.format(payload.totalTrashRate)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalEpaaValue', 'T. Deuda EPAA')}
                      <p>{CurrencyFormatter.format(payload.totalEpaaValue)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalSurcharge', 'T. Recargos')}
                      <p>{CurrencyFormatter.format(payload.totalSurcharge)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.improvementsInterest', 'T. Int. Mejoras')}
                      <p>{CurrencyFormatter.format(payload.totalImprovementsInterest)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalInterestCalculated', 'T. Int. Calculado')}
                      <p>{CurrencyFormatter.format(payload.totalInterestCalculated)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.overdue.totalUniqueClients',
                        'N° Clientes'
                      )}
                      <p>
                        {NumberFormatter.formatInteger(payload.clientsWithDebt)}
                      </p>
                    </span>
                  </div>
                );
              }}
              valuePosition={
                isCompact ? 'none' : 'top'
              } /* React intelligently unmounts labels completely */
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
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
            <DynamicPieChart
              data={compositionData}
              dataKey="value"
              nameKey="name"
              tooltipFormatterOrComponent={(payload: {
                name: string;
                value: number;
                color: string;
              }) => CurrencyFormatter.format(payload.value)}
            />
          </div>
        </div>

        <div
          className="overdue-chart-card"
          style={{ gridColumn: 'span 2', minHeight: '450px' }}
        >
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
          {globalSummary && (
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-clients">
                <div className="year-tooltip-evolution-icon">
                  <Users size={22} color="blue" />
                </div>
                <span>
                  {t('accounting.overdue.clientsWithDebt', 'Total Clientes')}
                  <p>
                    {NumberFormatter.formatInteger(
                      globalSummary.totalClientsWithDebt
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
                      globalSummary.totalUniqueCadastralKeys
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
                    {CurrencyFormatter.format(globalSummary.totalDebtAmount)}
                  </p>
                </span>
              </div>
            </div>
          )}
          <div className="overdue-chart-body">
            <GradientAreaChart
              data={chartData}
              dataKeyX="year"
              dataKeyY="totalMonthsPastDue"
              nameY={t('accounting.overdue.totalMonthsPastDue', 'Meses Mora')}
              nameX={t('accounting.overdue.year', 'Año')}
              startColor="#8b5cf6"
              endColor="#00aeffff"
              valuePosition={
                isCompact ? 'none' : 'top'
              } /* React intelligently unmounts labels completely */
              yAxisFormatter={(value: number) => value.toFixed(2)}
              tooltipFormatterOrComponent={(payload: YearlyOverdueSummary) => {
                return (
                  <div className="year-tooltip">
                    <span>
                      {t('accounting.overdue.year', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalDebtAmount', 'Deuda Total')}
                      <p>{CurrencyFormatter.format(payload.totalDebtAmount)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalTrashRate', 'T. Tasa Basura')}
                      <p>{CurrencyFormatter.format(payload.totalTrashRate)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalEpaaValue', 'T. Deuda EPAA')}
                      <p>{CurrencyFormatter.format(payload.totalEpaaValue)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalSurcharge', 'T. Recargos')}
                      <p>{CurrencyFormatter.format(payload.totalSurcharge)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.improvementsInterest', 'T. Int. Mejoras')}
                      <p>{CurrencyFormatter.format(payload.totalImprovementsInterest)}</p>
                    </span>
                    <span>
                      {t('accounting.overdue.totalInterestCalculated', 'T. Int. Calculado')}
                      <p>{CurrencyFormatter.format(payload.totalInterestCalculated)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.overdue.totalUniqueClients',
                        'N° Clientes'
                      )}
                      <p>
                        {NumberFormatter.formatInteger(payload.clientsWithDebt)}
                      </p>
                    </span>
                  </div>
                );
              }}
              customLabel={({
                x,
                y,
                value,
                payload,
                index
              }: {
                x: number;
                y: number;
                value: number;
                payload: { totalDebtAmount: number };
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
                      {value}
                    </tspan>
                    <tspan
                      fill="var(--text-secondary)"
                      fontSize={10}
                      fontWeight={500}
                      dx={3}
                    >
                      {t('common.monthsNames', 'Meses')}
                    </tspan>
                  </text>
                );
              }}
            />
          </div>
        </div>

        <div className="overdue-table-card">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t('accounting.dashboard.executiveSummaryTitle', 'Resumen Ejecutivo de la Cartera')}
            </h3>
            <p className="overdue-chart-subtitle">
              {t('accounting.dashboard.executiveSummarySubtitle', 'Desglose financiero detallado y distribución de la cartera vencida')}
            </p>
          </div>
          <div className="overdue-table-wrapper">
            <table className="overdue-summary-table">
              <thead>
                <tr>
                  <th>{t('accounting.overdue.tableConcept', 'Componente de Deuda')}</th>
                  <th>{t('accounting.overdue.tableAmount', 'Monto Total')}</th>
                  <th>{t('accounting.overdue.tableParticipation', 'Participación %')}</th>
                  <th>{t('accounting.overdue.tableImpact', 'Nivel de Impacto')}</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="overdue-table-concept-cell">
                        <div 
                          className="overdue-table-icon-container" 
                          style={{ backgroundColor: `${row.color}15`, color: row.color }}
                        >
                          {row.icon}
                        </div>
                        <span style={{ fontWeight: 600 }}>{row.concept}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}>
                      {CurrencyFormatter.format(row.value)}
                    </td>
                    <td>
                      <div className="overdue-table-progress-container">
                        <div className="overdue-table-progress-bar">
                          <div 
                            className="overdue-table-progress-fill" 
                            style={{ width: `${row.percentage}%`, backgroundColor: row.color }}
                          />
                        </div>
                        <span className="overdue-table-percentage-text">
                          {row.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`overdue-table-badge overdue-table-badge--${row.impactClass}`}>
                        {row.impact}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="table-row-total">
                  <td>
                    <div className="overdue-table-concept-cell">
                      <div 
                        className="overdue-table-icon-container" 
                        style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }}
                      >
                        <DollarSign size={16} />
                      </div>
                      <span style={{ fontWeight: 800 }}>{t('common.total', 'Total General')}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums', color: 'var(--primary)' }}>
                    {CurrencyFormatter.format(metrics.totalDebt)}
                  </td>
                  <td>
                    <div className="overdue-table-progress-container">
                      <div className="overdue-table-progress-bar">
                        <div 
                          className="overdue-table-progress-fill" 
                          style={{ width: '100%', backgroundColor: 'var(--primary)' }}
                        />
                      </div>
                      <span className="overdue-table-percentage-text" style={{ fontWeight: 850 }}>
                        100.0%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="overdue-table-badge overdue-table-badge--total">
                      {t('accounting.overdue.portfolioTotal', 'Cartera')}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
