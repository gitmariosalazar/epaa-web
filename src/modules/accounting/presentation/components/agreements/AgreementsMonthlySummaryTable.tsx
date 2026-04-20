import React from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { MonthlyCollectionSummary } from '../../../domain/models/Agreements';
import '../../styles/payments/PaymentsTable.css';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';

interface AgreementsMonthlySummaryTableProps {
  data: MonthlyCollectionSummary[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
}

export const AgreementsMonthlySummaryTable: React.FC<
  AgreementsMonthlySummaryTableProps
> = ({ data, isLoading, onSort, sortConfig }) => {
  const columns: Column<MonthlyCollectionSummary>[] = [
    { header: 'Mes', accessor: 'monthKey', sortable: true, id: 'monthKey' },
    {
      header: 'Emitido',
      accessor: (item) => CurrencyFormatter.format(item.amountEmitted),
      sortKey: 'amountEmitted',
      sortable: true,
      isNumeric: true,
      id: 'amountEmitted'
    },
    {
      header: 'Recaudado',
      accessor: (item) => CurrencyFormatter.format(item.amountCollected),
      sortKey: 'amountCollected',
      sortable: true,
      isNumeric: true,
      id: 'amountCollected'
    },
    {
      header: 'Pendiente',
      accessor: (item) => CurrencyFormatter.format(item.amountPending),
      sortKey: 'amountPending',
      sortable: true,
      isNumeric: true,
      id: 'amountPending'
    },
    {
      header: 'Eficiencia',
      accessor: (item) => (
        <ProgressBar
          value={item.collectionEfficiencyPct}
          color={getTrafficLightColor(item.collectionEfficiencyPct)}
        />
      ),
      sortKey: 'collectionEfficiencyPct',
      sortable: true,
      isNumeric: true,
      id: 'collectionEfficiencyPct'
    }
  ];

  const totalEmitted = data.reduce(
    (sum, item) => sum + (item.amountEmitted || 0),
    0
  );
  const totalCollected = data.reduce(
    (sum, item) => sum + (item.amountCollected || 0),
    0
  );
  const totalPending = data.reduce(
    (sum, item) => sum + (item.amountPending || 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL EMITIDO',
      value: CurrencyFormatter.format(totalEmitted),
      highlight: false,
      columnId: 'amountEmitted'
    },
    {
      label: 'TOTAL RECAUDADO',
      value: CurrencyFormatter.format(totalCollected),
      highlight: true,
      columnId: 'amountCollected'
    },
    {
      label: 'TOTAL PENDIENTE',
      value: CurrencyFormatter.format(totalPending),
      highlight: false,
      columnId: 'amountPending'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<MonthlyCollectionSummary>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'RESUMEN MENSUAL DE RECAUDACIÓN - CONVENIOS',
      reportDescription: 'Detalle histórico de emisión y recaudación por mes',
      labelsHorizontal: {
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          Mes: item.monthKey,
          Emitido: CurrencyFormatter.format(item.amountEmitted),
          Recaudado: CurrencyFormatter.format(item.amountCollected),
          Pendiente: CurrencyFormatter.format(item.amountPending),
          Eficiencia: `${item.collectionEfficiencyPct.toFixed(2)}%`
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
            description="No hay datos de resumen mensual."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
