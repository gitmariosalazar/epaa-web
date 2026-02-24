import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import type { ReadingHistory } from '../../domain/models/ReadingHistory';
import type { CreateReadingRequest } from '../../domain/dto/request/CreateReadingRequest';

export const useReading = () => {
  const {
    getReadingInfoUseCase,
    getReadingHistoryUseCase,
    createReadingUseCase
  } = useReadingsContext();

  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [readingInfo, setReadingInfo] = useState<ReadingInfo | null>(null);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);

  const fetchReadingData = useCallback(
    async (cadastralKey: string) => {
      if (!cadastralKey) return;

      setIsLoadingInfo(true);
      setIsLoadingHistory(true);

      try {
        const [infoResult, historyResult] = await Promise.all([
          getReadingInfoUseCase.execute(cadastralKey),
          getReadingHistoryUseCase.execute(cadastralKey, 15, 0)
        ]);

        if (infoResult && infoResult.length > 0) {
          setReadingInfo(infoResult[0]);
        } else {
          setReadingInfo(null);
          alert(
            'No se encontraron datos para la clave catastral proporcionada.'
          );
        }

        if (historyResult) {
          setReadingHistory(historyResult);
        } else {
          setReadingHistory([]);
        }
      } catch (error: any) {
        console.error('Error fetching reading data:', error);
        alert(
          error.response?.data?.message || 'Error al obtener la información.'
        );
        setReadingInfo(null);
        setReadingHistory([]);
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

  const submitReading = useCallback(
    async (request: CreateReadingRequest) => {
      setIsSubmitting(true);
      try {
        const result = await createReadingUseCase.execute(request);
        alert('Lectura guardada exitosamente.');

        // Refresh both info and history after saving
        if (request.cadastralKey) {
          await fetchReadingData(request.cadastralKey);
        }
        return result;
      } catch (error: any) {
        console.error('Error creating reading:', error);
        alert(error.response?.data?.message || 'Error al guardar la lectura.');
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
    clearData,
    submitReading
  };
};
