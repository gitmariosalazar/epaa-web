import React, { useMemo } from 'react';
import { Table } from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { PaymentMethodSummary } from '../../../../domain/models/Agreements';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import {
  Professional3DPieChart,
  type PieData
} from '@/shared/presentation/components/Charts/Professional3DPieChart';
import { CHART_COLORS } from '@/shared/presentation/utils/colors/charts.colors';

interface PaymentMethodsTableProps {
  data: PaymentMethodSummary[];
  isLoading: boolean;
  startYear: number;
  endYear: number;
}

export const PaymentMethodsTable: React.FC<PaymentMethodsTableProps> = ({
  data,
  isLoading,
  startYear,
  endYear
}) => {
  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<PaymentMethodSummary>({
      data: data,
      availableColumns: [
        { id: 'paymentMethod', label: 'Método', isDefault: true },
        { id: 'transactionCount', label: 'Cant.', isDefault: true },
        { id: 'methodTotal', label: 'Monto', isDefault: true },
        { id: 'contributionPct', label: 'Contribución', isDefault: true }
      ],
      reportTitle: 'Resumen de Métodos de Pago - Convenios',
      reportDescription: `Distribución por tipo de cobro (${startYear} - ${endYear})`,
      mapRowData: (row) => [
        row.paymentMethod,
        row.transactionCount,
        CurrencyFormatter.format(row.methodTotal),
        `${row.contributionPct.toFixed(1)}%`
      ]
    });

  const dataProfessional3DPie: PieData[] = useMemo(
    () =>
      data.map((item, index) => ({
        name: item.paymentMethod,
        value: item.transactionCount,
        color: CHART_COLORS[index % CHART_COLORS.length],
        label: `${item.paymentMethod}`,
        fmt: (n: number) => n.toLocaleString()
      })),
    [data]
  );

  const totalRows = [
    {
      label: 'TOTAL TRANSACCIONES',
      value: data.reduce((acc, item) => acc + item.transactionCount, 0),
      highlight: false,
      columnId: 'count'
    },
    {
      label: 'TOTAL MONTO',
      value: CurrencyFormatter.format(
        data.reduce((acc, item) => acc + item.methodTotal, 0)
      ),
      highlight: true,
      columnId: 'amount'
    }
  ];

  return (
    <div className="dashboard-chart-body" style={{ marginTop: '-1.8rem' }}>
      <div className="overdue-chart-header">
        <h3 className="overdue-chart-title">Métodos de Pago</h3>
        <p className="overdue-chart-subtitle">Distribución por tipo de cobro</p>
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
          data={data}
          columns={[
            { header: 'Método', accessor: 'paymentMethod', id: 'method' },
            {
              header: 'Cant.',
              accessor: 'transactionCount',
              id: 'count',
              isNumeric: true
            },
            {
              header: 'Monto',
              accessor: (item) => CurrencyFormatter.format(item.methodTotal),
              id: 'amount',
              isNumeric: true
            },
            {
              header: 'Contribución',
              accessor: (item) => (
                <ProgressBar
                  value={item.contributionPct}
                  color={getTrafficLightColor(item.contributionPct)}
                />
              ),
              id: 'contrib',
              isNumeric: true
            }
          ]}
          isLoading={isLoading}
          pagination={true}
          pageSize={5}
          width="100"
          onExportPdf={() => setShowPdfPreview(true)}
          showTotalRecords={false}
          showRowsPerPage={false}
          fullHeight={true}
          totalRows={totalRows}
        />
      </div>
      {PdfPreviewModal}

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
    </div>
  );
};
