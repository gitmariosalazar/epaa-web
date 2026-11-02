import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
} from '@vis.gl/react-google-maps';
import { Layers, MapPin, RefreshCw, ZoomIn, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type {
  ReadingRoute,
  RouteCentroidFeature,
  RouteCentroidFeatureCollection,
  RouteGeoJsonFeatureCollection,
} from '../../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../../domain/models/RouteConnection';
import { ReadingRouteCentroidMarker } from './ReadingRouteCentroidMarker';
import { ReadingRouteMapInfoWindow } from './ReadingRouteMapInfoWindow';
import { ReadingRouteMapSidePanel } from './ReadingRouteMapSidePanel';
import { DARK_MAP_STYLE, SILVER_MAP_STYLE } from './ReadingRouteMapStyles';
import './ReadingRouteMap.css';

interface ReadingRouteMapDataLayerProps {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  showPolygons: boolean;
  selectedRoute: ReadingRoute | null;
  onSelectRouteId: (idRuta: number) => void;
}

const ReadingRouteMapDataLayer: React.FC<ReadingRouteMapDataLayerProps> = ({
  geojsonData,
  showPolygons,
  selectedRoute,
  onSelectRouteId,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Clear previous features
    map.data.forEach(feature => {
      map.data.remove(feature);
    });

    if (!showPolygons || !geojsonData) return;

    try {
      map.data.addGeoJson(geojsonData);
    } catch (e) {
      console.warn('Error al cargar GeoJSON de rutas:', e);
    }

    map.data.setStyle((feature: google.maps.Data.Feature) => {
      const color = String(feature.getProperty('color') || '#0284c7');
      const idRuta = Number(feature.getProperty('idRuta'));
      const isSelected = Boolean(selectedRoute && selectedRoute.idRuta === idRuta);
      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.45 : 0.2,
        strokeColor: isSelected ? '#ffffff' : color,
        strokeWeight: isSelected ? 3 : 1.5,
        zIndex: isSelected ? 25 : 2,
      };
    });

    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const idRuta = event.feature.getProperty('idRuta');
      if (idRuta) {
        onSelectRouteId(Number(idRuta));
      }
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, geojsonData, showPolygons, selectedRoute, onSelectRouteId]);

  return null;
};

// Map Camera Controller
const MapCameraController: React.FC<{
  centerTarget: { lat: number; lng: number } | null;
  zoomTarget?: number;
}> = ({ centerTarget, zoomTarget }) => {
  const map = useMap();
  useEffect(() => {
    if (map && centerTarget) {
      const lat =
        typeof centerTarget.lat === 'number'
          ? centerTarget.lat
          : parseFloat(String(centerTarget.lat));
      const lng =
        typeof centerTarget.lng === 'number'
          ? centerTarget.lng
          : parseFloat(String(centerTarget.lng));

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        map.panTo({ lat, lng });
        if (typeof zoomTarget === 'number' && Number.isFinite(zoomTarget)) {
          map.setZoom(zoomTarget);
        }
      }
    }
  }, [map, centerTarget, zoomTarget]);
  return null;
};

export interface ReadingRouteMapProps {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  centroidsData: RouteCentroidFeatureCollection | null;
  selectedRoute: ReadingRoute | null;
  routeConnections: RouteConnection[];
  isConnectionsLoading: boolean;
  isOptimizing: boolean;
  selectedSector: number | undefined;
  onSectorChange: (sector: number | undefined) => void;
  onSelectRouteId: (idRuta: number) => void;
  onCloseSidePanel: () => void;
  onOptimizeSequence: (idRuta: number) => Promise<void>;
  onRefresh: () => void;
  isLoading?: boolean;
  isSidePanelOpen: boolean;
  onAssignRoute?: (route: ReadingRoute) => void;
}

