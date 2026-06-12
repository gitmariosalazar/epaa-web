/**
 * useWorkOrdersViewModel
 *
 * Presentation ViewModel — Clean Architecture.
 * Espejo exacto de useSolicitudesViewModel para OTs.
 *
 * SOLID:
 *   SRP: owns all filtering, sorting, search and pagination state.
 *   DIP: reads from WorkOrdersContext (injected dependency).
 *   OCP: add new filter types by extending WorkOrderFilterState.
 */
import { useState, useMemo, useCallback } from 'react';
import { useWorkOrdersContext } from '../context/WorkOrdersContext';
import type { WorkOrderFilterState, WorkOrderSortKey } from '../components/WorkOrderToolbar';
import { defaultWorkOrderFilters } from '../components/WorkOrderToolbar';
import type { OrdenTrabajoVistaCliente } from '../../domain/schemas/dto/response/work-orders.get.response';

// ── Sort function ─────────────────────────────────────────────────────────────
const PRIORIDAD_WEIGHT: Record<string, number> = {
  Emergencia: 5, Urgente: 4, Alta: 3, Media: 2, Baja: 1,
};

const sortFn = (
  a: OrdenTrabajoVistaCliente,
  b: OrdenTrabajoVistaCliente,
  key: WorkOrderSortKey
): number => {
  switch (key) {
    case 'fecha_desc':
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
    case 'fecha_asc':
      return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
    case 'estado':
      return a.estadoCodigo.localeCompare(b.estadoCodigo);
    case 'codigo':
      return a.codigoOrden.localeCompare(b.codigoOrden);
    case 'prioridad':
      return (PRIORIDAD_WEIGHT[b.prioridad] ?? 0) - (PRIORIDAD_WEIGHT[a.prioridad] ?? 0);
    default:
      return 0;
  }
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useWorkOrdersViewModel = () => {
  const { ordenes, isLoading, error, refresh } = useWorkOrdersContext();

  const [filters, setFilters] = useState<WorkOrderFilterState>(defaultWorkOrderFilters);
  const [sortBy, setSortBy] = useState<WorkOrderSortKey>('fecha_desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = useCallback((updates: Partial<WorkOrderFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  }, []);

  const handleSortChange = useCallback((key: WorkOrderSortKey) => {
    setSortBy(key);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  // ── Filtering + sorting (memoized) ─────────────────────────────────────────
  const filteredSorted = useMemo(() => {
    let list = [...ordenes];

    // 1. Estado filter
    if (filters.estado) {
      list = list.filter((o) => o.estadoCodigo === filters.estado);
    }

    // 2. Prioridad filter
    if (filters.prioridad) {
      list = list.filter((o) => o.prioridad === filters.prioridad);
    }

    // 3. Tipo de orden filter
    if (filters.tipoOrden) {
      list = list.filter((o) => o.tipoOrden === filters.tipoOrden);
    }

    // 4. Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const by = (filters.filterBy || '').toLowerCase();
      list = list.filter((o) => {
        if (by === 'codigo')   return o.codigoOrden.toLowerCase().includes(q);
        if (by === 'tipo')     return o.tipoTrabajo.toLowerCase().includes(q);
        if (by === 'ejecutor')
          return (
            (o.tecnicoNombre ?? '').toLowerCase().includes(q) ||
            (o.tecnicoNombre ?? '').toLowerCase().includes(q)
          );
        if (by === 'direccion') return !!(o.direccionTrabajo?.toLowerCase().includes(q));
        // default: search across everything
        return (
          o.codigoOrden.toLowerCase().includes(q) ||
          o.tipoTrabajo.toLowerCase().includes(q) ||
          o.estadoLabel.toLowerCase().includes(q) ||
          (o.tecnicoNombre ?? '').toLowerCase().includes(q) ||
          (o.tecnicoNombre ?? '').toLowerCase().includes(q) ||
          (o.direccionTrabajo ?? '').toLowerCase().includes(q)
        );
      });
    }

    // 5. Sort
    list.sort((a, b) => sortFn(a, b, sortBy));

    return list;
  }, [ordenes, filters, sortBy]);

  // ── Pagination slice ────────────────────────────────────────────────────────
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  return {
    // All (for counts)
    ordenes: filteredSorted,
    totalCount: ordenes.length,
    // Paginated slice
    paginated,
    page,
    pageSize,
    setPage,
    setPageSize: handlePageSizeChange,
    // State
    isLoading,
    error,
    filters,
    sortBy,
    handleFilterChange,
    handleSortChange,
    refresh,
  };
};
