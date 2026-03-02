import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type { ReadingImages } from '../../domain/models/ReadingImages';

export const useReadingImagesList = () => {
  const { readingImagesUseCase } = useReadingsContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readingImages, setReadingImages] = useState<ReadingImages[]>([]);

  const fetchImages = useCallback(
    async ({
      month,
      sector,
      cadastralKey
    }: {
      month?: string;
      sector?: string | number;
      cadastralKey?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        let result: ReadingImages[] = [];

        if (cadastralKey) {
          result =
            await readingImagesUseCase.executeFindByCadastralKey(cadastralKey);
        } else if (month && sector) {
          result = await readingImagesUseCase.executeFindByMonthAndSector(
            month,
            Number(sector)
          );
        } else if (month) {
          result = await readingImagesUseCase.executeFindByMonth(month);
        } else {
          result = await readingImagesUseCase.executeFindAll();
        }

        setReadingImages(result || []);
      } catch (err: any) {
        console.error('Error fetching reading images', err);
        setError(
          err.response?.data?.message ||
            'Ocurrió un error al cargar las imágenes de lecturas.'
        );
        setReadingImages([]);
      } finally {
        setIsLoading(false);
      }
    },
    [readingImagesUseCase]
  );

  return {
    readingImages,
    isLoading,
    error,
    fetchImages
  };
};
