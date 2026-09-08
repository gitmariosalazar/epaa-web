import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type { ReadingImages } from '../../domain/models/ReadingImages';
import { FilterReadingImagesUseCase } from '../../application/usecases/FilterReadingImagesUseCase';

interface FetchFilterParams {
  month?: string;
  sector?: string | number;
  cadastralKey?: string;
  date?: string;
  novelty?: string;
  updatedStatus?: string;
}

export const useFindReadingImagesByFilter = () => {
  const { findReadingImagesByFilterUseCase } = useReadingsContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readingImages, setReadingImages] = useState<ReadingImages[]>([]);

  const fetchImagesByFilter = useCallback(
    async ({
      month,
      sector,
      cadastralKey,
      date,
      novelty,
      updatedStatus
    }: FetchFilterParams) => {
      setIsLoading(true);
      setError(null);

      try {
        let result = await findReadingImagesByFilterUseCase.execute({
          month,
          cadastralKey,
          sector: sector ? Number(sector) : undefined,
          date
        });

        if (novelty || updatedStatus) {
          const filterUseCase = new FilterReadingImagesUseCase();
          result = filterUseCase.execute(result, { novelty, updatedStatus });
        }

        setReadingImages(result || []);
      } catch (err: any) {
        if (err?.status === 404) {
          setError(null);
        } else {
          setError(
            err?.status ||
              'Ocurrió un error al buscar las imágenes de lecturas por filtro.'
          );
        }
        setReadingImages([]);
      } finally {
        setIsLoading(false);
      }
    },
    [findReadingImagesByFilterUseCase]
  );

  return {
    readingImages,
    isLoading,
    error,
    fetchImagesByFilter
  };
};
