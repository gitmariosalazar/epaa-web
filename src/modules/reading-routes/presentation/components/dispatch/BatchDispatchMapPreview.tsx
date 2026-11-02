import React, { useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { MapPin, RefreshCw, X, Layers } from 'lucide-react';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type {
  ReadingRoute,
  RouteGeoJsonFeatureCollection,
} from '../../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../../domain/models/RouteConnection';
import { useBatchDispatchMap } from '../../hooks/useBatchDispatchMap';
import { DARK_MAP_STYLE, SILVER_MAP_STYLE } from '../map/ReadingRouteMapStyles';
import { Button } from '@/shared/presentation/components/Button/Button';
import './BatchDispatchMapPreview.css';

export interface BatchDispatchMapPreviewProps {
  selectedSector: number | undefined;
  routes: ReadingRoute[];
  selectedRouteId: number | null;
  onSelectRouteId: (routeId: number | null) => void;
  isOpen: boolean;
}

const getValidCoords = (
  lat: unknown,
  lng: unknown,
): { lat: number; lng: number } | null => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return null;
  }
  const numLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
  const numLng = typeof lng === 'number' ? lng : parseFloat(String(lng));
  if (!Number.isFinite(numLat) || !Number.isFinite(numLng)) return null;
  if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) return null;
  if (numLat === 0 && numLng === 0) return null;
  return { lat: numLat, lng: numLng };
};

// Subcomponente: Capa de Polígonos GeoJSON (SRP)
interface BatchDispatchDataLayerProps {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  selectedRouteId: number | null;
  onSelectRouteId: (idRuta: number) => void;
}

const BatchDispatchDataLayer: React.FC<BatchDispatchDataLayerProps> = ({
  geojsonData,
  selectedRouteId,
  onSelectRouteId,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Limpiar polígonos previos
    map.data.forEach(feature => {
      map.data.remove(feature);
    });

    if (!geojsonData) return;

    try {
      map.data.addGeoJson(geojsonData);
    } catch (e) {
      console.warn('Error al cargar GeoJSON de rutas en despacho:', e);
    }

    map.data.setStyle((feature: google.maps.Data.Feature) => {
      const color = String(feature.getProperty('color') || '#0284c7');
      const idRuta = Number(feature.getProperty('idRuta'));
      const isSelected = Boolean(selectedRouteId && selectedRouteId === idRuta);

      return {
        fillColor: color,
        fillOpacity: isSelected ? 0.45 : 0.18,
        strokeColor: isSelected ? '#ffffff' : color,
        strokeWeight: isSelected ? 3.5 : 1.5,
        zIndex: isSelected ? 25 : 2,
      };
    });

    const clickListener = map.data.addListener(
      'click',
      (event: google.maps.Data.MouseEvent) => {
        const idRuta = event.feature.getProperty('idRuta');
        if (idRuta) {
          onSelectRouteId(Number(idRuta));
        }
      },
    );

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [map, geojsonData, selectedRouteId, onSelectRouteId]);

  return null;
};

