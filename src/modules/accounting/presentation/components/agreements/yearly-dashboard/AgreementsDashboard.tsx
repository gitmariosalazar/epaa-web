import React from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  CreditCard,
  Target,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type {
  AgreementKPIsResponse,
  CollectorPerformance,
  PaymentMethodSummary
} from '../../../../domain/models/Agreements';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import {
  VerticalBarChart,
  type BarItem
} from '@/shared/presentation/components/Charts/VerticalBarChart';
import { MultiLineChart } from '@/shared/presentation/components/Charts/MultiLineChart';
import { GradientAreaChart } from '@/shared/presentation/components/Charts/GradientAreaChart';
import { DynamicBarChart } from '@/shared/presentation/components/Charts/DynamicBarChart';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { Button } from '@/shared/presentation/components/Button/Button';
import { CollectorPerformanceTable } from './CollectorPerformanceTable';
import { PaymentMethodsTable } from './PaymentMethodsTable';
import { AnnualSummaryTable } from './AnnualSummaryTable';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import '@/shared/presentation/components/Charts/Charts.css';

interface AgreementsDashboardProps {
  kpis: AgreementKPIsResponse[];
  collectorPerformance: CollectorPerformance[];
  paymentMethodSummary: PaymentMethodSummary[];
  isLoading: boolean;
  startYear: number;
  endYear: number;
}

interface YearPaginatorProps {
  items: AgreementKPIsResponse[];
}

