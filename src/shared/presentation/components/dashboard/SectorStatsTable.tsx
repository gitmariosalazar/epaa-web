import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SectorStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTableSort } from '@/shared/presentation/hooks/useTableSort';

interface SectorStatsProps {
  data: SectorStatsReport[];
  loading: boolean;
}

export const SectorStatsTable = ({ data, loading }: SectorStatsProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.sector.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const { sortedData, sortConfig, requestSort } = useTableSort(filteredData);

  if (loading)
    return (
      <div className="text-gray-500">{t('dashboard.sectorStats.loading')}</div>
    );
  if (!data.length)
    return (
      <div className="text-gray-500">{t('dashboard.sectorStats.empty')}</div>
    );

  const columns: Column<SectorStatsReport>[] = [
    {
      header: t('dashboard.sectorStats.columns.sector'),
      accessor: (row) => (
        <span className="font-medium text-blue">
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
              color: '#9ca3af'
            }}
          />
          <input
            type="text"
            placeholder={t('dashboard.sectorStats.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
