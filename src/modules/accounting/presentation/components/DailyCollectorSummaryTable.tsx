import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { DailyCollectorSummary } from '../../domain/models/EntryData';
import { useTranslation } from 'react-i18next';

interface DailyCollectorSummaryTableProps {
  data: DailyCollectorSummary[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
}

const fmt = (n: number) => `$${Number(n).toFixed(2)}`;

export const DailyCollectorSummaryTable: React.FC<
  DailyCollectorSummaryTableProps
> = ({ data, isLoading, onSort, sortConfig }) => {
  const { t } = useTranslation();

  const columns: Column<DailyCollectorSummary>[] = [
    {
      header: t('entryData.collector.date', 'Fecha'),
      accessor: 'date',
      sortable: true
    },
    {
      header: t('entryData.collector.collector', 'Cobrador'),
      accessor: 'collector',
      sortable: true
    },
    {
      header: t('entryData.collector.titleValue', 'V. EPAA'),
      accessor: (item) => fmt(item.titleValue),
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.collector.thirdPartyValue', 'V. Terc.'),
      accessor: (item) => fmt(item.thirdPartyValue),
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.collector.surchargeValue', 'Recargo'),
      accessor: (item) => fmt(item.surchargeValue),
      sortKey: 'surchargeValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.collector.trashRateValue', 'TB D.I.'),
      accessor: (item) => fmt(item.trashRateValue),
      sortKey: 'trashRateValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.collector.detailValue', 'TB Valor'),
      accessor: (item) => fmt(item.detailValue),
      sortKey: 'detailValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.collector.paymentCount', 'Pagos'),
      accessor: (item) => String(item.paymentCount),
      sortKey: 'paymentCount',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.collector.totalCollected', 'Total Recaudado'),
      accessor: (item) => fmt(item.totalCollected),
      sortKey: 'totalCollected',
      sortable: true,
      isNumeric: true
    }
  ];

  const totalRows = [
    {
      label: t('entryData.collector.totalEpaa', 'Total EPAA'),
      value: data.reduce((s, r) => s + Number(r.titleValue), 0)
    },
    {
      label: t('entryData.collector.totalThirdParty', 'Total Terceros'),
      value: data.reduce((s, r) => s + Number(r.thirdPartyValue), 0)
    },
    {
      label: t('entryData.collector.totalSurcharge', 'Total Recargo'),
      value: data.reduce((s, r) => s + Number(r.surchargeValue), 0)
    },
    {
      label: t('entryData.collector.totalTrash', 'Total TB D.I.'),
      value: data.reduce((s, r) => s + Number(r.trashRateValue), 0)
    },
    {
      label: t('entryData.collector.totalDetail', 'Total TB Valor'),
      value: data.reduce((s, r) => s + Number(r.detailValue), 0)
    },
    {
      label: t('entryData.collector.grandTotal', 'Total General'),
      value: data.reduce((s, r) => s + Number(r.totalCollected), 0),
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
        totalRows={totalRows}
        width="100"
        fullHeight
        emptyState={
          <div className="payments-table-empty">
            <p>{t('common.noData', 'No se encontraron registros')}</p>
          </div>
        }
      />
    </div>
  );
};
