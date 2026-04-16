import React from 'react';
import type {
  GeneralMonthlyKPIResponse,
  GeneralKPIResponse,
  KPISection
} from '../../../domain/models/GenelarCollection';
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
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// ─── Pure helpers (SRP) ───────────────────────────────────────────────────────
const MONTH_ABBR: Record<number, string> = {
  1: 'Ene',
  2: 'Feb',
  3: 'Mar',
  4: 'Abr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Ago',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dic'
};
const MONTH_FULL: Record<number, string> = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre'
};
const abbr = (m: number | string) => MONTH_ABBR[Number(m)] ?? String(m);
const full = (m: number | string) => MONTH_FULL[Number(m)] ?? String(m);

// ─── Chart DTO ────────────────────────────────────────────────────────────────
interface ChartDataItem {
  monthLabel: string;
  month: number | string;
  year: number | string;
  totalCollection: number;
  trashRateCollection: number;
  epaaCollection: number;
  surchargeCollection: number;
  improvementsCollection: number;
  uniqueCadastralKeys: number;
  totalBills: number;
}

const toChartItem = (item: GeneralMonthlyKPIResponse): ChartDataItem => ({
  monthLabel: abbr(item.month),
  month: item.month,
  year: item.year,
  totalCollection: item.sections.reduce((a, s) => a + (s.amountTotal || 0), 0),
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
});

// ─── Domain aggregation (SRP) ─────────────────────────────────────────────────
const KPI_TYPES: KPISection['typeKPI'][] = [
  'EPAA',
  'SURCHARGE',
  'COLLECTION TRASH RATE',
  'THIRD PARTIES',
  'IMPROVEMENTS'
];

const aggregateMonthsToKPI = (
  months: GeneralMonthlyKPIResponse[]
): GeneralKPIResponse => ({
  uniqueCadastralKeys: months.reduce(
    (a, m) => a + (m.uniqueCadastralKeys || 0),
    0
  ),
  totalBillsIssued: months.reduce((a, m) => a + (m.totalBillsIssued || 0), 0),
  averagePaidBill:
    months.reduce((a, m) => a + (m.averagePaidBill || 0), 0) /
    Math.max(months.length, 1),
  countNotes: months.reduce((a, m) => a + (m.countNotes || 0), 0),
  totalNotesAmount: months.reduce((a, m) => a + (m.totalNotesAmount || 0), 0),
  codeTitle: months[0]?.codeTitle ?? '',
  sections: KPI_TYPES.map((type) => {
    const rows = months.flatMap((m) =>
      m.sections.filter((s) => s.typeKPI === type)
    );
    return {
      typeKPI: type,
      countTotal: rows.reduce((a, s) => a + (s.countTotal || 0), 0),
      countPending: rows.reduce((a, s) => a + (s.countPending || 0), 0),
      countCollected: rows.reduce((a, s) => a + (s.countCollected || 0), 0),
      countZero: rows.reduce((a, s) => a + (s.countZero || 0), 0),
      countNull: rows.reduce((a, s) => a + (s.countNull || 0), 0),
      countGreaterThanZero: rows.reduce(
        (a, s) => a + (s.countGreaterThanZero || 0),
        0
      ),
      countLessThanZero: rows.reduce(
        (a, s) => a + (s.countLessThanZero || 0),
        0
      ),
      amountTotal: rows.reduce((a, s) => a + (s.amountTotal || 0), 0),
      amountPending: rows.reduce((a, s) => a + (s.amountPending || 0), 0),
      amountCollected: rows.reduce((a, s) => a + (s.amountCollected || 0), 0),
      amountDiscounts: rows.reduce((a, s) => a + (s.amountDiscounts || 0), 0)
    };
  })
});

// Group all months by year, sorted ascending (2017 → 2026). Newest year = last index.
const groupByYear = (
  items: GeneralMonthlyKPIResponse[]
): { year: string; months: GeneralMonthlyKPIResponse[] }[] =>
  Array.from(
    items.reduce((map, item) => {
      const y = String(item.year);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(item);
      return map;
    }, new Map<string, GeneralMonthlyKPIResponse[]>())
  )
    .map(([year, months]) => ({
      year,
      months: [...months].sort((a, b) => Number(a.month) - Number(b.month))
    }))
    .sort((a, b) => Number(a.year) - Number(b.year)); // ascending: oldest→newest

