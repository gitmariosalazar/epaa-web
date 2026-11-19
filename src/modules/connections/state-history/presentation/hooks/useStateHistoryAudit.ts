import { useState, useCallback, useEffect } from 'react';
import { useStateHistoryContext } from '../context/StateHistoryContext';
import type { StateHistory } from '../../domain/models/StateHistory';
import type { FilterStateHistoryGatewayRequest } from '../../domain/dto/request/filter-state-history.gateway.request';

export function useStateHistoryAudit() {
  const { useCases, summary, isLoadingSummary, refreshSummary, catalog } = useStateHistoryContext();

  const [records, setRecords] = useState<StateHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter params
  const [connectionId, setConnectionId] = useState<string>('');
  const [stateId, setStateId] = useState<number | ''>('');
  const [userId, setUserId] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [isReversal, setIsReversal] = useState<boolean | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [limit] = useState<number>(50);
  const [offset, setOffset] = useState<number>(0);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload: FilterStateHistoryGatewayRequest = {
        connectionId: connectionId.trim() || undefined,
        stateId: stateId !== '' ? Number(stateId) : undefined,
        userId: userId.trim() || undefined,
        origin: origin.trim() || undefined,
        isReversal: isReversal !== '' ? Boolean(isReversal) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        limit,
        offset
      };

      const data = await useCases.filterStateHistoryUseCase.execute(payload);
      setRecords(Array.isArray(data) ? data : (data as any)?.items || (data as any)?.records || []);
    } catch (err: any) {
      setError(err?.message || 'Error al filtrar el historial de estados.');
    } finally {
      setIsLoading(false);
    }
  }, [connectionId, stateId, userId, origin, isReversal, startDate, endDate, limit, offset, useCases]);

  const resetFilters = useCallback(() => {
    setConnectionId('');
    setStateId('');
    setUserId('');
    setOrigin('');
    setIsReversal('');
    setStartDate('');
    setEndDate('');
    setOffset(0);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [offset]);

  return {
    records,
    isLoading,
    error,
    summary,
    isLoadingSummary,
    refreshSummary,
    catalog,
    // Filters
    connectionId,
    setConnectionId,
    stateId,
    setStateId,
    userId,
    setUserId,
    origin,
    setOrigin,
    isReversal,
    setIsReversal,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    offset,
    setOffset,
    limit,
    // Actions
    fetchRecords,
    resetFilters
  };
}