export const ReadingRouteMap: React.FC<ReadingRouteMapProps> = ({
  geojsonData,
  centroidsData,
  selectedRoute,
  routeConnections,
  isConnectionsLoading,
  isOptimizing,
  selectedSector,
  onSectorChange,
  onSelectRouteId,
  onCloseSidePanel,
  onOptimizeSequence,
  onRefresh,
  isLoading = false,
  isSidePanelOpen,
  onAssignRoute,
}) => {
  const { theme } = useTheme();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

  const [showPolygons, setShowPolygons] = useState(true);
  const [showCentroids, setShowCentroids] = useState(true);
  const [infoWindowCentroid, setInfoWindowCentroid] = useState<RouteCentroidFeature | null>(null);
  const [infoWindowCoords, setInfoWindowCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [cameraZoom, setCameraZoom] = useState<number | undefined>(undefined);
  const [focusedConnectionCoords, setFocusedConnectionCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Available sectors from centroids
  const sectors = useMemo(() => {
    if (!centroidsData?.features) return [];
    const set = new Set<number>();
    centroidsData.features.forEach((f: RouteCentroidFeature) => {
      if (typeof f.properties.sector === 'number') {
        set.add(f.properties.sector);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [centroidsData]);

  // Filtered centroids based on selectedSector
  const filteredCentroids = useMemo(() => {
    if (!centroidsData?.features) return [];
    if (!selectedSector) return centroidsData.features;
    return centroidsData.features.filter((f: RouteCentroidFeature) => f.properties.sector === selectedSector);
  }, [centroidsData, selectedSector]);

  const handleCentroidClick = useCallback(
    (feature: RouteCentroidFeature, coords: { lat: number; lng: number }) => {
      const lat = typeof coords.lat === 'number' ? coords.lat : parseFloat(String(coords.lat));
      const lng = typeof coords.lng === 'number' ? coords.lng : parseFloat(String(coords.lng));
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setInfoWindowCentroid(feature);
        setInfoWindowCoords({ lat, lng });
        setCameraTarget({ lat, lng });
        setCameraZoom(14);
      }
    },
    [],
  );

  const handleOpenSidePanelFromInfoWindow = useCallback(
    (idRuta: number) => {
      setInfoWindowCentroid(null);
      setInfoWindowCoords(null);
      onSelectRouteId(idRuta);
    },
    [onSelectRouteId],
  );

  const handleResetView = useCallback(() => {
    setCameraTarget({
      lat: Number(FALLBACK_CENTER_ANTONIO_ANTE.lat),
      lng: Number(FALLBACK_CENTER_ANTONIO_ANTE.lng),
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

  const handleCloseSidePanel = useCallback(() => {
    setFocusedConnectionCoords(null);
    onCloseSidePanel();
  }, [onCloseSidePanel]);

  return (
    <div className="reading-route-map-wrapper">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        {/* Toolbar */}
        <div className="reading-route-map-toolbar">
          <div className="reading-route-map-toolbar-group">
            <button
              className={`reading-route-map-btn ${showPolygons ? 'active' : ''}`}
              onClick={() => setShowPolygons(prev => !prev)}
              title="Alternar visibilidad de polígonos GeoJSON"
            >
              <Layers size={14} />
              Polígonos
            </button>
            <button
              className={`reading-route-map-btn ${showCentroids ? 'active' : ''}`}
              onClick={() => setShowCentroids(prev => !prev)}
              title="Alternar visibilidad de marcadores de centroides"
            >
              {showCentroids ? <Eye size={14} /> : <EyeOff size={14} />}
              Centroides
            </button>
          </div>

          <div className="reading-route-map-toolbar-divider" />

          {/* Sector Selector */}
          <div className="reading-route-map-toolbar-group">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Sector:
            </span>
            <select
              className="reading-route-map-select"
              value={selectedSector ?? ''}
              onChange={e => onSectorChange(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Todos los sectores</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>
                  Sector {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="reading-route-map-toolbar-divider" />

          {/* Map reset & reload */}
          <div className="reading-route-map-toolbar-group">
            <button
              className="reading-route-map-btn"
              onClick={handleResetView}
              title="Centrar vista en Antonio Ante"
            >
              <ZoomIn size={14} />
              Centrar
            </button>
            <button
              className="reading-route-map-btn"
              onClick={onRefresh}
              title="Refrescar capas"
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
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
          <div className="reading-route-legend-title">Simbología SIG</div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#2563eb' }}
            />
            <span>Sector 1 (Centro Urbano)</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#10b981' }}
            />
            <span>Sector 2 (Andrade Marín)</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#f59e0b' }}
            />
            <span>Sector 3 (San Roque)</span>
          </div>
          <div className="reading-route-legend-item">
            <span
              className="reading-route-legend-swatch"
              style={{ backgroundColor: '#8b5cf6' }}
            />
            <span>Sector 4 (Chaltura / Natabuela)</span>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="reading-route-map-loading-overlay">
            <div className="reading-route-map-loading-spinner" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cargando capas cartográficas...</span>
          </div>
        )}

        {/* Map Container */}
        <div className="reading-route-map-container">
          <Map
            defaultCenter={{
              lat: FALLBACK_CENTER_ANTONIO_ANTE.lat,
              lng: FALLBACK_CENTER_ANTONIO_ANTE.lng,
            }}
            defaultZoom={13}
            mapId={mapId}
            styles={theme === 'dark' ? DARK_MAP_STYLE : SILVER_MAP_STYLE}
            disableDefaultUI={false}
            zoomControl={true}
            streetViewControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
          >
            {/* GeoJSON layer */}
            <ReadingRouteMapDataLayer
              geojsonData={geojsonData}
              showPolygons={showPolygons}
              selectedRoute={selectedRoute}
              onSelectRouteId={onSelectRouteId}
            />

            {/* Camera controller */}
            <MapCameraController centerTarget={cameraTarget} zoomTarget={cameraZoom} />

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

            {/* Focused Connection Highlight Pin */}
            {focusedConnectionCoords && (
              <AdvancedMarker
                position={focusedConnectionCoords}
                anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
              >
                <div className="focused-connection-pin" title="Acometida enfocada">
                  <div className="focused-connection-pulse" />
                  <div className="focused-connection-dot" />
                </div>
              </AdvancedMarker>
            )}

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
          />
        )}
      </APIProvider>
    </div>
  );
};
