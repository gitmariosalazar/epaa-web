import { useTranslation } from 'react-i18next';
import type { YearlyOverdueSummary } from '../../domain/models/OverdueReading';
import type { SortConfig } from '../hooks/useOverduePaymentsViewModel';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useCallback, useMemo } from 'react';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

interface YearlyOverdueSumaryTableProps {
  data: YearlyOverdueSummary[];
  isLoading: boolean;
  sortConfig?: SortConfig | null;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onEndReached?: () => void;
  hasMore?: boolean;
}

export const YearlyOverdueSumaryTable: React.FC<
  YearlyOverdueSumaryTableProps
> = ({ data, isLoading, sortConfig, onSort, onEndReached, hasMore }) => {
  const { t } = useTranslation();
  const loadingProgress = useSimulatedProgress(isLoading);

  const columns: Column<YearlyOverdueSummary>[] = useMemo(
    () => [
      {
        header: t('accounting.overdue.year', 'Año'),
        accessor: 'year',
        id: 'year',
        sortable: true,
        sortKey: 'year',
        style: { width: '80px', textAlign: 'center' }
      },
      {
        header: t('accounting.overdue.clientsWithDebt', 'Clientes con deuda'),
        accessor: 'clientsWithDebt',
        sortable: true,
        id: 'clientsWithDebt',
        sortKey: 'clientsWithDebt',
        style: { width: '120px', textAlign: 'center' }
      },
      {
        header: t(
          'accounting.overdue.totalUniqueCadastralKeysByYear',
          'Claves Catastrales'
        ),
        accessor: 'totalUniqueCadastralKeysByYear',
        sortable: true,
        id: 'totalUniqueCadastralKeysByYear',
        sortKey: 'totalUniqueCadastralKeysByYear',
        style: { width: '120px', textAlign: 'center' }
      },
      {
        header: t('accounting.overdue.totalMonthsPastDue', 'Meses con mora'),
        accessor: (item: YearlyOverdueSummary) => (
          <span
            className={`months-past-due-badge ${
              item.totalMonthsPastDue >= 6000
                ? 'past-due-critical'
                : item.totalMonthsPastDue >= 3000
                  ? 'past-due-warning'
                  : 'past-due-normal'
            }`}
          >
            {item.totalMonthsPastDue}
          </span>
        ),
        id: 'totalMonthsPastDue',
        sortable: true,
        sortKey: 'totalMonthsPastDue',
        style: { width: '100px', textAlign: 'center' }
      },
      {
        header: t('accounting.overdue.epaaValue', 'Monto EPAA'),
        accessor: (item: YearlyOverdueSummary) => (
          <span className="total-amount-cell">
            {item.totalEpaaValue !== undefined
              ? `$${item.totalEpaaValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        ),
        id: 'totalEpaaValue',
        sortable: true,
        sortKey: 'totalEpaaValue',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t('accounting.overdue.trashRate', 'Tasa de desecho'),
        accessor: (item: YearlyOverdueSummary) => (
          <span>
            {item.totalTrashRate !== undefined
              ? `$${item.totalTrashRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        ),
        id: 'totalTrashRate',
        sortable: true,
        sortKey: 'totalTrashRate',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t('accounting.overdue.currentSurcharge', 'Recargos actuales'),
        accessor: (item: YearlyOverdueSummary) => (
          <span>
            {item.totalSurcharge !== undefined
              ? `$${item.totalSurcharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        ),
        id: 'totalSurcharge',
        sortable: true,
        sortKey: 'totalSurcharge',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t('accounting.overdue.oldSurcharge', 'Recargos anteriores'),
        accessor: (item: YearlyOverdueSummary) => (
          <span>
            {item.totalOldSurcharge !== undefined
              ? `$${item.totalOldSurcharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        ),
        id: 'totalOldSurcharge',
        sortable: true,
        sortKey: 'totalOldSurcharge',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t(
          'accounting.overdue.improvementsInterest',
          'Intereses de mejoras'
        ),
        accessor: (item: YearlyOverdueSummary) => (
          <span>
            {item.totalImprovementsInterest !== undefined
              ? `$${item.totalImprovementsInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        ),
        id: 'totalImprovementsInterest',
        sortable: true,
        sortKey: 'totalImprovementsInterest',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t('accounting.overdue.avgDebtPerClient', 'Promedio p/ Cliente'),
        accessor: (item: YearlyOverdueSummary) => (
          <span>
            {item.avgDebtPerClient !== undefined
              ? `$${item.avgDebtPerClient.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        ),
        id: 'avgDebtPerClient',
        sortable: true,
        sortKey: 'avgDebtPerClient',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t('accounting.overdue.totalDebtAmount', 'Total deuda'),
        accessor: (item: YearlyOverdueSummary) => (
          <span className="total-due-text">
            {item.totalDebtAmount !== undefined
              ? `$${item.totalDebtAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '-'}
          </span>
        ),
        id: 'totalDebtAmount',
        sortable: true,
        sortKey: 'totalDebtAmount',
        style: { width: '120px', textAlign: 'right' }
      }
    ],
    [t]
  );

  const totals = useMemo(() => {
    const defaultTotals = {
      yearLabel: t('accounting.overdue.total', 'Total'),
      clientsWithDebt: 0,
      totalUniqueCadastralKeysByYear: 0,
      totalMonthsPastDue: 0,
      totalEpaaValue: 0,
      totalTrashRate: 0,
      totalSurcharge: 0,
      totalOldSurcharge: 0,
      totalImprovementsInterest: 0,
      totalDebtAmount: 0,
      avgDebtPerClient: 0
    };

    const aggregated = data.reduce((acc, item) => {
      return {
        ...acc,
        clientsWithDebt: acc.clientsWithDebt + (item.clientsWithDebt || 0),
        totalUniqueCadastralKeysByYear:
          acc.totalUniqueCadastralKeysByYear +
          (item.totalUniqueCadastralKeysByYear || 0),
        totalMonthsPastDue:
          acc.totalMonthsPastDue + (item.totalMonthsPastDue || 0),
        totalEpaaValue: acc.totalEpaaValue + (item.totalEpaaValue || 0),
        totalTrashRate: acc.totalTrashRate + (item.totalTrashRate || 0),
        totalSurcharge: acc.totalSurcharge + (item.totalSurcharge || 0),
        totalOldSurcharge:
          acc.totalOldSurcharge + (item.totalOldSurcharge || 0),
        totalImprovementsInterest:
          acc.totalImprovementsInterest + (item.totalImprovementsInterest || 0),
        totalDebtAmount: acc.totalDebtAmount + (item.totalDebtAmount || 0)
      };
    }, defaultTotals);

    if (aggregated.clientsWithDebt > 0) {
      aggregated.avgDebtPerClient =
        aggregated.totalDebtAmount / aggregated.clientsWithDebt;
    }

    return aggregated;
  }, [data, t]);

  const handleMapRowData = useCallback(
    (item: YearlyOverdueSummary, selectedColumns: ExportColumn[]) => {
      const rowData: Record<string, string> = {
        year: item.year.toString(),
        clientsWithDebt: item.clientsWithDebt.toString(),
        totalUniqueCadastralKeysByYear: (
          item.totalUniqueCadastralKeysByYear || 0
        ).toString(),
        totalMonthsPastDue: item.totalMonthsPastDue.toString(),
        totalEpaaValue: item.totalEpaaValue.toFixed(2),
        totalTrashRate: item.totalTrashRate.toFixed(2),
        totalSurcharge: item.totalSurcharge.toFixed(2),
        totalOldSurcharge: item.totalOldSurcharge.toFixed(2),
        totalImprovementsInterest: item.totalImprovementsInterest.toFixed(2),
        avgDebtPerClient: item.avgDebtPerClient.toFixed(2),
        totalDebtAmount: item.totalDebtAmount.toFixed(2)
      };
      return selectedColumns.map(
        (column) => rowData[column.id as keyof typeof rowData] || '-'
      );
    },
    []
  );

  const availableColumns = useMemo(
    () => [
      {
        id: 'year',
        label: t('accounting.overdue.year', 'Año'),
        isDefault: true
      },
      {
        id: 'clientsWithDebt',
        label: t('accounting.overdue.clientsWithDebt', 'Clientes con deuda'),
        isDefault: true
      },
      {
        id: 'totalUniqueCadastralKeysByYear',
        label: t(
          'accounting.overdue.totalUniqueCadastralKeysByYear',
          'Claves Catastrales'
        ),
        isDefault: true
      },
      {
        id: 'totalMonthsPastDue',
        label: t('accounting.overdue.totalMonthsPastDue', 'Meses con mora'),
        isDefault: true
      },
      {
        id: 'totalEpaaValue',
        label: t('accounting.overdue.epaaValue', 'Monto EPAA'),
        isDefault: true
      },
      {
        id: 'totalTrashRate',
        label: t('accounting.overdue.trashRate', 'Tasa de desecho'),
        isDefault: true
      },
      {
        id: 'totalSurcharge',
        label: t('accounting.overdue.currentSurcharge', 'Recargos actuales'),
        isDefault: true
      },
      {
        id: 'totalOldSurcharge',
        label: t('accounting.overdue.oldSurcharge', 'Recargos anteriores'),
        isDefault: true
      },
      {
        id: 'totalImprovementsInterest',
        label: t(
          'accounting.overdue.improvementsInterest',
          'Intereses de mejoras'
        ),
        isDefault: true
      },
      {
        id: 'avgDebtPerClient',
        label: t('accounting.overdue.avgDebtPerClient', 'Promedio p/ Cliente'),
        isDefault: true
      },
      {
        id: 'totalDebtAmount',
        label: t('accounting.overdue.totalDebtAmount', 'Total deuda'),
        isDefault: true
      }
    ],
    [t]
  );

  const totalRows = useMemo(
    () => [
      {
        label: t('accounting.overdue.year', 'Año'),
        value: data.length,
        highlight: false,
        columnId: 'year'
      },
      {
        label: t('accounting.overdue.epaaValue', 'Monto EPAA'),
        value: `$${totals.totalEpaaValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        highlight: false,
        columnId: 'totalEpaaValue'
      },
      {
        label: t('accounting.overdue.trashRate', 'Tasa de desecho'),
        value: `$${totals.totalTrashRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        highlight: false,
        columnId: 'totalTrashRate'
      },
      {
        label: t('accounting.overdue.currentSurcharge', 'Recargos actuales'),
        value: `$${totals.totalSurcharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        highlight: false,
        columnId: 'totalSurcharge'
      },
      {
        label: t('accounting.overdue.oldSurcharge', 'Recargos anteriores'),
        value: `$${totals.totalOldSurcharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        highlight: false,
        columnId: 'totalOldSurcharge'
      },
      {
        label: t(
          'accounting.overdue.improvementsInterest',
          'Intereses de mejoras'
        ),
        value: `$${totals.totalImprovementsInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        highlight: false,
        columnId: 'totalImprovementsInterest'
      },
      {
        label: t('accounting.overdue.avgDebtPerClient', 'Promedio p/ Cliente'),
        value: `$${totals.avgDebtPerClient.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        highlight: false,
        columnId: 'avgDebtPerClient'
      },
      {
        label: t('accounting.overdue.totalDebtAmount', 'Total deuda'),
        value: `$${totals.totalDebtAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        highlight: true,
        columnId: 'totalDebtAmount'
      }
    ],
    [t, data.length, totals]
  );

  const labelsHorizontal = useMemo(
    () => ({
      [t('readings.historyTable.date', 'Fecha de generación')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }),
    [t]
  );

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<YearlyOverdueSummary>({
      data,
      availableColumns,
      reportTitle: t(
        'accounting.overdue.reportTitle',
        'Reporte de Morosidad Anual'
      ),
      reportDescription: t(
        'accounting.overdue.reportSubtitle',
        'Resumen de morosidad por año'
      ),
      labelsHorizontal,
      totalRows,
      mapRowData: handleMapRowData
    });

  return (
    <div className="payments-table-wrapper">
      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        loadingState={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              width: '100%'
            }}
          >
            <CircularProgress
              progress={loadingProgress}
              size={140}
              strokeWidth={6}
              label={t('common.loading', 'LOADING...')}
            />
          </div>
        }
        sortConfig={sortConfig}
        onSort={onSort}
        onEndReached={onEndReached}
        hasMore={hasMore}
        onExportPdf={() => setShowPdfPreview(true)}
        totalRows={totalRows}
        width="100"
        fullHeight
        pagination={true} // Enable pagination to show the export button
        pageSize={15}
        emptyState={
          <EmptyState
            message={t('accounting.overdue.emptyStateTitle', 'No hay datos')}
            description={t(
              'accounting.overdue.emptyStateDescription',
              'No hay datos para mostrar'
            )}
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