// ─── Shared tooltip (SRP) ─────────────────────────────────────────────────────
const buildTooltip = (payload: ChartDataItem) => (
  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
    <span>
      Mes
      <p>
        {full(payload.month)} {payload.year}
      </p>
    </span>
    <span>
      T. Recaudación<p>{CurrencyFormatter.format(payload.totalCollection)}</p>
    </span>
    <span>
      T. Basura<p>{CurrencyFormatter.format(payload.trashRateCollection)}</p>
    </span>
    <span>
      EPAA<p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
    </span>
    <span>
      Recargos<p>{CurrencyFormatter.format(payload.surchargeCollection)}</p>
    </span>
    <span>
      Mejoras<p>{CurrencyFormatter.format(payload.improvementsCollection)}</p>
    </span>
    <span>
      Acometidas
      <p>{Number(payload.uniqueCadastralKeys).toLocaleString('es-EC')}</p>
    </span>
  </div>
);

// ─── Sub-component: YearlyMonthsPaginator ────────────────────────────────────
// SRP   : owns year-pagination state + Jan-Dec chart rendering per year.
// OCP   : swappable without touching parent.
// ISP   : receives only what it needs.
// KEY DESIGN:
//   allItems      = rawMonthlyKpi  → charts ALWAYS show full Jan-Dec (never 1 bar)
//   filteredItems = filtered kpi   → drives which year to jump to on filter change;
//                                    also used for the compact KPI summary header
interface YearlyMonthsPaginatorProps {
  /** Raw (unfiltered) data — charts always show all months of a year */
  allItems: GeneralMonthlyKPIResponse[];
  /** Filtered data — used to auto-navigate to filtered year & KPI header */
  filteredItems: GeneralMonthlyKPIResponse[];
  /** Jump paginator to this year (from the external FILTRAR POR AÑO picker) */
  jumpToYear?: number;
}

