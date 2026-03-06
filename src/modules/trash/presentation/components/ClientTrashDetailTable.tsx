import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { ClientTrashDetailRow } from '../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface ClientTrashDetailTableProps {
  data: ClientTrashDetailRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const ClientTrashDetailTable: React.FC<ClientTrashDetailTableProps> = ({
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

  const columns: Column<ClientTrashDetailRow>[] = [
    {
      header: t('trashRateReport.clientDetail.incomeCode', 'Cód. Ingreso'),
      accessor: 'incomeCode'
    },
    {
      header: t('trashRateReport.clientDetail.cadastralKey', 'Clave Catastral'),
      accessor: 'cadastralKey'
    },
    {
      header: t('trashRateReport.clientDetail.cardId', 'Cédula'),
      accessor: 'cardId'
    },
    {
      header: t('trashRateReport.clientDetail.customerName', 'Cliente'),
      accessor: 'customerName'
    },
    {
      header: t('trashRateReport.clientDetail.issueDate', 'Emisión'),
      accessor: 'issueDate'
    },
    {
      header: t('trashRateReport.clientDetail.dueDate', 'Vencimiento'),
      accessor: 'dueDate'
    },
    {
      header: t('trashRateReport.clientDetail.paymentDate', 'Fecha Pago'),
      accessor: (r) => r.paymentDate ?? '-'
    },
    {
      header: t('trashRateReport.clientDetail.officialRate', 'Tasa Oficial'),
      accessor: (r) => fmt(r.officialRate)
    },
    {
      header: t('trashRateReport.clientDetail.discountApplied', 'Descuento'),
      accessor: (r) => fmt(r.discountApplied)
    },
    {
      header: t('trashRateReport.clientDetail.netRateToPay', 'Neto a Pagar'),
      accessor: (r) => fmt(r.netRateToPay)
    },
    {
      header: t(
        'trashRateReport.clientDetail.effectiveTrashToPay',
        'Efec. a Pagar'
      ),
      accessor: (r) => fmt(r.effectiveTrashToPay)
    },
    {
      header: t('trashRateReport.clientDetail.diagnostic', 'Diagnóstico'),
      accessor: 'diagnostic'
    }
  ];

  // Total Tasa de Basura
  const totalOfficialRate = data.reduce(
    (sum, row) => sum + (row.officialRate ?? 0),
    0
  );
  // Total Descuento
  const totalDiscountApplied = data.reduce(
    (sum, row) => sum + (row.discountApplied ?? 0),
    0
  );
  // Total Neto a Pagar
  const totalTrashRate = data.reduce(
    (sum, row) => sum + (row.netRateToPay ?? 0),
    0
  );
  // Total Efectivo a Pagar
  const totalValue = data.reduce(
    (sum, row) => sum + (row.effectiveTrashToPay ?? 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL TB',
      value: totalOfficialRate
    },
    {
      label: 'TOTAL DESCUENTO',
      value: totalDiscountApplied,
      highlight: false
    },
    {
      label: 'TOTAL NETO A PAGAR',
      value: totalTrashRate,
      highlight: false
    },
    {
      label: 'TOTAL EFECTIVO A PAGAR',
      value: totalValue,
      highlight: false
    },
    {
      label: 'TOTAL',
      value: totalValue,
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
