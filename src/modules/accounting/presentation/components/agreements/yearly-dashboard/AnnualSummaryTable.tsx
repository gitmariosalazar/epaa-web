import React, { useMemo } from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import type { AgreementKPIsResponse } from '../../../../domain/models/Agreements';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { CHART_COLORS } from '@/shared/presentation/utils/colors/charts.colors';
import {
  Professional3DPieChart,
  type PieData
} from '@/shared/presentation/components/Charts/Professional3DPieChart';

interface AnnualSummaryTableProps {
  data: AgreementKPIsResponse[];
  isLoading: boolean;
}

export const AnnualSummaryTable: React.FC<AnnualSummaryTableProps> = ({
  data,
  isLoading
}) => {
  const chartData = [...(data || [])].reverse();

  const columns: Column<AgreementKPIsResponse>[] = [
    { header: 'Año', accessor: 'year', sortable: true, id: 'year' },
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

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<AgreementKPIsResponse>({
      data: data,
      availableColumns: [
        { id: 'year', label: 'Año', isDefault: true },
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
      reportTitle: 'Resumen Consolidado Anual de Convenios',
      reportDescription: 'Análisis de evolución histórica SIGEPAA',
      totalRows: totalRows,
      mapRowData: (row) => [
        row.year,
        row.totalCitizensWithAgreements,
        CurrencyFormatter.format(row.totalEmitted),
        CurrencyFormatter.format(row.totalCollected),
        `${row.collectionEfficiencyPct.toFixed(2)}%`,
        CurrencyFormatter.format(row.overdueAmount)
      ]
    });

  const dataProfessional3DPie: PieData[] = useMemo(
    () =>
      data.map((item, index) => ({
        name: CurrencyFormatter.format(item.totalCollected),
        value: item.totalCollected,
        label: `${item.year}`,
        fmt: (n: number) => CurrencyFormatter.format(n),
        color: CHART_COLORS[index % CHART_COLORS.length]
      })),
    [data]
  );

  return (
    <div
      className="dashboard-chart-body"
      style={{ height: 'auto', minHeight: 'auto', marginTop: '-2.8rem' }}
    >
      <div className="overdue-chart-header">
        <h3 className="overdue-chart-title">Resumen Consolidado Anual</h3>
        <p className="overdue-chart-subtitle">
          Detalle comparativo de métricas financieras
        </p>
      </div>
      <div
        className="payments-table-wrapper"
        style={{
          marginTop: '1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Table
          data={chartData}
          columns={columns}
          isLoading={isLoading}
          pagination={true}
          pageSize={5}
          width="100"
          totalRows={totalRows}
          onExportPdf={() => setShowPdfPreview(true)}
          showTotalRecords={false}
          showRowsPerPage={false}
          fullHeight={true}
          emptyState={
            <EmptyState
              message="Sin datos"
              description="No hay KPIs para mostrar"
              icon={IoInformationCircleOutline}
              variant="info"
            />
          }
        />
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1px solid var(--border-color-soft)',
          marginTop: '1rem'
        }}
      >
        <Professional3DPieChart data={dataProfessional3DPie} height={800} />
      </div>
      {PdfPreviewModal}
    </div>
  );
};
