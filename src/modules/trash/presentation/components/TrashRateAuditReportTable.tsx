import React from 'react';
import '../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { TrashRateAuditRow } from '../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

import { ConverDate } from '@/shared/presentation/utils/datetime/ConverDate';

interface TrashRateAuditRowProps {
  data: TrashRateAuditRow[];
  isLoading: boolean;
  onSort?: (key: string, directions: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  error: Error | null;
  onExportPdf?: () => void;
}

export const TrashRateAuditReportTable: React.FC<TrashRateAuditRowProps> = ({
  data,
  isLoading,
  onSort,
  onExportPdf,
  sortConfig
}) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const columns: Column<TrashRateAuditRow>[] = [
    {
      header: t('Nombre del Cliente'),
      accessor: 'customerName'
    },
    {
      header: t('Nº de Tarjeta'),
      accessor: 'cardId'
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
      accessor: 'paymentStatus'
    },
    {
      header: t('Tarifa en Ingreso'),
      accessor: (r) => formatCurrency(r.rateInIncome ?? 0),
      isNumeric: true
    },
    {
      header: t('Tarifa en Tabla de Valor'),
      accessor: (r) => formatCurrency(r.rateInValorTable ?? 0),
      isNumeric: true
    },
    {
      header: t('Diagnóstico'),
      accessor: 'diagnostic'
    },
    {
      header: t('Diferencia'),
      accessor: (r) => formatCurrency(r.difference ?? 0),
      isNumeric: true
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

  const totalRows = [
    {
      label: 'TOTAL Tabla Ingreso',
      value: totalRateInIncome,
      highlight: false
    },
    {
      label: 'TOTAL Tabla Valor',
      value: totalRateInValorTable,
      highlight: false
    },
    {
      label: 'TOTAL DIFERENCIA',
      value: totalDifference,
      highlight: false
    },
    {
      label: 'TOTAL',
      value: totalRateInIncome,
      highlight: true
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
        emptyState={<EmptyState message={`Data not found!`} />}
        totalRows={totalRows}
      />
    </div>
  );
};
