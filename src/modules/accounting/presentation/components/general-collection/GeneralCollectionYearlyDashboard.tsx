import React from 'react';
import type { GeneralYearlyKPIResponse } from '../../../domain/models/GenelarCollection';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { GeneralCollectionDashboard } from './GeneralCollectionDashboard';
import '../../styles/payments/GeneralCollectionDashboards.css';
import { DynamicBarChart } from '@/shared/presentation/components/Charts/DynamicBarChart';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { useTranslation } from 'react-i18next';
import { MdCable } from 'react-icons/md';
import { IconIncomes } from '@/shared/presentation/components/icons/custom-icons';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import { MultiLineChart } from '@/shared/presentation/components/Charts/MultiLineChart';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
import { Button } from '@/shared/presentation/components/Button/Button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

// ─── Sub-component: YearPaginator ─────────────────────────────────────────────
// SRP: owns only pagination state & rendering. OCP: swappable without touching
// the parent. ISP: receives only what it needs.
interface YearPaginatorProps {
  items: GeneralYearlyKPIResponse[];
}
function YearPaginator({ items }: YearPaginatorProps) {
  const { t } = useTranslation();
  const [idx, setIdx] = React.useState(0);

  // ── DIP: react to external items changes (e.g. filter applied) ──────────────
  // When the items array changes, clamp idx to a valid position so we never
  // access items[idx] === undefined. If the current year still exists in the
  // new result set, keep it; otherwise reset to 0 (most-recent year first).
  React.useEffect(() => {
    if (items.length === 0) return;
    setIdx((prev) => {
      const prevYear = items[prev]?.year;
      if (prevYear !== undefined) return prev; // same year still in range
      return 0; // year was filtered out — go to first result
    });
  }, [items]);

  if (items.length === 0) return null;

  // Defensive clamp: guarantees active is never undefined even during re-renders
  const safeIdx = Math.min(idx, items.length - 1);
  const total = items.length;
  const active = items[safeIdx];

  return (
    <div className="yearly-paginator-card">
      <div className="yearly-paginator-header">
        <div className="yearly-paginator-title-block">
          <span className="yearly-paginator-label">
            {t(
              'accounting.dashboard.yearlyPaginatorLabel',
              'Dashboard por Año'
            )}
          </span>
          <h2 className="yearly-paginator-year">{active.year}</h2>
        </div>
        <div className="yearly-paginator-controls">
          <div className="yearly-paginator-dots">
            {items.map((item, i) => (
              <button
                key={item.year}
                className={`yearly-dot${i === safeIdx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
                title={String(item.year)}
              />
            ))}
          </div>
          <Tooltip content="Año anterior" position="top">
            <Button
              disabled={safeIdx >= total - 1}
              onClick={() => setIdx((i) => Math.min(i + 1, total - 1))}
              variant="outline"
              size="sm"
              circle
            >
              <FaArrowLeft size={16} />
            </Button>
          </Tooltip>

          <span className="yearly-paginator-counter">
            {safeIdx + 1}&nbsp;/&nbsp;{total}
          </span>
          <Tooltip content="Año siguiente" position="top">
            <Button
              disabled={safeIdx <= 0}
              onClick={() => setIdx((i) => Math.max(i - 1, 0))}
              title="Año siguiente"
              variant="outline"
              size="sm"
              circle
            >
              <FaArrowRight size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="yearly-paginator-content">
        <GeneralCollectionDashboard
          kpi={active}
          isLoading={false}
          isCompact={true}
        />
      </div>
    </div>
  );
}

interface GeneralCollectionYearlyDashboardProps {
  kpi: GeneralYearlyKPIResponse[];
  unfilteredKpi?: GeneralYearlyKPIResponse[];
  isLoading: boolean;
}

// ─── Adapter / Presenter Logic ────────────────────────────────────────────────
// Follows SRP: Separates domain model transformation from UI rendering.
interface ChartDataItem {
  year: number | string;
  totalCollection: number;
  trashRateCollection: number;
  epaaCollection: number;
  surchargeCollection: number;
  improvementsCollection: number;
  uniqueCadastralKeys: number;
  totalBills: number;
}

const mapDomainToChartData = (
  kpis: GeneralYearlyKPIResponse[]
): ChartDataItem[] => {
  return kpis.map((item) => ({
    year: item.year,
    totalCollection: item.sections.reduce(
      (acc, s) => acc + (s.amountTotal || 0),
      0
    ),
    trashRateCollection:
      item.sections.find((s) => s.typeKPI === 'COLLECTION TRASH RATE')
        ?.amountTotal || 0,
    epaaCollection:
      item.sections.find((s) => s.typeKPI === 'EPAA')?.amountTotal || 0,
    surchargeCollection:
      item.sections.find((s) => s.typeKPI === 'SURCHARGE')?.amountTotal || 0,
    improvementsCollection:
      item.sections.find((s) => s.typeKPI === 'IMPROVEMENTS')?.amountTotal || 0,
    uniqueCadastralKeys: item.uniqueCadastralKeys || 0,
    totalBills: item.totalBillsIssued || 0
  }));
};
// ──────────────────────────────────────────────────────────────────────────────

const mapFullAllYearsTotal = (
  kpis: GeneralYearlyKPIResponse[]
): ChartDataItem => {
  return {
    year: 'All Years',
    totalCollection: kpis.reduce(
      (acc, s) =>
        acc +
        (s.sections.reduce((acc, s) => acc + (s.amountTotal || 0), 0) || 0),
      0
    ),
    trashRateCollection: kpis.reduce(
      (acc, s) =>
        acc +
        (s.sections.find((s) => s.typeKPI === 'COLLECTION TRASH RATE')
          ?.amountTotal || 0),
      0
    ),
    epaaCollection: kpis.reduce(
      (acc, s) =>
        acc + (s.sections.find((s) => s.typeKPI === 'EPAA')?.amountTotal || 0),
      0
    ),
    surchargeCollection: kpis.reduce(
      (acc, s) =>
        acc +
        (s.sections.find((s) => s.typeKPI === 'SURCHARGE')?.amountTotal || 0),
      0
    ),
    improvementsCollection: kpis.reduce(
      (acc, s) =>
        acc +
        (s.sections.find((s) => s.typeKPI === 'IMPROVEMENTS')?.amountTotal ||
          0),
      0
    ),
    uniqueCadastralKeys: kpis.reduce(
      (acc, s) => acc + (s.uniqueCadastralKeys || 0),
      0
    ),
    totalBills: kpis.reduce((acc, s) => acc + (s.totalBillsIssued || 0), 0)
  };
};

export const GeneralCollectionYearlyDashboard: React.FC<
  GeneralCollectionYearlyDashboardProps
> = ({ kpi, unfilteredKpi, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="dashboard-loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (!kpi || kpi.length === 0) {
    return (
      <EmptyState
        message="No hay datos"
        description="No hay datos de KPIs anuales para mostrar"
        variant="info"
      />
    );
  }

  // Use unfiltered data for historical chart context
  const sourceHistoricalData =
    unfilteredKpi && unfilteredKpi.length > 0 ? unfilteredKpi : kpi;
  const chartData = mapDomainToChartData(sourceHistoricalData);

  const sourseFullAllYearsTotal =
    unfilteredKpi && unfilteredKpi.length > 0
      ? mapFullAllYearsTotal(unfilteredKpi)
      : mapFullAllYearsTotal(kpi);

  console.log(sourseFullAllYearsTotal);

  return (
    <div className="dashboard-list-container yearly">
      {/* ─── Year Paginator (SRP: state owned by YearPaginator sub-component) ─── */}
      <YearPaginator items={kpi} />

      {/* ─── 0. All-Years Multi-Metric Overview ─── */}
      <div
        className="dashboard-chart-body"
        style={{ marginBottom: '0.5rem', flex: 'none', height: 'auto' }}
      >
        <div className="overdue-chart-header">
          <h3 className="overdue-chart-title">
            {t(
              'accounting.dashboard.analysisTitle',
              'Análisis Comparativo Anual'
            )}
          </h3>
          <p className="overdue-chart-subtitle">
            {t(
              'accounting.dashboard.analysisSubtitle',
              `Comparativa de todas las métricas ${chartData[0].year}–${chartData[chartData.length - 1].year}`
            )}
          </p>
          <div className="year-tooltip year-tooltip-evolution">
            <div className="year-tooltip-evolution-item gradient-color-clients">
              <div className="year-tooltip-evolution-icon">
                <span
                  style={{
                    fontWeight: 800,
                    color: '#3b82f6',
                    fontSize: '1.2rem'
                  }}
                >
                  #
                </span>
              </div>
              <span>
                {t('accounting.overdue.clientsWithDebt', 'N° Facturas')}
                <p>
                  {NumberFormatter.formatInteger(
                    sourseFullAllYearsTotal.totalBills
                  )}
                </p>
              </span>
            </div>
            <div className="year-tooltip-evolution-item gradient-color-keys">
              <div className="year-tooltip-evolution-icon">
                <IconIncomes />
              </div>
              <span>
                {t('accounting.overdue.totalDebtAmount', 'Recaudación Total')}
                <p>
                  {CurrencyFormatter.format(
                    sourseFullAllYearsTotal.totalCollection
                  )}
                </p>
              </span>
            </div>
          </div>
        </div>

        {/* Fixed-height wrapper — same pattern as GradientAreaChart usage */}
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
          <MultiLineChart<ChartDataItem>
            data={chartData}
            dataKeyX="year"
            nameX={t('accounting.dashboard.yearX', 'Año')}
            nameY={t('accounting.dashboard.amountY', 'Monto ($)')}
            yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
            showLegend={true}
            showLabels={false}
            normalizeData={true}
            tooltipFormatterOrComponent={(payload: ChartDataItem) => (
              <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                <span>
                  {t('accounting.dashboard.yearX', 'Año')}
                  <p>{payload.year}</p>
                </span>
                <span>
                  {t('accounting.dashboard.totalCollected', 'T. Recaudación')}
                  <p>{CurrencyFormatter.format(payload.totalCollection)}</p>
                </span>
                <span>
                  {t('accounting.dashboard.trashRateCollected', 'T. Basura')}
                  <p>{CurrencyFormatter.format(payload.trashRateCollection)}</p>
                </span>
                <span>
                  {t('accounting.dashboard.epaaCollected', 'EPAA')}
                  <p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
                </span>
                <span>
                  {t('accounting.dashboard.surchargeCollected', 'Recargos')}
                  <p>{CurrencyFormatter.format(payload.surchargeCollection)}</p>
                </span>
                <span>
                  {t('accounting.dashboard.improvementsCollected', 'Mejoras')}
                  <p>
                    {CurrencyFormatter.format(payload.improvementsCollection)}
                  </p>
                </span>
              </div>
            )}
            series={[
              {
                dataKey: 'totalCollection',
                name: t(
                  'accounting.dashboard.totalCollected',
                  'Recaudación Total'
                ),
                color: '#f59e0b',
                glow: true,
                strokeWidth: 3
              },
              {
                dataKey: 'trashRateCollection',
                name: t(
                  'accounting.dashboard.trashRateCollected',
                  'Tasa Basura'
                ),
                color: '#ef4444',
                glow: true,
                strokeWidth: 2.5
              },
              {
                dataKey: 'epaaCollection',
                name: t('accounting.dashboard.epaaCollected', 'EPAA'),
                color: '#10b981',
                glow: true,
                strokeWidth: 2.5
              },
              {
                dataKey: 'surchargeCollection',
                name: t('accounting.dashboard.surchargeCollected', 'Recargos'),
                color: '#a855f7',
                glow: false,
                strokeWidth: 2,
                strokeDasharray: '5 3'
              },
              {
                dataKey: 'improvementsCollection',
                name: t(
                  'accounting.dashboard.improvementsCollected',
                  'Mejoras'
                ),
                color: '#06b6d4',
                glow: false,
                strokeWidth: 2,
                strokeDasharray: '5 3'
              }
            ]}
          />
        </div>
      </div>

      {/* ─── 1. Evolution of Total Collection ─── */}
      <div className="dashboard-stats-grid" style={{ marginTop: '0rem' }}>
        {/* Left: Trend Volume Area Chart */}
        <div className="dashboard-chart-body" style={{ marginBottom: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t(
                'accounting.dashboard.trendVolumeTitle',
                'Tendencia N° Facturas'
              )}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.trendVolumeSubtitle',
                `Evolución de volumen de facturación activa`
              )}
            </p>
            {
              <div className="year-tooltip year-tooltip-evolution">
                <div className="year-tooltip-evolution-item gradient-color-clients">
                  <div className="year-tooltip-evolution-icon">
                    <span
                      style={{
                        fontWeight: 800,
                        color: '#3b82f6',
                        fontSize: '1.2rem'
                      }}
                    >
                      #
                    </span>
                  </div>
                  <span>
                    {t('accounting.overdue.clientsWithDebt', 'N° Facturas')}
                    <p>
                      {NumberFormatter.formatInteger(
                        sourseFullAllYearsTotal.totalBills
                      )}
                    </p>
                  </span>
                </div>
              </div>
            }
          </div>

          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <GradientAreaChart
              data={chartData}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => {
                return (
                  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                    <span>
                      {t('accounting.dashboard.yearX', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t('accounting.dashboard.totalBillsY', 'Facturas')}
                      <p>{NumberFormatter.formatInteger(payload.totalBills)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.totalCollected',
                        'Recaudación Total'
                      )}
                      <p>{CurrencyFormatter.format(payload.totalCollection)}</p>
                    </span>
                  </div>
                );
              }}
              dataKeyX="year"
              dataKeyY="totalBills"
              yAxisFormatter={(val) => NumberFormatter.formatInteger(val)}
              nameY="N° Facturas"
              nameX="Año"
              startColor="#a855f7"
              endColor="#06b6d4"
              valuePosition="none"
              customLabel={({
                x,
                y,
                payload,
                index
              }: {
                x: number;
                y: number;
                payload: ChartDataItem;
                index: number;
              }) => {
                let anchor = 'middle';
                let xOffset = x;
                if (index === 0) {
                  anchor = 'start';
                  xOffset = x - 5;
                } else if (index === chartData.length - 1) {
                  anchor = 'end';
                  xOffset = x + 5;
                }

                const isEven = index % 2 === 0;
                const yPosition = isEven ? y - 25 : y + 15;

                return (
                  <text
                    x={xOffset}
                    y={yPosition}
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
                      fill="#10b981"
                      fontSize={10}
                      fontWeight={800}
                    >
                      {CurrencyFormatter.formatCompact(payload.totalCollection)}
                    </tspan>
                    <tspan
                      x={xOffset}
                      dy={14}
                      fill="var(--text-main)"
                      fontSize={11}
                      fontWeight={700}
                    >
                      {NumberFormatter.formatInteger(payload.totalBills)}
                    </tspan>
                    <tspan
                      fill="var(--text-secondary)"
                      fontSize={10}
                      fontWeight={500}
                      dx={3}
                    >
                      Fact.
                    </tspan>
                  </text>
                );
              }}
            />
          </div>
        </div>

        {/* Right: Evolución Total Bar Chart */}
        <div className="dashboard-chart-body" style={{ margin: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t(
                'accounting.dashboard.evolutionTitle',
                'Evolución Histórica Total'
              )}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.evolutionSubtitle',
                `Recaudación Total anual ${chartData[0].year} - ${chartData[chartData.length - 1].year}`
              )}
            </p>
            {
              <div className="year-tooltip year-tooltip-evolution">
                <div className="year-tooltip-evolution-item gradient-color-clients">
                  <div className="year-tooltip-evolution-icon">
                    <span
                      style={{
                        fontWeight: 800,
                        color: '#3b82f6',
                        fontSize: '1.2rem'
                      }}
                    >
                      #
                    </span>
                  </div>
                  <span>
                    {t('accounting.overdue.clientsWithDebt', 'N° Facturas')}
                    <p>
                      {Number(
                        sourseFullAllYearsTotal.totalBills
                      ).toLocaleString('es-EC')}
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
                      {Number(
                        sourseFullAllYearsTotal.uniqueCadastralKeys
                      ).toLocaleString('es-EC')}
                    </p>
                  </span>
                </div>
                <div className="year-tooltip-evolution-item gradient-color-keys">
                  <div className="year-tooltip-evolution-icon">
                    <IconIncomes />
                  </div>
                  <span>
                    {t(
                      'accounting.overdue.totalDebtAmount',
                      'Recaudación Total'
                    )}
                    <p>
                      {CurrencyFormatter.format(
                        sourseFullAllYearsTotal.totalCollection
                      )}
                    </p>
                  </span>
                </div>
                <div className="year-tooltip-evolution-item gradient-color-keys">
                  <div className="year-tooltip-evolution-icon">
                    <IconIncomes />
                  </div>
                  <span>
                    {t(
                      'accounting.overdue.totalDebtAmount',
                      'Recaudación TB Total'
                    )}
                    <p>
                      {CurrencyFormatter.format(
                        sourseFullAllYearsTotal.trashRateCollection
                      )}
                    </p>
                  </span>
                </div>
              </div>
            }
          </div>

          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <DynamicBarChart
              data={chartData}
              dataKeyX="year"
              dataKeyY="totalCollection"
              nameY={t('accounting.dashboard.totalCollectionY', 'Monto Total')}
              nameX={t('accounting.dashboard.yearX', 'Año')}
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => {
                return (
                  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                    <span>
                      {t('accounting.dashboard.yearX', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.totalCollected',
                        'Recaudación Total'
                      )}
                      <p>{CurrencyFormatter.format(payload.totalCollection)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.trashRateCollected',
                        'T. Tasa Basura'
                      )}
                      <p>
                        {CurrencyFormatter.format(payload.trashRateCollection)}
                      </p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.epaaCollected',
                        'T. Recaudación EPAA'
                      )}
                      <p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.surchargeCollected',
                        'T. Recaudación Recargos'
                      )}
                      <p>
                        {CurrencyFormatter.format(payload.surchargeCollection)}
                      </p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.improvementsCollected',
                        'T. Recaudación Mejoras'
                      )}
                      <p>
                        {CurrencyFormatter.format(
                          payload.improvementsCollection
                        )}
                      </p>
                    </span>
                    <span>
                      {t('accounting.dashboard.uniqueClients', 'Acometidas')}
                      <p>
                        {Number(payload.uniqueCadastralKeys).toLocaleString(
                          'es-EC'
                        )}
                      </p>
                    </span>
                  </div>
                );
              }}
              valuePosition={'top'}
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>
      </div>

      {/* ─── 2. Evolution of Trash Rate ─── */}
      <div className="dashboard-stats-grid">
        {/* Left: Trend Trash Rate Area Chart */}
        <div className="dashboard-chart-body" style={{ marginBottom: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t(
                'accounting.dashboard.trendTrashRateTitle',
                'Tendencia T. Basura'
              )}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.trendTrashRateSubtitle',
                `Evolución histórica de Tasa de Basura`
              )}
            </p>
            {
              <div className="year-tooltip year-tooltip-evolution">
                <div className="year-tooltip-evolution-item gradient-color-keys">
                  <div className="year-tooltip-evolution-icon">
                    <IconIncomes />
                  </div>
                  <span>
                    {t(
                      'accounting.overdue.totalDebtAmount',
                      'Recaudación TB Total'
                    )}
                    <p>
                      {CurrencyFormatter.format(
                        sourseFullAllYearsTotal.trashRateCollection
                      )}
                    </p>
                  </span>
                </div>
              </div>
            }
          </div>

          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <GradientAreaChart
              data={chartData}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => {
                return (
                  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                    <span>
                      {t('accounting.dashboard.yearX', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.trashRateCollected',
                        'Tasa Basura'
                      )}
                      <p>
                        {CurrencyFormatter.format(payload.trashRateCollection)}
                      </p>
                    </span>
                  </div>
                );
              }}
              dataKeyX="year"
              dataKeyY="trashRateCollection"
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              nameY="Tasa Basura"
              nameX="Año"
              startColor="#3b82f6"
              endColor="#10b981"
              valuePosition="top"
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>

        {/* Right: Evolution Trash Rate Bar Chart */}
        <div className="dashboard-chart-body" style={{ margin: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t(
                'accounting.dashboard.evolutionTitle',
                'Evolución Histórica Tasa Basura'
              )}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.evolutionSubtitle',
                `Recaudación Tasa Basura anual ${chartData[0].year} - ${chartData[chartData.length - 1].year}`
              )}
            </p>
            {
              <div className="year-tooltip year-tooltip-evolution">
                <div className="year-tooltip-evolution-item gradient-color-clients">
                  <div className="year-tooltip-evolution-icon">
                    <span
                      style={{
                        fontWeight: 800,
                        color: '#3b82f6',
                        fontSize: '1.2rem'
                      }}
                    >
                      #
                    </span>
                  </div>
                  <span>
                    {t('accounting.overdue.clientsWithDebt', 'N° Facturas')}
                    <p>
                      {Number(
                        sourseFullAllYearsTotal.totalBills
                      ).toLocaleString('es-EC')}
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
                      {Number(
                        sourseFullAllYearsTotal.uniqueCadastralKeys
                      ).toLocaleString('es-EC')}
                    </p>
                  </span>
                </div>
                <div className="year-tooltip-evolution-item gradient-color-keys">
                  <div className="year-tooltip-evolution-icon">
                    <IconIncomes />
                  </div>
                  <span>
                    {t(
                      'accounting.overdue.totalDebtAmount',
                      'Recaudación TB Total'
                    )}
                    <p>
                      {CurrencyFormatter.format(
                        sourseFullAllYearsTotal.trashRateCollection
                      )}
                    </p>
                  </span>
                </div>
              </div>
            }
          </div>

          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <DynamicBarChart
              data={chartData}
              dataKeyX="year"
              dataKeyY="trashRateCollection"
              nameY={t(
                'accounting.dashboard.totalCollectionY',
                'Monto Total TB'
              )}
              nameX={t('accounting.dashboard.yearX', 'Año')}
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => {
                return (
                  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                    <span>
                      {t('accounting.dashboard.yearX', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.totalCollected',
                        'Recaudación Total'
                      )}
                      <p>{CurrencyFormatter.format(payload.totalCollection)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.trashRateCollected',
                        'T. Tasa Basura'
                      )}
                      <p>
                        {CurrencyFormatter.format(payload.trashRateCollection)}
                      </p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.epaaCollected',
                        'T. Recaudación EPAA'
                      )}
                      <p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.surchargeCollected',
                        'T. Recaudación Recargos'
                      )}
                      <p>
                        {CurrencyFormatter.format(payload.surchargeCollection)}
                      </p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.improvementsCollected',
                        'T. Recaudación Mejoras'
                      )}
                      <p>
                        {CurrencyFormatter.format(
                          payload.improvementsCollection
                        )}
                      </p>
                    </span>
                    <span>
                      {t('accounting.dashboard.uniqueClients', 'Acometidas')}
                      <p>
                        {Number(payload.uniqueCadastralKeys).toLocaleString(
                          'es-EC'
                        )}
                      </p>
                    </span>
                  </div>
                );
              }}
              valuePosition={'top'}
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>
      </div>

      {/* ─── 3. Evolution of Epaa Value ─── */}
      <div className="dashboard-stats-grid">
        {/* Left: Trend EPAA Area Chart */}
        <div className="dashboard-chart-body" style={{ marginBottom: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t('accounting.dashboard.trendEpaaTitle', 'Tendencia Valor EPAA')}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.trendEpaaSubtitle',
                `Evolución de recaudación neta EPAA`
              )}
            </p>
            {
              <div className="year-tooltip year-tooltip-evolution">
                <div className="year-tooltip-evolution-item gradient-color-keys">
                  <div className="year-tooltip-evolution-icon">
                    <IconIncomes />
                  </div>
                  <span>
                    {t(
                      'accounting.overdue.totalDebtAmount',
                      'Recaudación EPAA'
                    )}
                    <p>
                      {CurrencyFormatter.format(
                        sourseFullAllYearsTotal.epaaCollection
                      )}
                    </p>
                  </span>
                </div>
              </div>
            }
          </div>

          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <GradientAreaChart
              data={chartData}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => {
                return (
                  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                    <span>
                      {t('accounting.dashboard.yearX', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.epaaCollected',
                        'Recaudación EPAA'
                      )}
                      <p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
                    </span>
                  </div>
                );
              }}
              dataKeyX="year"
              dataKeyY="epaaCollection"
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              nameY="Valor EPAA"
              nameX="Año"
              startColor="#f59e0b"
              endColor="#ef4444"
              valuePosition="top"
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>

        {/* Right: Evolution EPAA Bar Chart */}
        <div className="dashboard-chart-body" style={{ margin: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              {t(
                'accounting.dashboard.evolutionTitle',
                'Evolución Histórica Valor EPAA'
              )}
            </h3>
            <p className="overdue-chart-subtitle">
              {t(
                'accounting.dashboard.evolutionSubtitle',
                `Recaudación Valor EPAA anual ${chartData[0].year} - ${chartData[chartData.length - 1].year}`
              )}
            </p>
            {
              <div className="year-tooltip year-tooltip-evolution">
                <div className="year-tooltip-evolution-item gradient-color-clients">
                  <div className="year-tooltip-evolution-icon">
                    <span
                      style={{
                        fontWeight: 800,
                        color: '#3b82f6',
                        fontSize: '1.2rem'
                      }}
                    >
                      #
                    </span>
                  </div>
                  <span>
                    {t('accounting.overdue.clientsWithDebt', 'N° Facturas')}
                    <p>
                      {Number(
                        sourseFullAllYearsTotal.totalBills
                      ).toLocaleString('es-EC')}
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
                      {Number(
                        sourseFullAllYearsTotal.uniqueCadastralKeys
                      ).toLocaleString('es-EC')}
                    </p>
                  </span>
                </div>
                <div className="year-tooltip-evolution-item gradient-color-keys">
                  <div className="year-tooltip-evolution-icon">
                    <IconIncomes />
                  </div>
                  <span>
                    {t(
                      'accounting.overdue.totalDebtAmount',
                      'Recaudación EPAA'
                    )}
                    <p>
                      {CurrencyFormatter.format(
                        sourseFullAllYearsTotal.epaaCollection
                      )}
                    </p>
                  </span>
                </div>
              </div>
            }
          </div>

          <div style={{ width: '100%', height: '350px', position: 'relative' }}>
            <DynamicBarChart
              data={chartData}
              dataKeyX="year"
              dataKeyY="epaaCollection"
              nameY={t(
                'accounting.dashboard.totalCollectionY',
                'Monto Total EPAA'
              )}
              nameX={t('accounting.dashboard.yearX', 'Año')}
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => {
                return (
                  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                    <span>
                      {t('accounting.dashboard.yearX', 'Año')}
                      <p>{payload.year}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.totalCollected',
                        'Recaudación Total'
                      )}
                      <p>{CurrencyFormatter.format(payload.totalCollection)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.trashRateCollected',
                        'T. Tasa Basura'
                      )}
                      <p>
                        {CurrencyFormatter.format(payload.trashRateCollection)}
                      </p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.epaaCollected',
                        'T. Recaudación EPAA'
                      )}
                      <p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.surchargeCollected',
                        'T. Recaudación Recargos'
                      )}
                      <p>
                        {CurrencyFormatter.format(payload.surchargeCollection)}
                      </p>
                    </span>
                    <span>
                      {t(
                        'accounting.dashboard.improvementsCollected',
                        'T. Recaudación Mejoras'
                      )}
                      <p>
                        {CurrencyFormatter.format(
                          payload.improvementsCollection
                        )}
                      </p>
                    </span>
                    <span>
                      {t('accounting.dashboard.uniqueClients', 'Acometidas')}
                      <p>
                        {Number(payload.uniqueCadastralKeys).toLocaleString(
                          'es-EC'
                        )}
                      </p>
                    </span>
                  </div>
                );
              }}
              valuePosition={'top'}
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
