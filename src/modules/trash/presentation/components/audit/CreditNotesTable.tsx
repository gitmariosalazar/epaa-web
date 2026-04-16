import React from 'react';
import '../../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { CreditNoteRow } from '../../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';

import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface CreditNotesTableProps {
  data: CreditNoteRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const CreditNotesTable: React.FC<CreditNotesTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  startDate,
  endDate
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
      header: t('trashRateReport.creditNotes.customerName', 'Cliente'),
      accessor: (item: CreditNoteRow) => (
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
      header: t('trashRateReport.creditNotes.creditNoteCount', 'N° NC'),
      accessor: 'creditNoteCount',
      isNumeric: true
    },
    {
      header: t('trashRateReport.creditNotes.totalBalanceInFavor', 'Saldo NC'),
      accessor: (r) => formatCurrency(r.totalBalanceInFavor),
      isNumeric: true,
      id: 'totalBalanceInFavor'
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
      isNumeric: true,
      id: 'pendingTrashDebt'
    },
    {
      header: t(
        'trashRateReport.creditNotes.remainingDebtAfterNc',
        'Deuda Restante'
      ),
      accessor: (r) => formatCurrency(r.remainingDebtAfterNc),
      isNumeric: true,
      id: 'remainingDebtAfterNc'
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
      value: formatCurrency(totalBalanceInFavor),
      highlight: false,
      columnId: 'totalBalanceInFavor'
    },
    {
      label: 'TOTAL DEUDA PENDIENTE',
      value: formatCurrency(totalPendingTrashDebt),
      highlight: false,
      columnId: 'pendingTrashDebt'
    },
    {
      label: 'TOTAL DEUDA RESTANTE',
      value: formatCurrency(totalRemainingDebtAfterNc),
      highlight: false,
      columnId: 'remainingDebtAfterNc'
    },
    {
      label: 'TOTAL',
      value: formatCurrency(totalRemainingDebtAfterNc),
      highlight: true,
      columnId: 'remainingDebtAfterNc'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<CreditNoteRow>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE NOTAS DE CRÉDITO DE TASA DE BASURA',
      reportDescription:
        'Registro de notas de crédito aplicadas y saldos a favor de clientes.',
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
          'Clave Catastral': item.cadastralKey || '-',
          Cliente: item.customerName || '-',
          'N° NC': String(item.creditNoteCount || 0),
          'Saldo NC': formatCurrency(item.totalBalanceInFavor),
          Cobertura: String(item.creditCoverage || 0),
          'Deuda Pendiente': formatCurrency(item.pendingTrashDebt),
          'Deuda Restante': formatCurrency(item.remainingDebtAfterNc),
          'Última Factura': ConverDate(item.lastBillIssued),
          'Último Pago': ConverDate(item.lastPaymentDate)
        };

        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

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
        onExportPdf={() => setShowPdfPreview(true)}
        sortConfig={sortConfig}
        emptyState={
          <EmptyState
            message={t('common.noResults', 'No se encontraron resultados')}
            icon={IoInformationCircleOutline}
            description={t(
              'common.noResultsDescription',
              'Intenta ajustar los filtros de búsqueda para ver los resultados.'
            )}
            minHeight="300px"
            variant="info"
          />
        }
        totalRows={totalRows}
      />
      {PdfPreviewModal}
    </div>
  );
};
