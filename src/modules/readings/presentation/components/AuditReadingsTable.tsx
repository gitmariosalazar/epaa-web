import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import type { AuditSector } from '../../domain/models/ReadingAudit';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { CheckCircle, Clock } from 'lucide-react';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

interface PropTypes {
  data: AuditSector[];
  isLoading: boolean;
}

/**
 * AuditReadingsTable
 *
 * Displays the monthly reading audit progress per sector.
 * Follows the same structure/style as PendingReadingConnectionTable and siblings.
 * SRP: purely a presentational component — no data-fetching logic.
 */
export const AuditReadingsTable: React.FC<PropTypes> = ({
  data,
  isLoading
}) => {
  const { t } = useTranslation();

  const columns: Column<AuditSector>[] = useMemo(
    () => [
      {
        header: t('readings.audit.sector', 'Sector'),
        accessor: 'sectorId'
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
        header: t('readings.audit.pending', 'Pendientes'),
        accessor: (row) => (
          <span
            style={{
              color: row.pendingTotal > 0 ? 'var(--warning)' : 'var(--success)',
              fontWeight: 600
            }}
          >
            {row.pendingTotal}
          </span>
        )
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
      },
      {
        header: t('readings.audit.supervisor', 'Supervisor'),
        accessor: (row) => row.supervisorId ?? '—'
      }
    ],
    [t]
  );

  return (
    <div className="cr-table-container">
      <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>
        {t('readings.audit.title', 'Auditoría de Lecturas')}
      </h3>
      <Table<AuditSector>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        emptyState={
          <EmptyState
            message={t(
              'readings.audit.noData',
              'No se encontraron registros de auditoría'
            )}
            description={t(
              'readings.audit.noDataDesc',
              'Selecciona un mes y presiona Consultar, o inicializa el período.'
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
