import { useCallback, useEffect, useState } from 'react';
import { useStateHistoryContext } from '../context/StateHistoryContext';
import type { StateHistory } from '../../domain/models/StateHistory';
import type { CurrentConnectionState } from '../../domain/models/CurrentConnectionState';
import type { AllowedTransitions } from '../../domain/models/AllowedTransitions';
import type { ReversibleRecord } from '../../domain/models/ReversibleRecord';

export interface UseConnectionStateHistoryOptions {
  connectionId?: string | null;
  autoFetch?: boolean;
  limit?: number;
}

export function useConnectionStateHistory({
  connectionId,
  autoFetch = true,
  limit = 50
}: UseConnectionStateHistoryOptions) {
  const { useCases } = useStateHistoryContext();

  const [history, setHistory] = useState<StateHistory[]>([]);
  const [currentState, setCurrentState] = useState<CurrentConnectionState | null>(null);
  const [allowedTransitions, setAllowedTransitions] = useState<AllowedTransitions | null>(null);
  const [reversibleRecord, setReversibleRecord] = useState<ReversibleRecord | null>(null);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingTransitions, setIsLoadingTransitions] = useState(false);
  const [isLoadingReversible, setIsLoadingReversible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!connectionId) {
      setHistory([]);
      setCurrentState(null);
      return;
    }

    setIsLoadingHistory(true);
    setError(null);
    try {
      const [historyData, currentStateData] = await Promise.all([
        useCases.getConnectionHistoryUseCase.execute(connectionId, limit, 0),
        useCases.getCurrentConnectionStateUseCase.execute(connectionId).catch(() => null)
      ]);
      setHistory(Array.isArray(historyData) ? historyData : (historyData as any)?.items || (historyData as any)?.records || []);
      setCurrentState(currentStateData);
    } catch (err: any) {
      const msg = err?.message || 'Error al cargar el historial de estados de la acometida.';
      setError(msg);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [connectionId, limit, useCases]);

  const fetchAllowedTransitions = useCallback(async () => {
    if (!connectionId) {
      setAllowedTransitions(null);
      return;
    }

    setIsLoadingTransitions(true);
    try {
      const data = await useCases.getAllowedTransitionsUseCase.execute(connectionId);
      setAllowedTransitions(data);
    } catch (err) {
      console.warn('Could not fetch allowed transitions:', err);
    } finally {
      setIsLoadingTransitions(false);
    }
  }, [connectionId, useCases]);

  const fetchReversible = useCallback(async () => {
    if (!connectionId) {
      setReversibleRecord(null);
      return;
    }

    setIsLoadingReversible(true);
    try {
      const data = await useCases.getReversibleHistoryUseCase.execute(connectionId);
      setReversibleRecord(data);
    } catch (err) {
      console.warn('Could not fetch reversibility status:', err);
    } finally {
      setIsLoadingReversible(false);
    }
  }, [connectionId, useCases]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchHistory(), fetchAllowedTransitions(), fetchReversible()]);
  }, [fetchHistory, fetchAllowedTransitions, fetchReversible]);

  useEffect(() => {
    if (autoFetch && connectionId) {
      refreshAll();
    }
  }, [autoFetch, connectionId, refreshAll]);

  return {
    history,
    currentState,
    allowedTransitions,
    reversibleRecord,
    isLoading: isLoadingHistory || isLoadingTransitions || isLoadingReversible,
    isLoadingHistory,
    isLoadingTransitions,
    isLoadingReversible,
    error,
    refreshAll,
    fetchHistory,
    fetchAllowedTransitions,
    fetchReversible
  };
}
