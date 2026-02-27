import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { FullBreakdownReport } from '../../domain/models/EntryData';
import { useTranslation } from 'react-i18next';

interface FullBreakdownReportTableProps {
  data: FullBreakdownReport[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
}

const fmt = (n: number) => `$${Number(n).toFixed(2)}`;

export const FullBreakdownReportTable: React.FC<
  FullBreakdownReportTableProps
> = ({ data, isLoading, onSort, sortConfig }) => {
  const { t } = useTranslation();

  const columns: Column<FullBreakdownReport>[] = [
    {
      header: t('entryData.breakdown.date', 'Fecha'),
      accessor: 'date',
      sortable: true
    },
    {
      header: t('entryData.breakdown.collector', 'Cobrador'),
      accessor: 'collector',
      sortable: true
    },
    {
      header: t('entryData.breakdown.titleCode', 'Código T.'),
      accessor: 'titleCode',
      sortable: true
    },
    {
      header: t('entryData.breakdown.paymentMethod', 'Mét. Pago'),
      accessor: 'paymentMethod',
      sortable: true
    },
    {
      header: t('entryData.breakdown.status', 'Estado'),
      accessor: 'status',
      sortable: true
    },
    {
      header: t('entryData.breakdown.titleValue', 'V. EPAA'),
      accessor: (item) => fmt(item.titleValue),
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.breakdown.thirdPartyValue', 'V. Terc.'),
      accessor: (item) => fmt(item.thirdPartyValue),
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.breakdown.surchargeValue', 'Recargo'),
      accessor: (item) => fmt(item.surchargeValue),
      sortKey: 'surchargeValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.breakdown.trashRateValue', 'TB D.I.'),
      accessor: (item) => fmt(item.trashRateValue),
      sortKey: 'trashRateValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.breakdown.detailValue', 'TB Valor'),
      accessor: (item) => fmt(item.detailValue),
      sortKey: 'detailValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.breakdown.incomeCount', 'Ingresos'),
      accessor: (item) => String(item.incomeCount),
      sortKey: 'incomeCount',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.breakdown.grandTotal', 'Total'),
      accessor: (item) => fmt(item.grandTotal),
      sortKey: 'grandTotal',
      sortable: true,
      isNumeric: true
    }
  ];

  const totalRows = [
    {
      label: t('entryData.breakdown.totalEpaa', 'Total EPAA'),
      value: data.reduce((s, r) => s + Number(r.titleValue), 0)
    },
    {
      label: t('entryData.breakdown.totalThirdParty', 'Total Terceros'),
      value: data.reduce((s, r) => s + Number(r.thirdPartyValue), 0)
    },
    {
      label: t('entryData.breakdown.totalSurcharge', 'Total Recargo'),
      value: data.reduce((s, r) => s + Number(r.surchargeValue), 0)
    },
    {
      label: t('entryData.breakdown.totalTrash', 'Total TB D.I.'),
      value: data.reduce((s, r) => s + Number(r.trashRateValue), 0)
    },
    {
      label: t('entryData.breakdown.totalDetail', 'Total TB Valor'),
      value: data.reduce((s, r) => s + Number(r.detailValue), 0)
    },
    {
      label: t('entryData.breakdown.grandTotalAll', 'Total General'),
      value: data.reduce((s, r) => s + Number(r.grandTotal), 0),
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
