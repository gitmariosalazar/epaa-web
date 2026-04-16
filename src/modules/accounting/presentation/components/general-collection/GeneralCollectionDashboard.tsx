import React from 'react';
import '../../../../trash/presentation/styles/TrashRateDashboard.css';
import {
  FileText,
  Home,
  CheckCircle,
  Clock,
  TrendingDown,
  Activity
} from 'lucide-react';
import {
  type GeneralKPIResponse,
  type KPISection
} from '../../../domain/models/GenelarCollection';
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
import { CHART_COLORS } from '@/shared/presentation/utils/colors/charts.colors';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import '../../styles/payments/GeneralCollectionDashboards.css';

interface GeneralCollectionDashboardProps {
  kpi: GeneralKPIResponse | null;
  isLoading: boolean;
  isCompact?: boolean;
}

export const GeneralCollectionDashboard: React.FC<
  GeneralCollectionDashboardProps
> = ({ kpi, isLoading, isCompact }) => {
  // ── All data computations use safe defaults so hooks below are always called ──
  const fmtNum = (n: number) => Number(n || 0).toLocaleString('es-EC');

  const sections = kpi?.sections || [];
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
      color: 'green',
      fmt: (n: number) => CurrencyFormatter.format(n)
    },
    {
      label: 'Pendiente',
      value: totalAmountPending,
      color: 'red',
      fmt: (n: number) => CurrencyFormatter.format(n)
    }
  ];

  const barItems: BarItem[] = sections.map((s, idx) => ({
    label: s.typeKPI,
    value: s.amountCollected,
    color: CHART_COLORS[idx % CHART_COLORS.length] as any,
    fmt: (n: number) => CurrencyFormatter.format(n)
  }));

  const columnsSections: Column<KPISection>[] = [
    {
      header: 'Tipo de Rubro',
      accessor: 'typeKPI',
      sortable: true,
      id: 'typeKPI'
    },
    {
      header: 'T. Facturas',
      accessor: 'countTotal',
      sortable: true,
      isNumeric: true,
      id: 'countTotal'
    },
    {
      header: 'Fact. Recaudadas',
      accessor: 'countCollected',
      sortable: true,
      isNumeric: true,
      id: 'countCollected'
    },
    {
      header: 'Fact. Pendientes',
      accessor: 'countPending',
      sortable: true,
      isNumeric: true,
      id: 'countPending'
    },
    {
      header: 'Fact. > 0',
      accessor: 'countGreaterThanZero',
      sortable: true,
      isNumeric: true,
      id: 'countGreaterThanZero'
    },
    {
      header: 'Fact. < 0',
      accessor: 'countLessThanZero',
      sortable: true,
      isNumeric: true,
      id: 'countLessThanZero'
    },
    {
      header: 'Fact. 0',
      accessor: 'countZero',
      sortable: true,
      isNumeric: true,
      id: 'countZero'
    },
    {
      header: 'Fact. Nulas',
      accessor: 'countNull',
      sortable: true,
      isNumeric: true,
      id: 'countNull'
    },
    {
      header: 'Monto Recaudado',
      accessor: (item: KPISection) =>
        CurrencyFormatter.format(item.amountCollected || 0),
      sortable: true,
      isNumeric: true,
      id: 'amountCollected'
    },
    {
      header: 'Monto Pendiente',
      accessor: (item: KPISection) =>
        CurrencyFormatter.format(item.amountPending || 0),
      sortable: true,
      isNumeric: true,
      id: 'amountPending'
    },
    {
      header: 'Monto Descuentos',
      accessor: (item: KPISection) =>
        CurrencyFormatter.format(item.amountDiscounts || 0),
      sortable: true,
      isNumeric: true,
      id: 'amountDiscounts'
    },
    {
      header: 'Total',
      accessor: (item: KPISection) => (
        <span className="total-due-text">
          {item.amountTotal !== undefined
            ? CurrencyFormatter.format(item.amountTotal)
            : '-'}
        </span>
      ),
      id: 'amountTotal',
      sortable: true,
      sortKey: 'amountTotal',
      style: { width: '120px', textAlign: 'right' }
    }
  ];

  const totalCountSections: number = sections.reduce(
    (sum, s) => sum + s.countTotal,
    0
  );
  const totalCollectedCountSections: number = sections.reduce(
    (sum, s) => sum + s.countCollected,
    0
  );
  const totalPendingCountSections: number = sections.reduce(
    (sum, s) => sum + s.countPending,
    0
  );
  const totalGreaterThanZeroCountSections: number = sections.reduce(
    (sum, s) => sum + s.countGreaterThanZero,
    0
  );
  const totalLessThanZeroCountSections: number = sections.reduce(
    (sum, s) => sum + s.countLessThanZero,
    0
  );
  const totalZeroCountSections: number = sections.reduce(
    (sum, s) => sum + s.countZero,
    0
  );
  const totalNullCountSections: number = sections.reduce(
    (sum, s) => sum + s.countNull,
    0
  );
  const totalAmountCollectedSections: number = sections.reduce(
    (sum, s) => sum + s.amountCollected,
    0
  );
  const totalAmountPendingSections: number = sections.reduce(
    (sum, s) => sum + s.amountPending,
    0
  );
  const totalAmountDiscountsSections: number = sections.reduce(
    (sum, s) => sum + (s.amountDiscounts || 0),
    0
  );
  const totalAmountSections: number = sections.reduce(
    (sum, s) => sum + (s.amountTotal || 0),
    0
  );

  const totalRows = [
    {
      label: 'Total',
      value: CurrencyFormatter.format(totalAmountSections),
      highlight: true,
      columnId: 'amountTotal'
    },
    {
      label: 'Total Pendiente',
      value: CurrencyFormatter.format(totalAmountPendingSections),
      highlight: true,
      columnId: 'amountPending'
    },
    {
      label: 'Total Recaudado',
      value: CurrencyFormatter.format(totalAmountCollectedSections),
      highlight: true,
      columnId: 'amountCollected'
    },
    {
      label: 'Total de Descuentos',
      value: CurrencyFormatter.format(totalAmountDiscountsSections),
      highlight: true,
      columnId: 'amountDiscounts'
    },
    {
      label: 'Total de Facturas',
      value: totalCountSections,
      highlight: true,
      columnId: 'countTotal'
    },
    {
      label: 'Total de Facturas Recaudadas',
      value: totalCollectedCountSections,
      highlight: true,
      columnId: 'countCollected'
    },
    {
      label: 'Total de Facturas Pendientes',
      value: totalPendingCountSections,
      highlight: true,
      columnId: 'countPending'
    },
    {
      label: 'Total de Facturas con Monto Mayor a 0',
      value: totalGreaterThanZeroCountSections,
      highlight: true,
      columnId: 'countGreaterThanZero'
    },
    {
      label: 'Total de Facturas con Monto Menor a 0',
      value: totalLessThanZeroCountSections,
      highlight: true,
      columnId: 'countLessThanZero'
    },
    {
      label: 'Total de Facturas con Monto 0',
      value: totalZeroCountSections,
      highlight: true,
      columnId: 'countZero'
    },
    {
      label: 'Total de Facturas Nulas',
      value: totalNullCountSections,
      highlight: true,
      columnId: 'countNull'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport<KPISection>({
    data: sections,
    availableColumns: columnsSections.map((c) => ({
      id:
        c.id ||
        (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
      label: c.header as string,
      isDefault: true
    })),
    reportTitle: `REPORTE AGRUPADO DE RECOLECCIÓN`,
    reportDescription: 'Detalle agrupado de recolección',
    labelsHorizontal: {
      'Fecha de Exportación':
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows,
    mapRowData: (item, selectedCols) => {
      const rowData: Record<string, string> = {
        'Tipo de Rubro': item.typeKPI,
        'T. Facturas': String(item.countTotal),
        'Fact. Recaudadas': String(item.countCollected),
        'Fact. Pendientes': String(item.countPending),
        'Fact. > 0': String(item.countGreaterThanZero),
        'Fact. < 0': String(item.countLessThanZero),
        'Fact. 0': String(item.countZero),
        'Fact. Nulas': String(item.countNull),
        'Monto Recaudado': CurrencyFormatter.format(item.amountCollected),
        'Monto Pendiente': CurrencyFormatter.format(item.amountPending),
        'Monto Descuentos': CurrencyFormatter.format(item.amountDiscounts),
        Total: CurrencyFormatter.format(item.amountTotal)
      };
      return selectedCols.map((col) => rowData[col.label] || '-');
    }
  });

  // ── Early returns AFTER all hooks (Rules of Hooks: never return before a hook) ──
  if (isLoading) return null;
  if (!kpi) return null;

  return (
    <div className="trash-dashboard dashboard-trash-section">
      <div className="trash-kpi-semantic-row">
        <div className="trash-kpi-metrics-grid trash-kpi-metrics-grid-auto">
          <KPICard
            label="Total Recaudado"
            value={CurrencyFormatter.format(totalAmountCollected)}
            icon={<CheckCircle size={16} />}
            color="green"
            valueColor="green"
            description="Monto liquidado"
          />
          <KPICard
            label="Monto Pendiente"
            value={CurrencyFormatter.format(totalAmountPending)}
            icon={<Clock size={16} />}
            color="red"
            valueColor="red"
            description="Monto por cobrar"
          />
          <KPICard
            label="Total de Facturas"
            value={fmtNum(kpi.totalBillsIssued)}
            icon={<FileText size={16} />}
            color="blue"
            description="Total emitidas"
          />
          <KPICard
            label="Total de Acometidas"
            value={fmtNum(kpi.uniqueCadastralKeys)}
            icon={<Home size={16} />}
            color="purple"
            description="Claves catastrales unicas"
          />
          <KPICard
            label="Promedio de Pago por Factura"
            value={CurrencyFormatter.format(kpi.averagePaidBill)}
            icon={<Activity size={16} />}
            color="amber"
            description="Pago promedio"
          />
          <KPICard
            label="Notas de Crédito"
            value={CurrencyFormatter.format(kpi.totalNotesAmount)}
            icon={<TrendingDown size={16} />}
            color="rose"
            description={`${fmtNum(kpi.countNotes)} notas aplicadas`}
          />
        </div>
      </div>

      {sections.length > 0 && (
        <div className="trash-dashboard-charts-grid">
          <DonutChart
            title="Distribución de Montos"
            slices={moneySlices}
            centerLabel="Total Acumulado"
            centerValue={CurrencyFormatter.format(totalAmount)}
            icon={<CheckCircle size={16} />}
            label="Código de Título"
            value={kpi.codeTitle}
            description="Distribución de recaudación vs pendiente"
          />
          <VerticalBarChart
            title="Recaudación por Rubro"
            items={barItems}
            icon={<CheckCircle size={16} />}
            label="Código de Título"
            value={kpi.codeTitle}
            description="Montos liquidados por cada rubro principal"
          />
        </div>
      )}
      {sections.length > 0 && (
        <div
          className={`payments-table-wrapper ${isCompact ? 'compact-table' : ''}`}
        >
          <Table
            key={`dashboard-sections-${isCompact ? 'compact' : 'full'}`}
            data={sections}
            columns={columnsSections}
            isLoading={false}
            pagination
            fullHeight={!isCompact}
            pageSize={20}
            onExportPdf={() => setShowPdfPreview(true)}
            totalRows={totalRows}
            width="100"
            emptyState={
              <EmptyState
                message="No se encontraron registros"
                description="No hay registros agrupados que coincidan con los filtros seleccionados."
              />
            }
          />
          {PdfPreviewModal}
        </div>
      )}
    </div>
  );
};
