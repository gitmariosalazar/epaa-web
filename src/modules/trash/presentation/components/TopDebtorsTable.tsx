import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { TopDebtorRow } from '../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface TopDebtorsTableProps {
  data: TopDebtorRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const TopDebtorsTable: React.FC<TopDebtorsTableProps> = ({
  data,
  isLoading,
  onSort,
  onExportPdf,
  sortConfig,
  error
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
      header: t('trashRateReport.topDebtors.cardId', 'Cédula'),
      accessor: 'cardId'
    },
    {
      header: t('trashRateReport.topDebtors.customerName', 'Cliente'),
      accessor: 'customerName'
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
        onExportPdf={onExportPdf}
        sortConfig={sortConfig}
        fullHeight
        emptyState={<EmptyState message="Data not found!" />}
        totalRows={totalRows}
      />
    </div>
  );
};
