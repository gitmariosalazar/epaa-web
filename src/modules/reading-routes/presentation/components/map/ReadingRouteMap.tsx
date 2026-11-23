import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react';
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow
} from '@vis.gl/react-google-maps';
import {
  Layers,
  MapPin,
  RefreshCw,
  ZoomIn,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type {
  ReadingRoute,
  RouteCentroidFeature,
  RouteCentroidFeatureCollection,
  RouteGeoJsonFeatureCollection
} from '../../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../../domain/models/RouteConnection';
import { ReadingRouteCentroidMarker } from './ReadingRouteCentroidMarker';
import { ReadingRouteConnectionMarker } from './ReadingRouteConnectionMarker';
import { ReadingRouteMapInfoWindow } from './ReadingRouteMapInfoWindow';
import { ReadingRouteMapSidePanel } from './ReadingRouteMapSidePanel';
import {
  getMapThemeConfig,
  type MapThemeConfig
} from './ReadingRouteMapStyles';
import './ReadingRouteMap.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { Select } from '@/shared/presentation/components/Input/Select';
import { sectors as DEFAULT_SECTORS } from '@/shared/utils/listSectors';

interface ReadingRouteMapDataLayerProps {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  showPolygons: boolean;
  selectedRoute: ReadingRoute | null;
  onSelectRouteId: (idRuta: number) => void;
  mapTheme: MapThemeConfig;
}

const ReadingRouteMapDataLayer: React.FC<ReadingRouteMapDataLayerProps> = ({
  geojsonData,
  showPolygons,
  selectedRoute,
  onSelectRouteId,
  mapTheme
}) => {
  const map = useMap();
  const onSelectRouteIdRef = useRef(onSelectRouteId);
  onSelectRouteIdRef.current = onSelectRouteId;

  // 1. Cargar GeoJSON únicamente cuando cambien los datos o la visibilidad de polígonos
  useEffect(() => {
    if (!map) return;

    // Limpiar polígonos anteriores
    map.data.forEach((feature) => {
      map.data.remove(feature);
    });

    if (!showPolygons || !geojsonData) return;

    try {
      map.data.addGeoJson(geojsonData);
    } catch (e) {
      console.warn('Error al cargar GeoJSON de rutas:', e);
    }
  }, [map, geojsonData, showPolygons]);

  // 2. Listener de clic en polígonos (estable, no recreado en cada render)
  useEffect(() => {
    if (!map) return;

    const clickListener = map.data.addListener(
      'click',
      (event: google.maps.Data.MouseEvent) => {
        const idRuta = event.feature.getProperty('idRuta');
        if (idRuta) {
          onSelectRouteIdRef.current(Number(idRuta));
        }
      }
    );

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map]);

  // 3. Aplicar estilos dinámicos sin destruir ni re-parsear las geometrías de polígonos
  useEffect(() => {
    if (!map) return;

    const selectedId = selectedRoute?.idRuta;

    map.data.setStyle((feature: google.maps.Data.Feature) => {
      const color = String(feature.getProperty('color') || '#0284c7');
      const idRuta = Number(feature.getProperty('idRuta'));
      const isSelected = Boolean(selectedId && selectedId === idRuta);
      return {
        fillColor: color,
        fillOpacity: isSelected
          ? mapTheme.polygon.selectedFillOpacity
          : mapTheme.polygon.unselectedFillOpacity,
        strokeColor: isSelected ? mapTheme.polygon.selectedStroke : color,
        strokeWeight: isSelected
          ? mapTheme.polygon.selectedStrokeWeight
          : mapTheme.polygon.unselectedStrokeWeight,
        zIndex: isSelected ? 25 : 2
      };
    });
  }, [map, selectedRoute?.idRuta, mapTheme]);

  return null;
};

// Subcomponente: Sincronización dinámica de tema en el mapa (SRP / OCP)
const MapThemeSyncController: React.FC<{ mapTheme: MapThemeConfig }> = ({
  mapTheme
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    try {
      map.setOptions({
        colorScheme: mapTheme.colorScheme,
        styles: mapTheme.styles
      });
    } catch {
      // Fallback seguro en caso de entornos con versión API fija
    }
  }, [map, mapTheme]);

  return null;
};

