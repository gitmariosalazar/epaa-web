import { useState, useMemo, type ChangeEvent } from 'react';
import type { DailyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { useTableSort } from '@/shared/presentation/hooks/useTableSort';

interface UseDailyStatsTableProps {
  data: DailyStatsReport[];
}

export const useDailyStatsTable = ({ data }: UseDailyStatsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      (row) =>
        row.date.includes(searchTerm) ||
        row.uniqueSectors.toString().includes(searchTerm)
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
