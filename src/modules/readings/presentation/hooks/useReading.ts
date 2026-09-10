import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

import type {
  ReadingDetailed,
  ReadingInfo
} from '../../domain/models/ReadingInfoResponse';
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
  const [isLoadingDetailedReading, setIsLoadingDetailedReading] =
    useState(false);
  const [isLoadingPendingReadings, setIsLoadingPendingReadings] =
    useState(false);
  const [isLoadingTakenReadings, setIsLoadingTakenReadings] = useState(false);
  const [
    isLoadingTakenReadingsEstimatesOrAverage,
    setIsLoadingTakenReadingsEstimatesOrAverage
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [readingInfo, setReadingInfo] = useState<ReadingInfo[]>([]);
  const [readingInfoForUpdated, setReadingInfoForUpdated] = useState<
    ReadingInfo[]
  >([]);
  const [readingDetailed, setReadingDetailed] =
    useState<ReadingDetailed | null>(null);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [pendingReadings, setPendingReadings] = useState<
    PendingReadingConnection[]
  >([]);
  const [takenReadings, setTakenReadings] = useState<TakenReadingConnection[]>(
    []
  );
  const [takenReadingsEstimatesOrAverage, setTakenReadingsEstimatesOrAverage] =
    useState<TakenReadingConnection[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene exclusivamente la información principal y el historial de una lectura
   * asegurando que una falla externa no rompa esta funcionalidad central (SRP).
   */
  const fetchReadingData = useCallback(
    async (cadastralKey: string, initialMonth?: string) => {
      if (!cadastralKey) return;

      setIsLoadingInfo(true);
      setIsLoadingHistory(true);
      setError(null);
      setReadingInfo([]);
      setReadingHistory([]);
      setReadingDetailed(null);
      setReadingInfoForUpdated([]);

      try {
        const infoPromise = initialMonth
          ? getReadingInfoUseCase.findReadingInfoForUpdated(
              cadastralKey,
              initialMonth
            )
          : getReadingInfoUseCase.execute(cadastralKey);

        // Ejecución concurrente pero tolerante a fallos independientes
        const [infoResultSettled, historyResultSettled] =
          await Promise.allSettled([
            infoPromise,
            getReadingHistoryUseCase.execute(cadastralKey, 15, 0)
          ]);

        // Procesar Información Principal
        if (
          infoResultSettled.status === 'fulfilled' &&
          infoResultSettled.value &&
          infoResultSettled.value.length > 0
        ) {
          const infoValue = infoResultSettled.value;
          setReadingInfo(infoValue);

          if (initialMonth) {
            setReadingInfoForUpdated(infoValue);
            try {
              const detailedResult =
                await getReadingInfoUseCase.getDetailedReadingInfoByCadastralKey(
                  cadastralKey,
                  initialMonth
                );
              setReadingDetailed(detailedResult);
            } catch (err) {
              console.error('Error fetching detailed info:', err);
            }
          } else {
            // Extraer información detallada si se tiene el mes
            const yearAndMonth = infoValue[0]?.monthReading;
            if (yearAndMonth) {
              try {
                const detailedResult =
                  await getReadingInfoUseCase.getDetailedReadingInfoByCadastralKey(
                    cadastralKey,
                    yearAndMonth
                  );
                console.log('detailedResult', detailedResult);
                const infoForUpdatedResult =
                  await getReadingInfoUseCase.findReadingInfoForUpdated(
                    cadastralKey,
                    yearAndMonth
                  );
                console.log('infoForUpdatedResult', infoForUpdatedResult);

                if (infoForUpdatedResult) {
                  setReadingInfoForUpdated(infoForUpdatedResult);
                } else {
                  setReadingInfoForUpdated([]);
                }

                setReadingDetailed(detailedResult);
              } catch (err) {
                console.error('Error fetching detailed info:', err);
              }
            }
          }
        } else {
          setReadingInfo([]);
          if (infoResultSettled.status === 'rejected') {
            console.error(
              'Error fetching info1:',
              infoResultSettled.reason?.response
            );

            // Extraemos el mensaje de forma segura
            const errorData = infoResultSettled.reason?.data;
            let errorMessage = 'Error al obtener la información de lectura.';
            let statusCode = infoResultSettled.reason?.status;

            if (errorData?.message) {
              errorMessage = Array.isArray(errorData.message)
                ? errorData.message[0]
                : errorData.message;
            } else if (infoResultSettled.reason?.message) {
              errorMessage = infoResultSettled.reason.message;
            }

            console.log('errorMessage', errorMessage);

            if (statusCode === 404) {
              console.log('statusCode', statusCode);

              setError(null);
              MessageToastCustom(
                'error',
                `No se encontraron datos para el acometida con clave catastral ${cadastralKey.toUpperCase()}.`,
                'Error',
                {
                  position: 'top-right'
                }
              );
              return;
            } else {
              setError(errorMessage);

              MessageToastCustom('error', errorMessage, 'Error', {
                position: 'top-right'
              });
            }
          } else {
            setError(
              'No se encontraron datos para la clave catastral proporcionada.'
            );
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

  /**
   * Obtiene la información detallada de una lectura (SRP - Separado).
   */
  const fetchDetailedReadingData = useCallback(
    async (cadastralKey: string, yearAndMonth: string) => {
      setIsLoadingDetailedReading(true);
      try {
        const result: ReadingDetailed | null =
          await getReadingInfoUseCase.getDetailedReadingInfoByCadastralKey(
            cadastralKey,
            yearAndMonth
          );
        setReadingDetailed(result!);
      } catch (error: any) {
        console.error('Error fetching detailed reading:', error);
        setReadingDetailed(null);
      } finally {
        setIsLoadingDetailedReading(false);
      }
    },
    [getReadingInfoUseCase]
  );

  const clearData = useCallback(() => {
    setReadingInfo([]);
    setReadingHistory([]);
    setPendingReadings([]);
    setTakenReadings([]);
    setError(null);
    setTakenReadingsEstimatesOrAverage([]);
    setReadingDetailed(null);
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
    readingInfoForUpdated,
    readingDetailed,
    readingHistory,
    isLoadingInfo,
    isLoadingDetailedReading,
    isLoadingHistory,
    isSubmitting,
    fetchReadingData,
    fetchDetailedReadingData,
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
    isLoadingTakenReadingsEstimatesOrAverage,
    error,
    setError
  };
};