// Map Camera Controller: Solo mueve la cámara cuando se define un nuevo objetivo (Elimina micro-bucle)
const MapCameraController: React.FC<{
  centerTarget: { lat: number; lng: number } | null;
  zoomTarget?: number;
}> = ({ centerTarget, zoomTarget }) => {
  const map = useMap();
  const prevTargetRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!map || !centerTarget) return;

    const lat =
      typeof centerTarget.lat === 'number'
        ? centerTarget.lat
        : parseFloat(String(centerTarget.lat));
    const lng =
      typeof centerTarget.lng === 'number'
        ? centerTarget.lng
        : parseFloat(String(centerTarget.lng));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    // Prevenir micro-bucle si las coordenadas no han variado
    const prev = prevTargetRef.current;
    if (prev && prev.lat === lat && prev.lng === lng) return;

    prevTargetRef.current = { lat, lng };
    map.panTo({ lat, lng });
    if (typeof zoomTarget === 'number' && Number.isFinite(zoomTarget)) {
      map.setZoom(zoomTarget);
    }
  }, [map, centerTarget, zoomTarget]);

  return null;
};

// Capa Vectorial de Acometidas en Google Maps (GPU accelerated, zero DOM overhead)
interface ReadingRouteConnectionsDataLayerProps {
  connections: RouteConnection[];
  selectedConnectionId?: number | string | null;
  onSelectConnection: (
    conn: RouteConnection,
    coords: { lat: number; lng: number }
  ) => void;
  showPoints: boolean;
}

const ReadingRouteConnectionsDataLayer: React.FC<
  ReadingRouteConnectionsDataLayerProps
> = ({
  connections,
  selectedConnectionId,
  onSelectConnection,
  showPoints
}) => {
    const map = useMap();
    const onSelectRef = useRef(onSelectConnection);
    onSelectRef.current = onSelectConnection;
    const dataLayerRef = useRef<google.maps.Data | null>(null);

    // Instanciar capa de datos dedicada en Google Maps
    useEffect(() => {
      if (!map) return;
      const dataLayer = new google.maps.Data();
      dataLayer.setMap(map);
      dataLayerRef.current = dataLayer;

      const clickListener = dataLayer.addListener(
        'click',
        (event: google.maps.Data.MouseEvent) => {
          const conn = event.feature.getProperty('connection') as RouteConnection;
          const lat = event.latLng?.lat();
          const lng = event.latLng?.lng();
          if (conn && typeof lat === 'number' && typeof lng === 'number') {
            onSelectRef.current(conn, { lat, lng });
          }
        }
      );

      return () => {
        google.maps.event.removeListener(clickListener);
        dataLayer.setMap(null);
        dataLayerRef.current = null;
      };
    }, [map]);

    // Cargar puntos de acometidas en la capa vectorial
    useEffect(() => {
      const dataLayer = dataLayerRef.current;
      if (!dataLayer) return;

      dataLayer.forEach((feature) => {
        dataLayer.remove(feature);
      });

      if (!showPoints || !connections || connections.length === 0) return;

      connections.forEach((conn) => {
        const coords = getValidCoords(conn.latitud, conn.longitud);
        if (!coords) return;

        const feature = new google.maps.Data.Feature({
          geometry: new google.maps.Data.Point(coords),
          id: conn.idRutaAcometida || conn.acometidaId,
          properties: {
            connection: conn,
            ordenSecuencia: conn.ordenSecuencia,
            numeroMedidor: conn.numeroMedidor || 'S/N',
            abonado: conn.abonado || 'Consumidor',
            id: conn.idRutaAcometida || conn.acometidaId
          }
        });
        dataLayer.add(feature);
      });
    }, [connections, showPoints]);

    // Aplicar estilos vectoriales ligeros por GPU
    useEffect(() => {
      const dataLayer = dataLayerRef.current;
      if (!dataLayer) return;

      dataLayer.setStyle((feature: google.maps.Data.Feature) => {
        const id = feature.getProperty('id');
        const isSelected = Boolean(
          selectedConnectionId && selectedConnectionId === id
        );
        const seq = feature.getProperty('ordenSecuencia');
        const meter = feature.getProperty('numeroMedidor');
        const abonado = feature.getProperty('abonado');

        return {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 8 : 4.5,
            fillColor: isSelected ? '#ef4444' : '#0284c7',
            fillOpacity: isSelected ? 1 : 0.85,
            strokeColor: '#ffffff',
            strokeWeight: isSelected ? 2.5 : 1.2
          },
          title: `Secuencia #${seq} • Medidor: ${meter} • ${abonado}`,
          zIndex: isSelected ? 50 : 10
        };
      });
    }, [selectedConnectionId]);

    return null;
  };

