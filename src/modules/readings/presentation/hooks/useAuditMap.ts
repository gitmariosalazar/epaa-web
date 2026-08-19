import { useState, useCallback } from 'react';
import { useReadingsContext } from '../context/ReadingsContext';
import type { MapRouteFeatureCollection } from '../../domain/models/map-geojson';

export const useAuditMap = () => {
  const { getMapGeojsonByDayAndByUserUseCase } = useReadingsContext();
  const [geojsonData, setGeojsonData] = useState<MapRouteFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMapData = useCallback(
    async (date: string, userId?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMapGeojsonByDayAndByUserUseCase.execute(date, userId);
        setGeojsonData(data);
      } catch (err: any) {
        console.error('Error fetching map geojson:', err);
        setError(err.message || 'Error al obtener los datos del mapa');
      } finally {
        setIsLoading(false);
      }
    },
    [getMapGeojsonByDayAndByUserUseCase]
  );

  const clearMapData = useCallback(() => {
    setGeojsonData(null);
    setError(null);
  }, []);

  return {
    geojsonData,
    isLoading,
    error,
    fetchMapData,
    clearMapData
  };
};
