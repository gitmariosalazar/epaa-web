import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { DailyPaymentMethodReport } from '../../domain/models/EntryData';
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
      header: t('entryData.method.date', 'Fecha'),
      accessor: 'date',
      sortable: true
    },
    {
      header: t('entryData.method.paymentMethod', 'Método de Pago'),
      accessor: 'paymentMethod',
      sortable: true
    },
    {
      header: t('entryData.method.status', 'Estado'),
      accessor: 'status',
      sortable: true
    },
    {
      header: t('entryData.method.titleValue', 'V. EPAA'),
      accessor: (item) => fmt(item.titleValue),
      sortKey: 'titleValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.method.thirdPartyValue', 'V. Terc.'),
      accessor: (item) => fmt(item.thirdPartyValue),
      sortKey: 'thirdPartyValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.method.surchargeValue', 'Recargo'),
      accessor: (item) => fmt(item.surchargeValue),
      sortKey: 'surchargeValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.method.trashRateValue', 'TB D.I.'),
      accessor: (item) => fmt(item.trashRateValue),
      sortKey: 'trashRateValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.method.detailValue', 'TB Valor'),
      accessor: (item) => fmt(item.detailValue),
      sortKey: 'detailValue',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.method.recordCount', 'Registros'),
      accessor: (item) => String(item.recordCount),
      sortKey: 'recordCount',
      sortable: true,
      isNumeric: true
    },
    {
      header: t('entryData.method.total', 'Total'),
      accessor: (item) => fmt(item.total),
      sortKey: 'total',
      sortable: true,
      isNumeric: true
    }
  ];

  const totalRows = [
    {
      label: t('entryData.method.totalEpaa', 'Total EPAA'),
      value: data.reduce((s, r) => s + Number(r.titleValue), 0)
    },
    {
      label: t('entryData.method.totalThirdParty', 'Total Terceros'),
      value: data.reduce((s, r) => s + Number(r.thirdPartyValue), 0)
    },
    {
      label: t('entryData.method.totalSurcharge', 'Total Recargo'),
      value: data.reduce((s, r) => s + Number(r.surchargeValue), 0)
    },
    {
      label: t('entryData.method.totalTrash', 'Total TB D.I.'),
      value: data.reduce((s, r) => s + Number(r.trashRateValue), 0)
    },
    {
      label: t('entryData.method.totalDetail', 'Total TB Valor'),
      value: data.reduce((s, r) => s + Number(r.detailValue), 0)
    },
    {
      label: t('entryData.method.grandTotal', 'Total General'),
      value: data.reduce((s, r) => s + Number(r.total), 0),
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
