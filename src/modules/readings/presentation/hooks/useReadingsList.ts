import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type {
  PendingReadingConnection,
  TakenReadingConnection
} from '../../domain/models/Reading';

/**
 * Hook `useReadingsList`
 *
 * Basado en Clean Architecture, este hook funciona como el presentador o
 * adaptador de interfaz para la vista principal de la lista de lecturas.
 * Se encarga de llamar a los Casos de Uso (Use Cases) necesarios para
 * abastecer la página de reportes/listados.
 */
export const useReadingsList = () => {
  const {
    getPendingReadingsByMonthUseCase,
    getTakenReadingsByMonthUseCase,
    getTakenReadingEstimatesOrAverageUseCase
  } = useReadingsContext();

  // Estados de control para la interfaz de usuario
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados que guardan la información proveniente del dominio/backend
  const [pendingReadings, setPendingReadings] = useState<
    PendingReadingConnection[]
  >([]);
  const [completedReadings, setCompletedReadings] = useState<
    TakenReadingConnection[]
  >([]);
  const [estimatedReadings, setEstimatedReadings] = useState<
    TakenReadingConnection[]
  >([]);

  /**
   * Obtiene la lista de lecturas agrupadas por el mes y sector solicitados.
   * Dependiendo de la pestaña activa, solo consulta el endpoint necesario para ahorrar recursos.
   */
  const fetchReadings = useCallback(
    async (
      activeTab: string,
      monthIso: string,
      sectorToFetch?: string | number
    ) => {
      const formattedDate = monthIso;
      const sectorPayload = sectorToFetch ? Number(sectorToFetch) : undefined;

      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === 'pending' || activeTab === 'all') {
          const pending = await getPendingReadingsByMonthUseCase.execute(
            formattedDate,
            sectorPayload
          );
          setPendingReadings(pending || []);
        }

        if (activeTab === 'completed' || activeTab === 'all') {
          const completed =
            await getTakenReadingsByMonthUseCase.executeGetTakenReadingsByMonth(
              formattedDate,
              sectorPayload
            );
          setCompletedReadings(completed || []);
        }

        if (activeTab === 'estimated' || activeTab === 'all') {
          const estimated =
            await getTakenReadingEstimatesOrAverageUseCase.executeGetTakenReadingEstimatesOrAverage(
              formattedDate,
              sectorPayload
            );
          setEstimatedReadings(estimated || []);
        }
      } catch (err: any) {
        console.error('Error fetching readings list', err);
        setError(err.message);

        if (activeTab === 'pending' || activeTab === 'all')
          setPendingReadings([]);
        if (activeTab === 'completed' || activeTab === 'all')
          setCompletedReadings([]);
        if (activeTab === 'estimated' || activeTab === 'all')
          setEstimatedReadings([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      getPendingReadingsByMonthUseCase,
      getTakenReadingsByMonthUseCase,
      getTakenReadingEstimatesOrAverageUseCase
    ]
  );

  /**
   * Limpia todos los datos cargados (pendientes, tomadas, estimadas) y el error.
   * SRP: llamar al cambiar de pestaña para garantizar un estado limpio.
   */
  const clearAll = useCallback(() => {
    setPendingReadings([]);
    setCompletedReadings([]);
    setEstimatedReadings([]);
    setError(null);
  }, []);

  return {
    pendingReadings,
    completedReadings,
    estimatedReadings,
    isLoading,
    error,
    fetchReadings,
    clearAll
  };
};
