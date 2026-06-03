/**
 * useTrackingViewModel
 *
 * SRP: owns loading, filtering and sorting of tracking data.
 * DIP: consumes GetTrackingByClienteIdUseCase via constructor injection.
 * OCP: add new filter fields by extending TrackingFilterState — no hook changes.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { GetTrackingByAnalistaIdUseCase } from '../../application/usecases/GetTrackingByAnalistaIdUseCase';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import type { TrackingSolicitudResponse } from '../../domain/models/Solicitud';

// ── Singleton instances (stable across renders) ───────────────────────────────
const repository = new SolicitudRepositoryImpl();
const trackingUseCase = new GetTrackingByAnalistaIdUseCase(repository);

// ── Filter state ──────────────────────────────────────────────────────────────
export interface TrackingFilterState {
  search: string;
  currentStep: string; // '' = all
}

export const defaultTrackingFilters: TrackingFilterState = {
  search: '',
  currentStep: ''
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useTrackingViewModel = () => {
  const { user: authUser } = useAuth();
  const clienteId = authUser?.userId ?? '';

  const [trackingList, setTrackingList] = useState<TrackingSolicitudResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TrackingFilterState>(
    defaultTrackingFilters
  );

  // ── Load from backend ──────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!clienteId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await trackingUseCase.execute(clienteId);
      setTrackingList(data);
    } catch (err: any) {
      console.error('[useTrackingViewModel] Error loading tracking:', err);
      setError(
        err?.message ?? 'Error al cargar el seguimiento de solicitudes.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (clienteId) load();
    else setTrackingList([]);
  }, [clienteId, load]);

  // ── Filter (memoized) ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...trackingList];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.codigo.toLowerCase().includes(q) ||
          (t.direccion ?? '').toLowerCase().includes(q) ||
          (t.claveCatastral ?? '').toLowerCase().includes(q) ||
          t.estadoActualLabel.toLowerCase().includes(q)
      );
    }

    if (filters.currentStep) {
      list = list.filter((t) => t.currentStep === filters.currentStep);
    }

    // Sort: most recent first
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return list;
  }, [trackingList, filters]);

  const handleFilterChange = useCallback(
    (updates: Partial<TrackingFilterState>) => {
      setFilters((prev) => ({ ...prev, ...updates }));
    },
    []
  );
  console.log(trackingList);

  return {
    tracking: filtered,
    totalCount: trackingList.length,
    isLoading,
    error,
    filters,
    handleFilterChange,
    refresh: load
  };
};
