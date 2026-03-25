import type { UpdateReadingRequest } from '../../domain/dto/request/UpdateReadingRequest';
import { useReadingsContext } from '../context/ReadingsContext';
import { useCallback, useState } from 'react';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import type { ReadingHistory } from '../../domain/models/ReadingHistory';

export const useUpdateReading = () => {
  // Dependencies
  const {
    updateReadingUseCase,
    getReadingInfoUseCase,
    getReadingHistoryUseCase
  } = useReadingsContext();

  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readingInfo, setReadingInfo] = useState<ReadingInfo | null>(null);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);

  const fetchReadingData = useCallback(
    async (cadastralKey: string) => {
      setIsLoadingInfo(true);
      setIsLoadingHistory(true);

      try {
        const [infoResultSettled, historyResultSettled] =
          await Promise.allSettled([
            getReadingInfoUseCase.execute(cadastralKey),
            getReadingHistoryUseCase.execute(cadastralKey, 15, 0)
          ]);

        if (
          infoResultSettled.status === 'fulfilled' &&
          infoResultSettled.value
        ) {
          setReadingInfo(infoResultSettled.value[0] || null);
        } else {
          setReadingInfo(null);
          if (infoResultSettled.status === 'rejected') {
            console.error('Error fetching info:', infoResultSettled.reason);
            alert(
              infoResultSettled.reason?.response?.data?.message ||
                'Error al obtener la información de lectura.'
            );
          } else {
            alert(
              'No se encontraron datos para la clave catastral proporcionada.'
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

  const clearData = useCallback(() => {
    setReadingInfo(null);
    setReadingHistory([]);
  }, []);

  const submitUpdateReading = useCallback(
    async (readingId: number, request: UpdateReadingRequest) => {
      setIsSubmitting(true);
      try {
        const result = await updateReadingUseCase.execute(readingId, request);
        return result;
      } catch (error: any) {
        console.error('Error updating reading:', error);
        alert(
          error?.response?.data?.message || 'Error al actualizar la lectura.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateReadingUseCase]
  );

  return {
    isLoadingInfo,
    isLoadingHistory,
    readingInfo,
    readingHistory,
    isSubmitting,
    fetchReadingData,
    submitUpdateReading,
    clearData
  };
};

export default useUpdateReading;
