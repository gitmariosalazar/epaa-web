import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import type { ReadingHistory } from '../../domain/models/ReadingHistory';
import type { CreateReadingRequest } from '../../domain/dto/request/CreateReadingRequest';
import type {
  PendingReadingConnection,
  TakenReadingConnection
} from '../../domain/models/Reading';

export const useReading = () => {
  const {
    getReadingInfoUseCase,
    getReadingHistoryUseCase,
    createReadingUseCase,
    getPendingReadingsByMonthUseCase,
    getTakenReadingEstimatesOrAverageUseCase,
    getTakenReadingsByMonthUseCase
  } = useReadingsContext();

  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingPendingReadings, setIsLoadingPendingReadings] =
    useState(false);
  const [isLoadingTakenReadings, setIsLoadingTakenReadings] = useState(false);
  const [
    isLoadingTakenReadingsEstimatesOrAverage,
    setIsLoadingTakenReadingsEstimatesOrAverage
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [readingInfo, setReadingInfo] = useState<ReadingInfo[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [pendingReadings, setPendingReadings] = useState<
    PendingReadingConnection[]
  >([]);
  const [takenReadings, setTakenReadings] = useState<TakenReadingConnection[]>(
    []
  );
  const [takenReadingsEstimatesOrAverage, setTakenReadingsEstimatesOrAverage] =
    useState<TakenReadingConnection[]>([]);

  /**
   * Obtiene exclusivamente la información principal y el historial de una lectura
   * asegurando que una falla externa no rompa esta funcionalidad central (SRP).
   */
  const fetchReadingData = useCallback(
    async (cadastralKey: string) => {
      if (!cadastralKey) return;

      setIsLoadingInfo(true);
      setIsLoadingHistory(true);

      try {
        // Ejecución concurrente pero tolerante a fallos independientes
        const [infoResultSettled, historyResultSettled] =
          await Promise.allSettled([
            getReadingInfoUseCase.execute(cadastralKey),
            getReadingHistoryUseCase.execute(cadastralKey, 15, 0)
          ]);

        // Procesar Información Principal
        if (
          infoResultSettled.status === 'fulfilled' &&
          infoResultSettled.value &&
          infoResultSettled.value.length > 0
        ) {
          setReadingInfo(infoResultSettled.value);
        } else {
          setReadingInfo([]);
          console.log(infoResultSettled);
          if (infoResultSettled.status === 'rejected') {
            console.error('Error fetching info:', infoResultSettled.reason);

            // Extraemos el mensaje de forma segura
            const errorData = infoResultSettled.reason?.response?.data;
            let errorMessage = 'Error al obtener la información de lectura.';

            if (errorData?.message) {
              errorMessage = Array.isArray(errorData.message)
                ? errorData.message[0]
                : errorData.message;
            } else if (infoResultSettled.reason?.message) {
              errorMessage = infoResultSettled.reason.message;
            }

            MessageToastCustom('error', errorMessage, 'Error', {
              position: 'top-right'
            });
          } else {
            MessageToastCustom(
              'warning',
              'No se encontraron datos para la clave catastral proporcionada.',
              'Atención',
              { position: 'top-right' }
            );
          }
        }

        // Procesar Historial
        if (
          historyResultSettled.status === 'fulfilled' &&
          historyResultSettled.value
        ) {
          setReadingHistory(historyResultSettled.value);
        } else {
          setReadingHistory([]);
          if (historyResultSettled.status === 'rejected') {
            console.error(
              'Error fetching history:',
              historyResultSettled.reason
            );
          }
        }
      } finally {
        setIsLoadingInfo(false);
        setIsLoadingHistory(false);
      }
    },
    [getReadingInfoUseCase, getReadingHistoryUseCase]
  );

  /**
   * Obtiene la lista de lecturas pendientes por mes (SRP - Separado).
   */
  const fetchPendingReadingsData = useCallback(
    async (monthIso: string, limit: number = 1) => {
      setIsLoadingPendingReadings(true);
      try {
        const result = await getPendingReadingsByMonthUseCase.execute(
          monthIso,
          limit
        );
        setPendingReadings(result || []);
      } catch (error: any) {
        console.error('Error fetching pending readings:', error);
        setPendingReadings([]);
      } finally {
        setIsLoadingPendingReadings(false);
      }
    },
    [getPendingReadingsByMonthUseCase]
  );

  /**
   * Obtiene la lista de lecturas tomadas (Estimaciones/Promedios cruzados) (SRP - Separado).
   */
  const fetchTakenReadingsData = useCallback(
    async (monthIso: string, limit: number = 1) => {
      setIsLoadingTakenReadings(true);
      try {
        const result =
          await getTakenReadingsByMonthUseCase.executeGetTakenReadingEstimatesOrAverage(
            monthIso,
            limit
          );
        setTakenReadings(result || []);
      } catch (error: any) {
        console.error('Error fetching taken readings:', error);
        setTakenReadings([]);
      } finally {
        setIsLoadingTakenReadings(false);
      }
    },
    [getTakenReadingsByMonthUseCase]
  );

  /**
   * Obtiene el promedio de listados (SRP - Separado)
   */
  const fetchTakenReadingsEstimatesOrAverageData = useCallback(
    async (monthIso: string, limit: number = 1) => {
      setIsLoadingTakenReadingsEstimatesOrAverage(true);
      try {
        const result =
          await getTakenReadingEstimatesOrAverageUseCase.executeGetTakenReadingsByMonth(
            monthIso,
            limit
          );
        setTakenReadingsEstimatesOrAverage(result || []);
      } catch (error: any) {
        console.error('Error fetching taken readings estimates:', error);
        setTakenReadingsEstimatesOrAverage([]);
      } finally {
        setIsLoadingTakenReadingsEstimatesOrAverage(false);
      }
    },
    [getTakenReadingEstimatesOrAverageUseCase]
  );

  const clearData = useCallback(() => {
    setReadingInfo([]);
    setReadingHistory([]);
    setPendingReadings([]);
    setTakenReadings([]);
    setTakenReadingsEstimatesOrAverage([]);
  }, []);

  const clearPendingReadings = useCallback(() => {
    setPendingReadings([]);
  }, []);

  const submitReading = useCallback(
    async (request: CreateReadingRequest) => {
      setIsSubmitting(true);
      try {
        const result = await createReadingUseCase.execute(request);
        MessageToastCustom(
          'success',
          'Lectura guardada exitosamente.',
          'Éxito',
          { position: 'top-right' }
        );
        if (request.cadastralKey) {
          await fetchReadingData(request.cadastralKey);
        }
        return result;
      } catch (error: any) {
        console.error('Error creating reading:', error);

        const errorData = error?.response?.data;
        let errorMessage = 'Error al guardar la lectura.';

        if (errorData?.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message[0]
            : errorData.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        MessageToastCustom('error', errorMessage, 'Error', {
          position: 'top-right'
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [createReadingUseCase, fetchReadingData]
  );

  return {
    readingInfo,
    readingHistory,
    isLoadingInfo,
    isLoadingHistory,
    isSubmitting,
    fetchReadingData,
    fetchPendingReadingsData,
    fetchTakenReadingsData,
    fetchTakenReadingsEstimatesOrAverageData,
    clearData,
    submitReading,
    clearPendingReadings,
    pendingReadings,
    isLoadingPendingReadings,
    takenReadings,
    isLoadingTakenReadings,
    takenReadingsEstimatesOrAverage,
    isLoadingTakenReadingsEstimatesOrAverage
  };
};
