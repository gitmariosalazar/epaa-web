import { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import {
  useTableSort,
  type SortDirection
} from '@/shared/presentation/hooks/useTableSort';

interface UseSectorProgressStatsProps {
  data: AdvancedReportReadings[];
  itemsPerPage?: number;
}

export const useSectorProgressStats = ({
  data,
  itemsPerPage = 10
}: UseSectorProgressStatsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filter Data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.sector > 0 &&
        item.sector.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // 2. Sort Data
  const { sortedData, requestSort, sortConfig } = useTableSort(filteredData);

  // 3. Pagination Logic
  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // 4. Event Handlers
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    // Format: "key-direction"
    const [key, direction] = value.split('-');
    requestSort(key, direction as SortDirection);
  };

  return {
    // State
    searchTerm,
    currentPage,
    totalPages,
    currentData,
    sortConfig,

    // Handlers
    handleSearchChange,
    handleSortChange,
    goToNextPage,
    goToPrevPage,

    // Raw filtered count if needed
    totalItems: sortedData.length
  };
};
