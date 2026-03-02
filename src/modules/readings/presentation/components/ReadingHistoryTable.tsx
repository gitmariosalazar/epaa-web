import React, { useMemo } from 'react';
import type { ReadingHistory } from '../../domain/models/ReadingHistory';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';

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
        accessor: (row) => (
          <span
            style={{
              fontWeight: 600,
              color:
                row.consumption > 20
                  ? 'var(--error, #e74c3c)'
                  : 'var(--success, #2ecc71)'
            }}
          >
            {row.consumption}
          </span>
        )
      },
      {
        header: t('readings.historyTable.observation'),
        accessor: (row) => row.observation || t('readings.historyTable.none')
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
