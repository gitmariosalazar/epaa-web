import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { MissingValorRow } from '../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface MissingValorBillsTableProps {
  data: MissingValorRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const MissingValorBillsTable: React.FC<MissingValorBillsTableProps> = ({
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

  const columns: Column<MissingValorRow>[] = [
    {
      header: t('trashRateReport.missingValor.incomeCode', 'Cód. Ingreso'),
      accessor: 'incomeCode'
    },
    {
      header: t('trashRateReport.missingValor.cadastralKey', 'Clave Catastral'),
      accessor: 'cadastralKey'
    },
    {
      header: t('trashRateReport.missingValor.cardId', 'Cédula'),
      accessor: 'cardId'
    },
    {
      header: t('trashRateReport.missingValor.customerName', 'Cliente'),
      accessor: 'customerName'
    },
    {
      header: t('trashRateReport.missingValor.issueDate', 'Fecha Emisión'),
      accessor: 'issueDate'
    },
    {
      header: t('trashRateReport.missingValor.paymentDate', 'Fecha Pago'),
      accessor: (r) => r.paymentDate ?? '-'
    },
    {
      header: t('trashRateReport.missingValor.trashRate', 'Tasa Basura'),
      accessor: (r) => fmt(r.trashRate)
    },
    {
      header: t('trashRateReport.missingValor.paymentStatus', 'Estado'),
      accessor: 'paymentStatus'
    },
    {
      header: t('trashRateReport.missingValor.diagnostic', 'Diagnóstico'),
      accessor: 'diagnostic'
    }
  ];

  // Total Tasa de Basura
  const totalTrashRate = data.reduce(
    (sum, row) => sum + (row.trashRate ?? 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL TB',
      value: totalTrashRate,
      highlight: false
    },
    {
      label: 'TOTAL',
      value: totalTrashRate,
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
