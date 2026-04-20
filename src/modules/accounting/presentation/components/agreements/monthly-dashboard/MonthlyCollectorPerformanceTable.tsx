import React, { useMemo } from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { CollectorPerformance } from '../../../../domain/models/Agreements';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import {
  Professional3DPieChart,
  type PieData
} from '@/shared/presentation/components/Charts/Professional3DPieChart';
import { CHART_COLORS } from '@/shared/presentation/utils/colors/charts.colors';

interface MonthlyCollectorPerformanceTableProps {
  data: CollectorPerformance[];
  isLoading: boolean;
  year: number;
}

export const MonthlyCollectorPerformanceTable: React.FC<
  MonthlyCollectorPerformanceTableProps
> = ({ data, isLoading, year }) => {
  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<CollectorPerformance>({
      data: data,
      availableColumns: [
        { id: 'collector', label: 'Recaudador', isDefault: true },
        { id: 'totalPayments', label: 'Transacciones', isDefault: true },
        { id: 'totalCollected', label: 'Total', isDefault: true },
        { id: 'performancePct', label: '% Eficiencia', isDefault: true }
      ],
      reportTitle: 'Desempeño de Recaudadores - Convenios (Mensual)',
      reportDescription: `Análisis de eficiencia por agente - Año ${year}`,
      mapRowData: (row) => [
        row.collector,
        row.totalPayments,
        CurrencyFormatter.format(row.totalCollected),
        `${row.performancePct.toFixed(1)}%`
      ]
    });

  const columns: Column<CollectorPerformance>[] = useMemo(
    () => [
      { header: 'Recaudador', accessor: 'collector', id: 'collector' },
      {
        header: 'Transacciones',
        accessor: 'totalPayments',
        id: 'tx',
        isNumeric: true
      },
      {
        header: 'Total',
        accessor: (item) => CurrencyFormatter.format(item.totalCollected),
        id: 'total',
        isNumeric: true
      },
      {
        header: '% Eficiencia',
        accessor: (item) => (
          <ProgressBar
            value={item.performancePct}
            color={getTrafficLightColor(item.performancePct)}
          />
        ),
        id: 'pct',
        isNumeric: true
      }
    ],
    []
  );

  const dataProfessional3DPie: PieData[] = useMemo(
    () =>
      data.map((item, index) => ({
        name: item.collector,
        value: item.totalPayments,
        color: CHART_COLORS[index % CHART_COLORS.length],
        label: `${item.collector}`,
        fmt: (n: number) => n.toLocaleString()
      })),
    [data]
  );

  const totalRows = [
    {
      label: 'TOTAL TRANSACCIONES',
      value: data.reduce((acc, item) => acc + item.totalPayments, 0),
      highlight: false,
      columnId: 'tx'
    },
    {
      label: 'TOTAL MONTO',
      value: CurrencyFormatter.format(
        data.reduce((acc, item) => acc + item.totalCollected, 0)
      ),
      highlight: true,
      columnId: 'total'
    }
  ];

  return (
    <div
      className="dashboard-chart-body"
      style={{
        height: 'auto',
        minHeight: 'min-content',
        alignSelf: 'flex-start',
        marginTop: '-1.8rem'
      }}
    >
      <div className="overdue-chart-header">
        <h3 className="overdue-chart-title">Desempeño de Recaudadores</h3>
        <p className="overdue-chart-subtitle">
          Resumen de eficiencia por agente en el año {year}
        </p>
      </div>

      <div
        className="payments-table-wrapper"
        style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          width: '100%'
        }}
      >
        <Table
          data={data.slice(0, 5)}
          columns={columns}
          isLoading={isLoading}
          pagination={true}
          pageSize={5}
          width="100"
          onExportPdf={() => setShowPdfPreview(true)}
          showTotalRecords={false}
          showRowsPerPage={false}
          fullHeight={false}
          totalRows={totalRows}
        />
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1px solid var(--border-color-soft)'
        }}
      >
        <Professional3DPieChart data={dataProfessional3DPie} height={800} />
      </div>

      {PdfPreviewModal}
    </div>
  );
};
