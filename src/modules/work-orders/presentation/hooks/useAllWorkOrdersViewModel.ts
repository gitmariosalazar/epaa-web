/**
 * useAllWorkOrdersViewModel
 *
 * Presentation ViewModel — Clean Architecture.
 * Carga todas las OTs via GetAllWorkOrdersUseCase.
 *
 * SOLID:
 *   SRP: owns filtering, sorting, search and pagination state.
 *   DIP: depends on GetAllWorkOrdersUseCase abstraction.
 *   OCP: new filter types → extend AllWorkOrderFilterState.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';
import { GetAllWorkOrdersUseCase }        from '../../application/usecases/GetAllWorkOrdersUseCase';
import type { WorkOrderListItem }          from '../../domain/schemas/dto/response/work-orders.get.response';

// ── Filter state ─────────────────────────────────────────────────────────────
export interface AllWorkOrderFilterState {
  search:    string;
  filterBy:  string;   // 'codigo' | 'cliente' | 'direccion' | ''
  status:    string;   // WorkOrderListItem['status'] | ''
  priority:  string;   // '1'|'2'|'3'|'4'|'5' | ''
  origin:    string;   // ORIGINS value | ''
}

export const defaultAllWorkOrderFilters: AllWorkOrderFilterState = {
  search:   '',
  filterBy: '',
  status:   '',
  priority: '',
  origin:   '',
};

export type AllWorkOrderSortKey =
  | 'fecha_desc'
  | 'fecha_asc'
  | 'status'
  | 'codigo'
  | 'priority';

// ── Priority weight for sorting ───────────────────────────────────────────────
const PRIORITY_WEIGHT: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

const sortFn = (
  a: WorkOrderListItem,
  b: WorkOrderListItem,
  key: AllWorkOrderSortKey
): number => {
  switch (key) {
    case 'fecha_desc':
      return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
    case 'fecha_asc':
      return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
    case 'status':
      return a.status.localeCompare(b.status);
    case 'codigo':
      return a.orderCode.localeCompare(b.orderCode);
    case 'priority':
      return (PRIORITY_WEIGHT[b.priorityId] ?? 0) - (PRIORITY_WEIGHT[a.priorityId] ?? 0);
    default:
      return 0;
  }
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export const useAllWorkOrdersViewModel = () => {
  // DIP: inject via useMemo — the hook doesn't know about implementation details
  const useCase = useMemo(
    () => new GetAllWorkOrdersUseCase(new ProcessWorkOrderRepositoryImpl()),
    []
  );

  const [allOrders,  setAllOrders]  = useState<WorkOrderListItem[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const [filters,  setFilters]  = useState<AllWorkOrderFilterState>(defaultAllWorkOrderFilters);
  const [sortBy,   setSortBy]   = useState<AllWorkOrderSortKey>('fecha_desc');
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await useCase.execute();
      setAllOrders(data);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar las órdenes.');
    } finally {
      setIsLoading(false);
    }
  }, [useCase]);

  useEffect(() => { load(); }, [load]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((updates: Partial<AllWorkOrderFilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setPage(1);
  }, []);

  const handleSortChange = useCallback((key: AllWorkOrderSortKey) => {
    setSortBy(key);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  // ── Filter + Sort (memoized) ──────────────────────────────────────────────
  const filteredSorted = useMemo(() => {
    let list = [...allOrders];

    if (filters.status)   list = list.filter(o => o.status   === filters.status);
    if (filters.priority) list = list.filter(o => String(o.priorityId) === filters.priority);
    if (filters.origin)   list = list.filter(o => o.origin   === filters.origin);

    if (filters.search) {
      const q  = filters.search.toLowerCase();
      const by = filters.filterBy.toLowerCase();
      list = list.filter(o => {
        if (by === 'codigo')    return o.orderCode.toLowerCase().includes(q);
        if (by === 'cliente')   return o.clientName.toLowerCase().includes(q) || o.clientId.toLowerCase().includes(q);
        if (by === 'direccion') return o.location.toLowerCase().includes(q);
        // default: all fields
        return (
          o.orderCode.toLowerCase().includes(q)    ||
          o.clientName.toLowerCase().includes(q)   ||
          o.clientId.toLowerCase().includes(q)     ||
          o.location.toLowerCase().includes(q)     ||
          o.status.toLowerCase().includes(q)       ||
          o.workTypeName.toLowerCase().includes(q)
        );
      });
    }

    list.sort((a, b) => sortFn(a, b, sortBy));
    return list;
  }, [allOrders, filters, sortBy]);

  // ── Pagination slice ──────────────────────────────────────────────────────
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  return {
    ordenes:       filteredSorted,
    totalCount:    allOrders.length,
    paginated,
    page,
    pageSize,
    setPage,
    setPageSize:   handlePageSizeChange,
    isLoading,
    error,
    filters,
    sortBy,
    handleFilterChange,
    handleSortChange,
    refresh:       load,
  };
};