// Subcomponente: Ajuste dinámico de cámara según polígonos o acometidas (SRP)
const BatchDispatchBoundsController: React.FC<{
  geojsonData: RouteGeoJsonFeatureCollection | null;
  connections: RouteConnection[];
  selectedRouteId: number | null;
}> = ({ geojsonData, connections, selectedRouteId }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = new google.maps.LatLngBounds();
    let hasCoords = false;

    // Si hay una ruta seleccionada y tiene acometidas, centrar en sus puntos
    if (selectedRouteId && connections.length > 0) {
      connections.forEach(conn => {
        const coords = getValidCoords(conn.latitud, conn.longitud);
        if (coords) {
          bounds.extend(coords);
          hasCoords = true;
        }
      });
    }

    // Si no hay acometidas o no hay ruta específica, ajustar a los polígonos del sector
    if (!hasCoords && geojsonData?.features && geojsonData.features.length > 0) {
      geojsonData.features.forEach(feat => {
        const routeId = feat.properties?.idRuta;
        // Si hay una ruta seleccionada, enfocar prioritariamente su polígono
        if (selectedRouteId && routeId !== selectedRouteId) return;

        const extract = (coords: unknown) => {
          if (
            Array.isArray(coords) &&
            coords.length >= 2 &&
            typeof coords[0] === 'number' &&
            typeof coords[1] === 'number'
          ) {
            bounds.extend({ lat: Number(coords[1]), lng: Number(coords[0]) });
            hasCoords = true;
          } else if (Array.isArray(coords)) {
            coords.forEach(extract);
          }
        };

        if (feat.geometry?.coordinates) {
          extract(feat.geometry.coordinates);
        }
      });

      // Si se filtró por una ruta pero su polígono no tenía coordenadas, fallback a todos los polígonos
      if (!hasCoords && selectedRouteId) {
        geojsonData.features.forEach(feat => {
          const extract = (coords: unknown) => {
            if (
              Array.isArray(coords) &&
              coords.length >= 2 &&
              typeof coords[0] === 'number' &&
              typeof coords[1] === 'number'
            ) {
              bounds.extend({ lat: Number(coords[1]), lng: Number(coords[0]) });
              hasCoords = true;
            } else if (Array.isArray(coords)) {
              coords.forEach(extract);
            }
          };
          if (feat.geometry?.coordinates) {
            extract(feat.geometry.coordinates);
          }
        });
      }
    }

    if (hasCoords) {
      map.fitBounds(bounds, { top: 35, right: 35, bottom: 35, left: 35 });
    } else {
      map.panTo({
        lat: FALLBACK_CENTER_ANTONIO_ANTE.lat,
        lng: FALLBACK_CENTER_ANTONIO_ANTE.lng,
      });
      map.setZoom(13);
    }
  }, [map, geojsonData, connections, selectedRouteId]);

  return null;
};

/**
 * Componente: BatchDispatchMapPreview
 *
 * Renderiza el visor cartográfico SIG en el panel derecho del modal de despacho masivo.
 * Cumple con SRP (sólo presentación y renderizado del mapa) y DIP (consume datos
 * a través del custom hook useBatchDispatchMap que depende de UseCases).
 */
