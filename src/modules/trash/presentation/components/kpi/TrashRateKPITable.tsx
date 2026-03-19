import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import type { TrashRateKPI } from '../../../domain/models/trash-rate-report.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import '../../styles/PaymentsTable.css';

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
      header: t('trashRateKPI.table.category', 'Categoría'),
      accessor: 'category'
    },
    {
      header: t('trashRateKPI.table.totalBills', 'Facturas Emitidas'),
      accessor: 'totalBills',
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.uniqueCadastralKeys', 'Predios Únicos'),
      accessor: 'uniqueCadastralKeys',
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.sourceAmount', 'Emisión Sistema'),
      accessor: (r) => formatCurrency(r.sourceAmount),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.valorAmount', 'Emisión Vencimiento'),
      accessor: (r) => formatCurrency(r.valorAmount),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.integrityGap', 'Brecha Integridad'),
      accessor: (r) => formatCurrency(r.integrityGap),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.grossAmount', 'Bruto a Recaudar'),
      accessor: (r) => formatCurrency(r.grossAmount),
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.paidAmount', 'Neto Recaudado'),
      accessor: (r) => {
        try {
          const status = JSON.parse(r.revenueStatusJson || '[]');
          const paid = status.find((i: any) => i.Estado === 'P')?.Monto || 0;
          return formatCurrency(paid);
        } catch {
          return formatCurrency(0);
        }
      },
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.pendingAmount', 'Total Pendiente'),
      accessor: (r) => {
        try {
          const status = JSON.parse(r.revenueStatusJson || '[]');
          const pending = status
            .filter((i: any) => i.Estado !== 'P')
            .reduce((acc: number, i: any) => acc + i.Monto, 0);
          return formatCurrency(pending);
        } catch {
          return formatCurrency(0);
        }
      },
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.collectionRate', '% Cumplimiento'),
      accessor: (r) => `${(r.collectionRate || 0).toFixed(1)}%`,
      isNumeric: true
    },
    {
      header: t('trashRateKPI.table.paidBills', 'Facturas Pagadas'),
      accessor: 'paidBills',
      isNumeric: true
    }
  ];

  if (isLoading) return null;

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
        getRowColor={(r) => {
          if (r.collectionRate >= 90) return 'success';
          if (r.collectionRate < 60) return 'error';
          if (r.collectionRate < 85) return 'warning';
          //return 'neutral';
        }}
        emptyState={<EmptyState message="Data not found!" />}
      />
    </div>
  );
};
