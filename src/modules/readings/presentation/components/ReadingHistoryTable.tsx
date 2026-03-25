import React, { useMemo } from 'react';
import type { ReadingHistory } from '../../domain/models/ReadingHistory';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

interface PropTypes {
  history: ReadingHistory[];
  isLoading: boolean;
}

export const ReadingHistoryTable: React.FC<PropTypes> = ({
  history,
  isLoading
}) => {
  const { t } = useTranslation();

  const columns: Column<ReadingHistory>[] = useMemo(
    () => [
      {
        header: t('readings.historyTable.readingId'),
        accessor: 'readingId'
      },
      {
        header: t('readings.historyTable.monthYear'),
        accessor: (row) => `${row.readingMonth} / ${row.readingYear}`
      },
      {
        header: t('readings.historyTable.readingDate'),
        accessor: (row) => dateService.formatToLocaleString(row.readingDate)
      },
      {
        header: t('readings.historyTable.readingTime'),
        accessor: (row) =>
          dateService.formatToLocaleString(row.readingDate, {
            timeStyle: 'medium'
          })
      },
      {
        header: t('readings.historyTable.prevReading'),
        accessor: 'previousReading'
      },
      {
        header: t('readings.historyTable.currReading'),
        accessor: 'currentReading'
      },
      {
        header: t('readings.historyTable.consumption'),
        accessor: (row) => {
          const color: string = getNoveltyColor(row.observation);
          return (
            <span
              style={{
                fontWeight: 600,
                color: color
              }}
            >
              {row.consumption}
            </span>
          );
        }
      },
      {
        header: t('readings.historyTable.observation'),
        accessor: (row) => {
          const color: string = getNoveltyColor(row.observation);
          return (
            <ColorChip
              color={color}
              label={row.observation}
              size="sm"
              variant="soft"
            />
          );
        }
      }
    ],
    [t]
  );

  return (
    <div className="cr-table-container">
      <h3 style={{ marginBottom: '5px', color: 'var(--text-primary)' }}>
        {t('readings.historyTable.title')}
      </h3>
      <Table<ReadingHistory>
        data={history}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={7}
      />
    </div>
  );
};
