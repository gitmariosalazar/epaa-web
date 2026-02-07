import { useState, useMemo, type ChangeEvent } from 'react';
import type { SectorStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { useTableSort } from '@/shared/presentation/hooks/useTableSort';

interface UseSectorStatsTableProps {
  data: SectorStatsReport[];
}

export const useSectorStatsTable = ({ data }: UseSectorStatsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.sector.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const { sortedData, sortConfig, requestSort } = useTableSort(filteredData);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    searchTerm,
    sortedData,
    sortConfig,
    requestSort,
    handleSearchChange
  };
};