export const BatchDispatchMapPreview: React.FC<BatchDispatchMapPreviewProps> = ({
  selectedSector,
  routes,
  selectedRouteId,
  onSelectRouteId,
  isOpen,
}) => {
  const { theme } = useTheme();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

  const {
    geojsonData,
    isLoadingGeoJson,
    connections,
    isLoadingConnections,
    activeConnection,
    setActiveConnection,
    refreshMapData,
  } = useBatchDispatchMap({
    selectedSector,
    selectedRouteId,
    isOpen,
  });

  const selectedRoute = useMemo(() => {
    if (!selectedRouteId) return null;
    return (
      routes.find(r => r.idRuta === selectedRouteId) || null
    );
  }, [routes, selectedRouteId]);

  const activeConnectionCoords = useMemo(() => {
    if (!activeConnection) return null;
    return getValidCoords(activeConnection.latitud, activeConnection.longitud);
  }, [activeConnection]);

  const handleClearSelectedRoute = useCallback(() => {
    onSelectRouteId(null);
  }, [onSelectRouteId]);

  const sectorName = useMemo(() => {
    if (!selectedSector) return 'Todos los sectores';
    switch (Number(selectedSector)) {
      case 1:
        return 'Sector 1 (Centro)';
      case 2:
        return 'Sector 2 (Andrade Marín)';
      case 3:
        return 'Sector 3 (San Roque)';
      case 4:
        return 'Sector 4 (Chaltura/Natabuela)';
      default:
        return `Sector ${selectedSector}`;
    }
  }, [selectedSector]);

  return (
    <div className="batch-dispatch-map-wrapper">
      {/* Barra superior de herramientas sobre el mapa */}
      <div className="batch-dispatch-map-toolbar">
        <div className="batch-dispatch-map-title-group">
          <Layers size={16} style={{ color: 'var(--accent)' }} />
          <span>Vista SIG: {sectorName}</span>
          {selectedRoute && (
            <div className="batch-dispatch-route-pill">
              <MapPin size={12} />
              <span>
                {selectedRoute.codigo || selectedRoute.codigoRuta || `Ruta #${selectedRoute.idRuta}`}
                {connections.length > 0 && ` (${connections.length} acometidas)`}
              </span>
              <button
                type="button"
                className="batch-dispatch-route-pill-clear"
                onClick={handleClearSelectedRoute}
                title="Quitar filtro de ruta y ver sector completo"
                aria-label="Quitar filtro de ruta"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="batch-dispatch-map-actions">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => void refreshMapData()}
            title="Refrescar capa cartográfica"
            leftIcon={<RefreshCw size={13} className={isLoadingGeoJson ? 'animate-spin' : ''} />}
          >
            Refrescar
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isLoadingGeoJson || isLoadingConnections) && (
        <div className="batch-dispatch-map-loading-overlay">
          <div className="batch-dispatch-map-spinner" />
          <span>
            {isLoadingConnections
              ? 'Cargando puntos de acometidas...'
              : 'Cargando polígonos del sector...'}
          </span>
        </div>
      )}

      {/* Visor de Google Maps */}
      <div className="batch-dispatch-map-viewport">
        <APIProvider apiKey={apiKey} libraries={['marker']}>
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
            {/* Capa de polígonos GeoJSON */}
            <BatchDispatchDataLayer
              geojsonData={geojsonData}
              selectedRouteId={selectedRouteId}
              onSelectRouteId={onSelectRouteId}
            />

            {/* Controlador de encuadre automático de cámara */}
            <BatchDispatchBoundsController
              geojsonData={geojsonData}
              connections={connections}
              selectedRouteId={selectedRouteId}
            />

            {/* Marcadores de acometidas (puntos secuenciales) */}
            {connections.map(conn => {
              const coords = getValidCoords(conn.latitud, conn.longitud);
              if (!coords) return null;
              const isActive =
                activeConnection?.idRutaAcometida === conn.idRutaAcometida;

              return (
                <AdvancedMarker
                  key={conn.idRutaAcometida || conn.acometidaId}
                  position={coords}
                  onClick={() => setActiveConnection(conn)}
                >
                  <div
                    className={`batch-dispatch-meter-pin ${isActive ? 'is-active' : ''}`}
                    title={`Acometida #${conn.ordenSecuencia} • Medidor: ${conn.numeroMedidor || 'S/N'}`}
                  >
                    <span>{conn.ordenSecuencia}</span>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* Ventana de información de acometida seleccionada */}
            {activeConnection && activeConnectionCoords && (
              <InfoWindow
                position={activeConnectionCoords}
                onCloseClick={() => setActiveConnection(null)}
              >
                <div className="batch-dispatch-infowindow">
                  <span className="batch-dispatch-infowindow-seq">
                    Secuencia #{activeConnection.ordenSecuencia}
                  </span>
                  <h4 className="batch-dispatch-infowindow-title">
                    {activeConnection.abonado || 'Consumidor desconocido'}
                  </h4>
                  <div className="batch-dispatch-infowindow-row">
                    <span>Medidor:</span>
                    <strong>{activeConnection.numeroMedidor || 'Sin medidor'}</strong>
                  </div>
                  <div className="batch-dispatch-infowindow-row">
                    <span>Cuenta:</span>
                    <strong>{activeConnection.cuenta || 'N/D'}</strong>
                  </div>
                  <div className="batch-dispatch-infowindow-row">
                    <span>Dirección:</span>
                    <span>{activeConnection.direccion || 'Sin dirección registrada'}</span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Leyenda cartográfica al pie del mapa */}
      <div className="batch-dispatch-map-legend">
        <div className="batch-dispatch-legend-item">
          <div className="batch-dispatch-legend-dot" style={{ backgroundColor: '#0284c7' }} />
          <span>Polígonos de Ruta</span>
        </div>
        <div className="batch-dispatch-legend-item">
          <div
            className="batch-dispatch-legend-dot"
            style={{ backgroundColor: 'var(--accent, #3b82f6)', borderRadius: '50%' }}
          />
          <span>Puntos de Acometidas ({connections.length})</span>
        </div>
      </div>
    </div>
  );
};
