import { useState, useEffect, useCallback } from 'react';
import { useReadingRoutesContext } from '../context/ReadingRoutesContext';
import type { RouteGeoJsonFeatureCollection } from '../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../domain/models/RouteConnection';

export interface UseBatchDispatchMapProps {
  selectedSector: number | undefined;
  selectedRouteId: number | null;
  isOpen: boolean;
}

export interface UseBatchDispatchMapReturn {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  isLoadingGeoJson: boolean;
  connections: RouteConnection[];
  isLoadingConnections: boolean;
  activeConnection: RouteConnection | null;
  setActiveConnection: (connection: RouteConnection | null) => void;
  refreshMapData: () => Promise<void>;
}

/**
 * Custom Hook: useBatchDispatchMap
 *
 * Responsabilidad única (SRP): Administrar la capa GIS del despacho masivo,
 * cargando polígonos del sector vía `GetRoutesGeoJsonUseCase` y puntos de acometidas
 * de la ruta seleccionada vía `GetRouteConnectionsUseCase`.
 */
export const useBatchDispatchMap = ({
  selectedSector,
  selectedRouteId,
  isOpen,
}: UseBatchDispatchMapProps): UseBatchDispatchMapReturn => {
  const { getRoutesGeoJsonUseCase, getRouteConnectionsUseCase } =
    useReadingRoutesContext();

  const [geojsonData, setGeojsonData] =
    useState<RouteGeoJsonFeatureCollection | null>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState(false);
  const [connections, setConnections] = useState<RouteConnection[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(false);
  const [activeConnection, setActiveConnection] =
    useState<RouteConnection | null>(null);

  // Carga de capa GeoJSON de polígonos del sector
  const loadGeoJson = useCallback(async () => {
    if (!isOpen) return;
    setIsLoadingGeoJson(true);
    try {
      const data = await getRoutesGeoJsonUseCase.execute(
        selectedSector,
        true,
      );
      setGeojsonData(data);
    } catch (err) {
      console.warn('Error al cargar capa GeoJSON de rutas en despacho:', err);
      setGeojsonData(null);
    } finally {
      setIsLoadingGeoJson(false);
    }
  }, [isOpen, selectedSector, getRoutesGeoJsonUseCase]);

  useEffect(() => {
    void loadGeoJson();
  }, [loadGeoJson]);

  // Carga de puntos de acometidas cuando se selecciona una ruta específica
  useEffect(() => {
    if (!isOpen || !selectedRouteId) {
      setConnections([]);
      setActiveConnection(null);
      return;
    }

    let isMounted = true;
    const loadConnections = async () => {
      setIsLoadingConnections(true);
      try {
        const data = await getRouteConnectionsUseCase.execute(selectedRouteId);
        if (isMounted) {
          setConnections(data || []);
          setActiveConnection(null);
        }
      } catch (err) {
        console.warn(
          `Error al cargar acometidas de ruta ${selectedRouteId}:`,
          err,
        );
        if (isMounted) {
          setConnections([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingConnections(false);
        }
      }
    };

    void loadConnections();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedRouteId, getRouteConnectionsUseCase]);

  return {
    geojsonData,
    isLoadingGeoJson,
    connections,
    isLoadingConnections,
    activeConnection,
    setActiveConnection,
    refreshMapData: loadGeoJson,
  };
};
