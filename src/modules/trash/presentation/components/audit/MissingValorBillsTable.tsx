import React from 'react';
import '../../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { MissingValorRow } from '../../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { maskString } from '@/shared/presentation/utils/maskString';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { CheckCircle } from 'lucide-react';
import { IoIosCloseCircle } from 'react-icons/io';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';

interface MissingValorBillsTableProps {
  data: MissingValorRow[];
  isLoading: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const MissingValorBillsTable: React.FC<MissingValorBillsTableProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  error,
  startDate,
  endDate
}) => {
  const { t } = useTranslation();

  const fmt = (n: number | null | undefined) =>
    n != null ? `$${Number(n).toFixed(2)}` : '-';

  const columns: Column<MissingValorRow>[] = [
    {
      header: t('trashRateReport.missingValor.incomeCode', 'Cód. Ingreso'),
      accessor: 'incomeCode'
    },
    {
      header: t('trashRateReport.missingValor.cadastralKey', 'Clave Catastral'),
      accessor: 'cadastralKey'
    },
    {
      header: t('trashRateReport.missingValor.customerName', 'Cliente'),
      accessor: (item: MissingValorRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={item.customerName} size="sm" />
          <div>
            <div style={{ fontWeight: 300 }}>
              {maskString(item.customerName)}
            </div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {maskString(item.cardId)}
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('trashRateReport.missingValor.issueDate', 'Fecha Emisión'),
      accessor: 'issueDate'
    },
    {
      header: t('trashRateReport.missingValor.paymentDate', 'Fecha Pago'),
      accessor: (r) => r.paymentDate ?? '-'
    },
    {
      header: t('trashRateReport.missingValor.trashRate', 'Tasa Basura'),
      accessor: (r) => fmt(r.trashRate)
    },
    {
      header: t('trashRateReport.missingValor.paymentStatus', 'Estado'),
      accessor: (item: MissingValorRow) => {
        const color = getTrafficLightColor(
          item.paymentStatus === 'PENDING' ? 0 : 100
        );
        const icon =
          item.paymentStatus === 'PAID' ? (
            <CheckCircle />
          ) : (
            <IoIosCloseCircle />
          );
        return (
          <ColorChip
            color={color}
            label={item.paymentStatus}
            size="sm"
            variant="soft"
            icon={icon}
          />
        );
      }
    },
    {
      header: t('trashRateReport.missingValor.diagnostic', 'Diagnóstico'),
      accessor: 'diagnostic'
    }
  ];

  // Total Tasa de Basura
  const totalTrashRate = data.reduce(
    (sum, row) => sum + (row.trashRate ?? 0),
    0
  );

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<MissingValorRow>({
      data,
      availableColumns: columns.map((c) => ({
        id: typeof c.accessor === 'string' ? c.accessor : (c.header as string),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'FACTURAS FALTANTES EN TABLA DE VALOR',
      reportDescription:
        'Registro de facturas presentes en el sistema de ingresos pero faltantes en la tabla de valor.',
      labelsHorizontal: {
        'Rango de Fecha': `${startDate} - ${endDate}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          'Cód. Ingreso': String(item.incomeCode || '-'),
          'Clave Catastral': item.cadastralKey || '-',
          Cliente: item.customerName || '-',
          'Fecha Emisión': item.issueDate || '-',
          'Fecha Pago': item.paymentDate || '-',
          'Tasa Basura': fmt(item.trashRate),
          Estado: item.paymentStatus || '-',
          Diagnóstico: item.diagnostic || '-'
        };

        return selectedCols.map((col) => {
          // Find mapped data based on column header
          return rowData[col.label] || '-';
        });
      }
    });

  const totalRows = [
    {
      label: 'TOTAL TB',
      value: fmt(totalTrashRate),
      highlight: false
    },
    {
      label: 'TOTAL',
      value: fmt(totalTrashRate),
      highlight: true
    }
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
        onExportPdf={() => setShowPdfPreview(true)}
        sortConfig={sortConfig}
        fullHeight
        emptyState={<EmptyState message="Data not found!" />}
        totalRows={totalRows}
        getRowColor={(row: MissingValorRow) => {
          if (row.paymentStatus === 'PENDING') {
            return 'error';
          }
        }}
      />
      {PdfPreviewModal}
    </div>
  );
};
