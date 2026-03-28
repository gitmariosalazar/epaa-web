import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { CollectorPerformanceKPI } from '../../../domain/models/trash-rate-report.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import '../../styles/PaymentsTable.css';

import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';

interface CollectorPerformanceKPITableProps {
  data: CollectorPerformanceKPI[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const CollectorPerformanceKPITable: React.FC<
  CollectorPerformanceKPITableProps
> = ({ data, isLoading, onSort, sortConfig, error, startDate, endDate }) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const columns: Column<CollectorPerformanceKPI>[] = [
    {
      header: t('trashRateReport.clientDetail.collectorId', 'ID del Cobrador'),
      accessor: 'collectorId',
      sortable: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.totalTransactions',
        'N° de Facturas'
      ),
      accessor: 'totalTransactions',
      isNumeric: true,
      id: 'totalTransactions'
    },
    {
      header: t(
        'trashRateReport.clientDetail.sourceTrashRateTotal',
        'TB Datos Ingreso'
      ),
      accessor: (item) => formatCurrency(item.sourceTrashRateTotal),
      isNumeric: true,
      id: 'sourceTrashRateTotal'
    },
    {
      header: t(
        'trashRateReport.clientDetail.valorTableTotal',
        'TB Tabla Valor'
      ),
      accessor: (item) => formatCurrency(item.valorTableTotal),
      isNumeric: true,
      id: 'valorTableTotal'
    },
    {
      header: t(
        'trashRateReport.clientDetail.integrityGapAmount',
        'Diferencia (TBDI - TBTV)'
      ),
      accessor: (item) => formatCurrency(item.integrityGapAmount),
      isNumeric: true,
      id: 'integrityGapAmount'
    },
    {
      header: t('trashRateReport.clientDetail.grossAmount', 'Monto Facturado'),
      accessor: (item) => formatCurrency(item.grossAmount),
      isNumeric: true,
      id: 'grossAmount'
    },
    {
      header: t(
        'trashRateReport.clientDetail.totalDiscountsApplied',
        'DesC. Aplicados'
      ),
      accessor: (item) => formatCurrency(item.totalDiscountsApplied),
      isNumeric: true,
      id: 'totalDiscountsApplied'
    },
    {
      header: t(
        'trashRateReport.clientDetail.netCollectionTotal',
        'Recaudación Neta'
      ),
      accessor: (item) => formatCurrency(item.netCollectionTotal),
      isNumeric: true,
      id: 'netCollectionTotal'
    },
    {
      header: t(
        'trashRateReport.clientDetail.cancelledBillsValue',
        'Valor Fact. (A - B)'
      ),
      accessor: (item) => formatCurrency(item.cancelledBillsValue),
      isNumeric: true,
      id: 'cancelledBillsValue'
    },
    {
      header: t(
        'trashRateReport.clientDetail.cancelledBillsCount',
        'Fact. (A - B)'
      ),
      accessor: 'cancelledBillsCount',
      isNumeric: true,
      id: 'cancelledBillsCount'
    }
  ];

  const totalTransactions = data.reduce(
    (sum, row) => sum + row.totalTransactions,
    0
  );
  const sourceTrashRateTotal = data.reduce(
    (sum, row) => sum + row.sourceTrashRateTotal,
    0
  );
  const valorTableTotal = data.reduce(
    (sum, row) => sum + row.valorTableTotal,
    0
  );
  const integrityGapAmount = data.reduce(
    (sum, row) => sum + row.integrityGapAmount,
    0
  );
  const grossAmount = data.reduce((sum, row) => sum + row.grossAmount, 0);
  const totalDiscountsApplied = data.reduce(
    (sum, row) => sum + row.totalDiscountsApplied,
    0
  );
  const netCollectionTotal = data.reduce(
    (sum, row) => sum + row.netCollectionTotal,
    0
  );
  const cancelledBillsValueTotal = data.reduce(
    (sum, row) => sum + row.cancelledBillsValue,
    0
  );

  const totalCancelledCount = data.reduce(
    (sum, row) => sum + row.cancelledBillsCount,
    0
  );

  const totalRows = [
    {
      label: 'N° de Facturas',
      value: totalTransactions,
      columnId: 'totalTransactions'
    },
    {
      label: 'TB Datos Ingreso',
      value: sourceTrashRateTotal,
      columnId: 'sourceTrashRateTotal'
    },
    {
      label: 'TB Tabla Valor',
      value: valorTableTotal,
      columnId: 'valorTableTotal'
    },
    {
      label: 'Diferencia (TBDI - TBTV)',
      value: integrityGapAmount,
      columnId: 'integrityGapAmount'
    },
    { label: 'Monto Facturado', value: grossAmount, columnId: 'grossAmount' },
    {
      label: 'DesC. Aplicados',
      value: totalDiscountsApplied,
      columnId: 'totalDiscountsApplied'
    },
    {
      label: 'Valor Fact. (A - B)',
      value: cancelledBillsValueTotal,
      columnId: 'cancelledBillsValue'
    },
    {
      label: 'Recaudación Neta',
      value: netCollectionTotal - cancelledBillsValueTotal,
      highlight: true,
      columnId: 'netCollectionTotal'
    },
    {
      label: 'Fact. (A - B)',
      value: totalCancelledCount,
      columnId: 'cancelledBillsCount'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<CollectorPerformanceKPI>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE TASA DE RECOLECCIÓN DE BASURA',
      reportDescription:
        'Reporte de tasa de recolección de basura por recaudador o cobrador (Rendimiento del Recolector mensual)',
      labelsHorizontal: {
        'Rango de Fecha': `${startDate} - ${endDate}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() + new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          'ID del Cobrador': item.collectorId || '-',
          'N° de Facturas': String(item.totalTransactions || 0),
          'TB Datos Ingreso': formatCurrency(item.sourceTrashRateTotal),
          'TB Tabla Valor': formatCurrency(item.valorTableTotal),
          'Diferencia (TBDI - TBTV)': formatCurrency(item.integrityGapAmount),
          'Monto Facturado': formatCurrency(item.grossAmount),
          'DesC. Aplicados': formatCurrency(item.totalDiscountsApplied),
          'Recaudación Neta': formatCurrency(item.netCollectionTotal),
          'Valor Fact. (A - B)': formatCurrency(item.cancelledBillsValue),
          'Fact. (A - B)': String(item.cancelledBillsCount || 0)
        };
        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

  if (error) return null;

  return (
    <div className="trash-rate-audit-table-wrapper">
      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        onSort={onSort}
        onExportPdf={() => setShowPdfPreview(true)}
        sortConfig={sortConfig}
        emptyState={<EmptyState message="Data not found!" />}
        totalRows={totalRows}
        getRowColor={(r) => {
          if (r.integrityGapAmount !== 0) {
            return 'error';
          }
          if (r.cancelledBillsValue !== 0) {
            return 'warning';
          }
        }}
      />
      {PdfPreviewModal}
    </div>
  );
};
