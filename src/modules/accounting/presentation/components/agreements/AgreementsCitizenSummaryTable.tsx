import React from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { CitizenSummary } from '../../../domain/models/Agreements';
import '../../styles/payments/PaymentsTable.css';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

interface AgreementsCitizenSummaryTableProps {
  data: CitizenSummary[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  startDate?: string;
  endDate?: string;
}

export const AgreementsCitizenSummaryTable: React.FC<
  AgreementsCitizenSummaryTableProps
> = ({ data, isLoading, onSort, sortConfig, startDate, endDate }) => {
  const columns: Column<CitizenSummary>[] = [
    { header: 'Cédula/RUC', accessor: 'cardId', sortable: true, id: 'cardId' },
    {
      header: 'Clave Catastral',
      accessor: (item) =>
        item.cadastralKey === '0' ? (
          <ColorChip
            label={`${item.cadastralKey}`}
            status="warning"
            variant="soft"
            size="sm"
          />
        ) : item.cadastralKey ? (
          item.cadastralKey
        ) : (
          <ColorChip label={'S/C'} status="warning" variant="soft" size="sm" />
        ),
      sortable: true,
      id: 'cadastralKey'
    },
    {
      header: 'Nombres',
      accessor: 'firstName',
      sortable: true,
      id: 'firstName'
    },
    {
      header: 'Apellidos',
      accessor: 'lastName',
      sortable: true,
      id: 'lastName'
    },
    {
      header: 'Cuotas Totales',
      accessor: 'totalInstallments',
      sortable: true,
      isNumeric: true,
      id: 'totalInstallments'
    },
    {
      header: 'Recaudado',
      accessor: (item) => CurrencyFormatter.format(item.collectedAmount),
      sortKey: 'collectedAmount',
      sortable: true,
      isNumeric: true,
      id: 'collectedAmount'
    },
    {
      header: 'Pendiente',
      accessor: (item) => CurrencyFormatter.format(item.pendingAmount),
      sortKey: 'pendingAmount',
      sortable: true,
      isNumeric: true,
      id: 'pendingAmount'
    }
  ];

  const totalCollected = data.reduce(
    (sum, item) => sum + (item.collectedAmount || 0),
    0
  );
  const totalPending = data.reduce(
    (sum, item) => sum + (item.pendingAmount || 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL RECAUDADO',
      value: CurrencyFormatter.format(totalCollected),
      highlight: true,
      columnId: 'collectedAmount'
    },
    {
      label: 'TOTAL PENDIENTE',
      value: CurrencyFormatter.format(totalPending),
      highlight: false,
      columnId: 'pendingAmount'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<CitizenSummary>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'RESUMEN DE CIUDADANOS CON CONVENIOS',
      reportDescription: 'Detalle consolidado de cuotas y montos por ciudadano',
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
          'Cédula/RUC': item.cardId,
          'Clave Catastral': item.cadastralKey,
          Nombres: item.firstName,
          Apellidos: item.lastName,
          'Cuotas Totales': String(item.totalInstallments),
          Recaudado: CurrencyFormatter.format(item.collectedAmount),
          Pendiente: CurrencyFormatter.format(item.pendingAmount)
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
            message="No se encontraron ciudadanos"
            description="No hay datos de ciudadanos para el rango seleccionado."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
