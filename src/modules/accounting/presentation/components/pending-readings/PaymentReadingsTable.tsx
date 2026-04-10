import React, { useState } from 'react';
import '../../styles/payments/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { PaymentReading } from '../../../domain/models/PaymentReading';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { PaymentReadingDetailModal } from './PaymentReadingDetailModal/PaymentReadingDetailModal';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface PaymentReadingsTableProps {
  data: PaymentReading[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  startDate?: string;
  endDate?: string;
}

export const PaymentReadingsTable: React.FC<PaymentReadingsTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  startDate,
  endDate
}) => {
  const { t } = useTranslation();
  const [selectedReading, setSelectedReading] = useState<PaymentReading | null>(
    null
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const columns: Column<PaymentReading>[] = [
    {
      header: t('accounting.columns.titleCode'),
      accessor: 'titleCode',
      sortable: true
    },
    {
      header: 'Cliente',
      accessor: (item: PaymentReading) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            name={
              item.name && item.lastName
                ? `${item.name} ${item.lastName}`
                : item.paymentUser
            }
            size="sm"
          />
          <div>
            <div style={{ fontWeight: 300 }}>
              {item.name + ' ' + item.lastName}
            </div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('accounting.columns.cadastralKey'),
      accessor: 'cadastralKey',
      sortable: true
    },
    {
      header: t('accounting.columns.surcharge'),
      accessor: (item) => `$${Number(item.surcharge).toFixed(2)}`,
      sortKey: 'surcharge',
      sortable: true,
      isNumeric: true,
      id: 'surcharge'
    },
    {
      header: t('accounting.columns.epaaValue'),
      accessor: (item) => `$${Number(item.epaaValue).toFixed(2)}`,
      sortKey: 'epaaValue',
      sortable: true,
      isNumeric: true,
      id: 'epaaValue'
    },
    {
      header: t('accounting.columns.thirdPartyValue'),
      accessor: (item) => `$${Number(item.thirdPartyValue).toFixed(2)}`,
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true,
      id: 'thirdPartyValue'
    },
    {
      header: t('accounting.columns.trashRateDt'),
      accessor: (item) => `$${Number(item.trashRate).toFixed(2)}`,
      sortKey: 'trashRate',
      sortable: true,
      isNumeric: true,
      id: 'trashRate'
    },
    {
      header: t('accounting.columns.trashRateVal'),
      accessor: (item) => `$${Number(item.value).toFixed(2)}`,
      sortKey: 'value',
      sortable: true,
      isNumeric: true,
      id: 'value'
    },
    {
      header: t('accounting.columns.total'),
      accessor: (item) => `$${Number(item.total).toFixed(2)}`,
      sortKey: 'total',
      sortable: true,
      isNumeric: true,
      id: 'total'
    },
    {
      header: t('accounting.columns.user'),
      accessor: 'paymentUser',
      sortable: true
    },
    {
      header: t('accounting.columns.paymentMethod'),
      accessor: 'paymentMethod',
      sortable: true
    },
    // Options
    {
      header: 'Opciones',
      accessor: (item) => {
        return (
          <div>
            <Button
              onClick={() => setSelectedReading(item)}
              variant="ghost"
              size="sm"
              color="sky"
              title={t('common.details', 'Detalles')}
              circle
            >
              <Eye size={16} />
            </Button>
          </div>
        );
      }
    }
  ];

  const epaaTotal = data.reduce((sum, item) => sum + Number(item.epaaValue), 0);
  const thirdPartyTotal = data.reduce(
    (sum, item) => sum + Number(item.thirdPartyValue),
    0
  );
  const trashRateTotalA = data.reduce(
    (sum, item) => sum + Number(item.trashRate),
    0
  );
  const trashRateTotalB = data.reduce(
    (sum, item) => sum + Number(item.value),
    0
  );
  const totalAmount = data.reduce((sum, item) => sum + Number(item.total), 0);
  const surchargeTotal = data.reduce(
    (sum, item) => sum + Number(item.surcharge),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL ' + t('accounting.columns.epaaValue'),
      value: epaaTotal,
      columnId: 'epaaValue'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.surcharge'),
      value: surchargeTotal,
      columnId: 'surcharge'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateDt'),
      value: trashRateTotalA,
      columnId: 'trashRate'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateVal'),
      value: trashRateTotalB,
      columnId: 'value'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.thirdPartyValue'),
      value: thirdPartyTotal,
      columnId: 'thirdPartyValue'
    },
    {
      label: 'TOTAL',
      value: totalAmount,
      highlight: true,
      columnId: 'total'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<PaymentReading>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE PAGOS DE LECTURAS',
      reportDescription:
        'Detalle de pagos realizados por conceptos de lecturas de agua y otros rubros relacionados.',
      labelsHorizontal: {
        'Rango de Fecha': `${startDate || '-'} - ${endDate || '-'}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          [t('accounting.columns.titleCode')]: item.titleCode,
          Cliente: `${item.name} ${item.lastName} (${item.cardId})`,
          [t('accounting.columns.cadastralKey')]: item.cadastralKey,
          [t('accounting.columns.surcharge')]: formatCurrency(item.surcharge),
          [t('accounting.columns.epaaValue')]: formatCurrency(item.epaaValue),
          [t('accounting.columns.thirdPartyValue')]: formatCurrency(
            item.thirdPartyValue
          ),
          [t('accounting.columns.trashRateDt')]: formatCurrency(item.trashRate),
          [t('accounting.columns.trashRateVal')]: formatCurrency(item.value),
          [t('accounting.columns.total')]: formatCurrency(item.total),
          [t('accounting.columns.user')]: item.paymentUser,
          [t('accounting.columns.paymentMethod')]: item.paymentMethod || '-'
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
        totalRows={totalRows}
        onExportPdf={() => setShowPdfPreview(true)}
        width="100"
        emptyState={
          <EmptyState
            message={t(
              'accounting.empty.noReadingsTitle',
              'No se encontraron cobros de lecturas'
            )}
            description={t(
              'accounting.empty.noReadingsDesc',
              'Modifique el rango de fechas o los filtros para visualizar resultados.'
            )}
          />
        }
      />

      <PaymentReadingDetailModal
        isOpen={selectedReading !== null}
        onClose={() => setSelectedReading(null)}
        reading={selectedReading}
      />
      {PdfPreviewModal}
    </div>
  );
};