function YearlyMonthsPaginator({
  allItems,
  filteredItems,
  jumpToYear
}: YearlyMonthsPaginatorProps) {
  const { t } = useTranslation();
  // MAX_SAFE_INTEGER → clamped to (length-1) on first render = newest year
  const [idx, setIdx] = React.useState(Number.MAX_SAFE_INTEGER);

  // Group RAW data so charts always have Jan-Dec even when a month filter is active
  const yearGroups = React.useMemo(() => groupByYear(allItems), [allItems]);

  // When filteredItems change or yearGroups load, auto-navigate:
  //   - Single filtered year  → jump there
  //   - Empty filter          → show newest year (last index, ascending sort)
  //   - Multiple years        → clamp to valid range, keep position
  React.useEffect(() => {
    if (yearGroups.length === 0) return;
    const uniqueFilteredYears = Array.from(
      new Set(filteredItems.map((m) => String(m.year)))
    );
    if (uniqueFilteredYears.length === 1) {
      const targetIdx = yearGroups.findIndex(
        (g) => g.year === uniqueFilteredYears[0]
      );
      if (targetIdx !== -1) setIdx(targetIdx);
    } else if (filteredItems.length === 0) {
      // No Consultar active → always show newest year
      setIdx(yearGroups.length - 1);
    } else {
      // Multiple filtered years → stay put, just clamp
      setIdx((prev) => Math.min(prev, yearGroups.length - 1));
    }
  }, [filteredItems, yearGroups]);
  // Jump to a specific year when requested by an external picker (FILTRAR POR AÑO)
  React.useEffect(() => {
    if (!jumpToYear || yearGroups.length === 0) return;
    const targetIdx = yearGroups.findIndex(
      (g) => g.year === String(jumpToYear)
    );
    if (targetIdx !== -1) setIdx(targetIdx);
  }, [jumpToYear, yearGroups]);

  if (yearGroups.length === 0) return null;

  const safeIdx = Math.min(idx, yearGroups.length - 1); // newest = last index
  const total = yearGroups.length;
  const activeYear = yearGroups[safeIdx];

  // Charts use FULL year data from allItems (always Jan-Dec)
  const monthsData = activeYear.months.map(toChartItem);

  // Compact KPI summary uses filtered months for the active year, or all if no filter
  const filteredMonthsForYear = filteredItems.filter(
    (m) => String(m.year) === activeYear.year
  );
  const summaryMonths =
    filteredMonthsForYear.length > 0
      ? filteredMonthsForYear
      : activeYear.months;
  const yearKPI = aggregateMonthsToKPI(summaryMonths);

  const totalCollection = monthsData.reduce((a, m) => a + m.totalCollection, 0);
  const totalBills = monthsData.reduce((a, m) => a + m.totalBills, 0);
  const totalTB = monthsData.reduce((a, m) => a + m.trashRateCollection, 0);
  const totalEpaa = monthsData.reduce((a, m) => a + m.epaaCollection, 0);

  return (
    <div className="yearly-paginator-card">
      {/* ── Paginator header: dots + arrows (äaño filter is in the right filter bar) ── */}
      <div className="yearly-paginator-header">
        <div className="yearly-paginator-title-block">
          <span className="yearly-paginator-label">
            {t(
              'accounting.dashboard.monthlyPaginatorLabel',
              'Dashboard Mensual — Ene a Dic'
            )}
          </span>
          <h2 className="yearly-paginator-year">{activeYear.year}</h2>
        </div>

        <div className="yearly-paginator-controls">
          {/* Dots */}
          <div className="yearly-paginator-dots">
            {yearGroups.map((g, i) => (
              <button
                key={g.year}
                className={`yearly-dot${i === safeIdx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
                title={g.year}
              />
            ))}
          </div>

          {/* Prev arrow — goes to older year (lower index in ascending sort) */}
          <Tooltip content="Año anterior" position="top">
            <Button
              disabled={safeIdx <= 0}
              onClick={() => setIdx((i) => Math.max(i - 1, 0))}
              variant="outline"
              size="sm"
              circle
            >
              <FaArrowLeft size={16} />
            </Button>
          </Tooltip>

          {/* Counter */}
          <span className="yearly-paginator-counter">
            {safeIdx + 1}&nbsp;/&nbsp;{total}
          </span>

          {/* Next arrow — goes to newer year (higher index in ascending sort) */}
          <Tooltip content="Año siguiente" position="top">
            <Button
              disabled={safeIdx >= total - 1}
              onClick={() => setIdx((i) => Math.min(i + 1, total - 1))}
              variant="outline"
              size="sm"
              circle
            >
              <FaArrowRight size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* ── Compact yearly KPI (uses filtered months for active year) ── */}
      <div className="yearly-paginator-content">
        <GeneralCollectionDashboard
          kpi={yearKPI}
          isLoading={false}
          isCompact={true}
        />
      </div>

      {/* ── Section 0: Multi-metric Comparative (all metrics Jan-Dec active year) ── */}
      <div
        className="dashboard-chart-body"
        style={{ marginBottom: '0.5rem', flex: 'none', height: 'auto' }}
      >
        <div className="overdue-chart-header">
          <h3 className="overdue-chart-title">Análisis Comparativo Mensual</h3>
          <p className="overdue-chart-subtitle">
            Comparativa de todas las métricas Ene–Dic {activeYear.year}
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
                N° Facturas<p>{NumberFormatter.formatInteger(totalBills)}</p>
              </span>
            </div>
            <div className="year-tooltip-evolution-item gradient-color-keys">
              <div className="year-tooltip-evolution-icon">
                <IconIncomes />
              </div>
              <span>
                Recaudación Total
                <p>{CurrencyFormatter.format(totalCollection)}</p>
              </span>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
          <MultiLineChart<ChartDataItem>
            data={monthsData}
            dataKeyX="monthLabel"
            nameX="Mes"
            nameY="Monto ($)"
            yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
            showLegend={true}
            normalizeData={true}
            tooltipFormatterOrComponent={(payload: ChartDataItem) => (
              <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                <span>
                  Mes
                  <p>
                    {full(payload.month)} {activeYear.year}
                  </p>
                </span>
                <span>
                  T. Recaudación
                  <p>{CurrencyFormatter.format(payload.totalCollection)}</p>
                </span>
                <span>
                  T. Basura
                  <p>{CurrencyFormatter.format(payload.trashRateCollection)}</p>
                </span>
                <span>
                  EPAA<p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
                </span>
                <span>
                  Recargos
                  <p>{CurrencyFormatter.format(payload.surchargeCollection)}</p>
                </span>
                <span>
                  Mejoras
                  <p>
                    {CurrencyFormatter.format(payload.improvementsCollection)}
                  </p>
                </span>
              </div>
            )}
            series={[
              {
                dataKey: 'totalCollection',
                name: 'Recaudación Total',
                color: '#f59e0b',
                glow: true,
                strokeWidth: 3
              },
              {
                dataKey: 'trashRateCollection',
                name: 'Tasa Basura',
                color: '#ef4444',
                glow: true,
                strokeWidth: 2.5
              },
              {
                dataKey: 'epaaCollection',
                name: 'EPAA',
                color: '#10b981',
                glow: true,
                strokeWidth: 2.5
              },
              {
                dataKey: 'surchargeCollection',
                name: 'Recargos',
                color: '#a855f7',
                glow: false,
                strokeWidth: 2,
                strokeDasharray: '5 3'
              },
              {
                dataKey: 'improvementsCollection',
                name: 'Mejoras',
                color: '#06b6d4',
                glow: false,
                strokeWidth: 2,
                strokeDasharray: '5 3'
              }
            ]}
          />
        </div>
      </div>

      {/* ── Section 1: N° Facturas + Recaudación Total ── */}
      <div className="dashboard-stats-grid" style={{ marginTop: '0.5rem' }}>
        <div className="dashboard-chart-body" style={{ marginBottom: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">Tendencia N° Facturas</h3>
            <p className="overdue-chart-subtitle">Ene–Dic {activeYear.year}</p>
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
                  N° Facturas<p>{NumberFormatter.formatInteger(totalBills)}</p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <IconIncomes />
                </div>
                <span>
                  Recaudación Total
                  <p>{CurrencyFormatter.format(totalCollection)}</p>
                </span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <GradientAreaChart
              data={monthsData}
              dataKeyX="monthLabel"
              dataKeyY="totalBills"
              yAxisFormatter={(val) => NumberFormatter.formatInteger(val)}
              nameY="N° Facturas"
              nameX="Mes"
              startColor="#a855f7"
              endColor="#06b6d4"
              valuePosition="none"
              tooltipFormatterOrComponent={(payload: ChartDataItem) => (
                <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                  <span>
                    Mes<p>{full(payload.month)}</p>
                  </span>
                  <span>
                    Facturas
                    <p>{NumberFormatter.formatInteger(payload.totalBills)}</p>
                  </span>
                  <span>
                    Recaudación
                    <p>{CurrencyFormatter.format(payload.totalCollection)}</p>
                  </span>
                </div>
              )}
            />
          </div>
        </div>

        <div className="dashboard-chart-body" style={{ margin: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">Evolución Histórica Total</h3>
            <p className="overdue-chart-subtitle">
              Recaudación Total mensual Ene–Dic {activeYear.year}
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
                  N° Facturas<p>{Number(totalBills).toLocaleString('es-EC')}</p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <MdCable size={22} color="green" />
                </div>
                <span>
                  T. Acometidas
                  <p>
                    {Number(yearKPI.uniqueCadastralKeys).toLocaleString(
                      'es-EC'
                    )}
                  </p>
                </span>
              </div>
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <IconIncomes />
                </div>
                <span>
                  Recaudación Total
                  <p>{CurrencyFormatter.format(totalCollection)}</p>
                </span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <DynamicBarChart
              data={monthsData}
              dataKeyX="monthLabel"
              dataKeyY="totalCollection"
              nameY="Monto Total"
              nameX="Mes"
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              tooltipFormatterOrComponent={(payload: ChartDataItem) =>
                buildTooltip(payload)
              }
              valuePosition="top"
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>
      </div>

      {/* ── Section 2: Tasa Basura ── */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-chart-body" style={{ marginBottom: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">Tendencia Tasa Basura</h3>
            <p className="overdue-chart-subtitle">Ene–Dic {activeYear.year}</p>
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <IconIncomes />
                </div>
                <span>
                  Recaudación TB<p>{CurrencyFormatter.format(totalTB)}</p>
                </span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <GradientAreaChart
              data={monthsData}
              dataKeyX="monthLabel"
              dataKeyY="trashRateCollection"
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              nameY="Tasa Basura"
              nameX="Mes"
              startColor="#3b82f6"
              endColor="#10b981"
              valuePosition="top"
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => (
                <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                  <span>
                    Mes<p>{full(payload.month)}</p>
                  </span>
                  <span>
                    Tasa Basura
                    <p>
                      {CurrencyFormatter.format(payload.trashRateCollection)}
                    </p>
                  </span>
                </div>
              )}
            />
          </div>
        </div>

        <div className="dashboard-chart-body" style={{ margin: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              Evolución Histórica Tasa Basura
            </h3>
            <p className="overdue-chart-subtitle">
              Recaudación TB mensual Ene–Dic {activeYear.year}
            </p>
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <IconIncomes />
                </div>
                <span>
                  Recaudación TB Total<p>{CurrencyFormatter.format(totalTB)}</p>
                </span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <DynamicBarChart
              data={monthsData}
              dataKeyX="monthLabel"
              dataKeyY="trashRateCollection"
              nameY="Monto TB"
              nameX="Mes"
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              tooltipFormatterOrComponent={(payload: ChartDataItem) =>
                buildTooltip(payload)
              }
              valuePosition="top"
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: EPAA ── */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-chart-body" style={{ marginBottom: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">Tendencia Valor EPAA</h3>
            <p className="overdue-chart-subtitle">Ene–Dic {activeYear.year}</p>
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <IconIncomes />
                </div>
                <span>
                  Recaudación EPAA<p>{CurrencyFormatter.format(totalEpaa)}</p>
                </span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <GradientAreaChart
              data={monthsData}
              dataKeyX="monthLabel"
              dataKeyY="epaaCollection"
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              nameY="Valor EPAA"
              nameX="Mes"
              startColor="#f59e0b"
              endColor="#ef4444"
              valuePosition="top"
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
              tooltipFormatterOrComponent={(payload: ChartDataItem) => (
                <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                  <span>
                    Mes<p>{full(payload.month)}</p>
                  </span>
                  <span>
                    EPAA
                    <p>{CurrencyFormatter.format(payload.epaaCollection)}</p>
                  </span>
                </div>
              )}
            />
          </div>
        </div>

        <div className="dashboard-chart-body" style={{ margin: 0 }}>
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">
              Evolución Histórica Valor EPAA
            </h3>
            <p className="overdue-chart-subtitle">
              Recaudación EPAA mensual Ene–Dic {activeYear.year}
            </p>
            <div className="year-tooltip year-tooltip-evolution">
              <div className="year-tooltip-evolution-item gradient-color-keys">
                <div className="year-tooltip-evolution-icon">
                  <IconIncomes />
                </div>
                <span>
                  Recaudación EPAA Total
                  <p>{CurrencyFormatter.format(totalEpaa)}</p>
                </span>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: '320px', position: 'relative' }}>
            <DynamicBarChart
              data={monthsData}
              dataKeyX="monthLabel"
              dataKeyY="epaaCollection"
              nameY="Monto EPAA"
              nameX="Mes"
              yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
              tooltipFormatterOrComponent={(payload: ChartDataItem) =>
                buildTooltip(payload)
              }
              valuePosition="top"
              labelFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface GeneralCollectionMonthlyDashboardProps {
  kpi: GeneralMonthlyKPIResponse[];
  unfilteredKpi?: GeneralMonthlyKPIResponse[];
  isLoading: boolean;
  /** Year to jump the paginator to (from FILTRAR POR AÑO picker) */
  jumpToYear?: number;
}

// ─── Main component ───────────────────────────────────────────────────────────
export const GeneralCollectionMonthlyDashboard: React.FC<
  GeneralCollectionMonthlyDashboardProps
> = ({ kpi, unfilteredKpi, isLoading, jumpToYear }) => {
  if (isLoading) {
    return (
      <div className="dashboard-loading-container">
        <CircularProgress />
      </div>
    );
  }

  // Raw source: auto-fetched last-10-years (never overwritten by Consultar)
  const rawSource =
    unfilteredKpi && unfilteredKpi.length > 0 ? unfilteredKpi : kpi;

  // Only show EmptyState when NO historical data is available at all
  if (!rawSource || rawSource.length === 0) {
    return (
      <EmptyState
        message="No hay datos"
        description="No hay datos de KPIs mensuales para mostrar"
        variant="info"
      />
    );
  }

  return (
    <div className="dashboard-list-container yearly">
      {/* ─── Year Paginator: Jan-Dec per year, MultiLine overview inside ─── */}
      <YearlyMonthsPaginator
        allItems={rawSource}
        filteredItems={kpi}
        jumpToYear={jumpToYear}
      />
    </div>
  );
};
