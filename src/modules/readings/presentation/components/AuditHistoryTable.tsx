import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { AuditSectorHistory } from '../../domain/models/ReadingAudit';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { CheckCircle, Clock } from 'lucide-react';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

interface PropTypes {
  data: AuditSectorHistory[];
  isLoading: boolean;
}

/**
 * AuditHistoryTable
 *
 * Displays the reading audit history for a sector across multiple months.
 * SRP: purely presentational — no fetching logic.
 */
export const AuditHistoryTable: React.FC<PropTypes> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  const columns: Column<AuditSectorHistory>[] = useMemo(
    () => [
      {
        header: t('readings.audit.sector', 'Sector'),
        accessor: 'sectorId'
      },
      {
        header: t('readings.audit.month', 'Mes'),
        accessor: (row) =>
          row.readingMonth
            ? dateService.formatToLocaleString(row.readingMonth)
            : '—'
      },
      {
        header: t('readings.audit.expected', 'Esperadas'),
        accessor: 'expectedTotal'
      },
      {
        header: t('readings.audit.completed', 'Completadas'),
        accessor: 'completedTotal'
      },
      {
        header: t('readings.audit.progress', 'Avance'),
        accessor: (row) => {
          const pct = Number(row.progressPercentage ?? 0);
          const color =
            pct >= 100 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--surface-hover)',
                  overflow: 'hidden',
                  minWidth: 80
                }}
              >
                <div
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    height: '100%',
                    background: color,
                    borderRadius: 999,
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <span
                style={{
                  color,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  minWidth: 44
                }}
              >
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        }
      },
      {
        header: t('readings.audit.status', 'Estado'),
        accessor: (row) => (
          <ColorChip
            label={
              row.isComplete
                ? t('readings.audit.complete', 'Completado')
                : t('readings.audit.inProgress', 'En progreso')
            }
            color={row.isComplete ? '#22c55e' : '#f59e0b'}
            icon={
              row.isComplete ? <CheckCircle size={13} /> : <Clock size={13} />
            }
            variant="soft"
            size="sm"
          />
        )
      },
      {
        header: t('readings.audit.closureDate', 'Cierre'),
        accessor: (row) =>
          row.closureDate
            ? dateService.formatToLocaleString(row.closureDate)
            : '—'
      }
    ],
    [t]
  );

  return (
    <div className="cr-table-container">
      <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>
        {t('readings.audit.historyTitle', 'Historial de Auditoría por Sector')}
      </h3>
      <Table<AuditSectorHistory>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        emptyState={
          <EmptyState
            message={t(
              'readings.audit.noHistory',
              'No se encontró historial para este sector'
            )}
            description={t(
              'readings.audit.noHistoryDesc',
              'Ingresa un número de sector y presiona Consultar.'
            )}
            icon={IoInformationCircleOutline}
            minHeight="300px"
            variant="info"
          />
        }
      />
    </div>
  );
};
