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
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';

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
        accessor: (row) => (
          <ProgressBar
            value={row.progressPercentage}
            color={getTrafficLightColor(row.progressPercentage)}
            height="8px"
            widthSize="lg"
          />
        )
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
        header: t('readings.audit.createdAt', 'Inicio de ciclo'),
        accessor: (row) =>
          row.createdAt
            ? dateService.formatToDateTimeString(row.createdAt)
            : '—'
      },
      {
        header: t('readings.audit.closureDate', 'Fecha de cierre'),
        accessor: (row) =>
          row.closureDate
            ? dateService.formatToDateTimeString(row.closureDate)
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
