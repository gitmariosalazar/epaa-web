import { useCallback, useEffect, useState } from 'react';
import type { OverduePayment } from '../../domain/models/OverdueReading';
import type { PendingReading } from '../../domain/models/PendingReading';
import { usePaymentsContext } from '../context/PaymentsContext';

export type OverduePaymentTab = 'payments';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

const LIMIT_SIZE = 50;

function applySortConfig<T>(data: T[], sortConfig: SortConfig | null): T[] {
  if (!sortConfig) return data;
  return [...data].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function applyLocalFilters(
  data: OverduePayment[],
  searchQuery: string,
  searchField: string,
  sortConfig: SortConfig | null
): OverduePayment[] {
  let result = data;

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();

    if (searchField === 'all') {
      result = result.filter((item) => {
        const partialMatches =
          (item.clientId ?? '').toLowerCase().includes(q) ||
          (item.cadastralKey ?? '').toLowerCase().includes(q) ||
          (item.monthsPastDue?.toString() ?? '').includes(q) ||
          (item.name ?? '').toLowerCase().includes(q);

        return partialMatches;
      });
    } else {
      result = result.filter((item) => {
        const value =
          (item as any)[searchField]?.toString().toLowerCase().trim() ?? '';

        if (
          searchField === 'connectionSector' ||
          searchField === 'connectionAccount'
        ) {
          return value === q;
        }

        return value.includes(q);
      });
    }
  }

  return applySortConfig(result, sortConfig);
}

// ── ViewModel Hook ────────────────────────────────────────────────────────────
export const useOverduePaymentsViewModel = () => {
  const { findAllOverduePayments, findPendingReadingsByCadastralKeyOrCardId } =
    usePaymentsContext();

  // ── 1. LIST STATE ──
  const [overduePayments, setOverduePayments] = useState<OverduePayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── PENDING READINGS STATE ──
  const [pendingReadings, setPendingReadings] = useState<PendingReading[]>([]);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const activeTab: OverduePaymentTab = 'payments';
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Local search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // ── 2. DATA FETCHING ──
  const fetchOverduePayments = useCallback(
    async (currentOffset: number = 0, append = false) => {
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === 'payments') {
          const result = await findAllOverduePayments.execute(
            LIMIT_SIZE,
            currentOffset
          );

          const data: OverduePayment[] = result || [];

          if (data.length < LIMIT_SIZE) {
            setHasMore(false);
          }

          setOverduePayments((prev) => (append ? [...prev, ...data] : data));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    },
    [findAllOverduePayments, activeTab]
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchOverduePayments(0, false);
  }, [activeTab]);

  // ── 3. HANDLERS ──
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchField('all');
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
    }));
  };

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT_SIZE;
    setOffset(newOffset);
    fetchOverduePayments(newOffset, true);
  };

  const fetchPendingReadings = useCallback(
    async (searchValue: string) => {
      setIsPendingLoading(true);
      setPendingError(null);
      setPendingReadings([]); // Clear old data to prevent "ghosting"
      try {
        const result =
          await findPendingReadingsByCadastralKeyOrCardId.execute(searchValue);
        setPendingReadings(result || []);
      } catch (err) {
        setPendingReadings([]); // Clear on error
        setPendingError(
          err instanceof Error ? err.message : 'Error al buscar lecturas'
        );
      } finally {
        setIsPendingLoading(false);
      }
    },
    [findPendingReadingsByCadastralKeyOrCardId]
  );

  // ── Filtrado y ordenamiento local (reactivo, sin fetch) ──
  const displayedPayments = applyLocalFilters(
    overduePayments,
    searchQuery,
    searchField,
    sortConfig
  );

  // ── 4. RETURNED VALUES ──
  return {
    overduePayments: displayedPayments,
    isLoading,
    error,
    hasMore,
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    sortConfig,
    setSortConfig,
    handleClearSearch,
    handleSort,
    handleLoadMore,
    // Pending
    pendingReadings,
    isPendingLoading,
    pendingError,
    fetchPendingReadings
  };
};
