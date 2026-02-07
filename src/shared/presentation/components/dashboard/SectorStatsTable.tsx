import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import type { SectorStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useSectorStatsTable } from '@/shared/presentation/hooks/dashboard/useSectorStatsTable';

interface SectorStatsProps {
  data: SectorStatsReport[];
  loading: boolean;
}

export const SectorStatsTable = ({ data, loading }: SectorStatsProps) => {
  const { t } = useTranslation();

  const {
    searchTerm,
    sortedData,
    sortConfig,
    requestSort,
    handleSearchChange
  } = useSectorStatsTable({ data });

  if (loading)
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        {t('dashboard.sectorStats.loading')}
      </div>
    );
  if (!data.length)
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        {t('dashboard.sectorStats.empty')}
      </div>
    );

  const columns: Column<SectorStatsReport>[] = [
    {
      header: t('dashboard.sectorStats.columns.sector'),
      accessor: (row) => (
        <span className="font-medium" style={{ color: 'var(--primary)' }}>
          {t('dashboard.sectorStats.columns.sector')} {row.sector}
        </span>
      ),
      sortable: true,
      sortKey: 'sector'
    },
    {
      header: t('dashboard.sectorStats.columns.count'),
      accessor: 'readingsCount',
      className: 'text-right',
      sortable: true,
      sortKey: 'readingsCount'
    },
    {
      header: t('dashboard.sectorStats.columns.avgConsumption'),
      accessor: (row) => `${Number(row.averageConsumption).toFixed(2)} m³`,
      className: 'text-right',
      sortable: true,
      sortKey: 'averageConsumption'
    },
    {
      header: t('dashboard.sectorStats.columns.activeDays'),
      accessor: 'activeDays',
      className: 'text-right',
      sortable: true,
      sortKey: 'activeDays'
    }
  ];

  return (
    <div
      className="content-card"
      style={{
        height: '100%', // Fill parent height
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="card-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        <h3>{t('dashboard.sectorStats.title')}</h3>
        <div style={{ position: 'relative', maxWidth: '150px' }}>
          <Search
            size={14}
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
            placeholder={t('dashboard.sectorStats.searchPlaceholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: '4px 8px 4px 26px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '0.8rem',
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
        containerStyle={{
          flex: 1,
          maxHeight: 'none',
          overflowY: 'auto',
          borderRadius: '0 0 0.75rem 0.75rem'
        }}
      />
    </div>
  );
};
