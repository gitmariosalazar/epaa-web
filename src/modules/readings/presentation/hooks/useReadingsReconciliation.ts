import { useState, useCallback } from 'react';
import { useReadingsReconciliationContext } from '../context/ReadingsReconciliationContext';
import type {
  ConsultarDetalleAuditoriaParams,
  ReconciliationPeriod
} from '../../domain/models/lecturas-reconciliation';

export const useReadingsReconciliation = () => {
  const context = useReadingsReconciliationContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithErrorHandling = async <T>(action: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await action();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const migrateLecturas = useCallback((months?: string[]) => {
    return executeWithErrorHandling(() => context.migrateLecturasUseCase.execute(months));
  }, [context]);

  const compareLecturas = useCallback((months?: string[]) => {
    return executeWithErrorHandling(() => context.compareLecturasUseCase.execute(months));
  }, [context]);

  const getSummary = useCallback((period: ReconciliationPeriod) => {
    return executeWithErrorHandling(() => context.getReconciliationSummaryUseCase.execute(period));
  }, [context]);

  const getDuplicates = useCallback((period: ReconciliationPeriod) => {
    return executeWithErrorHandling(() => context.getReconciliationDuplicatesUseCase.execute(period));
  }, [context]);

  const getMismatches = useCallback((period: ReconciliationPeriod) => {
    return executeWithErrorHandling(() => context.getReconciliationMismatchesUseCase.execute(period));
  }, [context]);

  const getKpis = useCallback((period: ReconciliationPeriod) => {
    return executeWithErrorHandling(() => context.getReconciliationKpisUseCase.execute(period));
  }, [context]);

  const getDiscrepanciesDetail = useCallback((params: ConsultarDetalleAuditoriaParams) => {
    return executeWithErrorHandling(() => context.getDiscrepanciesDetailUseCase.execute(params));
  }, [context]);

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    clearError,
    migrateLecturas,
    compareLecturas,
    getSummary,
    getDuplicates,
    getMismatches,
    getKpis,
    getDiscrepanciesDetail
  };
};
