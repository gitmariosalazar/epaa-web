import { useState, useCallback, useEffect } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type { ReadingDetailed } from '../../domain/models/ReadingInfoResponse';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useTranslation } from 'react-i18next';

export const useReadingDetailViewModel = (
  cadastralKey: string | null,
  yearAndMonth: string | null
) => {
  const { getReadingInfoUseCase } = useReadingsContext();
  const { t } = useTranslation();

  const [readingDetail, setReadingDetail] = useState<ReadingDetailed | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadingDetail = useCallback(async () => {
    if (!cadastralKey || !yearAndMonth) {
      setReadingDetail(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result =
        await getReadingInfoUseCase.getDetailedReadingInfoByCadastralKey(
          cadastralKey,
          yearAndMonth
        );
      setReadingDetail(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t('common.error', 'Ocurrió un error inesperado');
      setError(errorMessage);
      MessageToastCustom('error', errorMessage, 'Error');
    } finally {
      setIsLoading(false);
    }
  }, [cadastralKey, yearAndMonth, getReadingInfoUseCase, t]);

  useEffect(() => {
    if (cadastralKey && yearAndMonth) {
      fetchReadingDetail();
    } else {
      setReadingDetail(null);
    }
  }, [cadastralKey, yearAndMonth, fetchReadingDetail]);

  return {
    readingDetail,
    isLoading,
    error,
    refetch: fetchReadingDetail
  };
};
