import { useReadingNoveltyContext } from '../context/ReadingNoveltyContext';
import { useCallback, useState } from 'react';
import type { ReadingNovelty } from '../../domain/models/ReadingNovelty';

export const useReadingNovelty = () => {
  const { getReadingNoveltyUseCase } = useReadingNoveltyContext();
  const [readingNovelties, setReadingNovelties] = useState<ReadingNovelty[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNoveltyReadings = useCallback(
    async (novelty: string, dateMonth: string, sector?: number) => {
      try {
        setLoading(true);
        const result = await getReadingNoveltyUseCase.execute(
          dateMonth,
          novelty === 'TODAS' ? '' : novelty,
          sector
        );
        setReadingNovelties(result);
      } catch (err: any) {
        setError(err?.message ?? 'Error al cargar las novedades de lectura');
      } finally {
        setLoading(false);
      }
    },
    [getReadingNoveltyUseCase]
  );

  const clearNoveltyReadings = useCallback(() => {
    setReadingNovelties([]);
    setError(null);
  }, []);

  return {
    readingNovelties,
    loading,
    error,
    fetchNoveltyReadings,
    clearNoveltyReadings
  };
};
