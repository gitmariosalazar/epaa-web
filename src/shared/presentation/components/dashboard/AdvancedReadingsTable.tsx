import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { Table, type Column } from '../Table/Table';
import { getTrafficLightColor } from '../../utils/colors/traffic-lights.colors';

interface AdvancedReadingsTableProps {
  data: AdvancedReportReadings[];
  loading: boolean;
}

export const AdvancedReadingsTable = ({
  data,
  loading
}: AdvancedReadingsTableProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading)
    return (
      <div className="text-gray-500">
        {t('dashboard.advancedReadings.loading')}
      </div>
    );
  if (!data.length)
    return (
      <div className="text-gray-500">
        {t('dashboard.advancedReadings.empty')}
      </div>
    );

  const filteredData = data.filter((item) =>
    item.sector.toString().includes(searchTerm)
  );

  const columns: Column<AdvancedReportReadings>[] = [
    {
      header: t('dashboard.advancedReadings.columns.sector'),
      accessor: (row) => (
        <span className="font-medium text-blue">{row.sector}</span>
      )
    },
    {
      header: t('dashboard.advancedReadings.columns.totalConnections'),
      accessor: (row) => (
        <span className="font-medium text-gray-900">
          {row.totalConnections}
        </span>
      )
    },
    {
      header: t('dashboard.advancedReadings.columns.readingsCompleted'),
      accessor: (row) => (
        <span className="font-medium text-gray-900">
          {row.readingsCompleted}
        </span>
      )
    },
    {
      header: t('dashboard.advancedReadings.columns.missingReadings'),
      accessor: (row) => (
        <span className="font-medium text-gray-900">{row.missingReadings}</span>
      )
    },
    {
      header: t('dashboard.advancedReadings.columns.progress'),
      accessor: (row) => (
        <ProgressBar
          value={row.progressPercentage}
          color={getTrafficLightColor(row.progressPercentage)}
          height="8px"
        />
      ),
      className: 'w-48' // Give it some width
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
          flexShrink: 0 // Prevent header shrinking
        }}
      >
        <h3>{t('dashboard.advancedReadings.title')}</h3>
        <div style={{ position: 'relative', maxWidth: '200px' }}>
          <Search
            size={16}
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
            placeholder={t('dashboard.advancedReadings.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        data={filteredData}
        columns={columns}
        pagination={true}
        pageSize={15}
        containerStyle={{
          flex: 1, // Grow to fill remaining space
          maxHeight: 'none', // Override sticky limitation if needed or keep standard
          overflowY: 'auto',
          borderRadius: '0 0 0.75rem 0.75rem' // Match card radius
        }}
      />
    </div>
  );
};
