import React from 'react';
import '../../../trash/presentation/styles/TrashRateDashboard.css';
import {
  //DollarSign,
  FileText,
  Home,
  CheckCircle,
  Clock,
  TrendingDown,
  Activity
} from 'lucide-react';
//import { useTranslation } from 'react-i18next';
import {
  type GeneralKPIResponse,
  type GeneralMonthlyKPIResponse,
  type GeneralYearlyKPIResponse
} from '../../domain/models/GenelarCollection';
import {
  DonutChart,
  type DonutSlice
} from '@/shared/presentation/components/Charts/DonutChart';
import {
  VerticalBarChart,
  type BarItem
} from '@/shared/presentation/components/Charts/VerticalBarChart';
import '@/shared/presentation/components/Charts/Charts.css';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';

interface GeneralCollectionDashboardProps {
  kpi: GeneralKPIResponse | null;
  monthlyKpi: GeneralMonthlyKPIResponse[];
  yearlyKpi: GeneralYearlyKPIResponse[];
  isLoading: boolean;
  activeTab: 'dashboard' | 'general' | 'daily' | 'monthly' | 'yearly';
}

const fmtMoney = (n: number) =>
  `$${Number(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtNum = (n: number) => Number(n || 0).toLocaleString('es-EC');

export const GeneralCollectionDashboard: React.FC<
  GeneralCollectionDashboardProps
> = ({ kpi, monthlyKpi, yearlyKpi, isLoading, activeTab }) => {
  // const { t } = useTranslation();

  if (isLoading) return null;

  // For monthly and yearly tabs, if we want an aggregate, we can just sum up the array or
  // ideally the backend sends an aggregate `kpi` for those too if we call it. But for now,
  // we will try to aggregate if there is no direct kpi.
  let currentKpi: GeneralKPIResponse | null = kpi;

  if (activeTab === 'monthly' && monthlyKpi.length > 0) {
    // If we only have monthly array, aggregate it (simplify: just take the first or sum)
    // Actually the easiest is to show the dashboard only if we have a summary.
    // We will aggregate it if possible:
    currentKpi = {
      uniqueCadastralKeys: monthlyKpi.reduce(
        (sum, k) => sum + k.uniqueCadastralKeys,
        0
      ),
      totalBillsIssued: monthlyKpi.reduce(
        (sum, k) => sum + k.totalBillsIssued,
        0
      ),
      averagePaidBill:
        monthlyKpi.reduce((sum, k) => sum + k.averagePaidBill, 0) /
        monthlyKpi.length,
      countNotes: monthlyKpi.reduce((sum, k) => sum + k.countNotes, 0),
      totalNotesAmount: monthlyKpi.reduce(
        (sum, k) => sum + k.totalNotesAmount,
        0
      ),
      codeTitle: 'Mensualizado',
      sections: [] // Simplified sections for aggregate
    };
  } else if (activeTab === 'yearly' && yearlyKpi.length > 0) {
    currentKpi = {
      uniqueCadastralKeys: yearlyKpi.reduce(
        (sum, k) => sum + k.uniqueCadastralKeys,
        0
      ),
      totalBillsIssued: yearlyKpi.reduce(
        (sum, k) => sum + k.totalBillsIssued,
        0
      ),
      averagePaidBill:
        yearlyKpi.reduce((sum, k) => sum + k.averagePaidBill, 0) /
        yearlyKpi.length,
      countNotes: yearlyKpi.reduce((sum, k) => sum + k.countNotes, 0),
      totalNotesAmount: yearlyKpi.reduce(
        (sum, k) => sum + k.totalNotesAmount,
        0
      ),
      codeTitle: 'Anualizado',
      sections: []
    };
  }

  if (!currentKpi) {
    return null;
  }

  const sections = currentKpi.sections || [];
  const totalAmountCollected = sections.reduce(
    (sum, s) => sum + s.amountCollected,
    0
  );
  const totalAmountPending = sections.reduce(
    (sum, s) => sum + s.amountPending,
    0
  );
  const totalAmount = sections.reduce((sum, s) => sum + s.amountTotal, 0);

  const moneySlices: DonutSlice[] = [
    {
      label: 'Recaudado',
      value: totalAmountCollected,
      color: '#22c55e',
      fmt: fmtMoney
    },
    {
      label: 'Pendiente',
      value: totalAmountPending,
      color: '#ef4444',
      fmt: fmtMoney
    }
  ];

  const barItems: BarItem[] = sections.map((s, idx) => {
    const colors = ['blue', 'amber', 'purple', 'rose', 'cyan'];
    return {
      label: s.typeKPI,
      value: s.amountCollected,
      color: colors[idx % colors.length] as any,
      fmt: fmtMoney
    };
  });

  return (
    <div className="trash-dashboard" style={{ padding: '0 0 24px 0' }}>
      <div className="trash-kpi-semantic-row">
        <div
          className="trash-kpi-metrics-grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
          }}
        >
          <KPICard
            label="Total Recaudado"
            value={fmtMoney(totalAmountCollected)}
            icon={<CheckCircle size={16} />}
            color="green"
            valueColor="green"
            description="Monto liquidado"
          />
          <KPICard
            label="Monto Pendiente"
            value={fmtMoney(totalAmountPending)}
            icon={<Clock size={16} />}
            color="red"
            valueColor="red"
            description="Por cobrar"
          />
          <KPICard
            label="Facturas Emitidas"
            value={fmtNum(currentKpi.totalBillsIssued)}
            icon={<FileText size={16} />}
            color="blue"
            description="Total emitidas"
          />
          <KPICard
            label="Predios Únicos"
            value={fmtNum(currentKpi.uniqueCadastralKeys)}
            icon={<Home size={16} />}
            color="purple"
            description="Claves catastrales unicas"
          />
          <KPICard
            label="Promedio por Pago"
            value={fmtMoney(currentKpi.averagePaidBill)}
            icon={<Activity size={16} />}
            color="amber"
            description="Pago promedio"
          />
          <KPICard
            label="Notas de Crédito"
            value={fmtMoney(currentKpi.totalNotesAmount)}
            icon={<TrendingDown size={16} />}
            color="rose"
            description={`${fmtNum(currentKpi.countNotes)} notas aplicadas`}
          />
        </div>
      </div>

      {sections.length > 0 && (
        <div
          className="trash-dashboard-charts-grid"
          style={{ marginTop: '24px' }}
        >
          <DonutChart
            title="Distribución de Montos"
            slices={moneySlices}
            centerLabel="Total Acumulado"
            centerValue={fmtMoney(totalAmount)}
            description="Distribución de recaudación vs pendiente"
          />
          <VerticalBarChart
            title="Recaudación por Rubro"
            items={barItems}
            description="Montos liquidados por cada rubro principal"
          />
        </div>
      )}
    </div>
  );
};
