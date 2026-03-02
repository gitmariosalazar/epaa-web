import { useState, useEffect, useMemo } from 'react';
import { TakenReadingConnectionUseCase } from '@/modules/readings/application/usecases/TakenReadingConnectionUseCase';
import { PendingReadingConnectionUseCase } from '@/modules/readings/application/usecases/PendingReadingConnectionUseCase';
import { TakenReadingConnectionRepositoryImpl } from '@/modules/readings/infrastructure/repositories/TakenReadingConnectionRepositoryImpl';
import { PendingReadingConnectionRepositoryImpl } from '@/modules/readings/infrastructure/repositories/PendingReadingConnectionRepositoryImpl';
import type {
  TakenReadingConnection,
  PendingReadingConnection
} from '@/modules/readings/domain/models/Reading';

export const useSectorReadings = (
  sector: number | null,
  month: string,
  type: 'completed' | 'missing' | null
) => {
  const [data, setData] = useState<
    TakenReadingConnection[] | PendingReadingConnection[]
  >([]);
  const [loading, setLoading] = useState(false);

  const takenUseCase = useMemo(
    () =>
      new TakenReadingConnectionUseCase(
        new TakenReadingConnectionRepositoryImpl()
      ),
    []
  );

  const pendingUseCase = useMemo(
    () =>
      new PendingReadingConnectionUseCase(
        new PendingReadingConnectionRepositoryImpl()
      ),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      if (sector === null || !month || !type) {
        setData([]);
        return;
      }

      setLoading(true);
      try {
        if (type === 'completed') {
          const result = await takenUseCase.executeGetTakenReadingsByMonth(
            month,
            sector
          );
          setData(result);
        } else if (type === 'missing') {
          const result = await pendingUseCase.execute(month, sector);
          setData(result);
        }
      } catch (error) {
        console.error(
          `Error fetching ${type} readings for sector ${sector}`,
          error
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sector, month, type, takenUseCase, pendingUseCase]);

  return { data, loading };
};
