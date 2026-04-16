import React from 'react';
import '../../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { MonthlySummaryRow } from '../../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface MonthlySummaryTableProps {
  data: MonthlySummaryRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const MonthlySummaryTable: React.FC<MonthlySummaryTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  startDate,
  endDate
}) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number | null | undefined) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value ?? 0);

  const columns: Column<MonthlySummaryRow>[] = [
    {
      header: t(
        'trashRateReport.monthlySummary.paymentStatusCode',
        'Estado Pago'
      ),
      accessor: 'paymentStatusCode'
    },
    {
      header: t('trashRateReport.monthlySummary.valorOrder', 'Orden Valor'),
      accessor: 'valorOrder'
    },
    {
      header: t('trashRateReport.monthlySummary.billCount', 'Facturas'),
      accessor: 'billCount',
      isNumeric: true,
      id: 'billCount'
    },
    {
      header: t(
        'trashRateReport.monthlySummary.totalRateIncome',
        'Tasa Ingreso'
      ),
      accessor: (r) => formatCurrency(r.totalRateIncome),
      isNumeric: true,
      id: 'totalRateIncome'
    },
    {
      header: t(
        'trashRateReport.monthlySummary.totalRateValorTable',
        'Tasa Valor'
      ),
      accessor: (r) => formatCurrency(r.totalRateValorTable),
      isNumeric: true,
      id: 'totalRateValorTable'
    },
    {
      header: t('trashRateReport.monthlySummary.totalDiscounts', 'Descuentos'),
      accessor: (r) => formatCurrency(r.totalDiscounts),
      isNumeric: true,
      id: 'totalDiscounts'
    },
    {
      header: t('trashRateReport.monthlySummary.totalTrashNet', 'Neto Basura'),
      accessor: (r) => formatCurrency(r.totalTrashNet),
      isNumeric: true,
      id: 'totalTrashNet'
    },
    {
      header: t(
        'trashRateReport.monthlySummary.missingValorRecords',
        'Sin Valor'
      ),
      accessor: 'missingValorRecords',
      isNumeric: true,
      id: 'missingValorRecords'
    }
  ];

  // Totals calculations
  const totalBillCount = data.reduce(
    (sum, row) => sum + (row.billCount ?? 0),
    0
  );
  const totalRateIncome = data.reduce(
    (sum, row) => sum + (row.totalRateIncome ?? 0),
    0
  );
  const totalRateValor = data.reduce(
    (sum, row) => sum + (row.totalRateValorTable ?? 0),
    0
  );
  const totalDiscounts = data.reduce(
    (sum, row) => sum + (row.totalDiscounts ?? 0),
    0
  );
  const totalNet = data.reduce((sum, row) => sum + (row.totalTrashNet ?? 0), 0);
  const totalMissing = data.reduce(
    (sum, row) => sum + (row.missingValorRecords ?? 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL FACTURAS',
      value: totalBillCount,
      highlight: false,
      columnId: 'billCount'
    },
    {
      label: 'TOTAL Tabla Ingreso',
      value: totalRateIncome,
      highlight: false,
      columnId: 'totalRateIncome'
    },
    {
      label: 'TOTAL Tabla Valor',
      value: totalRateValor,
      highlight: false,
      columnId: 'totalRateValorTable'
    },
    {
      label: 'TOTAL DESCUENTOS',
      value: totalDiscounts,
      highlight: false,
      columnId: 'totalDiscounts'
    },
    {
      label: 'TOTAL NETO',
      value: totalNet,
      highlight: false,
      columnId: 'totalTrashNet'
    },
    {
      label: 'TOTAL SIN VALOR',
      value: totalMissing,
      highlight: false,
      columnId: 'missingValorRecords'
    },
    {
      label: 'TOTAL',
      value: totalNet,
      highlight: true,
      columnId: 'totalTrashNet'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<MonthlySummaryRow>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE RESUMEN MENSUAL DE TASA DE BASURA',
      reportDescription:
        'Resumen consolidado de valores y estados de facturación.',
      labelsHorizontal: {
        'Rango de Fecha': `${startDate} - ${endDate}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          'Estado Pago': item.paymentStatusCode || '-',
          'Orden Valor': String(item.valorOrder || '-'),
          Facturas: String(item.billCount || 0),
          'Tasa Ingreso': formatCurrency(item.totalRateIncome),
          'Tasa Valor': formatCurrency(item.totalRateValorTable),
          Descuentos: formatCurrency(item.totalDiscounts),
          'Neto Basura': formatCurrency(item.totalTrashNet),
          'Sin Valor': String(item.missingValorRecords || 0)
        };

        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

  if (isLoading) return null;

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
        emptyState={
          <EmptyState
            message={t('common.noResults', 'No se encontraron resultados')}
            icon={IoInformationCircleOutline}
            description={t(
              'common.noResultsDescription',
              'Intenta ajustar los filtros de búsqueda para ver los resultados.'
            )}
            minHeight="300px"
            variant="info"
          />
        }
        totalRows={totalRows}
        getRowColor={(item: MonthlySummaryRow) => {
          const color = item.paymentStatusCode !== 'P' ? 'error' : undefined;
          return color;
        }}
      />
      {PdfPreviewModal}
    </div>
  );
};
