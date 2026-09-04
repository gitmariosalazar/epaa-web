import React, { useMemo, useState } from 'react';
import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Droplets, DollarSign, AlertTriangle, FileText, CheckCircle, XCircle } from 'lucide-react';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import type { DashboardKpiResponse } from '@/modules/readings/domain/models/reading-kpi';
import './DashboardKpisByPeriodTab.css';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';

interface DashboardKpisByPeriodTabProps {
  data: DashboardKpiResponse[] | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const DashboardKpisByPeriodTab: React.FC<DashboardKpisByPeriodTabProps> = ({
  data,
  isLoading
}) => {
  const [activeMetric, setActiveMetric] = useState<'consumption' | 'financial'>('consumption');

  const { totals, chartData1To20, chartData21To40, formattedData } = useMemo(() => {
    if (!data || data.length === 0) return { totals: null, chartData1To20: [], chartData21To40: [], formattedData: [] };

    const initialTotals = {
      totalMeters: 0,
      totalConsumption: 0,
      totalBilled: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      totalDebt: 0,
      billsGenerated: 0,
      paidBillsCount: 0,
      unpaidBillsCount: 0,
      sewage: 0,
      trash: 0,
    };

    const aggregated = data.reduce((acc, curr) => {
      acc.totalMeters += Number(curr.totalMetersRead) || 0;
      acc.totalConsumption += Number(curr.totalConsumptionM3) || 0;
      acc.totalBilled += Number(curr.totalBilledWater) || 0;
      acc.totalPaid += Number(curr.totalPaidWater) || 0;
      acc.totalUnpaid += Number(curr.totalUnpaidWater) || 0;
      acc.totalDebt += Number(curr.totalDebtAmount) || 0;
      acc.billsGenerated += Number(curr.totalBillsGenerated) || 0;
      acc.paidBillsCount += Number(curr.paidBillsCount) || 0;
      acc.unpaidBillsCount += Number(curr.unpaidBillsCount) || 0;
      acc.sewage += Number(curr.totalSewageValue) || 0;
      acc.trash += Number(curr.totalTrashRate) || 0;
      return acc;
    }, initialTotals);

    const formattedData = data.map(item => ({
      name: `Sect. ${item.sector}`,
      sectorNum: Number(item.sector) || 0,
      consumption: Number(item.totalConsumptionM3) || 0,
      avgConsumption: Number(item.averageConsumptionM3) || 0,
      meters: Number(item.totalMetersRead) || 0,
      billed: Number(item.totalBilledWater) || 0,
      paid: Number(item.totalPaidWater) || 0,
      unpaid: Number(item.totalUnpaidWater) || 0,
      debt: Number(item.totalDebtAmount) || 0,
    })).sort((a, b) => a.sectorNum - b.sectorNum);

    const chartData1To20 = formattedData.filter(d => d.sectorNum <= 20);
    const chartData21To40 = formattedData.filter(d => d.sectorNum > 20);

    return { totals: aggregated, chartData1To20, chartData21To40, formattedData };
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const columns: Column<any>[] = useMemo(() => [
    { header: 'Sector', accessor: 'name', sortable: true },
    { header: 'Lecturas', accessor: 'meters', sortable: true, isNumeric: true },
    { header: 'Consumo (m³)', accessor: 'consumption', sortable: true, isNumeric: true },
    { header: 'Cons. Promedio (m³)', accessor: 'avgConsumption', sortable: true, isNumeric: true },
    { header: 'Facturado', accessor: (item: any) => formatCurrency(item.billed), sortKey: 'billed', sortable: true, isNumeric: true },
    { header: 'Recaudado', accessor: (item: any) => formatCurrency(item.paid), sortKey: 'paid', sortable: true, isNumeric: true },
    { header: 'Pendiente', accessor: (item: any) => formatCurrency(item.unpaid), sortKey: 'unpaid', sortable: true, isNumeric: true },
    { header: 'Cartera', accessor: (item: any) => formatCurrency(item.debt), sortKey: 'debt', sortable: true, isNumeric: true },
  ], []);

  if (isLoading && (!data || data.length === 0)) {
    return (
      <div className="premium-dashboard-loading">
        <div className="spinner"></div>
        <p>Analizando métricas del periodo...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={AlertTriangle}
        message="No hay datos disponibles para el periodo seleccionado"
        description="Por favor, selecciona otro mes (recuerda que este dashboard muestra información consolidada de meses anteriores)."
      />
    );
  }


  const revenueDistributionData = [
    { name: 'Agua', value: totals?.totalBilled || 0 },
    { name: 'Alcantarillado', value: totals?.sewage || 0 },
    { name: 'Basura', value: totals?.trash || 0 },
  ];

  const renderMainChart = (dataSubset: any[], titleSuffix: string) => {
    return (
      <div className="chart-wrapper" style={{ marginBottom: '2rem' }}>
        <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 10px 0', fontSize: '0.9rem', textAlign: 'center' }}>
          {titleSuffix}
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          {activeMetric === 'consumption' ? (
            <ComposedChart data={dataSubset} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
              <defs>
                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" angle={-45} textAnchor="end" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} interval={0} />
              <YAxis yAxisId="left" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fill: '#10b981', fontSize: 11 }} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                itemStyle={{ color: 'var(--text-main)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Bar yAxisId="left" dataKey="consumption" name="Consumo Total (m³)" fill="url(#colorCons)" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="avgConsumption" name="Promedio (m³)" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} />
            </ComposedChart>
          ) : (
            <AreaChart data={dataSubset} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
              <defs>
                <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" angle={-45} textAnchor="end" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} interval={0} />
              <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `$${val / 1000}k`} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Area type="monotone" dataKey="billed" name="Facturado" stroke="#10b981" fillOpacity={1} fill="url(#colorBilled)" />
              <Area type="monotone" dataKey="unpaid" name="Deuda Pendiente" stroke="#ef4444" fillOpacity={1} fill="url(#colorDebt)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="premium-dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h2 className="glow-text">Resumen Operativo</h2>
          <span className="badge">Indicadores Clave</span>
        </div>
        <div className="dashboard-actions">
          <div className="metric-toggle">
            <button
              className={`toggle-btn ${activeMetric === 'consumption' ? 'active' : ''}`}
              onClick={() => setActiveMetric('consumption')}
            >
              Consumo Operativo
            </button>
            <button
              className={`toggle-btn ${activeMetric === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveMetric('financial')}
            >
              Métricas Financieras
            </button>
          </div>
        </div>
      </div>

      <div className="kpi-cards-grid">
        <KPICard
          label="Volumen Total"
          value={`${totals?.totalConsumption.toLocaleString()} m³`}
          icon={<TrendingUp size={22} />}
          color="blue"
          description={`${(totals?.totalConsumption! / totals?.totalMeters!).toFixed(2)} m³ prom/medidor`}
        />
        <KPICard
          label="Medidores Leídos"
          value={totals?.totalMeters.toLocaleString() || '0'}
          icon={<Droplets size={22} />}
          color="cyan"
          description="Total general"
        />
        <KPICard
          label="Agua Facturada"
          value={formatCurrency(totals?.totalBilled || 0)}
          icon={<DollarSign size={22} />}
          color="emerald"
          valueColor="emerald"
          description={`${((totals?.totalPaid! / totals?.totalBilled!) * 100).toFixed(1)}% Recaudado`}
        />
        <KPICard
          label="Deuda Consolidada"
          value={formatCurrency(totals?.totalDebt || 0)}
          icon={<AlertTriangle size={22} />}
          color="rose"
          valueColor="rose"
          description="Atención requerida"
        />
      </div>

      <div className="charts-main-area">
        <div className="chart-container large-chart glass-panel">
          <h3 className="chart-title">
            {activeMetric === 'consumption' ? 'Consumo por Sector (m³)' : 'Facturado vs Recaudado por Sector'}
          </h3>

          {renderMainChart(chartData1To20, 'Sectores 1 al 20')}
          {renderMainChart(chartData21To40, 'Sectores 21 al 40')}
        </div>

        <div className="secondary-charts-container">
          <div className="chart-container glass-panel">
            <h3 className="chart-title">Distribución de Facturación</h3>
            <div className="chart-wrapper pie-chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={revenueDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {revenueDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mini-stats glass-panel">
            <h3 className="chart-title">Eficiencia del Mes</h3>
            <div className="mini-stat-item">
              <div className="mini-stat-icon text-info"><FileText size={20} /></div>
              <div className="mini-stat-content">
                <span className="mini-stat-label">Facturas Emitidas</span>
                <span className="mini-stat-value">{((totals?.billsGenerated! / totals?.totalMeters!) * 100).toFixed(1)}%</span>
              </div>
              <span className="right-value">
                <ColorChip label={totals?.billsGenerated.toLocaleString() || '0'}
                  color={getTrafficLightColor(
                    Number((totals?.billsGenerated! / totals?.totalMeters!) * 100)
                  )}
                  variant="soft" />
              </span>
            </div>
            <div className="mini-stat-item">
              <div className="mini-stat-icon text-success"><CheckCircle size={20} /></div>
              <div className="mini-stat-content">
                <span className="mini-stat-label">Tasa de Efectividad</span>
                <span className="mini-stat-value">{((totals?.totalPaid! / totals?.totalBilled!) * 100).toFixed(1)}%</span>
              </div>
              <span className="right-value">
                <ColorChip label={formatCurrency(totals?.totalPaid || 0)}
                  color={getTrafficLightColor(
                    Number((totals?.totalPaid! / totals?.totalBilled!) * 100)
                  )}
                  variant="soft" />
              </span>
            </div>
            <div className="mini-stat-item">
              <div className="mini-stat-icon text-danger"><XCircle size={20} /></div>
              <div className="mini-stat-content">
                <span className="mini-stat-label">Ratio de Morosidad</span>
                <span className="mini-stat-value">{((totals?.totalUnpaid! / totals?.totalBilled!) * 100).toFixed(1)}%</span>
              </div>
              <span className="right-value">
                <ColorChip label={formatCurrency(totals?.totalUnpaid || 0)}
                  color={getTrafficLightColor(
                    100 - Number((totals?.totalUnpaid! / totals?.totalBilled!) * 100)
                  )}
                  variant="soft" />
              </span>
            </div>
            <div className="mini-stat-item">
              <div className="mini-stat-icon text-info"><DollarSign size={20} /></div>
              <div className="mini-stat-content">
                <span className="mini-stat-label">Índice de Ejecución de Cartera</span>
                <span className="mini-stat-value">{((totals?.totalBilled! / totals?.totalDebt!) * 100).toFixed(1)}%</span>
              </div>
              <span className="right-value">
                <ColorChip label={formatCurrency(totals?.totalBilled || 0)}
                  color={getTrafficLightColor(
                    Number((totals?.totalBilled! / totals?.totalDebt!) * 100)
                  )}
                  variant="soft" />
              </span>
            </div>
            <div className="mini-stat-item">
              <div className="mini-stat-icon text-success"><FileText size={20} /></div>
              <div className="mini-stat-content">
                <span className="mini-stat-label">Facturas Pagadas</span>
                <span className="mini-stat-value">{((totals?.paidBillsCount! / totals?.billsGenerated!) * 100).toFixed(1)}%</span>
              </div>
              <span className="right-value">
                <ColorChip label={totals?.paidBillsCount.toLocaleString() || '0'}
                  color={getTrafficLightColor(
                    Number((totals?.paidBillsCount! / totals?.billsGenerated!) * 100)
                  )}
                  variant="soft" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container chart-container glass-panel" style={{ marginTop: '10px' }}>
        <h3 className="chart-title" style={{ marginBottom: '8px' }}>Detalle por Sector</h3>
        <Table
          data={formattedData}
          columns={columns}
          pagination={true}
          pageSize={10}
        />
      </div>
    </div>
  );
};
