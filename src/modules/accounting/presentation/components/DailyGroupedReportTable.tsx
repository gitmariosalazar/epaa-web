import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { DailyGroupedReport } from '../../domain/models/EntryData';
import { useTranslation } from 'react-i18next';

interface DailyGroupedReportTableProps {
  data: DailyGroupedReport[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
}

const fmt = (n: number) => `$${Number(n).toFixed(2)}`;

export const DailyGroupedReportTable: React.FC<
  DailyGroupedReportTableProps
> = ({ data, isLoading, onSort, sortConfig }) => {
  const { t } = useTranslation();

  const columns: Column<DailyGroupedReport>[] = [
    {
      header: t('entryData.grouped.date', 'Fecha'),
      accessor: 'date',
      sortable: true
    },
    {
      header: t('entryData.grouped.collector', 'Cobrador'),
      accessor: 'collector',
      sortable: true
    },
    {
      header: t('entryData.grouped.titleCode', 'Código T.'),
      accessor: 'titleCode',
      sortable: true
    },
    {
      header: t('entryData.grouped.paymentMethod', 'Mét. Pago'),
      accessor: 'paymentMethod',
      sortable: true
    },
    {
      header: t('entryData.grouped.status', 'Estado'),
      accessor: 'status',
      sortable: true
    },
    {
      header: t('entryData.grouped.titleValue', 'V. EPAA'),
      accessor: (item) => fmt(item.titleValue),
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.grouped.thirdPartyValue', 'V. Terc.'),
      accessor: (item) => fmt(item.thirdPartyValue),
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.grouped.surchargeValue', 'Recargo'),
      accessor: (item) => fmt(item.surchargeValue),
      sortKey: 'surchargeValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.grouped.trashRateValue', 'TB D.I.'),
      accessor: (item) => fmt(item.trashRateValue),
      sortKey: 'trashRateValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.grouped.detailValue', 'TB Valor'),
      accessor: (item) => fmt(item.detailValue),
      sortKey: 'detailValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.grouped.totalValue', 'Total'),
      accessor: (item) => fmt(item.totalValue),
      sortKey: 'totalValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.grouped.recordCount', 'Registros'),
      accessor: (item) => String(item.recordCount),
      sortKey: 'recordCount',
      sortable: true,
      isNumeric: true
    }
  ];

  // ── Totals ──────────────────────────────────────────────────────────────────
  const totalRows = [
    {
      label: t('entryData.grouped.totalTitleValue', 'Total EPAA'),
      value: data.reduce((s, r) => s + Number(r.titleValue), 0)
    },
    {
      label: t('entryData.grouped.totalThirdParty', 'Total Terceros'),
      value: data.reduce((s, r) => s + Number(r.thirdPartyValue), 0)
    },
    {
      label: t('entryData.grouped.totalSurcharge', 'Total Recargo'),
      value: data.reduce((s, r) => s + Number(r.surchargeValue), 0)
    },
    {
      label: t('entryData.grouped.totalTrash', 'Total TB D.I.'),
      value: data.reduce((s, r) => s + Number(r.trashRateValue), 0)
    },
    {
      label: t('entryData.grouped.totalDetail', 'Total TB Valor'),
      value: data.reduce((s, r) => s + Number(r.detailValue), 0)
    },
    {
      label: t('entryData.grouped.grandTotal', 'Total General'),
      value: data.reduce((s, r) => s + Number(r.totalValue), 0),
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
