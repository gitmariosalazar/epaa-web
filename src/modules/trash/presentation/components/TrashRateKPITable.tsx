import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { TrashRateKPI } from '../../domain/models/trash-rate-report.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';

interface TrashRateKPITableProps {
  data: TrashRateKPI[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const TrashRateKPITable: React.FC<TrashRateKPITableProps> = ({
  data,
  isLoading,
  onSort,
  onExportPdf,
  sortConfig
}) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number | null | undefined) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value ?? 0);

  const columns: Column<TrashRateKPI>[] = [
    {
      header: t('trashRateKPI.table.totalBillsIssued', 'Facturas Emitidas'),
      accessor: 'totalBillsIssued',
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.uniqueCadastralKeys', 'Predios Únicos'),
      accessor: 'uniqueCadastralKeys',
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.sourceTrashRateTotal', 'Emisión Sistema'),
      accessor: (r) => formatCurrency(r.sourceTrashRateTotal),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.valorTableTotal', 'Emisión Vencimiento'),
      accessor: (r) => formatCurrency(r.valorTableTotal),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.integrityGapAmount', 'Brecha Integridad'),
      accessor: (r) => formatCurrency(r.integrityGapAmount),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.grossAmountToCollect', 'Bruto a Recaudar'),
      accessor: (r) => formatCurrency(r.grossAmountToCollect),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.netAmountCollected', 'Neto Recaudado'),
      accessor: (r) => formatCurrency(r.netAmountCollected),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.totalAmountPending', 'Total Pendiente'),
      accessor: (r) => formatCurrency(r.totalAmountPending),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.collectionCompliancePct', '% Cumplimiento'),
      accessor: (r) => formatCurrency(r.collectionCompliancePct),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.paidBillsCount', 'Facturas Pagadas'),
      accessor: 'paidBillsCount',
      isNumeric: true
    }
  ];

  if (isLoading) return null;

  return (
    <div>
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
      />
    </div>
  );
};
