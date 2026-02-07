import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { DailyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useTableSort } from '@/shared/presentation/hooks/useTableSort';

interface DailyStatsProps {
  data: DailyStatsReport[];
  loading: boolean;
}

export const DailyStatsTable = ({ data, loading }: DailyStatsProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      (row) =>
        row.date.includes(searchTerm) ||
        row.uniqueSectors.toString().includes(searchTerm)
    );
  }, [data, searchTerm]);

  const { sortedData, sortConfig, requestSort } = useTableSort(filteredData);

  if (loading)
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        Loading daily stats...
      </div>
    );
  if (!data.length)
    return (
      <div style={{ color: 'var(--text-secondary)' }}>
        No daily data available.
      </div>
    );

  const columns: Column<DailyStatsReport>[] = [
    {
      header: 'Date',
      accessor: (row) => (
        <span className="font-medium">
          {new Date(row.date).toLocaleDateString('es-ES', {
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
      header: 'Readings',
      accessor: 'readingsCount',
      sortable: true,
      sortKey: 'readingsCount'
    },
    {
      header: 'Avg Value',
      accessor: (row) => `$${Number(row.averageReadingValue).toFixed(2)}`,
      sortable: true,
      sortKey: 'averageReadingValue'
    },
    {
      header: 'Consumption (Avg)',
      accessor: (row) => `${Number(row.averageConsumption).toFixed(2)} m³`,
      sortable: true,
      sortKey: 'averageConsumption'
    },
    {
      header: 'Sectors',
      accessor: 'uniqueSectors',
      sortable: true,
      sortKey: 'uniqueSectors'
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
        <h3>Daily Performance</h3>
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
            placeholder="Search date..."
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
        data={sortedData}
        columns={columns}
        pagination={true}
        pageSize={15}
        sortConfig={sortConfig}
        onSort={requestSort}
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
