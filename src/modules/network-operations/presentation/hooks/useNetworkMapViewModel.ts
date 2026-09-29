import { useState, useCallback } from 'react';
import type { MapGeojsonResponse } from '../../domain/models/GeoJsonFeature';
import { useNetworkOperationsContext } from '../context/NetworkOperationsContext';

export function useNetworkMapViewModel() {
  const { getNetworkMapGeoJsonUseCase } = useNetworkOperationsContext();
  
  const [geoJsonData, setGeoJsonData] = useState<MapGeojsonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMapData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNetworkMapGeoJsonUseCase.execute();
      setGeoJsonData(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching network map data');
    } finally {
      setLoading(false);
    }
  }, [getNetworkMapGeoJsonUseCase]);

  return {
    geoJsonData,
    loading,
    error,
    fetchMapData
  };
}
