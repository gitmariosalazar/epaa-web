import React from 'react';
import '../../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { TrashRateAuditRow } from '../../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

import { ConverDate } from '@/shared/utils/datetime/ConverDate';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';

import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { CheckCircle } from 'lucide-react';
import { IoIosCloseCircle } from 'react-icons/io';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface TrashRateAuditRowProps {
  data: TrashRateAuditRow[];
  isLoading: boolean;
  onSort?: (key: string, directions: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  startDate?: string;
  endDate?: string;
}

export const TrashRateAuditReportTable: React.FC<TrashRateAuditRowProps> = ({
  data,
  isLoading,
  onSort,
  sortConfig,
  startDate,
  endDate
}) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const columns: Column<TrashRateAuditRow>[] = [
    {
      header: t('Cliente'),
      accessor: (item: TrashRateAuditRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar name={item.customerName} size="sm" />
          <div>
            <div style={{ fontWeight: 300 }}>{item.customerName}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('Clave Catastral'),
      accessor: 'cadastralKey'
    },
    {
      header: t('Fecha de Emisión'),
      accessor: (r) => ConverDate(r.issueDate)
    },
    {
      header: t('Fecha de Pago'),
      accessor: (r) => ConverDate(r.paymentDate)
    },
    {
      header: t('Estado de Pago'),
      accessor: (r: TrashRateAuditRow) => {
        const color = getTrafficLightColor(
          r.paymentStatus === 'PAID' ? 100 : 0
        );
        const icon =
          r.paymentStatus === 'PAID' ? <CheckCircle /> : <IoIosCloseCircle />;
        return (
          <ColorChip
            color={color}
            label={r.paymentStatus}
            icon={icon}
            size="sm"
            variant="soft"
          />
        );
      }
    },
    {
      header: t('Tarifa en Ingreso'),
      accessor: (r) => formatCurrency(r.rateInIncome ?? 0),
      isNumeric: true,
      id: 'rateInIncome'
    },
    {
      header: t('Tarifa en Tabla de Valor'),
      accessor: (r) => formatCurrency(r.rateInValorTable ?? 0),
      isNumeric: true,
      id: 'rateInValorTable'
    },
    {
      header: t('Diagnóstico'),
      accessor: 'diagnostic'
    },
    {
      header: t('Diferencia'),
      accessor: (r) => formatCurrency(r.difference ?? 0),
      isNumeric: true,
      id: 'difference'
    },
    {
      header: t('Descuento Aplicado'),
      accessor: (r) => formatCurrency(r.discountApplied ?? 0),
      isNumeric: true,
      id: 'discountApplied'
    },
    {
      header: t('Saldo de Nota de Crédito'),
      accessor: (r) => formatCurrency(r.creditNoteBalance ?? 0),
      isNumeric: true,
      id: 'creditNoteBalance'
    },
    {
      header: t('Recolectado'),
      accessor: (r) =>
        formatCurrency(r.rateInIncome - (r.discountApplied ?? 0)),
      isNumeric: true,
      id: 'effectiveTrashToPay'
    }
  ];

  // Total Tarifa en Ingreso
  const totalRateInIncome = data.reduce(
    (sum, row) => sum + (row.rateInIncome ?? 0),
    0
  );
  // Total Tarifa en Tabla de Valor
  const totalRateInValorTable = data.reduce(
    (sum, row) => sum + (row.rateInValorTable ?? 0),
    0
  );
  // Total Diferencia
  const totalDifference = data.reduce(
    (sum, row) => sum + (row.difference ?? 0),
    0
  );
  // Total Descuento Aplicado
  const totalDiscountApplied = data.reduce(
    (sum, row) => sum + (row.discountApplied ?? 0),
    0
  );
  // Total Saldo de Nota de Crédito
  const totalCreditNoteBalance = data.reduce(
    (sum, row) => sum + (row.creditNoteBalance ?? 0),
    0
  );

  // Total Recolectado
  const totalEffectiveTrashToPay = data.reduce(
    (sum, row) => sum + (row.rateInIncome - (row.discountApplied ?? 0)),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL Tarifa en Ingreso',
      value: totalRateInIncome,
      highlight: false,
      columnId: 'rateInIncome'
    },
    {
      label: 'TOTAL Tarifa en Tabla de Valor',
      value: totalRateInValorTable,
      highlight: false,
      columnId: 'rateInValorTable'
    },
    {
      label: 'TOTAL Diferencia',
      value: totalDifference,
      highlight: false,
      columnId: 'difference'
    },
    {
      label: 'TOTAL',
      value: totalRateInIncome,
      highlight: true
    },
    {
      label: 'TOTAL Descuento Aplicado',
      value: totalDiscountApplied,
      highlight: false,
      columnId: 'discountApplied'
    },
    {
      label: 'TOTAL Saldo de Nota de Crédito',
      value: totalCreditNoteBalance,
      highlight: false,
      columnId: 'creditNoteBalance'
    },
    {
      label: 'TOTAL RECOLECTADO',
      value: totalEffectiveTrashToPay,
      highlight: true,
      columnId: 'effectiveTrashToPay'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<TrashRateAuditRow>({
      data,
      availableColumns: columns.map((c) => ({
        id:
          c.id ||
          (typeof c.accessor === 'string' ? c.accessor : (c.header as string)),
        label: c.header as string,
        isDefault: true
      })),
      reportTitle: 'REPORTE DE AUDITORÍA DE TASAS DE BASURA',
      reportDescription:
        'Auditoría comparativa entre la Tabla de Ingreso y Tabla de Valor.',
      labelsHorizontal: {
        'Rango de Fecha': `${startDate} - ${endDate}`,
        'Fecha de Exportación':
          new Date().toLocaleDateString() +
          ' ' +
          new Date().toLocaleTimeString()
      },
      totalRows,
      mapRowData: (item, selectedCols) => {
        const rowData: Record<string, string> = {
          Cliente: item.customerName || '-',
          'Clave Catastral': item.cadastralKey || '-',
          'Fecha de Emisión': ConverDate(item.issueDate),
          'Fecha de Pago': ConverDate(item.paymentDate),
          'Estado de Pago': item.paymentStatus || '-',
          'Tarifa en Ingreso': formatCurrency(item.rateInIncome ?? 0),
          'Tarifa en Tabla de Valor': formatCurrency(
            item.rateInValorTable ?? 0
          ),
          Diagnóstico: item.diagnostic || '-',
          Diferencia: formatCurrency(item.difference ?? 0),
          'Descuento Aplicado': formatCurrency(item.discountApplied ?? 0),
          'Saldo de Nota de Crédito': formatCurrency(
            item.creditNoteBalance ?? 0
          ),
          Recolectado: formatCurrency(
            item.rateInIncome - (item.discountApplied ?? 0)
          )
        };

        return selectedCols.map((col) => {
          // Find mapped data based on column header because accessor might be a function
          return rowData[col.label] || '-';
        });
      }
    });

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
        onExportPdf={() => setShowPdfPreview(true)}
        sortConfig={sortConfig}
        emptyState={
          <EmptyState
            message={t('common.noResults', 'No se encontraron resultados')}
            icon={IoInformationCircleOutline}
            description={t(
              'common.noResultsDescription',
              'Intenta ajustar los filtros de búsqueda para ver los resultados.'
            )}
            minHeight="300px"
            variant="info"
          />
        }
        totalRows={totalRows}
        getRowColor={(row) => {
          if (row.diagnostic === 'No record in Valor (Ord 10)') {
            return 'error';
          }
          if (row.diagnostic === 'Different Value - Review') {
            return 'warning';
          }
        }}
      />
      {PdfPreviewModal}
    </div>
  );
};
