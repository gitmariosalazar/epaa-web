import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type {
  AuditSector,
  AuditSectorHistory,
  InitializeAudit
} from '../../domain/models/ReadingAudit';

/**
 * useAuditReadings
 *
 * ViewModel hook for the Audit page.
 * Covers all 5 ReadingAuditRepository methods:
 *  1. initializeMonthlyAudit  → initAudit()
 *  2. getAuditByMonth         → fetchAudit() (no sector)
 *  3. getAuditBySectorAndMonth→ fetchAudit() (with sector)
 *  4. getAuditHistoryBySector → fetchHistory()
 *  5. closeAuditSector        → (exposed via closeAuditSectorUseCase in context)
 *
 * Clean Architecture — SRP: one hook, one concern (audit data).
 * DIP: depends on context, not on concrete repository.
 */
export const useAuditReadings = () => {
  const {
    getAuditByMonthUseCase,
    getAuditBySectorAndMonthUseCase,
    initializeMonthlyAuditUseCase,
    getAuditHistoryBySectorUseCase,
    closeAuditSectorUseCase
  } = useReadingsContext();

  // ── Monthly summary state ──────────────────────────────────────────────────
  const [auditData, setAuditData] = useState<AuditSector[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── History state ──────────────────────────────────────────────────────────
  const [historyData, setHistoryData] = useState<AuditSectorHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // ── Initialize state ───────────────────────────────────────────────────────
  const [isInitializing, setIsInitializing] = useState(false);

  // ── Shared error ───────────────────────────────────────────────────────────
  const [error, setError] = useState<string | null>(null);
  const [initResult, setInitResult] = useState<InitializeAudit | null>(null);

  /** Fetch all sector audits for a month; optionally scoped to a single sector. */
  const fetchAudit = useCallback(
    async (month: string, sector?: string | number) => {
      setIsLoading(true);
      setError(null);
      try {
        let result: AuditSector[];
        if (sector) {
          const single = await getAuditBySectorAndMonthUseCase.execute(
            Number(sector),
            month
          );
          result = single ? [single] : [];
        } else {
          result = await getAuditByMonthUseCase.execute(month);
        }
        setAuditData(result);
      } catch (err: any) {
        console.error('Error fetching audit data', err);
        setError(err?.message ?? 'Error al cargar la auditoría');
        setAuditData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [getAuditByMonthUseCase, getAuditBySectorAndMonthUseCase]
  );

  /** Fetch historical audit records for a specific sector (last N months). */
  const fetchHistory = useCallback(
    async (sector: number, months?: number) => {
      setIsHistoryLoading(true);
      setError(null);
      try {
        const result = await getAuditHistoryBySectorUseCase.execute(
          sector,
          months
        );
        setHistoryData(result);
      } catch (err: any) {
        console.error('Error fetching audit history', err);
        setError(err?.message ?? 'Error al cargar el historial');
        setHistoryData([]);
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [getAuditHistoryBySectorUseCase]
  );

  /** Trigger the backend procedure that generates monthly audit targets. */
  const initAudit = useCallback(
    async (month: string) => {
      setIsInitializing(true);
      setError(null);
      try {
        const result = await initializeMonthlyAuditUseCase.execute(month);
        setInitResult(result);
        return result;
      } catch (err: any) {
        console.error('Error initializing audit', err);
        setError(err?.message ?? 'Error al inicializar la auditoría');
        return null;
      } finally {
        setIsInitializing(false);
      }
    },
    [initializeMonthlyAuditUseCase]
  );

  /** Close a specific sector audit for a given month. */
  const closeAudit = useCallback(
    async (
      sector: number,
      month: string,
      supervisorId: string,
      observations?: string
    ) => {
      setError(null);
      try {
        return await closeAuditSectorUseCase.execute(
          sector,
          month,
          supervisorId,
          observations
        );
      } catch (err: any) {
        console.error('Error closing audit sector', err);
        setError(err?.message ?? 'Error al cerrar el sector de auditoría');
        return null;
      }
    },
    [closeAuditSectorUseCase]
  );

  /** Reset all state — call on tab change or unmount. */
  const clearAudit = useCallback(() => {
    setAuditData([]);
    setHistoryData([]);
    setError(null);
    setInitResult(null);
  }, []);

  return {
    // Monthly summary
    auditData,
    isLoading,
    // History
    historyData,
    isHistoryLoading,
    // Shared
    isInitializing,
    error,
    initResult,
    // Actions
    fetchAudit,
    fetchHistory,
    initAudit,
    closeAudit,
    clearAudit
  };
};
