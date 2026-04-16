import { useTranslation } from 'react-i18next';
import type { MonthlyDebtSummary } from '../../../domain/models/OverdueReading';
import type { SortConfig } from '../../hooks/payments/usePaymentsViewModel';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { useCallback, useMemo } from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { NumberFormatter } from '@/shared/utils/formatters/NumberFormatter';

interface MonthlyDebtSummaryTableProps {
  data: MonthlyDebtSummary[];
  isLoading: boolean;
  sortConfig?: SortConfig | null;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onEndReached?: () => void;
  hasMore?: boolean;
}

export const MonthlyDebtSummaryTable: React.FC<
  MonthlyDebtSummaryTableProps
> = ({ data, isLoading, sortConfig, onSort, onEndReached, hasMore }) => {
  const { t } = useTranslation();
  const loadingProgress = useSimulatedProgress(isLoading);

  const columns: Column<MonthlyDebtSummary>[] = useMemo(
    () => [
      {
        header: t('accounting.monthlyDebtSummary.year', 'Año'),
        accessor: 'year',
        id: 'year',
        sortable: true,
        sortKey: 'year',
        style: { width: '80px', textAlign: 'center' }
      },
      {
        header: t('accounting.monthlyDebtSummary.monthName', 'Mes'),
        accessor: 'monthName',
        id: 'monthName',
        sortable: true,
        sortKey: 'monthName',
        style: { width: '80px', textAlign: 'center' }
      },
      {
        header: t(
          'accounting.monthlyDebtSummary.clientsWithDebt',
          'Clientes con deuda'
        ),
        accessor: 'clientsWithDebtThisMonth',
        sortable: true,
        id: 'clientsWithDebtThisMonth',
        sortKey: 'clientsWithDebtThisMonth',
        style: { width: '120px', textAlign: 'center' }
      },
      {
        header: t(
          'accounting.monthlyDebtSummary.totalUniqueCadastralKeysByYear',
          'Claves Catastrales'
        ),
        accessor: 'totalUniqueCadastralKeys',
        sortable: true,
        id: 'totalUniqueCadastralKeys',
        sortKey: 'totalUniqueCadastralKeys',
        style: { width: '120px', textAlign: 'center' }
      },
      {
        header: t(
          'accounting.monthlyDebtSummary.totalMonthsPastDue',
          'Meses con mora'
        ),
        accessor: (item: MonthlyDebtSummary) => (
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
        header: t('accounting.monthlyDebtSummary.epaaValue', 'Monto EPAA'),
        accessor: (item: MonthlyDebtSummary) => (
          <span className="total-amount-cell">
            {item.totalEpaaValue !== undefined
              ? CurrencyFormatter.format(item.totalEpaaValue)
              : '-'}
          </span>
        ),
        id: 'totalEpaaValue',
        sortable: true,
        sortKey: 'totalEpaaValue',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t('accounting.monthlyDebtSummary.trashRate', 'Tasa de desecho'),
        accessor: (item: MonthlyDebtSummary) => (
          <span>
            {item.totalTrashRate !== undefined
              ? CurrencyFormatter.format(item.totalTrashRate)
              : '-'}
          </span>
        ),
        id: 'totalTrashRate',
        sortable: true,
        sortKey: 'totalTrashRate',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t(
          'accounting.monthlyDebtSummary.currentSurcharge',
          'Recargos actuales'
        ),
        accessor: (item: MonthlyDebtSummary) => (
          <span>
            {item.totalSurcharge !== undefined
              ? CurrencyFormatter.format(item.totalSurcharge)
              : '-'}
          </span>
        ),
        id: 'totalSurcharge',
        sortable: true,
        sortKey: 'totalSurcharge',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t(
          'accounting.monthlyDebtSummary.oldSurcharge',
          'Recargos anteriores'
        ),
        accessor: (item: MonthlyDebtSummary) => (
          <span>
            {item.totalOldSurcharge !== undefined
              ? CurrencyFormatter.format(item.totalOldSurcharge)
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
          'accounting.monthlyDebtSummary.improvementsInterest',
          'Intereses de mejoras'
        ),
        accessor: (item: MonthlyDebtSummary) => (
          <span>
            {item.totalImprovementsInterest !== undefined
              ? CurrencyFormatter.format(item.totalImprovementsInterest)
              : '-'}
          </span>
        ),
        id: 'totalImprovementsInterest',
        sortable: true,
        sortKey: 'totalImprovementsInterest',
        style: { width: '120px', textAlign: 'right' }
      },
      {
        header: t(
          'accounting.monthlyDebtSummary.avgDebtPerClient',
          'Promedio p/ Cliente'
        ),
        accessor: (item: MonthlyDebtSummary) => (
          <span>
            {item.avgDebtPerClient !== undefined
              ? CurrencyFormatter.format(item.avgDebtPerClient)
              : '-'}
          </span>
        ),
        id: 'avgDebtPerClient',
        sortable: true,
        sortKey: 'avgDebtPerClient',
        style: { width: '120px', textAlign: 'right' }
      }
    ],
    [t]
  );

  const totals = useMemo(() => {
    const defaultTotals = {
      year: 'Total',
      monthName: 'Mes',
      clientsWithDebtThisMonth: 0,
      totalUniqueCadastralKeys: 0,
      totalMonthsPastDue: 0,
      totalEpaaValue: 0,
      totalTrashRate: 0,
      totalSurcharge: 0,
      totalOldSurcharge: 0,
      totalImprovementsInterest: 0,
      avgDebtPerClient: 0
    };
    const aggregatedData = data.reduce((acc, item) => {
      acc.clientsWithDebtThisMonth += item.clientsWithDebtThisMonth;
      acc.totalUniqueCadastralKeys += item.totalUniqueCadastralKeys;
      acc.totalMonthsPastDue += item.totalMonthsPastDue;
      acc.totalEpaaValue += item.totalEpaaValue;
      acc.totalTrashRate += item.totalTrashRate;
      acc.totalSurcharge += item.totalSurcharge;
      acc.totalOldSurcharge += item.totalOldSurcharge;
      acc.totalImprovementsInterest += item.totalImprovementsInterest;
      acc.avgDebtPerClient += item.avgDebtPerClient;
      return acc;
    }, defaultTotals);
    // TODO: Fix this avgDebtPerClient calculation
    if (aggregatedData.clientsWithDebtThisMonth > 0) {
      aggregatedData.avgDebtPerClient =
        aggregatedData.totalEpaaValue / aggregatedData.clientsWithDebtThisMonth;
    }
    return aggregatedData;
  }, [data]);

  const handleMapRowData = useCallback(
    (item: MonthlyDebtSummary, selectedColumns: ExportColumn[]) => {
      const rowData: Record<string, string> = {
        year: item.year.toString(),
        monthName: item.monthName.toString(),
        clientsWithDebtThisMonth: NumberFormatter.formatCount(
          item.clientsWithDebtThisMonth
        ),
        totalUniqueCadastralKeys: NumberFormatter.formatCount(
          item.totalUniqueCadastralKeys
        ),
        totalMonthsPastDue: NumberFormatter.formatCount(
          item.totalMonthsPastDue
        ),
        totalEpaaValue: CurrencyFormatter.format(item.totalEpaaValue),
        totalTrashRate: CurrencyFormatter.format(item.totalTrashRate),
        totalSurcharge: CurrencyFormatter.format(item.totalSurcharge),
        totalOldSurcharge: CurrencyFormatter.format(item.totalOldSurcharge),
        totalImprovementsInterest: CurrencyFormatter.format(
          item.totalImprovementsInterest
        ),
        avgDebtPerClient: CurrencyFormatter.format(item.avgDebtPerClient)
      };
      return selectedColumns.map(
        (column) => rowData[column.id as keyof typeof rowData] || '-'
      );
    },
    []
  );

  const availableColumns = useMemo(() => {
    return [
      { id: 'year', label: 'Año', isDefault: true },
      { id: 'monthName', label: 'Mes', isDefault: true },
      {
        id: 'clientsWithDebtThisMonth',
        label: 'Clientes con mora',
        isDefault: true
      },
      {
        id: 'totalUniqueCadastralKeys',
        label: 'Total C.C.',
        isDefault: true
      },
      { id: 'totalMonthsPastDue', label: 'Meses con mora', isDefault: true },
      { id: 'totalEpaaValue', label: 'Monto EPAA', isDefault: true },
      { id: 'totalTrashRate', label: 'Tasa de desecho', isDefault: true },
      { id: 'totalSurcharge', label: 'Recargos actuales', isDefault: true },
      {
        id: 'totalOldSurcharge',
        label: 'Recargos anteriores',
        isDefault: true
      },
      {
        id: 'totalImprovementsInterest',
        label: 'Intereses de mejoras',
        isDefault: true
      },
      { id: 'avgDebtPerClient', label: 'Promedio p/ Cliente', isDefault: true }
    ];
  }, []);

  const totalRows = useMemo(
    () => [
      {
        label: '',
        value: totals.year,
        highlight: false,
        columnId: 'year'
      },
      {
        label: '',
        value: totals.monthName,
        highlight: false,
        columnId: 'monthName'
      },
      {
        label: 'Total',
        value: NumberFormatter.formatCount(totals.clientsWithDebtThisMonth),
        highlight: false,
        columnId: 'clientsWithDebtThisMonth'
      },
      {
        label: 'Total',
        value: NumberFormatter.formatCount(totals.totalUniqueCadastralKeys),
        highlight: false,
        columnId: 'totalUniqueCadastralKeys'
      },
      {
        label: 'Total',
        value: NumberFormatter.formatCount(totals.totalMonthsPastDue),
        highlight: false,
        columnId: 'totalMonthsPastDue'
      },
      {
        label: 'Total',
        value: CurrencyFormatter.format(totals.totalEpaaValue),
        highlight: false,
        columnId: 'totalEpaaValue'
      },
      {
        label: 'Total',
        value: CurrencyFormatter.format(totals.totalTrashRate),
        highlight: false,
        columnId: 'totalTrashRate'
      },
      {
        label: 'Total',
        value: CurrencyFormatter.format(totals.totalSurcharge),
        highlight: false,
        columnId: 'totalSurcharge'
      },
      {
        label: 'Total',
        value: CurrencyFormatter.format(totals.totalOldSurcharge),
        highlight: false,
        columnId: 'totalOldSurcharge'
      },
      {
        label: 'Total',
        value: CurrencyFormatter.format(totals.totalImprovementsInterest),
        highlight: false,
        columnId: 'totalImprovementsInterest'
      },
      {
        label: 'Total',
        value: CurrencyFormatter.format(totals.avgDebtPerClient),
        highlight: false,
        columnId: 'avgDebtPerClient'
      }
    ],
    [totals]
  );
  const labelsHorizontal = useMemo(
    () => ({
      [t('readings.historyTable.date', 'Fecha de generación')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      [t('accounting.monthlyDebtSummary.year', 'Año')]: totals.year,
      [t('accounting.monthlyDebtSummary.month', 'Mes')]: totals.monthName
    }),
    [t]
  );

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<MonthlyDebtSummary>({
      data,
      availableColumns,
      reportTitle: t(
        'accounting.monthlyDebtSummary.title',
        'Resumen de deuda mensual'
      ),
      reportDescription: t(
        'accounting.monthlyDebtSummary.description',
        'Resumen de deuda mensual'
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
              label={
                <CircularProgress
                  progress={loadingProgress}
                  size={140}
                  strokeWidth={6}
                  label={t('common.loading')}
                />
              }
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
