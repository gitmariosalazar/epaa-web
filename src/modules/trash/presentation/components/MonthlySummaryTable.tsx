import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { MonthlySummaryRow } from '../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface MonthlySummaryTableProps {
  data: MonthlySummaryRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const MonthlySummaryTable: React.FC<MonthlySummaryTableProps> = ({
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
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.monthlySummary.totalRateIncome',
        'Tasa Ingreso'
      ),
      accessor: (r) => formatCurrency(r.totalRateIncome),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.monthlySummary.totalRateValorTable',
        'Tasa Valor'
      ),
      accessor: (r) => formatCurrency(r.totalRateValorTable),
      isNumeric: true
    },
    {
      header: t('trashRateReport.monthlySummary.totalDiscounts', 'Descuentos'),
      accessor: (r) => formatCurrency(r.totalDiscounts),
      isNumeric: true
    },
    {
      header: t('trashRateReport.monthlySummary.totalTrashNet', 'Neto Basura'),
      accessor: (r) => formatCurrency(r.totalTrashNet),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.monthlySummary.missingValorRecords',
        'Sin Valor'
      ),
      accessor: 'missingValorRecords',
      isNumeric: true
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
      highlight: false
    },
    {
      label: 'TOTAL Tabla Ingreso',
      value: totalRateIncome,
      highlight: false
    },
    {
      label: 'TOTAL Tabla Valor',
      value: totalRateValor,
      highlight: false
    },
    {
      label: 'TOTAL DESCUENTOS',
      value: totalDiscounts,
      highlight: false
    },
    {
      label: 'TOTAL NETO',
      value: totalNet,
      highlight: false
    },
    {
      label: 'TOTAL SIN VALOR',
      value: totalMissing,
      highlight: false
    },
    {
      label: 'TOTAL',
      value: totalNet,
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
