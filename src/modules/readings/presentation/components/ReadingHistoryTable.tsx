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
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { IoInformationCircleOutline, IoSpeedometer, IoTimeOutline } from 'react-icons/io5';
import '../styles/ReadingReportsFilters.css';
import { MdCable } from 'react-icons/md';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

interface PropTypes {
  history: ReadingHistory[];
  connectionInfo: {
    cadastralKey: string;
    meterNumber: string;
  }
  isLoading: boolean;
}

export const ReadingHistoryTable: React.FC<PropTypes> = ({
  history,
  connectionInfo,
  isLoading
}) => {
  const { t } = useTranslation();

  const columns: Column<ReadingHistory>[] = useMemo(
    () => [
      {
        header: t('readings.historyTable.readingId', 'Id'),
        accessor: 'readingId'
      },
      {
        header: t('readings.historyTable.monthYear'),
        accessor: (row) => `${row.readingYear} - ${row.readingMonth}`
      },
      {
        header: t('readings.historyTable.readingDate'),
        accessor: (row) => dateService.formatToLocaleString(row.readingDate)
      },
      {
        header: t('readings.historyTable.readingTime'),
        accessor: (row) => (
          <ColorChip
            label={dateService.formatToLocaleString(row.readingDate, {
              timeStyle: 'medium'
            })}
            color="var(--secondary)"
            size="xs"
            variant="outline"
            borderRadius="5px"
            icon={<IoTimeOutline />}
          />
        )
      },
      {
        header: t('readings.historyTable.prevReading'),
        accessor: (row: ReadingHistory) => {
          const color: string = getNoveltyColor(row.observation);
          return (
            <span
              style={{
                fontWeight: 600,
                color: color
              }}
            >
              {`${row.previousReading ?? 'N/A'}`}
            </span>
          );
        }
      },
      {
        header: t('readings.historyTable.currReading'),
        accessor: (row: ReadingHistory) => {
          const color: string = getNoveltyColor(row.observation);
          return (
            <span
              style={{
                fontWeight: 600,
                color: color
              }}
            >
              {`${row.currentReading ?? 'N/A'}`}
            </span>
          );
        }
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
              {`${row.consumption ?? 'N/A'} m³`}
            </span>
          );
        }
      },
      {
        header: t('readings.historyTable.readingValue', 'Valor'),
        accessor: (row) => {
          const color: string = getNoveltyColor(row.observation);
          return (
            <span
              style={{
                fontWeight: 600,
                color: color
              }}
            >
              {`$ ${row.readingValue ?? 'N/A'}`}
            </span>
          );
        }
      },
      {
        header: t('readings.historyTable.observation'),
        accessor: (row) => {
          const color: string = getNoveltyColor(row.observation);
          return row.observation ? (
            row.observation ? (
              <ColorChip
                color={color}
                label={row.observation}
                size="xs"
                variant="outline"
              />
            ) : (
              <ColorChip
                color={'red'}
                label="Indeterminado"
                size="xs"
                variant="outline"
              />
            )
          ) : (
            <ColorChip
              color={'red'}
              label="Indeterminado"
              size="xs"
              variant="outline"
            />
          );
        }
      }
    ],
    [t]
  );

  return (
    <div className="cr-table-container">
      <div className="cr-history-header">
        <h3>
          {t('readings.historyTable.title')}
        </h3>
        <div className="cr-history-header-info">
          <Tooltip content={'Clave Catastral'} followCursor={false}
            themeColor="yellow"
          >
            <ColorChip
              label={connectionInfo.cadastralKey}
              size="xs"
              variant="outline"
              color="yellow"
              icon={<MdCable />}
              borderRadius={8}
            />
          </Tooltip>
          <Tooltip content='Numero de Medidor' followCursor={false}
            themeColor="orange"
          >
            <ColorChip
              label={connectionInfo.meterNumber}
              size="xs"
              variant="outline"
              color="orange"
              icon={<IoSpeedometer />}
              borderRadius={8}
            />
          </Tooltip>
        </div>
      </div>
      <Table<ReadingHistory>
        data={history}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={5}
        emptyState={
          <EmptyState
            message="No se encontraron lecturas"
            description="Intenta ajustar los filtros de búsqueda para ver los resultados."
            icon={IoInformationCircleOutline}
            variant="info"
          />
        }
      />
    </div>
  );
};