export interface ReadingRouteMapProps {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  centroidsData?: RouteCentroidFeatureCollection | null;
  selectedRoute?: ReadingRoute | null;
  routeConnections?: RouteConnection[];
  isConnectionsLoading?: boolean;
  isOptimizing?: boolean;
  selectedSector?: number | undefined;
  onSectorChange?: (sector: number | undefined) => void;
  periodoFilter?: string;
  onPeriodoChange?: (periodo: string) => void;
  estadoFilter?: string;
  onEstadoChange?: (estado: string) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  onSelectRouteId?: (idRuta: number) => void;
  onCloseSidePanel?: () => void;
  onOptimizeSequence?: (idRuta: number) => Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
  isSidePanelOpen?: boolean;
  onAssignRoute?: (route: ReadingRoute) => void;
  onReassignRoute?: (route: ReadingRoute) => void;
}

const getValidCoords = (
  lat: unknown,
  lng: unknown
): { lat: number; lng: number } | null => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return null;
  }
  const numLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
  const numLng = typeof lng === 'number' ? lng : parseFloat(String(lng));
  if (!Number.isFinite(numLat) || !Number.isFinite(numLng)) {
    return null;
  }
  if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
    return null;
  }
  if (numLat === 0 && numLng === 0) {
    return null;
  }
  return { lat: numLat, lng: numLng };
};

