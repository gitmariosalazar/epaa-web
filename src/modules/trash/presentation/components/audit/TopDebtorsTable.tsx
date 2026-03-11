import React from 'react';
import '../../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { TopDebtorRow } from '../../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { maskString } from '@/shared/presentation/utils/maskString';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';

interface TopDebtorsTableProps {
  data: TopDebtorRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const TopDebtorsTable: React.FC<TopDebtorsTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  error,
  startDate,
  endDate
}) => {
  const { t } = useTranslation();

  const fmt = (n: number | null | undefined) =>
    n != null ? `$${Number(n).toFixed(2)}` : '-';

  const columns: Column<TopDebtorRow>[] = [
    {
      header: t('trashRateReport.topDebtors.cadastralKey', 'Clave Catastral'),
      accessor: 'cadastralKey'
    },
    {
      header: t('trashRateReport.topDebtors.customerName', 'Cliente'),
      accessor: (item: TopDebtorRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={item.customerName} size="sm" />
          <div>
            <div style={{ fontWeight: 300 }}>
              {maskString(item.customerName)}
            </div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {maskString(item.cardId)}
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('trashRateReport.topDebtors.unpaidMonths', 'Meses Impago'),
      accessor: 'unpaidMonths'
    },
    {
      header: t('trashRateReport.topDebtors.totalTrashDebt', 'Deuda Total'),
      accessor: (r) => fmt(r.totalTrashDebt)
    },
    {
      header: t(
        'trashRateReport.topDebtors.oldestDebtDate',
        'Deuda más Antigua'
      ),
      accessor: 'oldestDebtDate'
    },
    {
      header: t(
        'trashRateReport.topDebtors.latestPendingBill',
        'Última Pendiente'
      ),
      accessor: 'latestPendingBill'
    }
  ];

  // Total Deuda Total
  const totalTrashDebt = data.reduce(
    (sum, row) => sum + (row.totalTrashDebt ?? 0),
    0
  );

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<TopDebtorRow>({
      data,
      availableColumns: columns.map((c) => ({
        id: typeof c.accessor === 'string' ? c.accessor : (c.header as string),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE PRINCIPALES DEUDORES DE TASA DE BASURA',
      reportDescription:
        'Ranking de clientes con mayor deuda acumulada por tasa de recolección de basura.',
      labelsHorizontal: {
        'Rango de Fecha de Ingreso': `${startDate} - ${endDate}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          'Clave Catastral': item.cadastralKey || '-',
          Cliente: item.customerName || '-',
          'Meses Impago': String(item.unpaidMonths || 0),
          'Deuda Total': fmt(item.totalTrashDebt),
          'Deuda más Antigua': item.oldestDebtDate || '-',
          'Última Pendiente': item.latestPendingBill || '-'
        };

        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

  const totalRows = [
    {
      label: 'TOTAL DEUDA',
      value: totalTrashDebt,
      highlight: false
    },
    {
      label: 'TOTAL',
      value: totalTrashDebt,
      highlight: true
    }
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
      />
      {PdfPreviewModal}
    </div>
  );
};
