import React, { useMemo, useState, useEffect } from 'react';
import {
  Professional3DPieChart,
  type PieData
} from '@/shared/presentation/components/Charts/Professional3DPieChart';
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
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
import type {
  AgreementKPIsResponse,
  CollectorPerformance,
  PaymentMethodSummary
} from '@/modules/accounting/domain/models/Agreements';
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
import { IoInformationCircleOutline } from 'react-icons/io5';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { MonthlyCollectorPerformanceTable } from './MonthlyCollectorPerformanceTable';
import { MonthlyPaymentMethodsTable } from './MonthlyPaymentMethodsTable';
import { MonthlySummaryTable } from './MonthlySummaryTable';
import '@/shared/presentation/components/Charts/Charts.css';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

interface MonthlyAgreementsDashboardProps {
  kpis: AgreementKPIsResponse[];
  collectorPerformance: CollectorPerformance[];
  paymentMethodSummary: PaymentMethodSummary[];
  isLoading: boolean;
  year: number;
}

interface MonthlyItemProps {
  active: AgreementKPIsResponse;
  year: number;
  idx: number;
  total: number;
  allKpis: AgreementKPIsResponse[];
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}

const MonthlyAgreementsDashboardDashboardItem: React.FC<MonthlyItemProps> = ({
  active,
  year,
  idx,
  total,
  allKpis,
  onPrev,
  onNext,
  onJump
}) => {
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

  const overdueSlices = [
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

  const monthName = active.month ? MONTHS[active.month - 1] : 'N/A';

  const dataProfessional3DPie: PieData[] = useMemo(
    () =>
      overdueSlices.map((s, idx) => ({
        name: s.label,
        value: s.value,
        color: s.color,
        label: `MORA ${String(idx + 1).padStart(2, '0')}`,
        fmt: s.fmt
      })),
    [overdueSlices]
  );

  console.log('datA ProfessionalPie', dataProfessional3DPie);

  return (
    <div className="yearly-paginator-card">
      <div className="yearly-paginator-header">
        <div className="yearly-paginator-title-block">
          <span className="yearly-paginator-label">Dashboard Mensual</span>
          <h2 className="yearly-paginator-year">
            {monthName} {year}
          </h2>
        </div>
        <div className="yearly-paginator-controls">
          <div className="yearly-paginator-dots">
            {allKpis.map((item, i) => (
              <Button
                key={i}
                className={`yearly-dot${i === idx ? ' active' : ''}`}
                onClick={() => onJump(i)}
                title={MONTHS[item.month ? item.month - 1 : 0]}
              />
            ))}
          </div>
          <Tooltip content="Mes anterior" position="top">
            <Button
              disabled={idx <= 0}
              onClick={onPrev}
              variant="outline"
              size="sm"
              circle
            >
              <ChevronLeft size={16} />
            </Button>
          </Tooltip>
          <span className="yearly-paginator-counter">
            {idx + 1} / {total}
          </span>
          <Tooltip content="Mes siguiente" position="top">
            <Button
              disabled={idx >= total - 1}
              onClick={onNext}
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
            centerLabel="Total Mensual"
            centerValue={CurrencyFormatter.format(active.totalEmitted)}
            icon={<CreditCard size={16} />}
            description={`${monthName} ${year}`}
          />
          <div style={{ width: '100%' }}>
            <Professional3DPieChart data={dataProfessional3DPie} />
          </div>
        </div>

        <div className="trash-dashboard-charts-grid">
          <DonutChart
            title="Distribución de Montos"
            slices={moneySlices}
            centerLabel="Total Mensual"
            centerValue={CurrencyFormatter.format(active.totalEmitted)}
            icon={<CreditCard size={16} />}
            description={`${monthName} ${year}`}
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

export const MonthlyAgreementsDashboard: React.FC<
  MonthlyAgreementsDashboardProps
> = ({ kpis, collectorPerformance, paymentMethodSummary, isLoading, year }) => {
  const [idx, setIdx] = useState(0);

  const chartData = useMemo(
    () => [...(kpis || [])].sort((a, b) => (a.month || 0) - (b.month || 0)),
    [kpis]
  );

  useEffect(() => {
    if (chartData.length > 0) setIdx(chartData.length - 1);
  }, [chartData]);

  if (isLoading) return null;

  const totalSummary = {
    totalCollected: (kpis || []).reduce((acc, k) => acc + k.totalCollected, 0),
    totalCitizens: (kpis || []).reduce(
      (acc, k) => acc + k.totalCitizensWithAgreements,
      0
    )
  };

  if (!kpis || kpis.length === 0) {
    return (
      <div className="trash-dashboard dashboard-trash-section">
        <EmptyState
          message="Sin datos para el periodo"
          description={`Ajusta el año ${year} para consultar estadísticas de convenios.`}
          icon={IoInformationCircleOutline}
          variant="info"
        />
      </div>
    );
  }

  const active = chartData[idx] || chartData[0];
  const totalItems = chartData.length;

  return (
    <div className="trash-dashboard dashboard-trash-section">
      <MonthlyAgreementsDashboardDashboardItem
        active={active}
        year={year}
        idx={idx}
        total={totalItems}
        allKpis={chartData}
        onPrev={() => setIdx(idx - 1)}
        onNext={() => setIdx(idx + 1)}
        onJump={(i) => setIdx(i)}
      />

      <div
        className="dashboard-chart-body"
        style={{ height: 'auto', minHeight: '520px', marginTop: '-1.3rem' }}
      >
        <div className="overdue-chart-header">
          <h3 className="overdue-chart-title">Análisis Histórico Mensual</h3>
          <p className="overdue-chart-subtitle">
            Evolución de recaudación y cumplimiento en el año {year}
          </p>
          <div className="year-tooltip year-tooltip-evolution">
            <div className="year-tooltip-evolution-item gradient-color-clients">
              <span>
                Total Ciudadanos
                <p>
                  {NumberFormatter.formatInteger(totalSummary.totalCitizens)}
                </p>
              </span>
            </div>
            <div className="year-tooltip-evolution-item gradient-color-keys">
              <span>
                Recaudación Total
                <p>{CurrencyFormatter.format(totalSummary.totalCollected)}</p>
              </span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '450px' }}>
          <MultiLineChart<AgreementKPIsResponse>
            data={chartData}
            dataKeyX="month"
            nameX="Mes"
            nameY="Monto ($)"
            xAxisFormatter={(val) => MONTHS[Number(val) - 1]?.substring(0, 3)}
            yAxisFormatter={(val) => CurrencyFormatter.formatCompact(val)}
            showLegend={true}
            normalizeData={true}
            tooltipFormatterOrComponent={(payload: AgreementKPIsResponse) => (
              <div className="year-tooltip" style={{ flexWrap: 'wrap' }}>
                <span>
                  Mes <p>{payload.month ? MONTHS[payload.month - 1] : 'N/A'}</p>
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

      <div className="dashboard-stats-grid" style={{ marginTop: '-0.8rem' }}>
        <div className="dashboard-chart-body">
          <div className="overdue-chart-header">
            <h3 className="overdue-chart-title">Tendencia de Ciudadanos</h3>
            <p className="overdue-chart-subtitle">
              Crecimiento mensual de convenios
            </p>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <GradientAreaChart
              data={chartData}
              dataKeyX="month"
              dataKeyY="totalCitizensWithAgreements"
              startColor="#6366f1"
              endColor="#a855f7"
              nameY="Ciudadanos"
              nameX="Mes"
              xAxisFormatter={(val) => MONTHS[Number(val) - 1]?.substring(0, 3)}
              yAxisFormatter={(val) => NumberFormatter.formatInteger(val)}
              tooltipFormatterOrComponent={(payload: AgreementKPIsResponse) => (
                <div className="year-tooltip">
                  <span>
                    Mes{' '}
                    <p>{payload.month ? MONTHS[payload.month - 1] : 'N/A'}</p>
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
            <h3 className="overdue-chart-title">Eficiencia de Recaudación</h3>
            <p className="overdue-chart-subtitle">% de cumplimiento por mes</p>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <DynamicBarChart
              data={chartData}
              dataKeyX="month"
              dataKeyY="collectionEfficiencyPct"
              nameY="Eficiencia %"
              nameX="Mes"
              xAxisFormatter={(val) => MONTHS[Number(val) - 1]?.substring(0, 3)}
              yAxisFormatter={(val) => `${val}%`}
              valuePosition="top"
              labelFormatter={(val) => `${val.toFixed(1)}%`}
              tooltipFormatterOrComponent={(payload: AgreementKPIsResponse) => (
                <div className="year-tooltip">
                  <span>
                    Mes{' '}
                    <p>{payload.month ? MONTHS[payload.month - 1] : 'N/A'}</p>
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
        <MonthlyCollectorPerformanceTable
          data={collectorPerformance}
          isLoading={isLoading}
          year={year}
        />
        <MonthlyPaymentMethodsTable
          data={paymentMethodSummary}
          isLoading={isLoading}
          year={year}
        />
      </div>

      <MonthlySummaryTable data={kpis} isLoading={isLoading} year={year} />
    </div>
  );
};
