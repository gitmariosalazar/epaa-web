import React from 'react';
import '../../styles/payments/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { DailyPaymentMethodReport } from '../../../domain/models/EntryData';
import { useTranslation } from 'react-i18next';

interface DailyPaymentMethodReportTableProps {
  data: DailyPaymentMethodReport[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onExportPdf?: () => void;
}

const fmt = (n: number) => `$${Number(n).toFixed(2)}`;

export const DailyPaymentMethodReportTable: React.FC<
  DailyPaymentMethodReportTableProps
> = ({ data, isLoading, onSort, sortConfig, onExportPdf }) => {
  const { t } = useTranslation();

  const columns: Column<DailyPaymentMethodReport>[] = [
    {
      header: t('accounting.columns.date'),
      accessor: 'date',
      sortable: true
    },
    {
      header: t('accounting.columns.paymentMethod'),
      accessor: 'paymentMethod',
      sortable: true
    },
    {
      header: t('accounting.columns.status'),
      accessor: 'status',
      sortable: true
    },
    {
      header: t('accounting.columns.epaaValue'),
      accessor: (item) => fmt(item.titleValue),
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true,
      id: 'titleValue'
    },
    {
      header: t('accounting.columns.thirdPartyValue'),
      accessor: (item) => fmt(item.thirdPartyValue),
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true,
      id: 'thirdPartyValue'
    },
    {
      header: t('accounting.columns.surcharge'),
      accessor: (item) => fmt(item.surchargeValue),
      sortKey: 'surchargeValue',
      sortable: true,
      isNumeric: true,
      id: 'surchargeValue'
    },
    {
      header: t('accounting.columns.trashRateDt'),
      accessor: (item) => fmt(item.trashRateValue),
      sortKey: 'trashRateValue',
      sortable: true,
      isNumeric: true,
      id: 'trashRateValue'
    },
    {
      header: t('accounting.columns.trashRateVal'),
      accessor: (item) => fmt(item.detailValue),
      sortKey: 'detailValue',
      sortable: true,
      isNumeric: true,
      id: 'detailValue'
    },
    {
      header: t('Desc. TR D.I.'),
      accessor: (item) => fmt(item.discountTrashRateValue),
      sortKey: 'discountTrashRateValue',
      sortable: true,
      isNumeric: true,
      id: 'discountTrashRateValue'
    },
    {
      header: t('accounting.columns.records'),
      accessor: (item) => String(item.recordCount),
      sortKey: 'recordCount',
      sortable: true,
      isNumeric: true,
      id: 'recordCount'
    },
    {
      header: t('accounting.columns.total'),
      accessor: (item) => fmt(item.total),
      sortKey: 'total',
      sortable: true,
      isNumeric: true,
      id: 'total'
    }
  ];

  const totalRows = [
    {
      label: 'TOTAL ' + t('accounting.columns.epaaValue'),
      value: data.reduce((s, r) => s + Number(r.titleValue), 0),
      columnId: 'titleValue'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.thirdPartyValue'),
      value: data.reduce((s, r) => s + Number(r.thirdPartyValue), 0),
      columnId: 'thirdPartyValue'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.surcharge'),
      value: data.reduce((s, r) => s + Number(r.surchargeValue), 0),
      columnId: 'surchargeValue'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateDt'),
      value: data.reduce((s, r) => s + Number(r.trashRateValue), 0),
      columnId: 'trashRateValue'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.trashRateVal'),
      value: data.reduce((s, r) => s + Number(r.detailValue), 0),
      columnId: 'detailValue'
    },
    {
      label: 'TOTAL ' + t('Desc. TR D.I.'),
      value: data.reduce((s, r) => s + Number(r.discountTrashRateValue), 0),
      columnId: 'discountTrashRateValue'
    },
    {
      label: 'TOTAL',
      value: data.reduce((s, r) => s + Number(r.total), 0),
      highlight: true,
      columnId: 'total'
    },
    {
      label: 'TOTAL ' + t('accounting.columns.records'),
      value: data.reduce((s, r) => s + Number(r.recordCount), 0),
      columnId: 'recordCount'
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
        totalRows={totalRows}
        width="100"
        onExportPdf={onExportPdf}
        emptyState={
          <div className="payments-table-empty">
            <p>{t('common.noData', 'No se encontraron registros')}</p>
          </div>
        }
      />
    </div>
  );
};
