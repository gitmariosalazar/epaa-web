import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint
} from '@vis.gl/react-google-maps';
import { Layers, MapPin, Maximize2, Crosshair, Sparkles } from 'lucide-react';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type { RouteGeoJsonFeatureCollection } from '../../../domain/models/ReadingRoute';
import {
  getMapThemeConfig,
  type MapThemeConfig
} from '../map/ReadingRouteMapStyles';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

export interface SmartRouteResolverMapProps {
  latitud: number;
  longitud: number;
  sector?: number;
  acometidaId?: string;
  hasCoords: boolean;
  onCoordinatesChange: (lat: number, lng: number) => void;
  geojsonData: RouteGeoJsonFeatureCollection | null;
  isLoadingGeoJson?: boolean;
  resolvedRouteId?: number;
  resolvedRouteCode?: string;
  resolvedRouteName?: string;
}

export interface ResolvedCentroidInfo {
  lat: number;
  lng: number;
  idRuta: number;
  codigo: string;
  nombre: string;
  cantidadAcometidas?: number;
}

// ── Theme Sync Subcomponent (SRP) ─────────────────────────────────────────────
const SmartRouteResolverThemeSync: React.FC<{ mapTheme: MapThemeConfig }> = ({
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
      // Safe fallback
    }
  }, [map, mapTheme]);
  return null;
};

// ── GeoJSON Data Layer Subcomponent with Polygon Heartbeat (SRP) ───────────────
interface SmartRouteResolverDataLayerProps {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  showPolygons: boolean;
  resolvedRouteId?: number;
  mapTheme: MapThemeConfig;
}

const SmartRouteResolverDataLayer: React.FC<
  SmartRouteResolverDataLayerProps
> = ({ geojsonData, showPolygons, resolvedRouteId, mapTheme }) => {
  const map = useMap();
  const [pulsePhase, setPulsePhase] = useState<number>(0);

  // Rhythmic heartbeat double-beat pulse for resolved target polygon
  useEffect(() => {
    if (!resolvedRouteId || !showPolygons) {
      setPulsePhase(0);
      return;
    }

    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 6);
    }, 280);

    return () => clearInterval(interval);
  }, [resolvedRouteId, showPolygons]);

  // Load GeoJSON features
  useEffect(() => {
    if (!map) return;

    map.data.forEach((feature) => {
      map.data.remove(feature);
    });

    if (!showPolygons || !geojsonData) return;

    try {
      map.data.addGeoJson(geojsonData);
    } catch (e) {
      console.warn('Error loading sector GeoJSON in resolver map:', e);
    }
  }, [map, geojsonData, showPolygons]);

  // Apply styling with dynamic heartbeat oscillation on the resolved polygon
  useEffect(() => {
    if (!map) return;

    map.data.setStyle((feature: google.maps.Data.Feature) => {
      const idRuta = Number(feature.getProperty('idRuta') ?? feature.getId());
      const isResolvedTarget = Boolean(
        resolvedRouteId && Number(resolvedRouteId) === idRuta
      );
      const color = String(feature.getProperty('color') || '#0284c7');

      if (isResolvedTarget) {
        // Heartbeat animation oscillation on stroke & fill
        let fillOpacity = 0.42;
        let strokeWeight = 3.2;
        let strokeColor = '#059669';

        if (pulsePhase === 1) {
          // First thump
          fillOpacity = 0.54;
          strokeWeight = 4.2;
          strokeColor = '#10b981';
        } else if (pulsePhase === 2) {
          // Intermediate dip
          fillOpacity = 0.36;
          strokeWeight = 2.8;
          strokeColor = '#059669';
        } else if (pulsePhase === 3) {
          // Second thump (strongest)
          fillOpacity = 0.64;
          strokeWeight = 5.0;
          strokeColor = '#047857';
        } else {
          // Rest phases
          fillOpacity = 0.28;
          strokeWeight = 2.2;
          strokeColor = '#059669';
        }

        return {
          fillColor: '#10b981',
          fillOpacity,
          strokeColor,
          strokeWeight,
          zIndex: 10,
          clickable: false
        };
      }

      return {
        fillColor: color,
        fillOpacity: 0.18,
        strokeColor: color,
        strokeWeight: 1.5,
        zIndex: 1,
        clickable: false
      };
    });
  }, [map, resolvedRouteId, mapTheme, pulsePhase]);

  return null;
};

