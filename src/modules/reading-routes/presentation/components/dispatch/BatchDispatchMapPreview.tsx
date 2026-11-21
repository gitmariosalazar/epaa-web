import React, { useEffect, useMemo, useCallback } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow
} from '@vis.gl/react-google-maps';
import { MapPin, RefreshCw, X, Layers } from 'lucide-react';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type {
  ReadingRoute,
  RouteGeoJsonFeatureCollection
} from '../../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../../domain/models/RouteConnection';
import { useBatchDispatchMap } from '../../hooks/useBatchDispatchMap';
import {
  getMapThemeConfig,
  type MapThemeConfig
} from '../map/ReadingRouteMapStyles';
import { Button } from '@/shared/presentation/components/Button/Button';
import './BatchDispatchMapPreview.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { truncateText } from '@/shared/utils/text/truncate-text';

export interface OperatorMapInfo {
  userId: string;
  cardId: string;
  name: string;
  color: string;
  count?: number;
}

export interface BatchDispatchMapPreviewProps {
  selectedSector: number | undefined;
  routes: ReadingRoute[];
  selectedRouteId: number | null;
  onSelectRouteId: (routeId: number | null) => void;
  isOpen: boolean;
  assignments?: Record<number, string>;
  operatorColors?: Record<string, string>;
  activeOperator?: { userId: string; name: string; color: string } | null;
  onToggleAssignRoute?: (routeId: number) => void;
  operators?: OperatorMapInfo[];
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
  if (!Number.isFinite(numLat) || !Number.isFinite(numLng)) return null;
  if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) return null;
  if (numLat === 0 && numLng === 0) return null;
  return { lat: numLat, lng: numLng };
};

