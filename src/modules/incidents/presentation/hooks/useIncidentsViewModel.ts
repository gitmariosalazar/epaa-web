import { useState, useMemo, useCallback, useEffect } from 'react';
import { useIncidentContext } from '../context/IncidentContext';
import type { IncidentResponse } from '../../domain/schemas/dtos/response/incident.response';

export type IncidentSortKey = 'fecha_desc' | 'fecha_asc' | 'status' | 'priority' | 'connection';

export interface IncidentsFilterState {
  search: string;
  status: string;
  priority: string;
  incidentTypeId: string;
}

const sortFn = (a: IncidentResponse, b: IncidentResponse, key: IncidentSortKey): number => {
  switch (key) {
    case 'fecha_desc':
      return new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime();
    case 'fecha_asc':
      return new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime();
    case 'status':
      return a.status.localeCompare(b.status);
    case 'priority':
      return a.priority.localeCompare(b.priority);
    case 'connection':
      return (a.connectionId ?? '').localeCompare(b.connectionId ?? '');
    default:
      return 0;
  }
};

export const useIncidentsViewModel = () => {
  const {
    incidents,
    categories,
    isLoading,
    error,
    loadIncidents,
    createIncident,
    resolveIncident,
    refresh
  } = useIncidentContext();

  const [filters, setFilters] = useState<IncidentsFilterState>({
    search: '',
    status: '',
    priority: '',
    incidentTypeId: ''
  });

  const [sortBy, setSortBy] = useState<IncidentSortKey>('fecha_desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const handleFilterChange = useCallback((updates: Partial<IncidentsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  }, []);

  // Safe side effect to load incidents whenever filters update
  useEffect(() => {
    loadIncidents({
      status: filters.status || null,
      priority: filters.priority || null,
      incidentTypeId: filters.incidentTypeId ? Number(filters.incidentTypeId) : null,
      connectionId: filters.search.includes('-') ? filters.search : null
    });
  }, [filters, loadIncidents]);

  const handleSortChange = useCallback((key: IncidentSortKey) => {
    setSortBy(key);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  // Client-side text search filter
  const filteredSorted = useMemo(() => {
    let list = [...incidents];

    if (filters.search && !filters.search.includes('-')) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.reportDescription.toLowerCase().includes(q) ||
          (item.referenceAddress ?? '').toLowerCase().includes(q) ||
          (item.categoryName ?? '').toLowerCase().includes(q) ||
          (item.incidentTypeName ?? '').toLowerCase().includes(q) ||
          String(item.incidentId).includes(q)
      );
    }

    list.sort((a, b) => sortFn(a, b, sortBy));
    return list;
  }, [incidents, filters.search, sortBy]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  return {
    incidents: filteredSorted,
    totalCount: filteredSorted.length,
    categories,
    paginated,
    page,
    pageSize,
    setPage,
    setPageSize: handlePageSizeChange,
    isLoading,
    error,
    filters,
    sortBy,
    handleFilterChange,
    handleSortChange,
    createIncident,
    resolveIncident,
    refresh
  };
};