// ── Camera Controller Subcomponent (SRP) ───────────────────────────────────────
const SmartRouteResolverCameraController: React.FC<{
  latitud: number;
  longitud: number;
  hasCoords: boolean;
  onMapReady: (map: google.maps.Map) => void;
}> = ({ latitud, longitud, hasCoords, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (map && hasCoords) {
      map.panTo({ lat: latitud, lng: longitud });
    }
  }, [map, hasCoords, latitud, longitud]);

  return null;
};

// ── Main Map Component ────────────────────────────────────────────────────────
export const SmartRouteResolverMap: React.FC<SmartRouteResolverMapProps> = ({
  latitud,
  longitud,
  sector,
  acometidaId,
  hasCoords,
  onCoordinatesChange,
  geojsonData,
  isLoadingGeoJson,
  resolvedRouteId,
  resolvedRouteCode,
  resolvedRouteName
}) => {
  const { theme } = useTheme();
  const mapTheme = useMemo(() => getMapThemeConfig(theme), [theme]);
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

  const centerCoords = useMemo(() => {
    if (
      !isNaN(latitud) &&
      !isNaN(longitud) &&
      !(latitud === 0 && longitud === 0)
    ) {
      return { lat: latitud, lng: longitud };
    }
    return {
      lat: FALLBACK_CENTER_ANTONIO_ANTE.lat,
      lng: FALLBACK_CENTER_ANTONIO_ANTE.lng
    };
  }, [latitud, longitud]);

  // Map internal controller to allow centering
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Compute centroid coordinates and details of the resolved target route
  const resolvedCentroid = useMemo<ResolvedCentroidInfo | null>(() => {
    if (!resolvedRouteId) return null;

    let centerLat = latitud;
    let centerLng = longitud;
    let code = resolvedRouteCode || `Ruta #${resolvedRouteId}`;
    let name = resolvedRouteName || `Ruta ${code}`;
    let cantidadAcometidas: number | undefined = undefined;

    if (geojsonData?.features) {
      const targetFeature = geojsonData.features.find(
        (f) => Number(f.properties?.idRuta ?? f.id) === Number(resolvedRouteId)
      );

      if (targetFeature?.geometry?.coordinates) {
        let totalLat = 0;
        let totalLng = 0;
        let count = 0;

        const extractCoords = (coords: any) => {
          if (
            Array.isArray(coords) &&
            coords.length >= 2 &&
            typeof coords[0] === 'number' &&
            typeof coords[1] === 'number'
          ) {
            // GeoJSON coordinates are [longitude, latitude]
            totalLng += coords[0];
            totalLat += coords[1];
            count++;
          } else if (Array.isArray(coords)) {
            for (const item of coords) {
              extractCoords(item);
            }
          }
        };

        extractCoords(targetFeature.geometry.coordinates);

        if (count > 0) {
          centerLat = totalLat / count;
          centerLng = totalLng / count;
        }

        code =
          resolvedRouteCode ||
          targetFeature.properties.codigo ||
          targetFeature.properties.codigoRuta ||
          code;
        name =
          resolvedRouteName ||
          targetFeature.properties.nombre ||
          targetFeature.properties.nombreRuta ||
          name;
        cantidadAcometidas = targetFeature.properties.cantidadAcometidas;
      }
    }

    if (isNaN(centerLat) || isNaN(centerLng)) return null;

    return {
      lat: centerLat,
      lng: centerLng,
      idRuta: resolvedRouteId,
      codigo: code,
      nombre: name,
      cantidadAcometidas
    };
  }, [
    resolvedRouteId,
    resolvedRouteCode,
    resolvedRouteName,
    geojsonData,
    latitud,
    longitud
  ]);

  const handleCenterAcometida = useCallback(() => {
    if (mapInstance && hasCoords) {
      mapInstance.panTo({ lat: latitud, lng: longitud });
      mapInstance.setZoom(16);
    }
  }, [mapInstance, hasCoords, latitud, longitud]);

  const handleCenterCentroid = useCallback(() => {
    if (mapInstance && resolvedCentroid) {
      mapInstance.panTo({
        lat: resolvedCentroid.lat,
        lng: resolvedCentroid.lng
      });
      mapInstance.setZoom(16);
    }
  }, [mapInstance, resolvedCentroid]);

  const handleCenterSector = useCallback(() => {
    if (!mapInstance || !geojsonData) return;
    try {
      const bounds = new google.maps.LatLngBounds();
      mapInstance.data.forEach((feature) => {
        feature.getGeometry()?.forEachLatLng((latLng) => {
          bounds.extend(latLng);
        });
      });
      if (!bounds.isEmpty()) {
        mapInstance.fitBounds(bounds, {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40
        });
      }
    } catch (e) {
      console.warn('Error centering sector bounds:', e);
    }
  }, [mapInstance, geojsonData]);

  // Center on acometida if coordinates change initially
  useEffect(() => {
    if (mapInstance && hasCoords && !resolvedCentroid) {
      mapInstance.panTo({ lat: latitud, lng: longitud });
    }
  }, [mapInstance, hasCoords, latitud, longitud, resolvedCentroid]);

  // Automatically frame both acometida and the centroid polygon when resolved
  useEffect(() => {
    if (!mapInstance || !resolvedCentroid) return;
    if (hasCoords) {
      try {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: latitud, lng: longitud });
        bounds.extend({ lat: resolvedCentroid.lat, lng: resolvedCentroid.lng });
        mapInstance.fitBounds(bounds, {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60
        });
      } catch {
        // Safe fallback
      }
    }
  }, [mapInstance, resolvedCentroid, hasCoords, latitud, longitud]);

  // Trigger map resize when mapInstance is ready to prevent gray box / empty tiles
  useEffect(() => {
    if (!mapInstance) return;
    const timer = setTimeout(() => {
      try {
        google.maps.event.trigger(mapInstance, 'resize');
      } catch {
        // Safe fallback
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [mapInstance]);

  const handleMapClick = useCallback(
    (e: any) => {
      const latLng = e.detail?.latLng;
      if (
        latLng &&
        typeof latLng.lat === 'number' &&
        typeof latLng.lng === 'number'
      ) {
        onCoordinatesChange(
          Number(latLng.lat.toFixed(6)),
          Number(latLng.lng.toFixed(6))
        );
      }
    },
    [onCoordinatesChange]
  );

  return (
    <div className="smart-resolver-map-wrapper">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        {/* Map Toolbar */}
        <div className="smart-resolver-map-toolbar">
          <div className="smart-resolver-map-toolbar-left">
            <span className="smart-resolver-sector-chip">
              <MapPin size={13} />
              {sector ? `Sector ${sector}` : 'Todos los sectores'}
            </span>
            {resolvedRouteCode && (
              <span className="smart-resolver-route-chip">
                <Sparkles size={13} />
                Ruta #{resolvedRouteCode}
              </span>
            )}
          </div>

          <div className="smart-resolver-map-toolbar-right">
            <Tooltip
              content={showPolygons ? 'Ocultar polígonos' : 'Mostrar polígonos'}
              position="bottom"
              followCursor={false}
            >
              <button
                type="button"
                className={`smart-resolver-map-btn ${showPolygons ? 'active' : ''}`}
                onClick={() => setShowPolygons((prev) => !prev)}
              >
                <Layers size={14} />
                Polígonos
              </button>
            </Tooltip>

            {hasCoords && (
              <Tooltip
                content="Centrar mapa en la acometida"
                position="bottom"
                followCursor={false}
              >
                <button
                  type="button"
                  className="smart-resolver-map-btn"
                  onClick={handleCenterAcometida}
                >
                  <Crosshair size={14} />
                  Acometida
                </button>
              </Tooltip>
            )}

            {resolvedCentroid && (
              <Tooltip
                content="Centrar mapa en el centroide de la ruta resuelta"
                position="bottom"
                followCursor={false}
              >
                <button
                  type="button"
                  className="smart-resolver-map-btn active"
                  onClick={handleCenterCentroid}
                >
                  <Sparkles size={14} />
                  Centroide
                </button>
              </Tooltip>
            )}

            {geojsonData && (
              <Tooltip
                content="Ajustar vista al sector"
                position="bottom"
                followCursor={false}
              >
                <button
                  type="button"
                  className="smart-resolver-map-btn"
                  onClick={handleCenterSector}
                >
                  <Maximize2 size={14} />
                  Sector
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Loading overlay for GeoJSON */}
        {isLoadingGeoJson && (
          <div className="smart-resolver-map-loading">
            <div className="smart-resolver-spinner" />
            <span>Cargando polígonos del sector...</span>
          </div>
        )}

        {/* Google Map */}
        <div className="smart-resolver-map-canvas">
          <Map
            colorScheme={mapTheme.colorScheme}
            defaultCenter={centerCoords}
            defaultZoom={hasCoords ? 16 : 13}
            mapId={mapId}
            style={{ width: '100%', height: '100%' }}
            styles={mapTheme.styles}
            disableDefaultUI={false}
            zoomControl={true}
            streetViewControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
            onClick={handleMapClick}
          >
            <SmartRouteResolverThemeSync mapTheme={mapTheme} />
            <SmartRouteResolverCameraController
              latitud={latitud}
              longitud={longitud}
              hasCoords={hasCoords}
              onMapReady={setMapInstance}
            />
            <SmartRouteResolverDataLayer
              geojsonData={geojsonData}
              showPolygons={showPolygons}
              resolvedRouteId={resolvedRouteId}
              mapTheme={mapTheme}
            />

            {/* Acometida Marker */}
            {hasCoords && (
              <AdvancedMarker
                position={{ lat: latitud, lng: longitud }}
                anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                zIndex={100}
              >
                <div className="smart-resolver-marker-container">
                  <div className="smart-resolver-marker-pulse" />
                  <div className="smart-resolver-marker-pin">
                    <MapPin size={18} color="#ffffff" />
                  </div>
                  <div className="smart-resolver-marker-tag">
                    {acometidaId || 'Acometida'}
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Centroid of the Resolved Route with Heartbeat effect and Name */}
            {resolvedCentroid && (
              <AdvancedMarker
                position={{
                  lat: resolvedCentroid.lat,
                  lng: resolvedCentroid.lng
                }}
                anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                zIndex={150}
              >
                <Tooltip
                  className="smart-resolver-centroid-marker"
                  content={
                    <div
                      className="centroid-info"
                      title={`Centroide #${resolvedCentroid.codigo} - ${resolvedCentroid.nombre}`}
                    >
                      <span className="centroid-label">Centroide:</span>
                      <span className="centroid-code">
                        #{resolvedCentroid.codigo}
                      </span>
                      <span className="centroid-separator" aria-hidden="true">
                        -
                      </span>
                      <span className="centroid-name">
                        {resolvedCentroid.nombre}
                      </span>
                    </div>
                  }
                  themeColor="indigo"
                  followCursor={false}
                >
                  <div className="smart-resolver-centroid-ripple-1" />
                  <div className="smart-resolver-centroid-ripple-2" />
                  <div className="smart-resolver-centroid-badge">
                    <span className="smart-resolver-centroid-dot" />
                    <div className="smart-resolver-centroid-text">
                      <span className="smart-resolver-centroid-label">
                        Centroide de Ruta a Enrutar
                      </span>
                      <span className="smart-resolver-centroid-name">
                        #{resolvedCentroid.codigo} — {resolvedCentroid.nombre}
                      </span>
                    </div>
                  </div>
                  <div className="smart-resolver-centroid-subtag">
                    <Sparkles size={11} />
                    <span>Destino Enrutamiento</span>
                  </div>
                </Tooltip>
              </AdvancedMarker>
            )}
          </Map>
        </div>

        {/* Click-to-pick Helper Hint */}
        <div className="smart-resolver-map-hint">
          <span>
            💡 Haz clic en cualquier punto del mapa para ajustar las coordenadas
            de la acometida.
          </span>
        </div>
      </APIProvider>
    </div>
  );
};
