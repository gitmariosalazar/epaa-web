import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { CreditNoteRow } from '../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

import { ConverDate } from '@/shared/presentation/utils/datetime/ConverDate';

interface CreditNotesTableProps {
  data: CreditNoteRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const CreditNotesTable: React.FC<CreditNotesTableProps> = ({
  data,
  isLoading,
  onSort,
  onExportPdf,
  sortConfig
}) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number | null | undefined) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value ?? 0);

  const columns: Column<CreditNoteRow>[] = [
    {
      header: t('trashRateReport.creditNotes.cadastralKey', 'Clave Catastral'),
      accessor: 'cadastralKey'
    },
    {
      header: t('trashRateReport.creditNotes.cardId', 'Cédula'),
      accessor: 'cardId'
    },
    {
      header: t('trashRateReport.creditNotes.customerName', 'Cliente'),
      accessor: 'customerName'
    },
    {
      header: t('trashRateReport.creditNotes.creditNoteCount', 'N° NC'),
      accessor: 'creditNoteCount',
      isNumeric: true
    },
    {
      header: t('trashRateReport.creditNotes.totalBalanceInFavor', 'Saldo NC'),
      accessor: (r) => formatCurrency(r.totalBalanceInFavor),
      isNumeric: true
    },
    {
      header: t('trashRateReport.creditNotes.creditCoverage', 'Cobertura'),
      accessor: 'creditCoverage',
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.creditNotes.pendingTrashDebt',
        'Deuda Pendiente'
      ),
      accessor: (r) => formatCurrency(r.pendingTrashDebt),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.creditNotes.remainingDebtAfterNc',
        'Deuda Restante'
      ),
      accessor: (r) => formatCurrency(r.remainingDebtAfterNc),
      isNumeric: true
    },
    {
      header: t('trashRateReport.creditNotes.lastBillIssued', 'Última Factura'),
      accessor: (r) => ConverDate(r.lastBillIssued)
    },
    {
      header: t('trashRateReport.creditNotes.lastPaymentDate', 'Último Pago'),
      accessor: (r) => ConverDate(r.lastPaymentDate)
    }
  ];

  // Total Saldo NC
  const totalBalanceInFavor = data.reduce(
    (sum, row) => sum + (row.totalBalanceInFavor ?? 0),
    0
  );
  // Total Deuda Pendiente
  const totalPendingTrashDebt = data.reduce(
    (sum, row) => sum + (row.pendingTrashDebt ?? 0),
    0
  );
  // Total Deuda Restante
  const totalRemainingDebtAfterNc = data.reduce(
    (sum, row) => sum + (row.remainingDebtAfterNc ?? 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL SALDO NC',
      value: totalBalanceInFavor,
      highlight: false
    },
    {
      label: 'TOTAL DEUDA PENDIENTE',
      value: totalPendingTrashDebt,
      highlight: false
    },
    {
      label: 'TOTAL DEUDA RESTANTE',
      value: totalRemainingDebtAfterNc,
      highlight: false
    },
    {
      label: 'TOTAL',
      value: totalRemainingDebtAfterNc,
      highlight: true
    }
  ];

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
        onExportPdf={onExportPdf}
        sortConfig={sortConfig}
        fullHeight
        emptyState={<EmptyState message="Data not found!" />}
        totalRows={totalRows}
      />
    </div>
  );
};
