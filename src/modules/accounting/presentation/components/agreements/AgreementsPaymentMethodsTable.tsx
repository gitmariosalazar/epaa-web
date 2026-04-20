import React from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { PaymentMethodSummary } from '../../../domain/models/Agreements';
import '../../styles/payments/PaymentsTable.css';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';

interface AgreementsPaymentMethodsTableProps {
  data: PaymentMethodSummary[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  startDate?: string;
  endDate?: string;
}

export const AgreementsPaymentMethodsTable: React.FC<
  AgreementsPaymentMethodsTableProps
> = ({ data, isLoading, onSort, sortConfig, startDate, endDate }) => {
  const columns: Column<PaymentMethodSummary>[] = [
    {
      header: 'Método de Pago',
      accessor: 'paymentMethod',
      sortable: true,
      id: 'paymentMethod'
    },
    {
      header: 'Total Recaudado',
      accessor: (item) => CurrencyFormatter.format(item.methodTotal),
      sortKey: 'methodTotal',
      sortable: true,
      isNumeric: true,
      id: 'methodTotal'
    },
    {
      header: 'Transacciones',
      accessor: 'transactionCount',
      sortable: true,
      isNumeric: true,
      id: 'transactionCount'
    },
    {
      header: 'Contribución',
      accessor: (item) => (
        <ProgressBar
          value={item.contributionPct}
          color={getTrafficLightColor(item.contributionPct)}
        />
      ),
      sortKey: 'contributionPct',
      sortable: true,
      isNumeric: true,
      id: 'contributionPct'
    }
  ];

  const totalCollected = data.reduce(
    (sum, item) => sum + (item.methodTotal || 0),
    0
  );
  const totalTransactions = data.reduce(
    (sum, item) => sum + (item.transactionCount || 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL RECAUDADO',
      value: CurrencyFormatter.format(totalCollected),
      highlight: true,
      columnId: 'methodTotal'
    },
    {
      label: 'TOTAL TRANSACCIONES',
      value: totalTransactions,
      highlight: false,
      columnId: 'transactionCount'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<PaymentMethodSummary>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE MÉTODOS DE PAGO - CONVENIOS',
      reportDescription:
        'Resumen de recaudación desglosado por canal o método de pago',
      labelsHorizontal: {
        Rango: `${startDate || '-'} - ${endDate || '-'}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          'Método de Pago': item.paymentMethod,
          'Total Recaudado': CurrencyFormatter.format(item.methodTotal),
          Transacciones: String(item.transactionCount),
          Contribución: `${item.contributionPct.toFixed(2)}%`
        };
        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

  return (
    <div className="payments-table-wrapper">
      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={20}
        onSort={onSort}
        sortConfig={sortConfig}
        onExportPdf={() => setShowPdfPreview(true)}
        totalRows={totalRows}
        emptyState={
          <EmptyState
            message="No se encontraron registros"
            description="No hay datos de métodos de pago para el rango seleccionado."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