export const ReadingRouteMap: React.FC<ReadingRouteMapProps> = ({
  geojsonData,
  centroidsData = null,
  selectedRoute = null,
  routeConnections = [],
  isConnectionsLoading = false,
  isOptimizing = false,
  selectedSector = undefined,
  onSectorChange = () => {},
  periodoFilter = '',
  onPeriodoChange = () => {},
  estadoFilter = 'TODOS',
  onEstadoChange = () => {},
  onResetFilters,
  hasActiveFilters,
  onSelectRouteId = () => {},
  onCloseSidePanel = () => {},
  onOptimizeSequence = async () => {},
  onRefresh = () => {},
  isLoading = false,
  isSidePanelOpen = false,
  onAssignRoute,
  onReassignRoute
}) => {
  const { theme } = useTheme();
  const mapTheme = useMemo(() => getMapThemeConfig(theme), [theme]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

  const [showPolygons, setShowPolygons] = useState(true);
  const [showCentroids, setShowCentroids] = useState(true);
  const [showConnectionPoints, setShowConnectionPoints] = useState(true);
  const [selectedConnection, setSelectedConnection] =
    useState<RouteConnection | null>(null);
  const [infoWindowCentroid, setInfoWindowCentroid] =
    useState<RouteCentroidFeature | null>(null);
  const [infoWindowCoords, setInfoWindowCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [cameraTarget, setCameraTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [cameraZoom, setCameraZoom] = useState<number | undefined>(undefined);
  const [focusedConnectionCoords, setFocusedConnectionCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Sectores estándar del 1 al 40 (complementados con cualquier sector de centroides)
  const sectors = useMemo(() => {
    const set = new Set<number>(DEFAULT_SECTORS.map((s) => s.id));
    if (centroidsData?.features) {
      centroidsData.features.forEach((f: RouteCentroidFeature) => {
        const sec = f.properties.sector ?? f.properties.sectorId;
        if (typeof sec === 'number' && Number.isFinite(sec)) {
          set.add(sec);
        }
      });
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [centroidsData]);

  // Filtered centroids based on selectedSector
  const filteredCentroids = useMemo(() => {
    if (!centroidsData?.features) return [];
    if (!selectedSector) return centroidsData.features;
    return centroidsData.features.filter((f: RouteCentroidFeature) => {
      const sec = f.properties.sector ?? f.properties.sectorId;
      return sec === selectedSector;
    });
  }, [centroidsData, selectedSector]);

  const handleCentroidClick = useCallback(
    (feature: RouteCentroidFeature, coords: { lat: number; lng: number }) => {
      const lat =
        typeof coords.lat === 'number'
          ? coords.lat
          : parseFloat(String(coords.lat));
      const lng =
        typeof coords.lng === 'number'
          ? coords.lng
          : parseFloat(String(coords.lng));
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setInfoWindowCentroid(feature);
        setInfoWindowCoords({ lat, lng });
        setCameraTarget({ lat, lng });
        setCameraZoom(14);
      }
    },
    []
  );

  const handleOpenSidePanelFromInfoWindow = useCallback(
    (idRuta: number) => {
      setInfoWindowCentroid(null);
      setInfoWindowCoords(null);
      onSelectRouteId(idRuta);
    },
    [onSelectRouteId]
  );

  const handleResetView = useCallback(() => {
    setCameraTarget({
      lat: Number(FALLBACK_CENTER_ANTONIO_ANTE.lat),
      lng: Number(FALLBACK_CENTER_ANTONIO_ANTE.lng)
    });
    setCameraZoom(13);
    setFocusedConnectionCoords(null);
  }, []);

  const handleFocusConnection = useCallback((lat: unknown, lng: unknown) => {
    const numLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
    const numLng = typeof lng === 'number' ? lng : parseFloat(String(lng));
    if (Number.isFinite(numLat) && Number.isFinite(numLng)) {
      setCameraTarget({ lat: numLat, lng: numLng });
      setCameraZoom(18);
      setFocusedConnectionCoords({ lat: numLat, lng: numLng });
    }
  }, []);

  const handleConnectionClick = useCallback(
    (conn: RouteConnection, coords: { lat: number; lng: number }) => {
      setSelectedConnection(conn);
      setFocusedConnectionCoords(coords);
      setCameraTarget(coords);
      setCameraZoom(18);
    },
    []
  );

  // Limpiar conexión seleccionada si cambia la ruta
  useEffect(() => {
    setSelectedConnection(null);
  }, [selectedRoute?.idRuta]);

  // Centrar cámara en el centroide de la ruta seleccionada
  useEffect(() => {
    if (!selectedRoute) return;
    const feat = centroidsData?.features?.find(
      (f: RouteCentroidFeature) => f.properties.idRuta === selectedRoute.idRuta
    );
    if (feat) {
      const lat = feat.properties.latitud;
      const lng = feat.properties.longitud;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setCameraTarget({ lat, lng });
        setCameraZoom(15);
      }
    }
  }, [selectedRoute?.idRuta, centroidsData]);

  const handleCloseSidePanel = useCallback(() => {
    setFocusedConnectionCoords(null);
    setSelectedConnection(null);
    onCloseSidePanel();
  }, [onCloseSidePanel]);

  return (
    <div className="reading-route-map-wrapper">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        {/* Toolbar */}
        <div className="reading-route-map-toolbar">
          {/* Layer toggles */}
          <div className="reading-route-map-toolbar-group">
            <button
              type="button"
              className={`reading-route-map-btn ${showPolygons ? 'active' : ''}`}
              onClick={() => setShowPolygons((prev) => !prev)}
              title="Alternar visibilidad de polígonos GeoJSON"
            >
              <Layers size={14} />
              Polígonos
            </button>
            <button
              type="button"
              className={`reading-route-map-btn ${showCentroids ? 'active' : ''}`}
              onClick={() => setShowCentroids((prev) => !prev)}
              title="Alternar visibilidad de marcadores de centroides"
            >
              {showCentroids ? <Eye size={14} /> : <EyeOff size={14} />}
              Centroides
            </button>
            {selectedRoute && (
              <button
                type="button"
                className={`reading-route-map-btn ${showConnectionPoints ? 'active' : ''}`}
                onClick={() => setShowConnectionPoints((prev) => !prev)}
                title="Alternar visibilidad de puntos de acometidas en la ruta seleccionada"
              >
                {showConnectionPoints ? (
                  <MapPin size={14} />
                ) : (
                  <EyeOff size={14} />
                )}
                Acometidas ({routeConnections.length})
              </button>
            )}
          </div>

          <div className="reading-route-map-toolbar-divider" />

          {/* Filtro Período */}
          <div className="reading-route-map-toolbar-group reading-route-map-filter-item">
            <Tooltip
              content="Selecciona el período operativo mensual"
              followCursor={false}
              themeColor="indigo"
            >
              <DatePicker
                value={periodoFilter}
                onChange={(val) => onPeriodoChange(val)}
                size="small"
                view="month"
              />
            </Tooltip>
          </div>

          <div className="reading-route-map-toolbar-divider" />

          {/* Filtro Estado de Asignación */}
          <div className="reading-route-map-toolbar-group reading-route-map-filter-item">
            <Tooltip
              content="Filtrar por estado de asignación de la ruta"
              followCursor={false}
              themeColor="indigo"
            >
              <Select
                value={estadoFilter || 'TODOS'}
                onChange={(e) => onEstadoChange(e.target.value)}
                aria-label="Filtrar por estado de asignación"
                size="small"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="NO_ASIGNADA">Sin Asignar (Pendientes)</option>
                <option value="ASIGNADA">Asignadas</option>
                <option value="EN_PROCESO">En Proceso (En campo)</option>
                <option value="PAUSADA">Pausadas</option>
                <option value="COMPLETADA">Completadas</option>
                <option value="REASIGNADA">Reasignadas</option>
              </Select>
            </Tooltip>
          </div>

          <div className="reading-route-map-toolbar-divider" />

          {/* Sector Selector */}
          <div className="reading-route-map-toolbar-group reading-route-map-filter-item">
            <Tooltip
              content="Filtrar por sector comercial/hidráulico"
              followCursor={false}
              themeColor="indigo"
            >
              <Select
                value={selectedSector ?? ''}
                onChange={(e) =>
                  onSectorChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                aria-label="Filtrar por sector"
                size="small"
              >
                <option value="">Todos los sectores</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    Sector {sec}
                  </option>
                ))}
              </Select>
            </Tooltip>
          </div>

          {/* Botón Restablecer Filtros */}
          {hasActiveFilters && onResetFilters && (
            <>
              <div className="reading-route-map-toolbar-divider" />
              <Tooltip
                content="Restablecer todos los filtros"
                followCursor={false}
                themeColor="indigo"
              >
                <button
                  type="button"
                  className="reading-route-map-reset-btn"
                  onClick={onResetFilters}
                >
                  <RotateCcw size={12} />
                  Limpiar
                </button>
              </Tooltip>
            </>
          )}

          <div className="reading-route-map-toolbar-divider" />

          {/* Map reset & reload */}
          <div className="reading-route-map-toolbar-group">
            <Tooltip
              content="Centrar vista en Antonio Ante"
              followCursor={false}
              themeColor="indigo"
            >
              <button
                type="button"
                className="reading-route-map-btn"
                onClick={handleResetView}
              >
                <ZoomIn size={14} />
                Centrar
              </button>
            </Tooltip>
            <Tooltip
              content="Refrescar capas"
              followCursor={false}
              themeColor="indigo"
            >
              <button
                type="button"
                className="reading-route-map-btn"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  size={14}
                  className={isLoading ? 'animate-spin' : ''}
                />
              </button>
            </Tooltip>
          </div>

          <div className="reading-route-map-toolbar-divider" />

          {/* Stats Badge */}
          <div className="reading-route-map-stats">
            <MapPin size={13} style={{ color: 'var(--accent)' }} />
            <span>{filteredCentroids.length} Rutas</span>
          </div>
        </div>

        {/* Legend */}
        <div className="reading-route-map-legend">
          <div className="reading-route-legend-title">Estado de Asignación</div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#64748b' }}
            />
            <span>Sin Asignar (Pendiente)</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#2563eb' }}
            />
            <span>Asignada</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#f59e0b' }}
            />
            <span>En Proceso</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#10b981' }}
            />
            <span>Completada</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#ef4444' }}
            />
            <span>Pausada</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#8b5cf6' }}
            />
            <span>Reasignada</span>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="reading-route-map-loading-overlay">
            <div className="reading-route-map-loading-spinner" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Cargando capas cartográficas...
            </span>
          </div>
        )}

        {/* Map Container */}
        <div className="reading-route-map-container">
          <Map
            colorScheme={mapTheme.colorScheme}
            defaultCenter={{
              lat: FALLBACK_CENTER_ANTONIO_ANTE.lat,
              lng: FALLBACK_CENTER_ANTONIO_ANTE.lng
            }}
            defaultZoom={13}
            mapId={mapId}
            styles={mapTheme.styles}
            disableDefaultUI={false}
            zoomControl={true}
            streetViewControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
          >
            {/* Theme synchronizer */}
            <MapThemeSyncController mapTheme={mapTheme} />

            {/* GeoJSON layer */}
            <ReadingRouteMapDataLayer
              geojsonData={geojsonData}
              showPolygons={showPolygons}
              selectedRoute={selectedRoute}
              onSelectRouteId={onSelectRouteId}
              mapTheme={mapTheme}
            />

            {/* Camera controller */}
            <MapCameraController
              centerTarget={cameraTarget}
              zoomTarget={cameraZoom}
            />

            {/* Centroid markers */}
            {showCentroids &&
              filteredCentroids.map((feat: RouteCentroidFeature) => (
                <ReadingRouteCentroidMarker
                  key={feat.properties.idRuta}
                  feature={feat}
                  isSelected={selectedRoute?.idRuta === feat.properties.idRuta}
                  onClick={handleCentroidClick}
                />
              ))}

            {/* Capa vectorial de acometidas (GPU acelerada en canvas WebGL, cero sobrecarga DOM) */}
            {showConnectionPoints && selectedRoute && (
              <ReadingRouteConnectionsDataLayer
                connections={routeConnections}
                selectedConnectionId={
                  selectedConnection?.idRutaAcometida ??
                  selectedConnection?.acometidaId
                }
                onSelectConnection={handleConnectionClick}
                showPoints={showConnectionPoints}
              />
            )}

            {/* Marcador DOM activo únicamente para la acometida actualmente seleccionada */}
            {selectedConnection &&
              (() => {
                const coords = getValidCoords(
                  selectedConnection.latitud,
                  selectedConnection.longitud
                );
                if (!coords) return null;
                return (
                  <ReadingRouteConnectionMarker
                    key={`active-conn-${selectedConnection.idRutaAcometida || selectedConnection.acometidaId}`}
                    connection={selectedConnection}
                    isSelected={true}
                    onClick={handleConnectionClick}
                  />
                );
              })()}

            {/* Focused Connection Highlight Pin */}
            {focusedConnectionCoords && (
              <AdvancedMarker
                position={focusedConnectionCoords}
                anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
              >
                <div
                  className="focused-connection-pin"
                  title="Acometida enfocada"
                >
                  <div className="focused-connection-pulse" />
                  <div className="focused-connection-dot" />
                </div>
              </AdvancedMarker>
            )}

            {/* InfoWindow de la acometida seleccionada */}
            {selectedConnection &&
              (() => {
                const coords = getValidCoords(
                  selectedConnection.latitud,
                  selectedConnection.longitud
                );
                if (!coords) return null;
                return (
                  <InfoWindow
                    position={coords}
                    onCloseClick={() => setSelectedConnection(null)}
                  >
                    <div className="reading-route-connection-infowindow">
                      <span className="reading-route-connection-infowindow-seq">
                        Secuencia #{selectedConnection.ordenSecuencia}
                      </span>
                      <h4 className="reading-route-connection-infowindow-title">
                        {selectedConnection.abonado || 'Consumidor desconocido'}
                      </h4>
                      <div className="reading-route-connection-infowindow-row">
                        <span>Medidor:</span>
                        <strong>
                          {selectedConnection.numeroMedidor || 'Sin medidor'}
                        </strong>
                      </div>
                      <div className="reading-route-connection-infowindow-row">
                        <span>Cuenta / Acometida:</span>
                        <strong>
                          {selectedConnection.cuenta ||
                            selectedConnection.acometidaId ||
                            'N/D'}
                        </strong>
                      </div>
                      <div className="reading-route-connection-infowindow-row">
                        <span>Dirección:</span>
                        <span>
                          {selectedConnection.direccion ||
                            selectedConnection.referencia ||
                            'Sin dirección registrada'}
                        </span>
                      </div>
                    </div>
                  </InfoWindow>
                );
              })()}

            {/* InfoWindow */}
            {infoWindowCentroid && infoWindowCoords && (
              <ReadingRouteMapInfoWindow
                centroid={infoWindowCentroid}
                position={infoWindowCoords}
                onClose={() => {
                  setInfoWindowCentroid(null);
                  setInfoWindowCoords(null);
                }}
                onInspectRoute={handleOpenSidePanelFromInfoWindow}
              />
            )}
          </Map>
        </div>

        {/* Slide-out side panel for route details & connections */}
        {isSidePanelOpen && (
          <ReadingRouteMapSidePanel
            route={selectedRoute}
            connections={routeConnections}
            isLoadingConnections={isConnectionsLoading}
            isOptimizing={isOptimizing}
            onClose={handleCloseSidePanel}
            onOptimize={onOptimizeSequence}
            onFocusConnection={handleFocusConnection}
            onAssignRoute={onAssignRoute}
            onReassignRoute={onReassignRoute}
            showConnectionPoints={showConnectionPoints}
            onToggleConnectionPoints={() =>
              setShowConnectionPoints((prev) => !prev)
            }
            selectedConnectionId={
              selectedConnection?.idRutaAcometida ??
              selectedConnection?.acometidaId
            }
            onSelectConnection={(conn) => {
              setSelectedConnection(conn);
              const coords = getValidCoords(conn.latitud, conn.longitud);
              if (coords) {
                setFocusedConnectionCoords(coords);
              }
            }}
          />
        )}
      </APIProvider>
    </div>
  );
};
