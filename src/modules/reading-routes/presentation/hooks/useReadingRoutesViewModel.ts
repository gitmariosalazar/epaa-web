import { useState, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useReadingRoutesContext } from '../context/ReadingRoutesContext';
import type { ReadingRoute } from '../../domain/models/ReadingRoute';
import { notify } from '../utils/notify';

export type ReadingRoutesTab = 'map' | 'catalog' | 'dispatch' | 'resolver';

export interface UseReadingRoutesViewModelReturn {
  activeTab: ReadingRoutesTab;
  setActiveTab: Dispatch<SetStateAction<ReadingRoutesTab>>;
  routes: ReadingRoute[];
  allRoutes: ReadingRoute[];
  total: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  sectorFilter: number | undefined;
  setSectorFilter: Dispatch<SetStateAction<number | undefined>>;
  activaFilter: boolean | undefined;
  setActivaFilter: Dispatch<SetStateAction<boolean | undefined>>;
  estadoFilter: string;
  setEstadoFilter: Dispatch<SetStateAction<string>>;
  periodoFilter: string;
  setPeriodoFilter: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  isResolverModalOpen: boolean;
  setIsResolverModalOpen: Dispatch<SetStateAction<boolean>>;
  refreshRoutes: () => Promise<void>;
  resetFilters: () => void;
}

export const useReadingRoutesViewModel = (): UseReadingRoutesViewModelReturn => {
  const { getReadingRoutesUseCase } = useReadingRoutesContext();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [activeTab, setActiveTab] = useState<ReadingRoutesTab>('map');
  const [routes, setRoutes] = useState<ReadingRoute[]>([]);
  const [allRoutes, setAllRoutes] = useState<ReadingRoute[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [search, setSearch] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<number | undefined>(undefined);
  const [activaFilter, setActivaFilter] = useState<boolean | undefined>(undefined);
  const [estadoFilter, setEstadoFilter] = useState<string>('TODOS');
  const [periodoFilter, setPeriodoFilter] = useState<string>(currentMonthStr);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Resolver modal
  const [isResolverModalOpen, setIsResolverModalOpen] = useState<boolean>(false);

  const loadRoutes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getReadingRoutesUseCase.execute({
        page,
        limit,
        search: search.trim() || undefined,
        sectorId: sectorFilter,
        activa: activaFilter,
        estado: estadoFilter || undefined,
        periodo: periodoFilter || undefined,
      });
      setRoutes(response?.items || []);
      setTotal(response?.total || (response?.items?.length ?? 0));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      notify.error('Error al cargar catálogo de rutas: ' + msg);
    } finally {
      setIsLoading(false);
    }
  }, [
    getReadingRoutesUseCase,
    page,
    limit,
    search,
    sectorFilter,
    activaFilter,
    estadoFilter,
    periodoFilter,
  ]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setSectorFilter(undefined);
    setActivaFilter(undefined);
    setEstadoFilter('TODOS');
    setPeriodoFilter(currentMonthStr);
    setPage(1);
  }, [currentMonthStr]);

  const loadAllRoutes = useCallback(async () => {
    try {
      const response = await getReadingRoutesUseCase.execute({
        limit: 150,
        activa: true,
      });
      setAllRoutes(response?.items || []);
    } catch (err: unknown) {
      console.warn('Error al precargar todas las rutas:', err);
    }
  }, [getReadingRoutesUseCase]);

  // Pre-load all routes for dispatch modal and quick lookup
  useEffect(() => {
    queueMicrotask(() => {
      void loadAllRoutes();
    });
  }, [loadAllRoutes]);

  useEffect(() => {
    if (activeTab === 'catalog') {
      queueMicrotask(() => {
        void loadRoutes();
      });
    }
  }, [activeTab, loadRoutes]);

  return {
    activeTab,
    setActiveTab,
    routes,
    allRoutes,
    total,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    sectorFilter,
    setSectorFilter,
    activaFilter,
    setActivaFilter,
    estadoFilter,
    setEstadoFilter,
    periodoFilter,
    setPeriodoFilter,
    isLoading,
    isResolverModalOpen,
    setIsResolverModalOpen,
    refreshRoutes: loadRoutes,
    resetFilters,
  };
};