// Subcomponente: Sincronización dinámica de tema en el mapa (SRP / OCP)
const BatchDispatchThemeSyncController: React.FC<{
  mapTheme: MapThemeConfig;
}> = ({ mapTheme }) => {
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

// Subcomponente: Capa de Polígonos GeoJSON (SRP)
interface BatchDispatchDataLayerProps {
  geojsonData: RouteGeoJsonFeatureCollection | null;
  selectedRouteId: number | null;
  onSelectRouteId: (idRuta: number) => void;
  mapTheme: MapThemeConfig;
  assignments?: Record<number, string>;
  operatorColors?: Record<string, string>;
  activeOperator?: { userId: string; name: string; color: string } | null;
  onToggleAssignRoute?: (routeId: number) => void;
}

const BatchDispatchDataLayer: React.FC<BatchDispatchDataLayerProps> = ({
  geojsonData,
  selectedRouteId,
  onSelectRouteId,
  mapTheme,
  assignments,
  operatorColors,
  activeOperator,
  onToggleAssignRoute
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Limpiar polígonos previos
    map.data.forEach((feature) => {
      map.data.remove(feature);
    });

    if (!geojsonData) return;

    try {
      map.data.addGeoJson(geojsonData);
    } catch (e) {
      console.warn('Error al cargar GeoJSON de rutas en despacho:', e);
    }

    map.data.setStyle((feature: google.maps.Data.Feature) => {
      const defaultColor = String(feature.getProperty('color') || '#0284c7');
      const idRuta = Number(feature.getProperty('idRuta'));
      const isSelected = Boolean(selectedRouteId && selectedRouteId === idRuta);
      const assignedUserId = assignments?.[idRuta];
      const isAssigned = Boolean(assignedUserId);
      const isAssignedToActive = Boolean(
        activeOperator && assignedUserId === activeOperator.userId
      );

      const opColor =
        assignedUserId && operatorColors?.[assignedUserId]
          ? operatorColors[assignedUserId]
          : null;

      const fillColor = opColor || (isAssigned ? '#0284c7' : defaultColor);

      let fillOpacity = isSelected
        ? mapTheme.polygon.selectedFillOpacity
        : mapTheme.polygon.unselectedFillOpacity;

      let strokeColor = isSelected
        ? mapTheme.polygon.selectedStroke
        : opColor || defaultColor;

      let strokeWeight = isSelected
        ? mapTheme.polygon.selectedStrokeWeight
        : mapTheme.polygon.unselectedStrokeWeight;

      if (isAssignedToActive) {
        fillOpacity = isSelected ? 0.65 : 0.48;
        strokeWeight = isSelected ? 4 : 2.8;
        if (!isSelected) {
          strokeColor = opColor || '#ffffff';
        }
      } else if (isAssigned) {
        fillOpacity = isSelected ? 0.55 : 0.35;
        strokeWeight = isSelected ? 3.5 : 2;
      } else {
        fillOpacity = isSelected ? 0.4 : 0.16;
        strokeWeight = isSelected ? 3 : 1.2;
        strokeColor = isSelected ? mapTheme.polygon.selectedStroke : '#94a3b8';
      }

      return {
        fillColor,
        fillOpacity,
        strokeColor,
        strokeWeight,
        zIndex: isSelected ? 30 : isAssignedToActive ? 20 : isAssigned ? 10 : 2
      };
    });

    const clickListener = map.data.addListener(
      'click',
      (event: google.maps.Data.MouseEvent) => {
        const idRuta = event.feature.getProperty('idRuta');
        if (idRuta) {
          const numId = Number(idRuta);
          onSelectRouteId(numId);
          if (onToggleAssignRoute && activeOperator) {
            onToggleAssignRoute(numId);
          }
        }
      }
    );

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [
    map,
    geojsonData,
    selectedRouteId,
    onSelectRouteId,
    mapTheme,
    assignments,
    operatorColors,
    activeOperator,
    onToggleAssignRoute
  ]);

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
      connections.forEach((conn) => {
        const coords = getValidCoords(conn.latitud, conn.longitud);
        if (coords) {
          bounds.extend(coords);
          hasCoords = true;
        }
      });
    }

    // Si no hay acometidas o no hay ruta específica, ajustar a los polígonos del sector
    if (
      !hasCoords &&
      geojsonData?.features &&
      geojsonData.features.length > 0
    ) {
      geojsonData.features.forEach((feat) => {
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
        geojsonData.features.forEach((feat) => {
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
        lng: FALLBACK_CENTER_ANTONIO_ANTE.lng
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
export const BatchDispatchMapPreview: React.FC<
  BatchDispatchMapPreviewProps
> = ({
  selectedSector,
  routes,
  selectedRouteId,
  onSelectRouteId,
  isOpen,
  assignments,
  operatorColors,
  activeOperator,
  onToggleAssignRoute,
  operators
}) => {
  const { theme } = useTheme();
  const mapTheme = useMemo(() => getMapThemeConfig(theme), [theme]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

  const {
    geojsonData,
    isLoadingGeoJson,
    connections,
    isLoadingConnections,
    activeConnection,
    setActiveConnection,
    refreshMapData
  } = useBatchDispatchMap({
    selectedSector,
    selectedRouteId,
    isOpen
  });

  const selectedRoute = useMemo(() => {
    if (!selectedRouteId) return null;
    return routes.find((r) => r.idRuta === selectedRouteId) || null;
  }, [routes, selectedRouteId]);

  const activeConnectionCoords = useMemo(() => {
    if (!activeConnection) return null;
    return getValidCoords(activeConnection.latitud, activeConnection.longitud);
  }, [activeConnection]);

  const handleClearSelectedRoute = useCallback(() => {
    onSelectRouteId(null);
  }, [onSelectRouteId]);

  const assignedOperatorToSelectedRoute = useMemo(() => {
    if (!selectedRouteId || !assignments || !operators) return null;
    const uId = assignments[selectedRouteId];
    if (!uId) return null;
    return operators.find((op) => op.userId === uId) || null;
  }, [selectedRouteId, assignments, operators]);

  const isAssignedToActive = useMemo(() => {
    if (!selectedRouteId || !assignments || !activeOperator) return false;
    return assignments[selectedRouteId] === activeOperator.userId;
  }, [selectedRouteId, assignments, activeOperator]);

  const operatorsWithAssignments = useMemo(() => {
    if (!operators || !assignments) return [];
    const counts: Record<string, number> = {};
    Object.values(assignments).forEach((uId) => {
      counts[uId] = (counts[uId] || 0) + 1;
    });
    return operators
      .filter((op) => (counts[op.userId] || 0) > 0)
      .map((op) => ({
        ...op,
        count: counts[op.userId] || 0
      }));
  }, [operators, assignments]);

  const unassignedCount = useMemo(() => {
    if (!routes) return 0;
    if (!assignments) return routes.length;
    return routes.filter((r) => !assignments[r.idRuta]).length;
  }, [routes, assignments]);

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

          {/* Pill de lecturista activo para asignación */}
          {activeOperator && (
            <div
              className="batch-dispatch-active-op-pill"
              style={{
                borderColor: activeOperator.color,
                color: activeOperator.color
              }}
              title={`Lecturista actual para asignar: ${activeOperator.name}`}
            >
              <span
                className="batch-dispatch-active-op-dot"
                style={{ backgroundColor: activeOperator.color }}
              />
              <span>
                Asignando a: <strong>{activeOperator.name}</strong>
              </span>
            </div>
          )}

          {/* Información y acción sobre la ruta enfocada */}
          {selectedRoute && (
            <div className="batch-dispatch-route-pill">
              <MapPin size={12} />
              <span>
                {selectedRoute.codigo ||
                  selectedRoute.codigoRuta ||
                  `Ruta #${selectedRoute.idRuta}`}
                {connections.length > 0 && ` (${connections.length} acom.)`}
              </span>

              {assignedOperatorToSelectedRoute ? (
                <span
                  className="batch-dispatch-route-assigned-tag"
                  style={{
                    backgroundColor: assignedOperatorToSelectedRoute.color,
                    color: '#ffffff'
                  }}
                >
                  ● {assignedOperatorToSelectedRoute.name}
                </span>
              ) : (
                <span className="batch-dispatch-route-unassigned-tag">
                  Sin asignar
                </span>
              )}

              {activeOperator && onToggleAssignRoute && (
                <button
                  type="button"
                  className={`batch-dispatch-route-assign-btn ${
                    isAssignedToActive ? 'is-assigned' : ''
                  }`}
                  onClick={() => onToggleAssignRoute(selectedRoute.idRuta)}
                  style={{
                    backgroundColor: isAssignedToActive
                      ? activeOperator.color
                      : 'transparent',
                    borderColor: activeOperator.color,
                    color: isAssignedToActive ? '#ffffff' : activeOperator.color
                  }}
                  title={
                    isAssignedToActive
                      ? `Quitar asignación de ${activeOperator.name}`
                      : `Asignar ruta a ${activeOperator.name}`
                  }
                >
                  {isAssignedToActive
                    ? '✓ Quitar'
                    : `+ Asignar a ${activeOperator.name.split(' ')[0]}`}
                </button>
              )}

              <Button
                type="button"
                circle
                variant="dashed"
                onClick={handleClearSelectedRoute}
                title="Quitar filtro de ruta y ver sector completo"
                aria-label="Quitar filtro de ruta"
                size="xs"
              >
                <X size={12} />
              </Button>
            </div>
          )}
        </div>

        <div className="batch-dispatch-map-actions">
          <Button
            size="xs"
            variant="dashed"
            color="error"
            onClick={() => void refreshMapData()}
            title="Refrescar capa cartográfica"
            circle
            leftIcon={
              <RefreshCw
                size={13}
                className={isLoadingGeoJson ? 'animate-spin' : ''}
              />
            }
          ></Button>
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
            {/* Sincronizador dinámico de tema */}
            <BatchDispatchThemeSyncController mapTheme={mapTheme} />

            {/* Capa de polígonos GeoJSON con coloreado por lecturista */}
            <BatchDispatchDataLayer
              geojsonData={geojsonData}
              selectedRouteId={selectedRouteId}
              onSelectRouteId={onSelectRouteId}
              mapTheme={mapTheme}
              assignments={assignments}
              operatorColors={operatorColors}
              activeOperator={activeOperator}
              onToggleAssignRoute={onToggleAssignRoute}
            />

            {/* Controlador de encuadre automático de cámara */}
            <BatchDispatchBoundsController
              geojsonData={geojsonData}
              connections={connections}
              selectedRouteId={selectedRouteId}
            />

            {/* Marcadores de acometidas (puntos secuenciales) */}
            {connections.map((conn) => {
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
                    <strong>
                      {activeConnection.numeroMedidor || 'Sin medidor'}
                    </strong>
                  </div>
                  <div className="batch-dispatch-infowindow-row">
                    <span>Cuenta:</span>
                    <strong>{activeConnection.cuenta || 'N/D'}</strong>
                  </div>
                  <div className="batch-dispatch-infowindow-row">
                    <span>Dirección:</span>
                    <span>
                      {activeConnection.direccion || 'Sin dirección registrada'}
                    </span>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Leyenda cartográfica al pie del mapa */}
      <div className="batch-dispatch-map-legend">
        {operatorsWithAssignments.length > 0 ? (
          operatorsWithAssignments.map((op) => (
            <Tooltip
              key={op.userId}
              content={
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Avatar name={op.name || 'S/N'} size="sm" />
                  <div>
                    <div style={{ fontWeight: 300 }}>
                      {truncateText(op.name, 25)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.85em',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {op.cardId}
                    </div>
                  </div>
                </div>
              }
              followCursor={false}
              themeColor={op.color}
            >
              <div key={op.userId} className="batch-dispatch-legend-item">
                <div
                  className="batch-dispatch-legend-dot"
                  style={{ backgroundColor: op.color }}
                />
                <span>
                  {op.cardId} ({op.count})
                </span>
              </div>
            </Tooltip>
          ))
        ) : (
          <div className="batch-dispatch-legend-item">
            <div
              className="batch-dispatch-legend-dot"
              style={{ backgroundColor: '#0284c7' }}
            />
            <span>Polígonos de Ruta</span>
          </div>
        )}
        <div className="batch-dispatch-legend-item">
          <div
            className="batch-dispatch-legend-dot"
            style={{ backgroundColor: '#94a3b8' }}
          />
          <span>Sin Asignar ({unassignedCount})</span>
        </div>
        <div className="batch-dispatch-legend-item">
          <div
            className="batch-dispatch-legend-dot"
            style={{
              backgroundColor: 'var(--accent, #3b82f6)',
              borderRadius: '50%'
            }}
          />
          <span>Punt. Acometidas ({connections.length})</span>
        </div>
      </div>
    </div>
  );
};
