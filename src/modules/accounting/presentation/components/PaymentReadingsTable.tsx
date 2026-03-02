import React, { useState } from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { PaymentReading } from '../../domain/models/PaymentReading';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { PaymentReadingDetailModal } from './PaymentReadingDetailModal/PaymentReadingDetailModal';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { Button } from '@/shared/presentation/components/Button/Button';

interface PaymentReadingsTableProps {
  data: PaymentReading[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
}

export const PaymentReadingsTable: React.FC<PaymentReadingsTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig
}) => {
  const { t } = useTranslation();
  const [selectedReading, setSelectedReading] = useState<PaymentReading | null>(
    null
  );

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
      isNumeric: true
    },
    {
      header: t('accounting.columns.epaaValue'),
      accessor: (item) => `$${Number(item.epaaValue).toFixed(2)}`,
      sortKey: 'epaaValue',
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
  /*
  const summaryRows = [
    {
      label: t('accounting.readings.epaaValue', 'Epaa Value'),
      value: epaaTotal
    },
    {
      label: t('accounting.readings.thirdPartyValue', 'Third Party Value'),
      value: thirdPartyTotal
    },
    { label: t('common.total', 'Total'), value: totalAmount, highlight: true }
  ];
  */

  const totalRows = [
    {
      label: 'TOTAL ' + t('accounting.columns.epaaValue'),
      value: epaaTotal
    },
    {
      label: 'TOTAL ' + t('accounting.columns.surcharge'),
      value: surchargeTotal
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateDt'),
      value: trashRateTotalA
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateVal'),
      value: trashRateTotalB
    },
    {
      label: 'TOTAL ' + t('accounting.columns.thirdPartyValue'),
      value: thirdPartyTotal
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
              {t(
                'common.noData',
                'No reading payrolls found matching the criteria'
              )}
            </p>
          </div>
        }
      />

      <PaymentReadingDetailModal
        isOpen={selectedReading !== null}
        onClose={() => setSelectedReading(null)}
        reading={selectedReading}
      />
    </div>
  );
};
