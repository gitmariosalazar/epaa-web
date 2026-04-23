import React from 'react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { CurrencyFormatter } from '@/shared/utils/formatters/CurrencyFormatter';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { Debtor } from '../../../domain/models/Agreements';
import '../../styles/payments/PaymentsTable.css';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

interface AgreementsDebtorsTableProps {
  data: Debtor[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
}

export const AgreementsDebtorsTable: React.FC<AgreementsDebtorsTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig
}) => {
  const columns: Column<Debtor>[] = [
    { header: 'Cédula/RUC', accessor: 'cardId', sortable: true, id: 'cardId' },
    {
      header: 'Nombre Completo',
      accessor: 'fullName',
      sortable: true,
      id: 'fullName'
    },
    {
      header: 'Clave Catastral',
      accessor: 'cadastralKey',
      sortable: true,
      id: 'cadastralKey'
    },
    {
      header: 'Cuotas Vencidas',
      accessor: 'overdueInstallments',
      sortable: true,
      isNumeric: true,
      id: 'overdueInstallments'
    },
    {
      header: 'Deuda Total',
      accessor: (item) => CurrencyFormatter.format(item.totalDebt),
      sortKey: 'totalDebt',
      sortable: true,
      isNumeric: true,
      id: 'totalDebt'
    },
    {
      header: 'Nivel de Riesgo',
      accessor: (item) => (
        <ColorChip
          color={getRiskColor(item.riskLevel)}
          label={item.riskLevel}
          variant="soft"
          size="sm"
        />
      ),
      sortKey: 'riskLevel',
      sortable: true,
      id: 'riskLevel'
    }
  ];

  const getRiskColor = (riskLevel: string): string => {
    if (riskLevel.toLowerCase().includes('bajo')) return 'green';
    if (riskLevel.toLowerCase().includes('moderado')) return 'orange';
    if (
      riskLevel.toLowerCase().includes('critico') ||
      riskLevel.toLocaleLowerCase().includes('tico')
    )
      return 'red';
    if (riskLevel.toLowerCase().includes('alto')) return 'red';
    return 'gray';
  };

  const totalDebt = data.reduce((sum, item) => sum + (item.totalDebt || 0), 0);
  const totalOverdue = data.reduce(
    (sum, item) => sum + (item.overdueInstallments || 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL DEUDA',
      value: CurrencyFormatter.format(totalDebt),
      highlight: true,
      columnId: 'totalDebt'
    },
    {
      label: 'TOTAL CUOTAS VENCIDAS',
      value: totalOverdue,
      highlight: false,
      columnId: 'overdueInstallments'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport<Debtor>({
    data,
    availableColumns: columns.map((c) => ({
      id:
        c.id ||
        (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
      label: c.header as string,
      isDefault: true
    })),
    reportTitle: 'REPORTE DE DEUDORES CON RIESGO',
    reportDescription:
      'Listado detallado de ciudadanos con cuotas de convenios vencidas y nivel de riesgo',
    labelsHorizontal: {
      'Fecha de Exportación':
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows,
    mapRowData: (item, selectedCols) => {
      const rowData: Record<string, string> = {
        'Cédula/RUC': item.cardId,
        'Nombre Completo': item.fullName,
        'Clave Catastral': item.cadastralKey,
        'Cuotas Vencidas': String(item.overdueInstallments),
        'Deuda Total': CurrencyFormatter.format(item.totalDebt),
        'Nivel de Riesgo': item.riskLevel
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
            message="No se encontraron deudores"
            description="No hay deudores de riesgo registrados."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
