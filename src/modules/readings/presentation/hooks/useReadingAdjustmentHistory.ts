import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type { HistorialAjusteLectura } from '../../domain/models/Reading';

export const useReadingAdjustmentHistory = () => {
  const { getReadingAdjustmentHistoryByReadingIdUseCase } = useReadingsContext();

  const [data, setData] = useState<HistorialAjusteLectura[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(
    async (readingId: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getReadingAdjustmentHistoryByReadingIdUseCase.execute(readingId);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al obtener el historial de ajustes');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [getReadingAdjustmentHistoryByReadingIdUseCase]
  );

  return {
    data,
    isLoading,
    error,
    fetchHistory
  };
};
