import React, { useState } from 'react';
import '../../styles/payments/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { Payment } from '../../../domain/models/Payment';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { PaymentDetailModal } from './PaymentDetailModal/PaymentDetailModal';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface PaymentsTableProps {
  data: Payment[];
  isLoading: boolean;
  onSort?: (key: keyof Payment | string, direction: 'asc' | 'desc') => void;
  sortConfig?: {
    key: keyof Payment | string;
    direction: 'asc' | 'desc';
  } | null;
  startDate?: string;
  endDate?: string;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  startDate,
  endDate
}) => {
  const { t } = useTranslation();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const columns: Column<Payment>[] = [
    {
      header: t('accounting.columns.titleCode'),
      accessor: 'titleCode',
      sortable: true
    },
    {
      header: 'Cliente',
      accessor: (item: Payment) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={item.name} size="sm" />
          <div>
            <div style={{ fontWeight: 300 }}>{item.name}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'C.C',
      accessor: 'cadastralKey',
      sortable: true
    },
    {
      header: t('accounting.columns.epaaValue'),
      accessor: (item) => `$${Number(item.titleValue).toFixed(2)}`,
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true,
      id: 'epaaValue'
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
      header: 'Usuario',
      accessor: 'paymentUser',
      sortable: true
    },
    {
      header: t('accounting.columns.paymentMethod'),
      accessor: 'paymentMethod',
      sortable: true
    },
    {
      header: 'Opciones',
      accessor: (item) => {
        return (
          <div className="payments-table-options">
            <Button
              onClick={() => setSelectedPayment(item)}
              variant="ghost"
              size="sm"
              color="sky"
              circle
            >
              <Eye size={16} />
            </Button>
          </div>
        );
      }
    }
  ];

  const totalTitleValue = data.reduce(
    (sum, item) => sum + Number(item.titleValue),
    0
  );
  const totalAmount = data.reduce((sum, item) => sum + Number(item.total), 0);
  const totalTrashRate = data.reduce(
    (sum, item) => sum + Number(item.trashRate),
    0
  );
  const totalValue = data.reduce(
    (sum, item) => sum + (item.value ? Number(item.value) : 0),
    0
  );
  const totalSurcharge = data.reduce(
    (sum, item) => sum + Number(item.surcharge),
    0
  );
  const totalThirdPartyValue = data.reduce(
    (sum, item) => sum + Number(item.thirdPartyValue),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL ' + t('accounting.columns.epaaValue'),
      value: totalTitleValue,
      columnId: 'epaaValue'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.surcharge'),
      value: totalSurcharge,
      highlight: false,
      columnId: 'surcharge'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateDt'),
      value: totalTrashRate,
      highlight: false,
      columnId: 'trashRate'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateVal'),
      value: totalValue,
      highlight: false,
      columnId: 'value'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.thirdPartyValue'),
      value: totalThirdPartyValue,
      highlight: false,
      columnId: 'thirdPartyValue'
    },
    {
      label: 'TOTAL',
      value: totalAmount,
      highlight: true,
      columnId: 'total'
    }
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport<Payment>({
    data,
    availableColumns: columns.map((c) => ({
      id:
        c.id ||
        (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
      label: c.header as string,
      isDefault: true
    })),
    reportTitle: t('accounting.payments.title', 'REPORTE DE PAGOS'),
    reportDescription: t(
      'accounting.payments.description',
      'Detalle de pagos realizados por fecha y orden'
    ),
    labelsHorizontal: {
      Fecha: `${startDate || '-'} - ${endDate || '-'}`,
      'Fecha de Exportación':
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows,
    mapRowData: (item, selectedCols) => {
      const rowData: Record<string, string> = {
        [t('accounting.columns.titleCode')]: item.titleCode,
        Cliente: `${item.name} (${item.cardId})`,
        'C.C': item.cadastralKey,
        [t('accounting.columns.epaaValue')]: formatCurrency(item.titleValue),
        [t('accounting.columns.surcharge')]: formatCurrency(item.surcharge),
        [t('accounting.columns.thirdPartyValue')]: formatCurrency(
          item.thirdPartyValue
        ),
        [t('accounting.columns.trashRateDt')]: formatCurrency(item.trashRate),
        [t('accounting.columns.trashRateVal')]: formatCurrency(item.value || 0),
        [t('accounting.columns.total')]: formatCurrency(item.total),
        Usuario: item.paymentUser,
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
        onExportPdf={() => setShowPdfPreview(true)}
        totalRows={totalRows}
        width="100"
        emptyState={
          <EmptyState
            message={t(
              'accounting.empty.noPaymentsTitle',
              'No se encontraron pagos'
            )}
            description={t(
              'accounting.empty.noPaymentsDesc',
              'No hay registros de pagos que coincidan con los filtros seleccionados.'
            )}
            variant="info"
          />
        }
      />

      <PaymentDetailModal
        isOpen={selectedPayment !== null}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
      {PdfPreviewModal}
    </div>
  );
};
