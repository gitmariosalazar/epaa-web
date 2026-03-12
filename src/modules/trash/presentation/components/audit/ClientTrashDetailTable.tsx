import React from 'react';
import '../../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { ClientTrashDetailRow } from '../../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';

import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';

interface ClientTrashDetailTableProps {
  data: ClientTrashDetailRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const ClientTrashDetailTable: React.FC<ClientTrashDetailTableProps> = ({
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
      header: t('trashRateReport.clientDetail.customerName', 'Cliente'),
      accessor: (item: ClientTrashDetailRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={item.customerName} size="sm" />
          <div>
            <div style={{ fontWeight: 300 }}>{item.customerName}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
            </div>
          </div>
        </div>
      )
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
      accessor: (r) => fmt(r.officialRate),
      id: 'officialRate'
    },
    {
      header: t('trashRateReport.clientDetail.discountApplied', 'Descuento'),
      accessor: (r) => fmt(r.discountApplied),
      id: 'discountApplied'
    },
    {
      header: t('trashRateReport.clientDetail.netRateToPay', 'Neto a Pagar'),
      accessor: (r) => fmt(r.netRateToPay),
      id: 'netRateToPay'
    },
    {
      header: t(
        'trashRateReport.clientDetail.effectiveTrashToPay',
        'Efec. a Pagar'
      ),
      accessor: (r) => fmt(r.effectiveTrashToPay),
      id: 'effectiveTrashToPay'
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
      value: fmt(totalOfficialRate),
      columnId: 'officialRate'
    },
    {
      label: 'TOTAL DESCUENTO',
      value: fmt(totalDiscountApplied),
      highlight: false,
      columnId: 'discountApplied'
    },
    {
      label: 'TOTAL NETO A PAGAR',
      value: fmt(totalTrashRate),
      highlight: false,
      columnId: 'netRateToPay'
    },
    {
      label: 'TOTAL EFECTIVO A PAGAR',
      value: fmt(totalValue),
      highlight: false,
      columnId: 'effectiveTrashToPay'
    },
    {
      label: 'TOTAL',
      value: fmt(totalValue),
      highlight: true
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<ClientTrashDetailRow>({
      data,
      availableColumns: columns.map((c) => ({
        id: c.id || (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'DETALLE DE COBROS DE BASURA POR CLIENTE',
      reportDescription:
        'Desglose por cliente de tasas oficiales, descuentos y valores netos a pagar.',
      labelsHorizontal: {
        'Rango de Fecha': `${startDate} - ${endDate}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          'Cód. Ingreso': String(item.incomeCode || '-'),
          'Clave Catastral': item.cadastralKey || '-',
          Cliente: item.customerName || '-',
          Emisión: item.issueDate || '-',
          Vencimiento: item.dueDate || '-',
          'Fecha Pago': item.paymentDate || '-',
          'Tasa Oficial': fmt(item.officialRate),
          Descuento: fmt(item.discountApplied),
          'Neto a Pagar': fmt(item.netRateToPay),
          'Efec. a Pagar': fmt(item.effectiveTrashToPay),
          Diagnóstico: item.diagnostic || '-'
        };

        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

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
