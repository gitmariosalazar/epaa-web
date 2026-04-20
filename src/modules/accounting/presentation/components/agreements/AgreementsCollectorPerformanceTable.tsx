import React from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { CollectorPerformance } from '../../../domain/models/Agreements';
import '../../styles/payments/PaymentsTable.css';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { User } from 'lucide-react';

interface AgreementsCollectorPerformanceTableProps {
  data: CollectorPerformance[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  startDate?: string;
  endDate?: string;
}

export const AgreementsCollectorPerformanceTable: React.FC<
  AgreementsCollectorPerformanceTableProps
> = ({ data, isLoading, onSort, sortConfig, startDate, endDate }) => {
  const columns: Column<CollectorPerformance>[] = [
    {
      header: 'Recaudador',
      accessor: (item) => (
        <div
          className="cr-client-badge"
          style={{
            maxWidth: '250px',
            borderRadius: '50px',
            backgroundColor: 'transparent'
          }}
        >
          <User size={16} />
          <span className="cr-client-name">{item.collector}</span>
        </div>
      ),
      sortable: true,
      id: 'collector'
    },
    {
      header: 'Total Pagos',
      accessor: 'totalPayments',
      sortable: true,
      isNumeric: true,
      id: 'totalPayments'
    },
    {
      header: 'Total Recaudado',
      accessor: (item) => CurrencyFormatter.format(item.totalCollected),
      sortKey: 'totalCollected',
      sortable: true,
      isNumeric: true,
      id: 'totalCollected'
    },
    {
      header: 'Eficiencia',
      accessor: (item) => (
        <ProgressBar
          value={item.performancePct}
          color={getTrafficLightColor(item.performancePct)}
        />
      ),
      sortKey: 'performancePct',
      sortable: true,
      isNumeric: true,
      id: 'performancePct'
    }
  ];

  const totalCollected = data.reduce(
    (sum, item) => sum + (item.totalCollected || 0),
    0
  );
  const totalPayments = data.reduce(
    (sum, item) => sum + (item.totalPayments || 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL RECAUDADO',
      value: CurrencyFormatter.format(totalCollected),
      highlight: true,
      columnId: 'totalCollected'
    },
    {
      label: 'TOTAL PAGOS',
      value: totalPayments,
      highlight: false,
      columnId: 'totalPayments'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<CollectorPerformance>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE DESEMPEÑO DE RECAUDADORES',
      reportDescription:
        'Detalle de eficiencia y montos recaudados por cada agente',
      labelsHorizontal: {
        Rango: `${startDate || '-'} - ${endDate || '-'}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          Recaudador: item.collector,
          'Total Pagos': String(item.totalPayments),
          'Total Recaudado': CurrencyFormatter.format(item.totalCollected),
          Eficiencia: `${item.performancePct.toFixed(2)}%`
        };
        return selectedCols.map((col) => rowData[col.label] || '-');
      }
    });

  return (
    <div className="payments-table-wrapper">
      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={20}
        onSort={onSort}
        sortConfig={sortConfig}
        onExportPdf={() => setShowPdfPreview(true)}
        totalRows={totalRows}
        emptyState={
          <EmptyState
            message="No se encontraron registros"
            description="No hay datos de desempeño para el rango seleccionado."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
