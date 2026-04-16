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
import { IoInformationCircleOutline } from 'react-icons/io5';

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

  const getDiagnosisTranslation = (diagnosis: string) => {
    const upper = (diagnosis || '').toUpperCase();
    if (upper.includes('CRITICAL'))
      return t('trashRate.finalDiagnosisCritical', diagnosis);
    if (upper.includes('MISSING') || upper.includes('WARNING'))
      return t('trashRate.finalDiagnosisWarning', diagnosis);
    if (upper.includes('DISCREPANCY'))
      return t('trashRate.finalDiagnosisDiscrepancy', diagnosis);
    return t('trashRate.noAnomalies', 'Sin Anomalías');
  };

  const columns: Column<MissingValorRow>[] = [
    {
      header: t('common.incomeCode', 'Cód. Ingreso'),
      accessor: 'incomeCode',
      id: 'incomeCode'
    },
    {
      header: t('common.dataTitleCode', 'Código Título'),
      accessor: 'dataTitleCode',
      id: 'dataTitleCode'
    },
    {
      header: t('common.cadastralKey', 'Clave Catastral'),
      accessor: 'cadastralKey',
      id: 'cadastralKey'
    },
    {
      header: t('common.customerName', 'Cliente'),
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
      ),
      id: 'customerName'
    },
    {
      header: t('common.issueDate', 'Fecha Emisión'),
      accessor: 'issueDate',
      id: 'issueDate'
    },
    {
      header: t('common.paymentDate', 'Fecha Pago'),
      accessor: (r) => r.paymentDate ?? '-',
      id: 'paymentDate'
    },
    {
      header: t('common.trashRateDt', 'Tasa Basura (T. D.I)'),
      accessor: (r) =>
        r.rateInIncome === null ? (
          <ColorChip
            color="var(--warning)"
            label={t('common.noValue')}
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
      header: t('common.trashRateVal', 'Tasa Basura (T. V)'),
      accessor: (r) =>
        r.rateInValorTable === null ? (
          <ColorChip
            color="var(--warning)"
            label={t('common.noValue')}
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
      header: t('common.integrity', 'Integridad'),
      accessor: (r) =>
        r.integrityGapIndivual === 0 ? (
          <Tooltip
            content={getDiagnosisTranslation(r.finalDiagnosis)}
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
            content={getDiagnosisTranslation(r.finalDiagnosis)}
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
      header: t('common.status', 'Estado'),
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
            label={
              item.paymentStatus === 'PAID'
                ? t('common.paid')
                : t('common.pending')
            }
            size="sm"
            variant="soft"
            icon={icon}
          />
        );
      }
    },
    {
      header: t('common.diagnostic', 'Diagnóstico'),
      accessor: (r) => getDiagnosisTranslation(r.finalDiagnosis)
    }
  ];

  // Totales
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
      label: t('common.integrity'),
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
      reportTitle: t('common.trashRate', 'REPORTE TASA DE BASURA'),
      reportDescription: t('common.dataNotFoundDescription'),
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
          [t('common.incomeCode')]: String(item.incomeCode || '-'),
          [t('common.cadastralKey')]: item.cadastralKey || '-',
          [t('common.dataTitleCode', 'Código Título')]:
            item.dataTitleCode || '-',
          [t('common.customerName')]: item.customerName || '-',
          'ID Cliente': item.cardId || '-',
          [t('common.issueDate')]: item.issueDate || '-',
          [t('common.paymentDate')]: item.paymentDate || '-',
          [t('common.status')]:
            item.paymentStatus === 'PAID'
              ? t('common.paid')
              : t('common.pending'),
          [t('common.diagnostic')]: getDiagnosisTranslation(
            item.finalDiagnosis
          ),
          [t('common.trashRateDt')]: fmt(item.rateInIncome),
          [t('common.trashRateVal')]: fmt(item.rateInValorTable),
          [t('common.integrity')]: fmt(item.integrityGapIndivual)
        };

        return selectedCols.map((col) => {
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
        emptyState={
          <EmptyState
            description={t('common.dataNotFoundDescription')}
            message={t('common.dataNotFound')}
            variant="info"
            icon={<IoInformationCircleOutline size={32} color="var(--info)" />}
          />
        }
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
