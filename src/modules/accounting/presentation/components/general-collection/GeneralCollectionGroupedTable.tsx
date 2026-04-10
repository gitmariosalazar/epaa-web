import React from 'react';
import '../../styles/payments/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
// import { useTranslation } from 'react-i18next';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { ConvertMonth } from '@/shared/utils/datetime/Converts';

// Hack to handle intersection of types
export type GroupedReportItem = {
  collector: string;
  titleCode: string;
  paymentMethod: string;
  status: string;
  titleValue: number;
  thirdPartyValue: number;
  surchargeValue: number;
  trashRateValue: number;
  discountTrashRateValue: number;
  totalValue: number;
  recordCount: number;
  date?: string;
  month?: string;
  year?: string;
};

interface GeneralCollectionGroupedTableProps {
  data: GroupedReportItem[];
  isLoading: boolean;
  type: 'daily' | 'monthly' | 'yearly';
  onSort?: (
    key: keyof GroupedReportItem | string,
    direction: 'asc' | 'desc'
  ) => void;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  startDate?: string;
  endDate?: string;
}

export const GeneralCollectionGroupedTable: React.FC<
  GeneralCollectionGroupedTableProps
> = ({ data, isLoading, type, onSort, sortConfig, startDate, endDate }) => {
  // const { t } = useTranslation();
  const columns: Column<GroupedReportItem>[] = [];

  if (type === 'daily') {
    columns.push({
      header: 'Fecha',
      accessor: 'date',
      sortable: true
    });
  } else if (type === 'monthly') {
    columns.push({
      header: 'Año / Mes',
      accessor: (item) =>
        `${item.year || ''} - ${ConvertMonth(Number(item.month))}`,
      id: 'yearAndMonth'
    });
  } else if (type === 'yearly') {
    columns.push({
      header: 'Año',
      accessor: 'year',
      sortable: true
    });
  }

  columns.push(
    { header: 'Recaudador', accessor: 'collector', sortable: true },
    { header: 'Cód. Título', accessor: 'titleCode', sortable: true },
    { header: 'Método', accessor: 'paymentMethod', sortable: true },
    { header: 'Estado', accessor: 'status', sortable: true },
    {
      header: '# Registros',
      accessor: 'recordCount',
      sortable: true,
      isNumeric: true
    },
    {
      header: 'Val. Título',
      accessor: (item) => `$${Number(item.titleValue).toFixed(2)}`,
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true,
      id: 'titleValue'
    },
    {
      header: 'Val. Terceros',
      accessor: (item) => `$${Number(item.thirdPartyValue).toFixed(2)}`,
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true,
      id: 'thirdPartyValue'
    },
    {
      header: 'Recargo',
      accessor: (item) => `$${Number(item.surchargeValue).toFixed(2)}`,
      sortKey: 'surchargeValue',
      sortable: true,
      isNumeric: true,
      id: 'surchargeValue'
    },
    {
      header: 'Tasa Basura',
      accessor: (item) => `$${Number(item.trashRateValue).toFixed(2)}`,
      sortKey: 'trashRateValue',
      sortable: true,
      isNumeric: true,
      id: 'trashRateValue'
    },
    {
      header: 'Desc. TB',
      accessor: (item) => `$${Number(item.discountTrashRateValue).toFixed(2)}`,
      sortKey: 'discountTrashRateValue',
      sortable: true,
      isNumeric: true,
      id: 'discountTrashRateValue'
    },
    {
      header: 'Total',
      accessor: (item) => `$${Number(item.totalValue).toFixed(2)}`,
      sortKey: 'totalValue',
      sortable: true,
      isNumeric: true,
      id: 'totalValue'
    }
  );

  const totalRecords = data.reduce(
    (sum, item) => sum + Number(item.recordCount),
    0
  );
  const totalTitleValue = data.reduce(
    (sum, item) => sum + Number(item.titleValue),
    0
  );
  const totalThirdPartyValue = data.reduce(
    (sum, item) => sum + Number(item.thirdPartyValue),
    0
  );
  const totalSurchargeValue = data.reduce(
    (sum, item) => sum + Number(item.surchargeValue),
    0
  );
  const totalTrashRateValue = data.reduce(
    (sum, item) => sum + Number(item.trashRateValue),
    0
  );
  const totalDiscountTrashRateValue = data.reduce(
    (sum, item) => sum + Number(item.discountTrashRateValue),
    0
  );
  const totalAmount = data.reduce(
    (sum, item) => sum + Number(item.totalValue),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL Reg',
      value: totalRecords,
      highlight: false,
      columnId: 'recordCount'
    },
    { label: 'TOTAL Título', value: totalTitleValue, columnId: 'titleValue' },
    {
      label: 'TOTAL Terc.',
      value: totalThirdPartyValue,
      highlight: false,
      columnId: 'thirdPartyValue'
    },
    {
      label: 'TOTAL Rec.',
      value: totalSurchargeValue,
      highlight: false,
      columnId: 'surchargeValue'
    },
    {
      label: 'TOTAL Basura',
      value: totalTrashRateValue,
      highlight: false,
      columnId: 'trashRateValue'
    },
    {
      label: 'TOTAL Desc. TB',
      value: totalDiscountTrashRateValue,
      highlight: false,
      columnId: 'discountTrashRateValue'
    },
    {
      label: 'TOTAL',
      value: totalAmount,
      highlight: true,
      columnId: 'totalValue'
    }
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<GroupedReportItem>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: `REPORTE AGRUPADO DE RECOLECCIÓN (${type.toUpperCase()})`,
      reportDescription: 'Detalle agrupado de recolección',
      labelsHorizontal: {
        Fecha: `${startDate || '-'} - ${endDate || '-'}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          Fecha: item.date || '-',
          'Año / Mes': `${item.year || ''} - ${item.month || ''}`,
          Año: item.year || '-',
          Recaudador: item.collector,
          'Cód. Título': item.titleCode,
          Método: item.paymentMethod || '-',
          Estado: item.status || '-',
          '# Registros': String(item.recordCount),
          'Val. Título': formatCurrency(item.titleValue),
          'Val. Terceros': formatCurrency(item.thirdPartyValue),
          Recargo: formatCurrency(item.surchargeValue),
          'Tasa Basura': formatCurrency(item.trashRateValue),
          'Desc. TB': formatCurrency(item.discountTrashRateValue),
          Total: formatCurrency(item.totalValue)
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
            description="No hay registros agrupados que coincidan con los filtros seleccionados."
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
