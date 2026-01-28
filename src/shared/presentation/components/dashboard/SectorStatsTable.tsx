import { useState } from 'react';
import { Search } from 'lucide-react';
import type { SectorStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';

interface SectorStatsProps {
  data: SectorStatsReport[];
  loading: boolean;
}

export const SectorStatsTable = ({ data, loading }: SectorStatsProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (loading)
    return <div className="text-gray-500">Loading sector stats...</div>;
  if (!data.length)
    return <div className="text-gray-500">No sector data available.</div>;

  const filteredData = data.filter((row) =>
    row.sector.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<SectorStatsReport>[] = [
    {
      header: 'Sector',
      accessor: (row) => (
        <span className="font-medium text-blue">Sector {row.sector}</span>
      )
    },
    {
      header: 'Count',
      accessor: 'readingsCount',
      className: 'text-right'
    },
    {
      header: 'Avg Consumption',
      accessor: (row) => `${Number(row.averageConsumption).toFixed(2)} m³`,
      className: 'text-right'
    },
    {
      header: 'Active Days',
      accessor: 'activeDays',
      className: 'text-right'
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
        <h3>Sector Analysis</h3>
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
            placeholder="Search..."
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
        data={filteredData}
        columns={columns}
        pagination={true}
        pageSize={15}
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
