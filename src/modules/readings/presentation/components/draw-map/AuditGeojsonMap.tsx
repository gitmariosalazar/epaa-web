import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Map, useMap, AdvancedMarker, AdvancedMarkerAnchorPoint } from '@vis.gl/react-google-maps';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type { MapRouteFeatureCollection, MapFeature } from '../../../domain/models/map-geojson';
import { AuditMapInstantTooltip } from './AuditMapInstantTooltip';
import { ReadingMapMarker } from './ReadingMapMarker';
import { ReadingLocationModal } from './ReadingLocationModal';
import { useReadingsContext } from '../../context/ReadingsContext';

const DISTINCT_COLORS = [
  '#9333ea', '#f59e0b', '#e11d48', '#0284c7', '#16a34a',
  '#ea580c', '#4f46e5', '#c026d3', '#0d9488', '#65a30d'
];

interface AuditGeojsonMapProps {
  geojsonData: MapRouteFeatureCollection | null;
  mapId?: string;
  selectedFeatureId: string | null;
  onFeatureSelect: (feature: MapFeature | null) => void;
  onCameraChange?: (center: { lat: number; lng: number }, zoom: number) => void;
}

export const AuditGeojsonMap: React.FC<AuditGeojsonMapProps> = ({
  geojsonData,
  mapId = 'audit-geojson-map',
  selectedFeatureId,
  onFeatureSelect,
  onCameraChange
}) => {
  const { theme } = useTheme();
  const map = useMap();
  const { getReadingInfoUseCase } = useReadingsContext();

  // Track listeners to avoid memory leaks
  const [listenersReady, setListenersReady] = useState(false);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [hoveredProps, setHoveredProps] = useState<any>(null);
  const [hoveredMarkerIdx, setHoveredMarkerIdx] = useState<number | null>(null);
  const [extraReadingInfo, setExtraReadingInfo] = useState<{ clientName: string, address: string, readingDate: string | null } | null>(null);

  // Ref for debounce timeout
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derivar la feature seleccionada a partir del ID
  const selectedFeature = useMemo(() => {
    if (!geojsonData || !selectedFeatureId) return null;
    return geojsonData.features.find((f, idx) => {
      const featureId = `${f.properties.acometida_id || f.properties.clave_catastral || ''}-${f.properties.tipo}-${idx}`;
      return featureId === selectedFeatureId;
    }) || null;
  }, [geojsonData, selectedFeatureId]);

  // Encontrar todas las features (acometida y captura) relacionadas con la seleccionada
  const selectedFeatures = useMemo(() => {
    if (!geojsonData || !selectedFeature) return [];
    const matchKey = selectedFeature.properties.acometida_id || selectedFeature.properties.clave_catastral;
    if (!matchKey) return [selectedFeature];

    return geojsonData.features.filter((f) => {
      const cc = f.properties.acometida_id || f.properties.clave_catastral;
      return cc === matchKey && f.geometry.type === 'Point';
    });
  }, [geojsonData, selectedFeature]);

  const userColors = useMemo(() => {
    const colors = new globalThis.Map<string, string>();
    if (!geojsonData?.features) return colors;

    let colorIdx = 0;
    geojsonData.features.forEach(f => {
      if (f.geometry.type === 'LineString') {
        const user = f.properties.usuario_lectura || f.properties.usuario_lectura || 'Tramo';
        if (!colors.has(user)) {
          const color = DISTINCT_COLORS[colorIdx % DISTINCT_COLORS.length];
          colors.set(user, color);
          colorIdx++;
        }
      }
    });
    return colors;
  }, [geojsonData]);

  // Extraer información de los tramos (LineString) para la leyenda
  const legendItems = useMemo(() => {
    if (!geojsonData?.features) return [];

    const items = new globalThis.Map<string, { label: string, color: string }>();

    geojsonData.features.forEach(f => {
      if (f.geometry.type === 'LineString') {
        const user = f.properties.usuario_lectura || f.properties.usuario_lectura || 'Tramo';
        const color = userColors.get(user) || '#ef4444';

        if (!items.has(user)) {
          items.set(user, { label: user, color });
        }
      }
    });

    return Array.from(items.values());
  }, [geojsonData, userColors]);

  // Extraer información de los puntos para la leyenda usando sus colores de DB
  const pointLegendItems = useMemo(() => {
    if (!geojsonData?.features) return [];

    const items = new globalThis.Map<string, { label: string, color: string }>();

    geojsonData.features.forEach(f => {
      if (f.geometry.type === 'Point') {
        const type = f.properties.tipo;
        const color = f.properties['marker-color'] || (type === 'medidor' ? '#10b981' : '#3b82f6');

        let label = 'Punto';
        if (type === 'medidor') label = 'Punto de acometida';
        else if (type === 'captura') {
          const user = f.properties.usuario_lectura || f.properties.usuario_lectura;
          label = user ? `Punto de lectura ${user}` : 'Punto de lectura';
        }
        else if (type === 'punto_inicio') label = 'Inicio de lectura';
        else if (type === 'punto_final') label = 'Fin de lectura';
        else label = type;

        const key = `${label}-${color}`;
        if (!items.has(key)) {
          items.set(key, { label, color });
        }
      }
    });

    return Array.from(items.values());
  }, [geojsonData]);

  // Fetch extra info when InfoWindow opens
  useEffect(() => {
    if (infoWindowShown && selectedFeature) {
      const cadastralKey = selectedFeature.properties.clave_catastral;
      if (cadastralKey) {
        getReadingInfoUseCase.execute(cadastralKey).then(infoArray => {
          if (infoArray && infoArray.length > 0) {
            const info = infoArray[0];
            setExtraReadingInfo({
              clientName: info.clientName,
              address: info.address,
              readingDate: info.readingDate
            });
          }
        }).catch(err => {
          console.error("Error fetching extra reading info for map", err);
        });
      }
    } else {
      setExtraReadingInfo(null);
    }
  }, [infoWindowShown, selectedFeature, getReadingInfoUseCase]);

  // Posición del InfoWindow
  const infoWindowPosition = useMemo(() => {
    if (selectedFeature && selectedFeature.geometry.type === 'Point') {
      const [lng, lat] = selectedFeature.geometry.coordinates;
      return { lat, lng };
    }
    return null;
  }, [selectedFeature]);

  // Construir un mock reading para el Modal
  const mockReading = useMemo(() => {
    if (!selectedFeature || !geojsonData) return null;
    const matchKey = selectedFeature.properties.acometida_id || selectedFeature.properties.clave_catastral;
    if (!matchKey) return null;

    const captureFeature = geojsonData.features.find(f => (f.properties.acometida_id || f.properties.clave_catastral) === matchKey && f.properties.tipo === 'captura');
    const connectionFeature = geojsonData.features.find(f => (f.properties.acometida_id || f.properties.clave_catastral) === matchKey && f.properties.tipo === 'medidor');

    const captureGeom = captureFeature?.geometry.type === 'Point' ? captureFeature.geometry.coordinates : null;
    const connectionGeom = connectionFeature?.geometry.type === 'Point' ? connectionFeature.geometry.coordinates : null;

    let distanceMeters = null;
    let isInsideAllowedRadius = null;

    if (captureGeom && connectionGeom && (window as any).google?.maps?.geometry?.spherical) {
      const latLngCaptura = new google.maps.LatLng(captureGeom[1], captureGeom[0]);
      const latLngMedidor = new google.maps.LatLng(connectionGeom[1], connectionGeom[0]);
      distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(latLngCaptura, latLngMedidor);
      isInsideAllowedRadius = distanceMeters <= 25; // Radio permitido por defecto
    }

    return {
      readingId: 0,
      connectionId: 0,
      cadastralKey: selectedFeature.properties.clave_catastral || 'N/A',
      meterNumber: selectedFeature.properties.numero_medidor || 'N/A',
      clientName: extraReadingInfo?.clientName || 'N/A',
      address: extraReadingInfo?.address || 'N/A',
      readingDate: extraReadingInfo?.readingDate
        ? extraReadingInfo.readingDate
        : selectedFeature.properties.fecha_lectura || undefined,
      locationCapture: captureGeom ? { lat: captureGeom[1], lng: captureGeom[0] } : null,
      locationConnection: connectionGeom ? { lat: connectionGeom[1], lng: connectionGeom[0] } : null,
      distanceMeters,
      isInsideAllowedRadius,
    };
  }, [selectedFeature, geojsonData, extraReadingInfo]);

  const isHoveredSelected = useMemo(() => {
    if (!selectedFeature || !hoveredProps) return false;
    const sKey = selectedFeature.properties.acometida_id || selectedFeature.properties.clave_catastral;
    const hKey = hoveredProps.acometida_id || hoveredProps.clave_catastral;
    return sKey === hKey && selectedFeature.properties.tipo === hoveredProps.tipo;
  }, [selectedFeature, hoveredProps]);

  // 1. Limpiar y agregar GeoJSON
  useEffect(() => {
    if (!map) return;

    map.data.forEach((feature: google.maps.Data.Feature) => {
      map.data.remove(feature);
    });

    if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) {
      return;
    }

    try {
      map.data.addGeoJson(geojsonData);

      const googleMaps = (window as any).google.maps;
      const bounds = new googleMaps.LatLngBounds();

      map.data.setStyle((feature: google.maps.Data.Feature) => {
        const type = feature.getProperty('tipo') as string;
        const stroke = feature.getProperty('stroke') as string;
        const strokeWidth = feature.getProperty('stroke-width') as number;
        const markerColor = feature.getProperty('marker-color') as string;

        if (feature.getGeometry()?.getType() === 'Point') {
          const isEndpoint = type === 'punto_inicio' || type === 'punto_final';
          return {
            icon: {
              path: googleMaps.SymbolPath.CIRCLE,
              fillColor: markerColor || (type === 'medidor' ? '#10b981' : '#3b82f6'),
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#ffffff',
              scale: isEndpoint ? 8 : 6
            },
            cursor: 'pointer'
          };
        } else if (feature.getGeometry()?.getType() === 'LineString') {
          const user = feature.getProperty('usuario_lectura') || feature.getProperty('usuario') || 'Tramo';
          const userColor = userColors.get(user as string) || stroke || '#ef4444';
          return {
            strokeColor: userColor,
            strokeWeight: strokeWidth || 3,
            strokeOpacity: 0.8
          };
        }
        return {};
      });

      // Calcular bounds
      map.data.forEach((feature: google.maps.Data.Feature) => {
        const geom = feature.getGeometry();
        if (geom?.getType() === 'Point') {
          const pointGeom = geom as google.maps.Data.Point;
          bounds.extend(pointGeom.get());
        } else if (geom?.getType() === 'LineString') {
          const lineGeom = geom as google.maps.Data.LineString;
          lineGeom.getArray().forEach((latLng: google.maps.LatLng) => bounds.extend(latLng));
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
      }

      setListenersReady(true);
    } catch (error) {
      console.error('Failed to add GeoJSON to map', error);
    }
  }, [map, geojsonData, userColors]);

  // 2. Manejar eventos click en la capa de datos
  useEffect(() => {
    if (!map || !listenersReady) return;

    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const geom = event.feature.getGeometry();
      if (geom?.getType() === 'Point') {
        // Para encontrar el MapFeature original, comparamos coordenadas y tipo
        const latLng = (geom as google.maps.Data.Point).get();
        const type = event.feature.getProperty('tipo');
        const clave = event.feature.getProperty('clave_catastral');

        if (geojsonData) {
          // Buscamos el feature correspondiente
          const featureIndex = geojsonData.features.findIndex(f => {
            if (f.geometry.type === 'Point') {
              const [lng, lat] = f.geometry.coordinates;
              // Comparación con cierta tolerancia
              const isSameCoord = Math.abs(lat - latLng.lat()) < 0.0001 && Math.abs(lng - latLng.lng()) < 0.0001;
              return isSameCoord && f.properties.tipo === type && f.properties.clave_catastral === clave;
            }
            return false;
          });

          if (featureIndex !== -1) {
            const feature = geojsonData.features[featureIndex];
            const featureId = `${feature.properties.acometida_id || feature.properties.clave_catastral || ''}-${feature.properties.tipo}-${featureIndex}`;
            onFeatureSelect({ ...feature, id: featureId } as any);
            // setInfoWindowShown(true); // Ya no se abre automáticamente

            // Centramos el mapa y hacemos zoom
            map.panTo(latLng);
            map.setZoom(19);
          }
        }
      }
    });

    const mouseoverListener = map.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

      const geom = event.feature.getGeometry();
      if (geom?.getType() === 'Point') {
        const latLng = (geom as google.maps.Data.Point).get();
        setHoveredProps({
          tipo: event.feature.getProperty('tipo'),
          clave_catastral: event.feature.getProperty('clave_catastral'),
          numero_medidor: event.feature.getProperty('numero_medidor'),
          'marker-color': event.feature.getProperty('marker-color'),
          acometida_id: event.feature.getProperty('acometida_id'),
        });
        setHoveredPosition({ lat: latLng.lat(), lng: latLng.lng() });
      }
    });

    const mouseoutListener = map.data.addListener('mouseout', () => {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredPosition(null);
        setHoveredProps(null);
      }, 50);
    });

    return () => {
      google.maps.event.removeListener(clickListener);
      google.maps.event.removeListener(mouseoverListener);
      google.maps.event.removeListener(mouseoutListener);
    };
  }, [map, listenersReady, geojsonData, onFeatureSelect]);

  // Si se selecciona un feature desde el sidepanel (cambia infoWindowPosition), centramos el mapa
  useEffect(() => {
    if (infoWindowPosition) {
      // setInfoWindowShown(true); // Ya no se abre automáticamente al seleccionar
      if (map) {
        map.panTo(infoWindowPosition);
        map.setZoom(19);
      }
    }
  }, [infoWindowPosition, map]);

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowShown(false);
    onFeatureSelect(null);
    setHoveredMarkerIdx(null);
  }, [onFeatureSelect]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
        defaultCenter={FALLBACK_CENTER_ANTONIO_ANTE}
        defaultZoom={15}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        fullscreenControl={true}
        onCameraChanged={(ev) => {
          if (onCameraChange) {
            onCameraChange(
              { lat: Number(ev.detail.center.lat), lng: Number(ev.detail.center.lng) },
              ev.detail.zoom
            );
          }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Renderizamos el Marcador premium para TODOS los puntos relacionados con el seleccionado (acometida y captura) */}
        {selectedFeatures.length > 0 && infoWindowPosition && (
          <>
            {selectedFeatures.map((feature, idx) => {
              const [lng, lat] = feature.geometry.coordinates as [number, number];
              const isCaptura = feature.properties.tipo === 'captura' || feature.properties.tipo === 'punto_inicio' || feature.properties.tipo === 'punto_final';

              return (
                <AdvancedMarker
                  key={`selected-group-${idx}`}
                  position={{ lat, lng }}
                  zIndex={30000 + idx}
                  anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                  onClick={() => setInfoWindowShown(true)}
                  onMouseEnter={() => setHoveredMarkerIdx(idx)}
                  onMouseLeave={() => setHoveredMarkerIdx(null)}
                >
                  <ReadingMapMarker
                    type={isCaptura ? 'capture' : 'connection'}
                    isSelected={true}
                    isHovered={hoveredMarkerIdx === idx}
                  />

                  {hoveredMarkerIdx === idx && (
                    <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                      <AuditMapInstantTooltip props={feature.properties} />
                    </div>
                  )}
                </AdvancedMarker>
              );
            })}

            <ReadingLocationModal
              isOpen={infoWindowShown}
              onClose={handleInfoWindowClose}
              reading={mockReading as any}
            />
          </>
        )}

        {/* Renderizamos el Tooltip interactivo si hay hover (sin bloquear clics) y no es el elemento actualmente seleccionado */}
        {hoveredPosition && hoveredProps && !isHoveredSelected && (
          <AdvancedMarker
            position={hoveredPosition}
            zIndex={99999}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={() => {
              setHoveredPosition(null);
              setHoveredProps(null);
            }}
            onClick={() => {
              // Same logic as clickListener on map.data
              if (geojsonData) {
                const matchKey = hoveredProps.acometida_id || hoveredProps.clave_catastral;
                const featureIndex = geojsonData.features.findIndex(f =>
                  (f.properties.acometida_id || f.properties.clave_catastral) === matchKey &&
                  f.properties.tipo === hoveredProps.tipo
                );

                if (featureIndex !== -1) {
                  const feature = geojsonData.features[featureIndex];
                  const featureId = `${feature.properties.acometida_id || feature.properties.clave_catastral || ''}-${feature.properties.tipo}-${featureIndex}`;
                  onFeatureSelect({ ...feature, id: featureId } as any);
                  map?.panTo(hoveredPosition);
                  map?.setZoom(19);
                  setHoveredPosition(null);
                  setHoveredProps(null);
                }
              }
            }}
          >
            <ReadingMapMarker
              type={hoveredProps.tipo === 'captura' ? 'capture' : 'connection'}
              isSelected={true}
              isHovered={false} // Since this is for generic hover, we can just pass false or handle it if needed. Actually it uses hoveredProps.

            />
            {/* El AuditMapInstantTooltip ya no es necesario aquí directamente
                porque ReadingMapMarker renderiza su propio tooltip interno cuando isHovered=true.
                Pero como ReadingMapMarker espera un objeto `reading` completo para mostrar datos,
                y aquí solo tenemos `hoveredProps`, es mejor seguir usando nuestro tooltip dedicado
                y renderizar el marcador base. */}
            <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)' }}>
              <AuditMapInstantTooltip props={hoveredProps} />
            </div>
          </AdvancedMarker>
        )}
      </Map>
      {/* ── Leyenda flotante ────────────────────────────────────────────────── */}

      <div className="reading-map-legend-box">

        <div className="reading-map-legend-items">
          {pointLegendItems.map((item, idx) => (
            <div className="reading-map-legend-item" key={`legend-point-${idx}`}>
              <span
                className="reading-map-legend-dot"
                style={{ background: item.color }}
              />
              <span style={{ textTransform: 'capitalize' }}>
                {item.label}
              </span>
            </div>
          ))}

          {legendItems.map((item, idx) => (
            <div className="reading-map-legend-item" key={`legend-route-${idx}`}>
              <span
                className="reading-map-legend-dot"
                style={{
                  background: item.color,
                  borderRadius: '2px',
                  width: '14px',
                  height: '4px'
                }}
              />
              <span style={{ textTransform: 'capitalize' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
