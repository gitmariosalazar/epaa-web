import React from 'react';
import '../../styles/payments/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { GeneralCollectionResponse } from '../../../domain/models/GenelarCollection';
// import { useTranslation } from 'react-i18next';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface GeneralCollectionTableProps {
  data: GeneralCollectionResponse[];
  isLoading: boolean;
  onSort?: (key: keyof GeneralCollectionResponse | string, direction: 'asc' | 'desc') => void;
  sortConfig?: {
    key: keyof GeneralCollectionResponse | string;
    direction: 'asc' | 'desc';
  } | null;
  startDate?: string;
  endDate?: string;
}

export const GeneralCollectionTable: React.FC<GeneralCollectionTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  startDate,
  endDate
}) => {
  // const { t } = useTranslation();

  const columns: Column<GeneralCollectionResponse>[] = [
    {
      header: 'Cód. Ingreso',
      accessor: 'incomeCode',
      sortable: true
    },
    {
      header: 'Cód. Título',
      accessor: 'titleCode',
      sortable: true
    },
    {
      header: 'Cliente',
      accessor: (item: GeneralCollectionResponse) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={item.name} size="sm" />
          <div>
            <div style={{ fontWeight: 300 }}>{item.name}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'C.C',
      accessor: 'cadastralKey',
      sortable: true
    },
    {
      header: 'EPAA Val.',
      accessor: (item) => `$${Number(item.titleValue).toFixed(2)}`,
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true,
      id: 'titleValue'
    },
    {
      header: 'Recargo',
      accessor: (item) => `$${Number(item.surcharge).toFixed(2)}`,
      sortKey: 'surcharge',
      sortable: true,
      isNumeric: true,
      id: 'surcharge'
    },
    {
      header: '3er. Valor',
      accessor: (item) => `$${Number(item.thirdPartyValue).toFixed(2)}`,
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true,
      id: 'thirdPartyValue'
    },
    {
      header: 'Tasa Basura',
      accessor: (item) => `$${Number(item.trashRate).toFixed(2)}`,
      sortKey: 'trashRate',
      sortable: true,
      isNumeric: true,
      id: 'trashRate'
    },
    {
      header: 'Total',
      accessor: (item) => `$${Number(item.total).toFixed(2)}`,
      sortKey: 'total',
      sortable: true,
      isNumeric: true,
      id: 'total'
    },
    {
      header: 'Usuario',
      accessor: 'paymentUser',
      sortable: true
    },
    {
      header: 'Método',
      accessor: 'paymentMethod',
      sortable: true
    },
    {
      header: 'Estado',
      accessor: 'incomeStatus',
      sortable: true
    }
  ];

  const totalTitleValue = data.reduce((sum, item) => sum + Number(item.titleValue), 0);
  const totalSurcharge = data.reduce((sum, item) => sum + Number(item.surcharge), 0);
  const totalThirdParty = data.reduce((sum, item) => sum + Number(item.thirdPartyValue), 0);
  const totalTrashRate = data.reduce((sum, item) => sum + Number(item.trashRate), 0);
  const totalAmount = data.reduce((sum, item) => sum + Number(item.total), 0);

  const totalRows = [
    { label: 'TOTAL EPAA', value: totalTitleValue, columnId: 'titleValue' },
    { label: 'TOTAL Recargo', value: totalSurcharge, highlight: false, columnId: 'surcharge' },
    { label: 'TOTAL 3er Val.', value: totalThirdParty, highlight: false, columnId: 'thirdPartyValue' },
    { label: 'TOTAL Basura', value: totalTrashRate, highlight: false, columnId: 'trashRate' },
    { label: 'TOTAL', value: totalAmount, highlight: true, columnId: 'total' }
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport<GeneralCollectionResponse>({
    data,
    availableColumns: columns.map((c) => ({
      id: c.id || (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
      label: c.header as string,
      isDefault: true
    })),
    reportTitle: 'REPORTE DE RECOLECCIÓN GENERAL',
    reportDescription: 'Detalle de recolección general',
    labelsHorizontal: {
      Fecha: `${startDate || '-'} - ${endDate || '-'}`,
      'Fecha de Exportación': new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows,
    mapRowData: (item, selectedCols) => {
      const rowData: Record<string, string> = {
        'Cód. Ingreso': item.incomeCode,
        'Cód. Título': item.titleCode,
        'Cliente': `${item.name} (${item.cardId})`,
        'C.C': item.cadastralKey,
        'EPAA Val.': formatCurrency(item.titleValue),
        'Recargo': formatCurrency(item.surcharge),
        '3er. Valor': formatCurrency(item.thirdPartyValue),
        'Tasa Basura': formatCurrency(item.trashRate),
        'Total': formatCurrency(item.total),
        'Usuario': item.paymentUser,
        'Método': item.paymentMethod || '-',
        'Estado': item.incomeStatus || '-'
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
        pageSize={15}
        onSort={onSort}
        sortConfig={sortConfig}
        onExportPdf={() => setShowPdfPreview(true)}
        totalRows={totalRows}
        width="100"
        emptyState={
          <EmptyState
            message="No se encontraron registros"
            description="No hay registros de recolección que coincidan con los filtros seleccionados."
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
