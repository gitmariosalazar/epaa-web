/**
 * useSolicitudesViewModel
 *
 * SRP: owns all filtering, sorting, search and pagination state.
 * DIP: reads from SolicitudesContext (injected dependency).
 * OCP: add new filter types by extending FilterState, not modifying hooks.
 */
import { useState, useMemo, useCallback } from 'react';
import { useSolicitudesContext } from '../context/SolicitudesContext';
import { defaultSolicitudesFilters } from '../components/SolicitudesGlobalFilters';
import type { SolicitudesFilterState } from '../components/SolicitudesGlobalFilters';
import type { Solicitud } from '../../domain/models/Solicitud';

export type SortKey = 'fecha_desc' | 'fecha_asc' | 'estado' | 'numero';

const sortFn = (a: Solicitud, b: Solicitud, key: SortKey): number => {
  switch (key) {
    case 'fecha_desc':
      return new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime();
    case 'fecha_asc':
      return new Date(a.fechaSolicitud).getTime() - new Date(b.fechaSolicitud).getTime();
    case 'estado':
      return a.estado.localeCompare(b.estado);
    case 'numero':
      return (a.solicitudNumero ?? '').localeCompare(b.solicitudNumero ?? '');
    default:
      return 0;
  }
};

export const useSolicitudesViewModel = (
  filter?: 'en_proceso' | 'aprobada' | 'rechazada' | 'completada',
  categoria?: string
) => {
  const { solicitudes, isLoading, error, refresh } = useSolicitudesContext();
  const [filters, setFilters] = useState<SolicitudesFilterState>(defaultSolicitudesFilters);
  const [sortBy, setSortBy] = useState<SortKey>('fecha_desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = useCallback((updates: Partial<SolicitudesFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  }, []);

  const handleSortChange = useCallback((key: SortKey) => {
    setSortBy(key);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  // ── All filtering + sorting (memoized) ──────────────────────
  const filteredSorted = useMemo(() => {
    let list = [...solicitudes];

    // 1. Category filter (from route param)
    if (categoria) {
      const catUpper = categoria.toUpperCase();
      list = list.filter((s) => {
        const typeUpper = (s.tipoAcometida || '').toUpperCase();
        if (catUpper === 'NUEVA_ACOMETIDA') {
          return typeUpper === 'AGUA_POTABLE' || typeUpper === 'ALCANTARILLADO' || typeUpper === 'NUEVA_ACOMETIDA';
        }
        if (catUpper === 'CAMBIO_TITULAR') return typeUpper === 'CAMBIO_TITULAR';
        if (catUpper === 'SUSPENSION_SERVICIO' || catUpper === 'SUSPENSION') {
          return typeUpper === 'SUSPENSION_SERVICIO' || typeUpper === 'SUSPENSION' || typeUpper === 'SUSPENSION_SERVICIO_POTABLE';
        }
        if (catUpper === 'BENEFICIO_TERCERA_EDAD' || catUpper === 'BENEFICIO') {
          return typeUpper === 'BENEFICIO_TERCERA_EDAD' || typeUpper === 'TERCERA_EDAD' || typeUpper === 'BENEFICIO';
        }
        if (catUpper === 'BENEFICIO_DISCAPACIDAD') {
          return typeUpper === 'BENEFICIO_DISCAPACIDAD' || typeUpper === 'DISCAPACIDAD';
        }
        return typeUpper === catUpper || typeUpper.includes(catUpper) || catUpper.includes(typeUpper);
      });
    }

    // 2. Prop-level status filter
    if (filter) list = list.filter((s) => s.estado === filter);

    // 3. Filter-by + search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const by = (filters.filterBy || '').toLowerCase();
      list = list.filter((s) => {
        if (by === 'codigo') {
          return (
            s.solicitudId.toLowerCase().includes(q) ||
            (s.solicitudNumero ?? '').toLowerCase().includes(q)
          );
        }
        if (by === 'direccion') return !!(s.direccion?.toLowerCase().includes(q));
        return (
          s.solicitudId.toLowerCase().includes(q) ||
          (s.solicitudNumero ?? '').toLowerCase().includes(q) ||
          s.clienteId.toLowerCase().includes(q) ||
          !!(s.datosAdicionales?.nombres?.toLowerCase().includes(q)) ||
          !!(s.datosAdicionales?.apellidos?.toLowerCase().includes(q)) ||
          !!(s.direccion?.toLowerCase().includes(q))
        );
      });
    }

    // 4. User id filter
    if (filters.userId) {
      const q = filters.userId.toLowerCase();
      list = list.filter(
        (s) =>
          s.clienteId.includes(q) ||
          !!(s.datosAdicionales?.nombres?.toLowerCase().includes(q)) ||
          !!(s.datosAdicionales?.apellidos?.toLowerCase().includes(q))
      );
    }

    // 5. Status filter from dropdown
    if (filters.event) list = list.filter((s) => s.estado === filters.event);

    // 6. Date range
    if (filters.initDate) {
      const initTime = new Date(filters.initDate).getTime();
      list = list.filter((s) => s.fechaSolicitud ? new Date(s.fechaSolicitud).getTime() >= initTime : false);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      const endTime = endDate.getTime();
      list = list.filter((s) => s.fechaSolicitud ? new Date(s.fechaSolicitud).getTime() <= endTime : false);
    }

    // 7. Sort
    list.sort((a, b) => sortFn(a, b, sortBy));

    return list;
  }, [solicitudes, filter, categoria, filters, sortBy]);

  // ── Pagination slice ─────────────────────────────────────────
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  return {
    // All (for counts)
    solicitudes: filteredSorted,
    totalCount: solicitudes.length,
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
    refresh
  };
};
