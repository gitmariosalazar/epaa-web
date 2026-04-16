import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DailyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useDailyStatsTable } from '@/shared/presentation/hooks/dashboard/useDailyStatsTable';
import { EmptyState } from '../common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { CircularProgress } from '../CircularProgress';

interface DailyStatsProps {
  data: DailyStatsReport[];
  loading: boolean;
}

export const DailyStatsTable = ({ data, loading }: DailyStatsProps) => {
  const { t } = useTranslation();
  const {
    searchTerm,
    sortedData,
    sortConfig,
    requestSort,
    handleSearchChange
  } = useDailyStatsTable({ data });

  if (loading)
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        <CircularProgress
          size={110}
          strokeWidth={6}
          label={t('dashboard.dailyStats.loading')}
        />
      </div>
    );
  if (!data.length)
    return (
      <EmptyState
        message={t('common.noData', 'No se encontraron datos')}
        description={t('dashboard.dailyStats.noData', 'No hay registros diarios para este periodo')}
        variant="info"
      />
    );

  const columns: Column<DailyStatsReport>[] = [
    {
      header: t('dashboard.dailyStats.columns.date'),
      accessor: (row) => (
        <span className="font-medium">
          {dateService.formatToLocaleString(row.date, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      ),
      sortable: true,
      sortKey: 'date'
    },
    {
      header: t('dashboard.dailyStats.columns.readings'),
      accessor: 'readingsCount',
      sortable: true,
      sortKey: 'readingsCount'
    },
    {
      header: t('dashboard.dailyStats.columns.avgValue'),
      accessor: (row) => `$${Number(row.averageReadingValue).toFixed(2)}`,
      sortable: true,
      sortKey: 'averageReadingValue'
    },
    {
      header: t('dashboard.dailyStats.columns.avgConsumption'),
      accessor: (row) => `${Number(row.averageConsumption).toFixed(2)} m³`,
      sortable: true,
      sortKey: 'averageConsumption'
    },
    {
      header: t('dashboard.dailyStats.columns.sectors'),
      accessor: 'uniqueSectors',
      sortable: true,
      sortKey: 'uniqueSectors'
    }
  ];

  const totalReadings = sortedData.reduce(
    (total, row) => total + Number(row.readingsCount || 0),
    0
  );

  // Count distinct values
  const totalUniqueSectors = new Set(sortedData.map((row) => row.uniqueSectors))
    .size;

  const totalAverageReadingValue = sortedData.reduce(
    (total, row) => total + Number(row.averageReadingValue || 0),
    0
  );

  const totalAverageConsumption = sortedData.reduce(
    (total, row) => total + Number(row.averageConsumption || 0),
    0
  );

  const totalRows = [
    {
      label: t('dashboard.dailyStats.totals.readings'),
      value: totalReadings
    },
    {
      label: t('dashboard.dailyStats.totals.sectors'),
      value: totalUniqueSectors
    },
    {
      label: t('dashboard.dailyStats.totals.avgValue'),
      value: `$${totalAverageReadingValue.toFixed(2)}`
    },
    {
      label: t('dashboard.dailyStats.totals.avgConsumption'),
      value: `${totalAverageConsumption.toFixed(2)} m³`
    }
  ];

  return (
    <div
      className="content-card"
      style={{
        height: '100%', // Fill parent height
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1rem'
      }}
    >
      <div
        className="card-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0 // Prevent header shrinking
        }}
      >
        <h3>{t('dashboard.dailyStats.title')}</h3>
        <div style={{ position: 'relative', maxWidth: '200px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }}
          />
          <input
            type="text"
            placeholder={t('dashboard.dailyStats.searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: '6px 8px 6px 30px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '0.875rem',
              outline: 'none',
              width: '100%',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-main)'
            }}
          />
        </div>
      </div>
      <Table
        data={sortedData}
        columns={columns}
        pagination={true}
        pageSize={15}
        sortConfig={sortConfig}
        onSort={requestSort}
        totalRows={totalRows}
        containerStyle={{
          flex: 1, // Grow to fill remaining space
          maxHeight: 'none', // Override sticky limitation if needed or keep standard
          overflowY: 'auto',
          borderRadius: '0 0 0.75rem 0.75rem' // Match card radius
        }}
        emptyState={
          <EmptyState
            message={t('common.noResults', 'No se encontraron resultados')}
            icon={IoInformationCircleOutline}
            description={t(
              'common.noResultsDescription',
              'Intenta ajustar los filtros de búsqueda para ver los resultados.'
            )}
            minHeight="300px"
            variant="info"
          />
        }
      />
    </div>
  );
};
