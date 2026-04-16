import React from 'react';
import '../../styles/PaymentsTable.css';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTranslation } from 'react-i18next';
import type { MissingValorRow } from '../../../domain/models/trash-rate-report.model';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { CheckCircle } from 'lucide-react';
import { IoIosCloseCircle } from 'react-icons/io';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { TiWarningOutline } from 'react-icons/ti';
import { MdOutlineInfo } from 'react-icons/md';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

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
            <div style={{ fontWeight: 300 }}>{item.customerName}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
              {item.cardId}
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
      header: t(
        'trashRateReport.missingValor.trashRate',
        'Tasa Basura (T. D.I)'
      ),
      accessor: (r) =>
        r.rateInIncome === null ? (
          <ColorChip
            color="var(--warning)"
            label="Sin Valor"
            size="sm"
            variant="soft"
            icon={<TiWarningOutline />}
          />
        ) : (
          fmt(r.rateInIncome)
        ),
      id: 'rateInIncome',
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.missingValor.trashRateValor',
        'Tasa Basura (T. V)'
      ),
      accessor: (r) =>
        r.rateInValorTable === null ? (
          <ColorChip
            color="var(--warning)"
            label="Sin Valor"
            size="sm"
            variant="soft"
            icon={<TiWarningOutline />}
          />
        ) : (
          fmt(r.rateInValorTable)
        ),
      id: 'rateInValorTable',
      isNumeric: true
    },
    {
      header: t(
        'trashRateReport.missingValor.integrityGapIndivual',
        'Integridad'
      ),
      accessor: (r) =>
        r.integrityGapIndivual === 0 ? (
          <Tooltip
            content={t(
              'trashRateReport.missingValor.finalDiagnosis',
              `${r.finalDiagnosis}`
            )}
            position="top"
            variant="transparent"
            icon={<MdOutlineInfo scale={25} />}
            themeColor="warning"
          >
            <ColorChip
              color="var(--info)"
              label={`${fmt(r.integrityGapIndivual)}`}
              size="sm"
              variant="soft"
              icon={<MdOutlineInfo />}
            />
          </Tooltip>
        ) : (
          <Tooltip
            content={t(
              'trashRateReport.missingValor.finalDiagnosis',
              `${r.finalDiagnosis}`
            )}
            position="top"
            variant="transparent"
            icon={<TiWarningOutline scale={25} />}
            themeColor="error"
          >
            <ColorChip
              color="var(--error)"
              label={`${fmt(r.integrityGapIndivual)}`}
              size="sm"
              variant="soft"
              icon={<TiWarningOutline />}
            />
          </Tooltip>
        ),
      id: 'integrityGapIndivual',
      isNumeric: true,
      sortable: true
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
      accessor: 'finalDiagnosis'
    }
  ];

  // Total Tasa de Basura
  const totalTrashRateIncome = data.reduce(
    (sum, row) => sum + (row.rateInIncome ?? 0),
    0
  );

  const totalTrashRateValor = data.reduce(
    (sum, row) => sum + (row.rateInValorTable ?? 0),
    0
  );

  const totalRows = [
    {
      label: 'TOTAL TB',
      value: fmt(totalTrashRateIncome),
      highlight: false,
      columnId: 'rateInIncome'
    },
    {
      label: 'TOTAL',
      value: fmt(totalTrashRateValor),
      highlight: false,
      columnId: 'rateInValorTable'
    },
    {
      label: 'Integridad',
      value: fmt(totalTrashRateIncome - totalTrashRateValor),
      highlight: true,
      columnId: 'integrityGapIndivual'
    }
  ];

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<MissingValorRow>({
      data,
      availableColumns: [
        { id: 'cardId', label: 'ID Cliente', isDefault: true },
        ...columns.map((c) => ({
          id:
            c.id ||
            (typeof c.accessor === 'string'
              ? c.accessor
              : (c.header as string)),
          label: c.header as string,
          isDefault: true
        }))
      ],
      reportTitle: 'FACTURAS FALTANTES EN TABLA DE VALOR DE TASA DE BASURA',
      reportDescription:
        'Registro de facturas presentes en el sistema de ingresos pero faltantes en la tabla de valor.',
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
          'Cód. Ingreso': String(item.incomeCode || '-'),
          'Clave Catastral': item.cadastralKey || '-',
          Cliente: item.customerName || '-',
          'ID Cliente': item.cardId || '-',
          'Fecha Emisión': item.issueDate || '-',
          'Fecha Pago': item.paymentDate || '-',
          Estado: item.paymentStatus || '-',
          Diagnóstico: item.finalDiagnosis || '-',
          'Tasa Basura (T. D.I)': fmt(item.rateInIncome),
          'Tasa Basura (T. V)': fmt(item.rateInValorTable),
          Integridad: fmt(item.integrityGapIndivual)
        };

        return selectedCols.map((col) => {
          // Find mapped data based on column header
          return rowData[col.label] || '-';
        });
      }
    });

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
