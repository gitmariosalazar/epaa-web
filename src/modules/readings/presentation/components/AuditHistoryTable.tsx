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
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';

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
          row.readingMonth ? dateService.getMonthString(row.readingMonth) : '—'
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
          return (
            <ProgressBar
              value={row.progressPercentage}
              color={getTrafficLightColor(row.progressPercentage)}
              height="8px"
              widthSize="lg"
            />
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
        header: t('readings.audit.createdAt', 'Inicio de ciclo'),
        accessor: (row) =>
          row.createdAt
            ? dateService.formatToDateTimeString(row.createdAt)
            : '—'
      },
      {
        header: t('readings.audit.closureDate', 'Fecha cierre'),
        accessor: (row) =>
          row.closureDate
            ? dateService.formatToDateTimeString(row.closureDate)
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