const YearPaginator: React.FC<YearPaginatorProps> = ({ items }) => {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (items.length === 0) return;
    setIdx(0);
  }, [items]);

  if (items.length === 0) return null;

  const safeIdx = Math.min(idx, items.length - 1);
  const total = items.length;
  const active = items[safeIdx];

  const fmtNum = (n: number) => Number(n || 0).toLocaleString('es-EC');

  const moneySlices: DonutSlice[] = [
    {
      label: 'Recaudado',
      value: active.totalCollected,
      color: 'green',
      fmt: (n: number) => CurrencyFormatter.format(n)
    },
    {
      label: 'Pendiente',
      value: active.totalPending,
      color: 'red',
      fmt: (n: number) => CurrencyFormatter.format(n)
    }
  ];

  const overdueSlices: DonutSlice[] = [
    {
      label: '1-30 Días',
      value: active.overdue1_30Days,
      color: 'blue',
      fmt: (n: number) => fmtNum(n)
    },
    {
      label: '31-60 Días',
      value: active.overdue31_60Days,
      color: 'amber',
      fmt: (n: number) => fmtNum(n)
    },
    {
      label: '61-90 Días',
      value: active.overdue61_90Days,
      color: 'orange',
      fmt: (n: number) => fmtNum(n)
    },
    {
      label: '> 90 Días',
      value: active.overdueMore90Days,
      color: 'red',
      fmt: (n: number) => fmtNum(n)
    }
  ];

  const installmentsBarItems: BarItem[] = [
    {
      label: 'Pagadas',
      value: active.totalInstallmentsPaid,
      color: 'green',
      name: 'Pagadas',
      fmt: (n: number) => fmtNum(n)
    },
    {
      label: 'Pendientes',
      value: active.totalInstallmentsPendings,
      color: 'blue',
      name: 'Pendientes',
      fmt: (n: number) => fmtNum(n)
    },
    {
      label: 'En Mora',
      value: active.overdueInstallmentsCount,
      color: 'red',
      name: 'En Mora',
      fmt: (n: number) => fmtNum(n)
    }
  ];

  return (
    <div className="yearly-paginator-card">
      <div className="yearly-paginator-header">
        <div className="yearly-paginator-title-block">
          <span className="yearly-paginator-label">Dashboard por Año</span>
          <h2 className="yearly-paginator-year">{active.year}</h2>
        </div>
        <div className="yearly-paginator-controls">
          <div className="yearly-paginator-dots">
            {items.map((item, i) => (
              <Button
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
              <ChevronLeft size={16} />
            </Button>
          </Tooltip>
          <span className="yearly-paginator-counter">
            {safeIdx + 1} / {total}
          </span>
          <Tooltip content="Año siguiente" position="top">
            <Button
              disabled={safeIdx <= 0}
              onClick={() => setIdx((i) => Math.max(i - 1, 0))}
              variant="outline"
              size="sm"
              circle
            >
              <ChevronRight size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="yearly-paginator-content">
        <div
          className="trash-kpi-metrics-grid"
          style={{ marginBottom: '0.5rem' }}
        >
          <KPICard
            label="Total Emitido"
            value={CurrencyFormatter.format(active.totalEmitted)}
            icon={<FileText size={16} />}
            color="blue"
            description="Total convenios emitidos"
          />
          <KPICard
            label="Total Recaudado"
            value={CurrencyFormatter.format(active.totalCollected)}
            icon={<CheckCircle size={16} />}
            color="green"
            valueColor="green"
            description={`${active.collectionEfficiencyPct.toFixed(2)}% de eficiencia`}
          />
          <KPICard
            label="Monto Pendiente"
            value={CurrencyFormatter.format(active.totalPending)}
            icon={<Clock size={16} />}
            color="red"
            valueColor="red"
            description="Monto por cobrar"
          />
          <KPICard
            label="Monto en Mora"
            value={CurrencyFormatter.format(active.overdueAmount)}
            icon={<AlertTriangle size={16} />}
            color="amber"
            valueColor="amber"
            description={`${active.overdueInstallmentsCount} cuotas vencidas`}
          />
          <KPICard
            label="Ciudadanos"
            value={fmtNum(active.totalCitizensWithAgreements)}
            icon={<Users size={16} />}
            color="purple"
            description="Ciudadanos con convenios"
          />
          <KPICard
            label="Recuperación Capital"
            value={`${active.principalRecoveryPct.toFixed(2)}%`}
            icon={<Target size={16} />}
            color="indigo"
            description="Avance sobre el principal"
          />
        </div>

        <div className="trash-dashboard-charts-grid">
          <DonutChart
            title="Distribución de Montos"
            slices={moneySlices}
            centerLabel="Total Anual"
            centerValue={CurrencyFormatter.format(active.totalEmitted)}
            icon={<CreditCard size={16} />}
            description={`Año fiscal ${active.year}`}
          />
          <DonutChart
            title="Distribución de Mora"
            slices={overdueSlices}
            centerLabel="Cuotas en Mora"
            centerValue={fmtNum(active.overdueInstallmentsCount)}
            icon={<AlertTriangle size={16} />}
            description="Desglose por rango de días"
          />
        </div>
        <div className="trash-dashboard-charts-grid">
          <DonutChart
            title="Distribución de Montos"
            slices={moneySlices}
            centerLabel="Total Anual"
            centerValue={CurrencyFormatter.format(active.totalEmitted)}
            icon={<CreditCard size={16} />}
            description={`Año fiscal ${active.year}`}
          />
          <VerticalBarChart
            title="Estado de Cuotas"
            items={installmentsBarItems}
            icon={<BarChart3 size={16} />}
            description="Progreso de cumplimiento de cuotas"
          />
        </div>
      </div>
    </div>
  );
};

export const AgreementsDashboard: React.FC<AgreementsDashboardProps> = ({
  kpis,
  collectorPerformance,
  paymentMethodSummary,
  isLoading,
  startYear,
  endYear
}) => {
  if (isLoading) return null;
  const chartData = [...(kpis || [])].reverse();

  const totalSummary = {
    totalCollected: (kpis || []).reduce((acc, k) => acc + k.totalCollected, 0),
    totalCitizens: (kpis || []).reduce(
      (acc, k) => acc + k.totalCitizensWithAgreements,
      0
    )
  };

  return (
    <div className="trash-dashboard dashboard-trash-section">
      <YearPaginator items={kpis || []} />

      {!kpis || kpis.length === 0 ? (
        <EmptyState
          message="Sin datos para el periodo"
          description="Ajusta el rango de años para consultar estadísticas de convenios."
          icon={IoInformationCircleOutline}
          variant="info"
        />
      ) : (
        <>
          <div
            className="dashboard-chart-body"
            style={{ height: 'auto', minHeight: '520px', marginTop: '-2.3rem' }}
          >
            <div className="overdue-chart-header">
              <h3 className="overdue-chart-title">
                Análisis Histórico de Convenios
              </h3>
              <p className="overdue-chart-subtitle">
                Evolución de recaudación y cumplimiento {chartData[0]?.year} –{' '}
                {chartData[chartData.length - 1]?.year}
              </p>
              <div className="year-tooltip year-tooltip-evolution">
                <div className="year-tooltip-evolution-item gradient-color-clients">
                  <span>
                    Total Ciudadanos
                    <p>
                      {NumberFormatter.formatInteger(
                        totalSummary.totalCitizens
                      )}
                    </p>
                  </span>
                </div>
                <div className="year-tooltip-evolution-item gradient-color-keys">
                  <span>
                    Recaudación Total
                    <p>
                      {CurrencyFormatter.format(totalSummary.totalCollected)}
                    </p>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '450px' }}>
              <MultiLineChart<AgreementKPIsResponse>
                data={chartData}
                dataKeyX="year"
                nameX="Año"
                nameY="Monto ($)"
                yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
                showLegend={true}
                normalizeData={true}
                tooltipFormatterOrComponent={(
                  payload: AgreementKPIsResponse
                ) => (
                  <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                    <span>
                      Año <p>{payload.year}</p>
                    </span>
                    <span>
                      T. Emitido{' '}
                      <p>{CurrencyFormatter.format(payload.totalEmitted)}</p>
                    </span>
                    <span>
                      T. Recaudado{' '}
                      <p>{CurrencyFormatter.format(payload.totalCollected)}</p>
                    </span>
                    <span>
                      Monto en Mora{' '}
                      <p>{CurrencyFormatter.format(payload.overdueAmount)}</p>
                    </span>
                  </div>
                )}
                series={[
                  {
                    dataKey: 'totalEmitted',
                    name: 'Total Emitido',
                    color: '#3b82f6',
                    glow: true
                  },
                  {
                    dataKey: 'totalCollected',
                    name: 'Total Recaudado',
                    color: '#10b981',
                    glow: true
                  },
                  {
                    dataKey: 'overdueAmount',
                    name: 'Monto en Mora',
                    color: '#ef4444',
                    glow: false,
                    strokeDasharray: '5 3'
                  }
                ]}
              />
            </div>
          </div>

          <div
            className="dashboard-stats-grid"
            style={{ marginTop: '-0.8rem' }}
          >
            <div className="dashboard-chart-body">
              <div className="overdue-chart-header">
                <h3 className="overdue-chart-title">Tendencia de Ciudadanos</h3>
                <p className="overdue-chart-subtitle">
                  Crecimiento de la base de convenios
                </p>
              </div>
              <div style={{ width: '100%', height: '300px' }}>
                <GradientAreaChart
                  data={chartData}
                  dataKeyX="year"
                  dataKeyY="totalCitizensWithAgreements"
                  startColor="#6366f1"
                  endColor="#a855f7"
                  nameY="Ciudadanos"
                  nameX="Año"
                  yAxisFormatter={(val) => NumberFormatter.formatInteger(val)}
                  tooltipFormatterOrComponent={(
                    payload: AgreementKPIsResponse
                  ) => (
                    <div className="year-tooltip">
                      <span>
                        Año <p>{payload.year}</p>
                      </span>
                      <span>
                        Ciudadanos{' '}
                        <p>
                          {NumberFormatter.formatInteger(
                            payload.totalCitizensWithAgreements
                          )}
                        </p>
                      </span>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="dashboard-chart-body">
              <div className="overdue-chart-header">
                <h3 className="overdue-chart-title">
                  Eficiencia de Recaudación
                </h3>
                <p className="overdue-chart-subtitle">
                  % de cumplimiento por año
                </p>
              </div>
              <div style={{ width: '100%', height: '300px' }}>
                <DynamicBarChart
                  data={chartData}
                  dataKeyX="year"
                  dataKeyY="collectionEfficiencyPct"
                  nameY="Eficiencia %"
                  nameX="Año"
                  yAxisFormatter={(val) => `${val}%`}
                  valuePosition="top"
                  labelFormatter={(val) => `${val.toFixed(1)}%`}
                  tooltipFormatterOrComponent={(
                    payload: AgreementKPIsResponse
                  ) => (
                    <div className="year-tooltip">
                      <span>
                        Año <p>{payload.year}</p>
                      </span>
                      <span>
                        Eficiencia{' '}
                        <p style={{ fontWeight: 'bold' }}>
                          {payload.collectionEfficiencyPct.toFixed(2)}%
                        </p>
                      </span>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-stats-grid">
            <CollectorPerformanceTable
              data={collectorPerformance}
              isLoading={isLoading}
              startYear={startYear}
              endYear={endYear}
            />
            <PaymentMethodsTable
              data={paymentMethodSummary}
              isLoading={isLoading}
              startYear={startYear}
              endYear={endYear}
            />
          </div>

          <AnnualSummaryTable data={kpis} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};
