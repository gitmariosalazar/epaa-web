import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { CollectorPerformanceKPI } from '../../domain/models/trash-rate-report.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import '../styles/PaymentsTable.css';

interface CollectorPerformanceKPITableProps {
  data: CollectorPerformanceKPI[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const CollectorPerformanceKPITable: React.FC<
  CollectorPerformanceKPITableProps
> = ({ data, isLoading, onSort, onExportPdf, sortConfig, error }) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const columns: Column<CollectorPerformanceKPI>[] = [
    /*
    {
      header: t(
        'trashRateReport.clientDetail.performanceRank',
        'Ranking de Desempeño'
      ),
      accessor: 'performanceRank',
      isNumeric: true
    },
    */
    {
      header: t('trashRateReport.clientDetail.collectorId', 'ID del Cobrador'),
      accessor: 'collectorId'
    },
    {
      header: t(
        'trashRateReport.clientDetail.totalTransactions',
        'N° de Facturas'
      ),
      accessor: 'totalTransactions',
      isNumeric: true
    },
    /*
    {
      header: t(
        'trashRateReport.clientDetail.uniqueCustomersServed',
        'Clientes Únicos'
      ),
      accessor: 'uniqueCustomersServed',
      isNumeric: true
    },
    */
    {
      header: t(
        'trashRateReport.clientDetail.sourceTrashRateTotal',
        'TB Datos Ingreso'
      ),
      accessor: (item) => formatCurrency(item.sourceTrashRateTotal),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.valorTableTotal',
        'TB Tabla Valor'
      ),
      accessor: (item) => formatCurrency(item.valorTableTotal),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.integrityGapAmount',
        'Diferencia (TBDI - TBTV)'
      ),
      accessor: (item) => formatCurrency(item.integrityGapAmount),
      isNumeric: true
    },
    {
      header: t('trashRateReport.clientDetail.grossAmount', 'Monto Facturado'),
      accessor: (item) => formatCurrency(item.grossAmount),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.totalDiscountsApplied',
        'DesC. Aplicados'
      ),
      accessor: (item) => formatCurrency(item.totalDiscountsApplied),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.netCollectionTotal',
        'Recaudación Neta'
      ),
      accessor: (item) => formatCurrency(item.netCollectionTotal),
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.clientDetail.cancelledBillsValue',
        'Valor Fact. (A - B)'
      ),
      accessor: (item) => formatCurrency(item.cancelledBillsValue),
      isNumeric: true
    },
    /*
    {
      header: t(
        'trashRateReport.clientDetail.avgTicketSize',
        'Ticket Promedio'
      ),
      accessor: (item) => formatCurrency(item.avgTicketSize),
      isNumeric: true
    },
    
    {
      header: t(
        'trashRateReport.clientDetail.pctOfTotalRevenue',
        '% de Contribución'
      ),
      accessor: (item) => formatCurrency(item.pctOfTotalRevenue),
      isNumeric: true
    },
    */
    {
      header: t(
        'trashRateReport.clientDetail.cancelledBillsCount',
        'Fact. (A - B)'
      ),
      accessor: 'cancelledBillsCount',
      isNumeric: true
    }
  ];

  const totalTransactions = data.reduce(
    (sum, row) => sum + row.totalTransactions,
    0
  );
  /*
  const totalUniqueCustomers = data.reduce(
    (sum, row) => sum + row.uniqueCustomersServed,
    0
  );
  */
  const sourceTrashRateTotal = data.reduce(
    (sum, row) => sum + row.sourceTrashRateTotal,
    0
  );
  const valorTableTotal = data.reduce(
    (sum, row) => sum + row.valorTableTotal,
    0
  );
  const integrityGapAmount = data.reduce(
    (sum, row) => sum + row.integrityGapAmount,
    0
  );
  const grossAmount = data.reduce((sum, row) => sum + row.grossAmount, 0);
  const totalDiscountsApplied = data.reduce(
    (sum, row) => sum + row.totalDiscountsApplied,
    0
  );
  const netCollectionTotal = data.reduce(
    (sum, row) => sum + row.netCollectionTotal,
    0
  );
  const cancelledBillsValueTotal = data.reduce(
    (sum, row) => sum + row.cancelledBillsValue,
    0
  );
  /*
  const avgTicketSize =
    totalTransactions > 0 ? netCollectionTotal / totalTransactions : 0;

  const totalPctContribution = data.reduce(
    (sum, row) => sum + row.pctOfTotalRevenue,
    0
  );
  */

  const totalCancelledCount = data.reduce(
    (sum, row) => sum + row.cancelledBillsCount,
    0
  );

  const totalRows = [
    { label: 'TOTAL FACTURAS', value: totalTransactions },
    //{ label: 'TOTAL CLIENTES', value: totalUniqueCustomers },
    { label: 'TOTAL TB DATOS INGRESO', value: sourceTrashRateTotal },
    { label: 'TOTAL TB TABLA VALOR', value: valorTableTotal },
    { label: 'TOTAL DIF. (TBDI - TBTV)', value: integrityGapAmount },
    { label: 'TOTAL MONTO FACT.', value: grossAmount },
    { label: 'TOTAL DESCUENTOS', value: totalDiscountsApplied },
    {
      label: 'TOTAL VALOR FACT. (A - B)',
      value: cancelledBillsValueTotal
    },
    {
      label: 'RECAUDACIÓN NETA',
      value: netCollectionTotal - cancelledBillsValueTotal,
      highlight: true
    },
    /*
    { label: 'TOTAL TICKET PROMEDIO', value: avgTicketSize },
    { label: 'TOTAL % DE CONTRIBUCIÓN', value: totalPctContribution },
    */
    { label: 'TOTAL FACT. (A - B)', value: totalCancelledCount }
  ];

  if (error) return null;

  return (
    <div className="trash-rate-audit-table-wrapper">
      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        onSort={onSort}
        onExportPdf={onExportPdf}
        sortConfig={sortConfig}
        fullHeight
        emptyState={<EmptyState message="Data not found!" />}
        totalRows={totalRows}
      />
    </div>
  );
};
