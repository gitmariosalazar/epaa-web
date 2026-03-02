import React, { useState } from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { Payment } from '../../domain/models/Payment';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { PaymentDetailModal } from './PaymentDetailModal/PaymentDetailModal';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { Button } from '@/shared/presentation/components/Button/Button';

interface PaymentsTableProps {
  data: Payment[];
  isLoading: boolean;
  onSort?: (key: keyof Payment | string, direction: 'asc' | 'desc') => void;
  sortConfig?: {
    key: keyof Payment | string;
    direction: 'asc' | 'desc';
  } | null;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig
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
      isNumeric: true
    },
    {
      header: t('accounting.columns.surcharge'),
      accessor: (item) => `$${Number(item.surcharge).toFixed(2)}`,
      sortKey: 'surcharge',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('accounting.columns.thirdPartyValue'),
      accessor: (item) => `$${Number(item.thirdPartyValue).toFixed(2)}`,
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('accounting.columns.trashRateDt'),
      accessor: (item) => `$${Number(item.trashRate).toFixed(2)}`,
      sortKey: 'trashRate',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('accounting.columns.trashRateVal'),
      accessor: (item) => `$${Number(item.value).toFixed(2)}`,
      sortKey: 'value',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('accounting.columns.total'),
      accessor: (item) => `$${Number(item.total).toFixed(2)}`,
      sortKey: 'total',
      sortable: true,
      isNumeric: true
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
  //const tax = totalAmount - subtotal;
  const totalTrashRate = data.reduce(
    (sum, item) => sum + Number(item.trashRate),
    0
  );
  const totalValue = data.reduce((sum, item) => sum + Number(item.value), 0);
  const totalSurcharge = data.reduce(
    (sum, item) => sum + Number(item.surcharge),
    0
  );
  const totalThirdPartyValue = data.reduce(
    (sum, item) => sum + Number(item.thirdPartyValue),
    0
  );
  /*
  const summaryRows = [
    { label: 'Subtotal', value: subtotal },
    {
      label: 'IVA',
      value: tax,
      percentage: tax > 0 ? '15%' : '0%'
    },
    { label: 'Total', value: totalAmount, highlight: true }
  ];
  */

  const totalRows = [
    {
      label: 'TOTAL ' + t('accounting.columns.epaaValue'),
      value: totalTitleValue
    },
    {
      label: 'TOTAL ' + t('accounting.columns.surcharge'),
      value: totalSurcharge,
      highlight: false
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateDt'),
      value: totalTrashRate,
      highlight: false
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateVal'),
      value: totalValue,
      highlight: false
    },
    {
      label: 'TOTAL ' + t('accounting.columns.thirdPartyValue'),
      value: totalThirdPartyValue,
      highlight: false
    },
    {
      label: 'TOTAL',
      value: totalAmount,
      highlight: true
    }
  ];

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
        //summaryRows={summaryRows}
        totalRows={totalRows}
        width="100"
        fullHeight
        emptyState={
          <div className="payments-table-empty">
            <p>
              {t('common.noData', 'No records found matching the criteria')}
            </p>
          </div>
        }
      />

      <PaymentDetailModal
        isOpen={selectedPayment !== null}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </div>
  );
};
