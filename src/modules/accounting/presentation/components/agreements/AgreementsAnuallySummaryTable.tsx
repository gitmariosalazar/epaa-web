import React from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import type { AgreementKPIsResponse } from '@/modules/accounting/domain/models/Agreements';
import type { SearchType } from '@/modules/accounting/domain/dto/params/AgreementsParams';
import { ConvertMonth } from '@/shared/utils/datetime/Converts';

interface AgreementsAnuallySummaryTableProps {
  data: AgreementKPIsResponse[];
  isLoading: boolean;
  searchType: SearchType;
}

export const AgreementsAnuallySummaryTable: React.FC<
  AgreementsAnuallySummaryTableProps
> = ({ data, isLoading, searchType }) => {
  const chartData = [...(data || [])].reverse();

  const columns: Column<AgreementKPIsResponse>[] = [
    { header: 'Año', accessor: 'year', sortable: true, id: 'year' },
    ...(searchType === 'MONTH' || searchType === 'DAY'
      ? [
          {
            header: 'Mes',
            accessor: (item: any) => ConvertMonth(item.month) || '-',
            sortable: true,
            id: 'month'
          }
        ]
      : []),
    ...(searchType === 'DAY'
      ? [
          {
            header: 'Día',
            accessor: (item: any) => item.day || '-',
            sortable: true,
            id: 'day'
          }
        ]
      : []),
    {
      header: 'Ciudadanos',
      accessor: (item) =>
        NumberFormatter.formatInteger(item.totalCitizensWithAgreements),
      sortable: true,
      id: 'citizens',
      isNumeric: true
    },
    {
      header: 'T. Emitido',
      accessor: (item) => CurrencyFormatter.format(item.totalEmitted),
      sortable: true,
      id: 'emitted',
      isNumeric: true
    },
    {
      header: 'T. Recaudado',
      accessor: (item) => CurrencyFormatter.format(item.totalCollected),
      sortable: true,
      id: 'collected',
      isNumeric: true
    },
    {
      header: 'Eficiencia',
      accessor: (item) => (
        <ProgressBar
          value={item.collectionEfficiencyPct}
          color={getTrafficLightColor(item.collectionEfficiencyPct)}
        />
      ),
      sortable: true,
      id: 'efficiency',
      isNumeric: true
    },
    {
      header: 'En Mora',
      accessor: (item) => CurrencyFormatter.format(item.overdueAmount),
      sortable: true,
      id: 'overdue',
      isNumeric: true
    }
  ];

  const totalCitizens = (data || []).reduce(
    (acc, curr) => acc + curr.totalCitizensWithAgreements,
    0
  );
  const totalEmitted = (data || []).reduce(
    (acc, curr) => acc + curr.totalEmitted,
    0
  );
  const totalCollected = (data || []).reduce(
    (acc, curr) => acc + curr.totalCollected,
    0
  );
  const totalOverdue = (data || []).reduce(
    (acc, curr) => acc + curr.overdueAmount,
    0
  );
  const avgEfficiency =
    (data || []).length > 0
      ? (data || []).reduce(
          (acc, curr) => acc + curr.collectionEfficiencyPct,
          0
        ) / (data || []).length
      : 0;

  const totalRows = [
    { label: 'RESUMEN', columnId: 'year', value: 'RESUMEN' },
    {
      label: 'Ciudadanos',
      columnId: 'citizens',
      value: NumberFormatter.formatInteger(totalCitizens)
    },
    {
      label: 'Emitido',
      columnId: 'emitted',
      value: CurrencyFormatter.format(totalEmitted)
    },
    {
      label: 'Recaudado',
      columnId: 'collected',
      value: CurrencyFormatter.format(totalCollected)
    },
    {
      label: 'Eficiencia',
      columnId: 'efficiency',
      value: `${avgEfficiency.toFixed(2)}%`
    },
    {
      label: 'En Mora',
      columnId: 'overdue',
      value: CurrencyFormatter.format(totalOverdue),
      highlight: true
    }
  ];

  console.log('searchType', searchType);
  console.log('data', data);
  console.log('totalRows', totalRows);

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<AgreementKPIsResponse>({
      data: data,
      availableColumns: [
        { id: 'year', label: 'Año', isDefault: true },
        ...(searchType === 'MONTH' || searchType === 'DAY'
          ? [{ id: 'month', label: 'Mes', isDefault: true }]
          : []),
        ...(searchType === 'DAY'
          ? [{ id: 'day', label: 'Día', isDefault: true }]
          : []),
        {
          id: 'totalCitizensWithAgreements',
          label: 'Ciudadanos',
          isDefault: true
        },
        { id: 'totalEmitted', label: 'T. Emitido', isDefault: true },
        { id: 'totalCollected', label: 'T. Recaudado', isDefault: true },
        {
          id: 'collectionEfficiencyPct',
          label: 'Eficiencia %',
          isDefault: true
        },
        { id: 'overdueAmount', label: 'En Mora', isDefault: true }
      ],
      reportTitle: `Resumen de Convenios (${
        searchType === 'YEAR'
          ? 'Anual'
          : searchType === 'MONTH'
            ? 'Mensual'
            : 'Diario'
      })`,
      reportDescription: 'Análisis de evolución histórica SIGEPAA',
      totalRows: totalRows,
      mapRowData: (row) => [
        row.year,
        ...(searchType === 'MONTH' || searchType === 'DAY' ? [row.month] : []),
        ...(searchType === 'DAY' ? [row.day] : []),
        row.totalCitizensWithAgreements,
        CurrencyFormatter.format(row.totalEmitted),
        CurrencyFormatter.format(row.totalCollected),
        `${row.collectionEfficiencyPct.toFixed(2)}%`,
        CurrencyFormatter.format(row.overdueAmount)
      ]
    });

  return (
    <div className="payments-table-wrapper">
      <Table
        data={chartData}
        columns={columns}
        isLoading={isLoading}
        pagination={true}
        pageSize={15}
        width="100"
        totalRows={totalRows}
        onExportPdf={() => setShowPdfPreview(true)}
        showTotalRecords={false}
        showRowsPerPage={false}
        fullHeight={true}
        emptyState={
          <EmptyState
            message="Sin datos"
            description="No hay información para mostrar en el resumen consolidado anual."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
