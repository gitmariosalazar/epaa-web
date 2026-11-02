import { useState, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useReadingRoutesContext } from '../context/ReadingRoutesContext';
import type {
  ReadingRoute,
  RouteCentroidFeatureCollection,
  RouteGeoJsonFeatureCollection,
} from '../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../domain/models/RouteConnection';
import { notify } from '../utils/notify';

export interface UseRouteMapViewModelReturn {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  centroidsData: RouteCentroidFeatureCollection | null;
  selectedRoute: ReadingRoute | null;
  routeConnections: RouteConnection[];
  isConnectionsLoading: boolean;
  isOptimizing: boolean;
  selectedSector: number | undefined;
  setSelectedSector: Dispatch<SetStateAction<number | undefined>>;
  activaOnly: boolean;
  setActivaOnly: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isSidePanelOpen: boolean;
  selectRouteById: (idRuta: number) => Promise<ReadingRoute | null>;
  closeSidePanel: () => void;
  optimizeSequence: (idRuta: number, acometidaInicio?: string) => Promise<void>;
  refreshMap: () => void;
}

export const useRouteMapViewModel = (): UseRouteMapViewModelReturn => {
  const {
    getRoutesGeoJsonUseCase,
    getRouteCentroidsUseCase,
    getRouteByIdUseCase,
    getRouteConnectionsUseCase,
    optimizeRouteSequenceUseCase,
  } = useReadingRoutesContext();

  const [geojsonData, setGeojsonData] =
    useState<RouteGeoJsonFeatureCollection | null>(null);
  const [centroidsData, setCentroidsData] =
    useState<RouteCentroidFeatureCollection | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<ReadingRoute | null>(null);
  const [routeConnections, setRouteConnections] = useState<RouteConnection[]>([]);
  const [isConnectionsLoading, setIsConnectionsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const [selectedSector, setSelectedSector] = useState<number | undefined>(
    undefined,
  );
  const [activaOnly, setActivaOnly] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  // Fetch GeoJSON polygons
  const loadGeoJson = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRoutesGeoJsonUseCase.execute(
        selectedSector,
        activaOnly,
      );
      setGeojsonData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      notify.error('Error al cargar la capa de polígonos de rutas: ' + msg);
    } finally {
      setIsLoading(false);
    }
  }, [getRoutesGeoJsonUseCase, selectedSector, activaOnly]);

  // Fetch 79 Centroids
  const loadCentroids = useCallback(async () => {
    try {
      const data = await getRouteCentroidsUseCase.execute(activaOnly);
      setCentroidsData(data);
    } catch (err: unknown) {
      console.error('Error al cargar centroides:', err);
    }
  }, [getRouteCentroidsUseCase, activaOnly]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadGeoJson();
    });
  }, [loadGeoJson]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadCentroids();
    });
  }, [loadCentroids]);

  // Select a Route by ID (from polygon click, centroid, or table)
  const selectRouteById = useCallback(
    async (idRuta: number): Promise<ReadingRoute | null> => {
      try {
        setIsConnectionsLoading(true);
        setIsSidePanelOpen(true);
        const [route, connections] = await Promise.all([
          getRouteByIdUseCase.execute(idRuta),
          getRouteConnectionsUseCase.execute(idRuta),
        ]);
        setSelectedRoute(route);
        setRouteConnections(connections);
        return route;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        notify.error('Error al cargar detalle de ruta: ' + msg);
        return null;
      } finally {
        setIsConnectionsLoading(false);
      }
    },
    [getRouteByIdUseCase, getRouteConnectionsUseCase],
  );

  const closeSidePanel = useCallback(() => {
    setIsSidePanelOpen(false);
    setSelectedRoute(null);
    setRouteConnections([]);
  }, []);

  // Optimize sequence
  const optimizeSequence = useCallback(
    async (idRuta: number, acometidaInicio?: string) => {
      setIsOptimizing(true);
      try {
        const result = await optimizeRouteSequenceUseCase.execute(idRuta, {
          acometidaInicio,
        });
        notify.success(
          `Secuencia optimizada: ${result.totalReordenadas} medidores reordenados (${result.distanciaTotalCaminadaMetros} m caminata estimada).`,
        );
        // Recargar conexiones
        const updatedConnections = await getRouteConnectionsUseCase.execute(
          idRuta,
        );
        setRouteConnections(updatedConnections);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        notify.error('Error al optimizar secuencia: ' + msg);
      } finally {
        setIsOptimizing(false);
      }
    },
    [optimizeRouteSequenceUseCase, getRouteConnectionsUseCase],
  );

  return {
    geojsonData,
    centroidsData,
    selectedRoute,
    routeConnections,
    isConnectionsLoading,
    isOptimizing,
    selectedSector,
    setSelectedSector,
    activaOnly,
    setActivaOnly,
    isLoading,
    isSidePanelOpen,
    selectRouteById,
    closeSidePanel,
    optimizeSequence,
    refreshMap: () => {
      void loadGeoJson();
      void loadCentroids();
    },
  };
};
