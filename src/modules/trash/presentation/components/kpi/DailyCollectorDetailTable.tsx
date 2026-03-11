import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { DailyCollectorDetail } from '../../../domain/models/trash-rate-report.model';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { ConverDate } from '@/shared/presentation/utils/datetime/ConverDate';
import '../../styles/PaymentsTable.css';

import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';

interface DailyCollectorDetailTableProps {
  data: DailyCollectorDetail[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const DailyCollectorDetailTable: React.FC<
  DailyCollectorDetailTableProps
> = ({ data, isLoading, onSort, sortConfig, error, startDate, endDate }) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const columns: Column<DailyCollectorDetail>[] = [
    {
      header: t('trashRateReport.clientDetail.collectorId', 'Colector'),
      accessor: 'collectorId'
    },
    {
      header: t('trashRateReport.clientDetail.paymentDate', 'Fecha Pago'),
      accessor: (item) => ConverDate(item.paymentDate)
    },
    {
      header: t('trashRateReport.clientDetail.incomeStatus', 'Estado Ingreso'),
      accessor: 'incomeStatus'
    },
    {
      header: t(
        'trashRateReport.clientDetail.transactionsCount',
        'N° de Facturas'
      ),
      accessor: 'transactionsCount',
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.sourceTrashRateDaily',
        'TB Datos Ingreso'
      ),
      accessor: (item) => formatCurrency(item.sourceTrashRateDaily),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.valorTableDaily',
        'TB Tabla Valor'
      ),
      accessor: (item) => formatCurrency(item.valorTableDaily),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.integrityGapDaily',
        'Diferencia (TBDI - TBTV)'
      ),
      accessor: (item) => formatCurrency(item.integrityGapDaily),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.grossDailyTotal',
        'Monto Facturado'
      ),
      accessor: (item) => formatCurrency(item.grossDailyTotal),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.discountsDailyTotal',
        'DesC. Aplicados'
      ),
      accessor: (item) => formatCurrency(item.discountsDailyTotal),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.netDailyCollection',
        'Recaudación Neta'
      ),
      accessor: (item) => formatCurrency(item.netDailyCollection),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.cancelledValueDaily',
        'Valor Fact. (A - B)'
      ),
      accessor: (item) => formatCurrency(item.cancelledValueDaily),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.cancelledCountDaily',
        'Fact. (A - B)'
      ),
      accessor: 'cancelledCountDaily',
      isNumeric: true
    }
  ];

  const totalTransactions = data.reduce(
    (sum, row) => sum + row.transactionsCount,
    0
  );
  const sourceTrashRateTotal = data.reduce(
    (sum, row) => sum + row.sourceTrashRateDaily,
    0
  );
  const valorTableTotal = data.reduce(
    (sum, row) => sum + row.valorTableDaily,
    0
  );
  const integrityGapAmount = data.reduce(
    (sum, row) => sum + row.integrityGapDaily,
    0
  );
  const grossAmount = data.reduce((sum, row) => sum + row.grossDailyTotal, 0);
  const totalDiscountsApplied = data.reduce(
    (sum, row) => sum + row.discountsDailyTotal,
    0
  );
  const netCollectionTotal = data.reduce(
    (sum, row) => sum + row.netDailyCollection,
    0
  );
  const cancelledValueTotal = data.reduce(
    (sum, row) => sum + row.cancelledValueDaily,
    0
  );
  const totalCancelledCount = data.reduce(
    (sum, row) => sum + row.cancelledCountDaily,
    0
  );

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<DailyCollectorDetail>({
      data,
      availableColumns: columns.map((c) => ({
        id: typeof c.accessor === 'string' ? c.accessor : c.header as string,
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE TASA DE RECOLECCIÓN DE BASURA',
      reportDescription:
        'Reporte de tasa de recolección de basura por recaudador o cobrador (Detalle Diario)',
      labelsHorizontal: {
        'Rango de Fecha': `${startDate} - ${endDate}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          'Colector': item.collectorId || '-',
          'Fecha Pago': item.paymentDate ? ConverDate(item.paymentDate) : '-',
          'Estado Ingreso': item.incomeStatus || '-',
          'N° de Facturas': String(item.transactionsCount || 0),
          'TB Datos Ingreso': formatCurrency(item.sourceTrashRateDaily),
          'TB Tabla Valor': formatCurrency(item.valorTableDaily),
          'Diferencia (TBDI - TBTV)': formatCurrency(item.integrityGapDaily),
          'Monto Facturado': formatCurrency(item.grossDailyTotal),
          'DesC. Aplicados': formatCurrency(item.discountsDailyTotal),
          'Recaudación Neta': formatCurrency(item.netDailyCollection),
          'Valor Fact. (A - B)': formatCurrency(item.cancelledValueDaily),
          'Fact. (A - B)': String(item.cancelledCountDaily || 0)
        };
        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

  const totalRows = [
    { label: 'TOTAL FACTURAS', value: totalTransactions },
    { label: 'TOTAL TB DATOS INGRESO', value: sourceTrashRateTotal },
    { label: 'TOTAL TB TABLA VALOR', value: valorTableTotal },
    { label: 'TOTAL DIF. (TBDI - TBTV)', value: integrityGapAmount },
    { label: 'TOTAL MONTO FACT.', value: grossAmount },
    { label: 'TOTAL DESCUENTOS', value: totalDiscountsApplied },
    {
      label: 'TOTAL VALOR FACT. (A - B)',
      value: cancelledValueTotal
    },
    {
      label: 'RECAUDACIÓN NETA',
      value: netCollectionTotal - cancelledValueTotal,
      highlight: true
    },
    { label: 'TOTAL FACT. (A - B)', value: totalCancelledCount }
  ];

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
        fullHeight
        emptyState={<EmptyState message="Data not found!" />}
        totalRows={totalRows}
        getRowColor={(r) => {
          if (r.cancelledValueDaily !== 0 || r.cancelledCountDaily > 0) {
            return 'warning';
          }
          if (r.integrityGapDaily !== 0) {
            return 'error';
          }
        }}
      />
      {PdfPreviewModal}
    </div>
  );
};
