import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo
} from 'react';
import {
  Map,
  InfoWindow,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint
} from '@vis.gl/react-google-maps';
import { ReadingMapMarker } from './ReadingMapMarker';
import { ReadingMapInfoWindow } from './ReadingMapInfoWindow';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import type { TakenReadingConnection } from '../../../domain/models/Reading';
import '@/modules/readings/presentation/styles/ReadingMap.css';

// ── Props ─────────────────────────────────────────────────────────────────────
export interface ReadingMapProps {
  /** Lectura a mostrar en el mapa */
  reading?: TakenReadingConnection | null;
  /** Ubicación donde se capturó la lectura (GPS del lecturista) */
  locationCapture?: { lat: number; lng: number } | null;
  /** Ubicación del punto de conexión/acometida */
  locationConnection?: { lat: number; lng: number } | null;
  /** Distancia en metros entre los dos puntos */
  distanceMeters?: number | null;
  /** Si la captura está dentro del radio permitido */
  isInsideAllowedRadius?: boolean | null;
  /** GeoJSON de la línea de distancia */
  distanceLineGeoJSON?: any | null;
  /** Map ID para AdvancedMarker */
  mapId?: string;
  /** Callback al cambiar la cámara */
  onCameraChange?: (center: { lat: number; lng: number }, zoom: number) => void;
  /** Callback al ver detalle de la lectura */
  onViewDetail?: (reading: TakenReadingConnection) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// ReadingMap — componente principal del mapa
// SRP: coordina el mapa, los marcadores, el InfoWindow y la línea GeoJSON.
// Toda la lógica de datos viene del padre (modal o feature).
// OCP: extensible mediante props.
// DIP: depende de interfaces (props), no de implementaciones concretas.
// ─────────────────────────────────────────────────────────────────────────────
export const ReadingMap: React.FC<ReadingMapProps> = ({
  reading,
  locationCapture,
  locationConnection,
  distanceMeters,
  isInsideAllowedRadius,
  distanceLineGeoJSON,
  mapId = 'reading-map',
  onCameraChange,
  onViewDetail
}) => {
  const { theme } = useTheme();
  const map = useMap();
  const lastCameraRef = useRef<{ lat: number; lng: number; zoom: number } | null>(null);

  const [geoJsonAdded, setGeoJsonAdded] = useState(false);
  const [activeMarker, setActiveMarker] = useState<'capture' | 'connection' | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<'capture' | 'connection' | null>(null);

  const HOVER_TOOLTIP_MIN_ZOOM = 14;
  const [currentZoom, setCurrentZoom] = useState(16);

  // Center logic: prefer capture → connection → fallback
  const defaultCenter = useMemo(
    () => locationCapture ?? locationConnection ?? FALLBACK_CENTER_ANTONIO_ANTE,
    [locationCapture, locationConnection]
  );

  // ── GeoJSON line + fit bounds ───────────────────────────────────────────────
  useEffect(() => {
    if (!map) return;

    // Draw GeoJSON Line
    if (distanceLineGeoJSON && !geoJsonAdded) {
      try {
        map.data.addGeoJson(distanceLineGeoJSON);
        map.data.setStyle({
          strokeColor: isInsideAllowedRadius ? '#10b981' : '#ef4444',
          strokeWeight: 4,
          strokeOpacity: 0.8
        });
        setGeoJsonAdded(true);
      } catch (error) {
        console.error('Failed to add GeoJSON to map', error);
      }
    }

    // Fit bounds if both points exist
    if (locationCapture && locationConnection) {
      const googleMaps = (window as any).google.maps;
      const bounds = new googleMaps.LatLngBounds();
      bounds.extend(new googleMaps.LatLng(locationCapture.lat, locationCapture.lng));
      bounds.extend(new googleMaps.LatLng(locationConnection.lat, locationConnection.lng));
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    } else if (locationCapture) {
      map.panTo(locationCapture);
      map.setZoom(18);
    } else if (locationConnection) {
      map.panTo(locationConnection);
      map.setZoom(18);
    }
  }, [map, locationCapture, locationConnection, distanceLineGeoJSON, isInsideAllowedRadius, geoJsonAdded]);

  // ── Hide hover tooltip when zoomed out ─────────────────────────────────────
  useEffect(() => {
    if (currentZoom < HOVER_TOOLTIP_MIN_ZOOM && hoveredMarker) {
      setHoveredMarker(null);
    }
  }, [currentZoom, hoveredMarker]);

  const handleMarkerClick = useCallback((type: 'capture' | 'connection') => {
    setHoveredMarker(null);
    setActiveMarker(type);
    setInfoWindowShown(true);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowShown(false);
    setActiveMarker(null);
  }, []);

  return (
    <div className="reading-map-container">
      <Map
        colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
        defaultCenter={defaultCenter}
        defaultZoom={16}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        fullscreenControl={true}
        onCameraChanged={(ev) => {
          const newZoom = ev.detail.zoom;
          if (newZoom !== currentZoom) setCurrentZoom(newZoom);

          if (!onCameraChange) return;
          const lat = Number(ev.detail.center.lat);
          const lng = Number(ev.detail.center.lng);
          const last = lastCameraRef.current;
          if (
            !last ||
            last.zoom !== newZoom ||
            Math.abs(last.lat - lat) > 0.00015 ||
            Math.abs(last.lng - lng) > 0.00015
          ) {
            lastCameraRef.current = { lat, lng, zoom: newZoom };
            onCameraChange(ev.detail.center, newZoom);
          }
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* ── Marker: Punto de Conexión ──────────────────────────────────────── */}
        {locationConnection && (
          <AdvancedMarker
            position={locationConnection}
            zIndex={activeMarker === 'connection' ? 30000 : hoveredMarker === 'connection' ? 25000 : 1}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
            onMouseEnter={() => {
              if (currentZoom >= HOVER_TOOLTIP_MIN_ZOOM) setHoveredMarker('connection');
            }}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            <ReadingMapMarker
              type="connection"
              reading={reading ?? undefined}
              isHovered={hoveredMarker === 'connection'}
              isSelected={activeMarker === 'connection'}
              onClick={() => handleMarkerClick('connection')}
            />
          </AdvancedMarker>
        )}

        {/* ── Marker: Punto de Captura ───────────────────────────────────────── */}
        {locationCapture && (
          <AdvancedMarker
            position={locationCapture}
            zIndex={activeMarker === 'capture' ? 30000 : hoveredMarker === 'capture' ? 25000 : 2}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
            onMouseEnter={() => {
              if (currentZoom >= HOVER_TOOLTIP_MIN_ZOOM) setHoveredMarker('capture');
            }}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            <ReadingMapMarker
              type="capture"
              reading={reading ?? undefined}
              isHovered={hoveredMarker === 'capture'}
              isSelected={activeMarker === 'capture'}
              onClick={() => handleMarkerClick('capture')}
            />
          </AdvancedMarker>
        )}

        {/* ── InfoWindow: Popup al click ─────────────────────────────────────── */}
        {activeMarker === 'connection' && infoWindowShown && locationConnection && reading && (
          <InfoWindow
            position={locationConnection}
            pixelOffset={[0, -28]}
            onCloseClick={handleInfoWindowClose}
            maxWidth={340}
            disableAutoPan={false}
          >
            <ReadingMapInfoWindow
              reading={reading}
              markerType="connection"
              theme={theme}
              onClose={handleInfoWindowClose}
              onViewDetail={onViewDetail}
            />
          </InfoWindow>
        )}

        {activeMarker === 'capture' && infoWindowShown && locationCapture && reading && (
          <InfoWindow
            position={locationCapture}
            pixelOffset={[0, -28]}
            onCloseClick={handleInfoWindowClose}
            maxWidth={340}
            disableAutoPan={false}
          >
            <ReadingMapInfoWindow
              reading={reading}
              markerType="capture"
              theme={theme}
              onClose={handleInfoWindowClose}
              onViewDetail={onViewDetail}
            />
          </InfoWindow>
        )}
      </Map>

      {/* ── Leyenda flotante ────────────────────────────────────────────────── */}
      {distanceMeters != null && (
        <div className="reading-map-legend-box">
          <div className="reading-map-legend-title">
            <span
              className="reading-map-legend-distance-value"
              style={{ color: isInsideAllowedRadius ? '#10b981' : '#ef4444' }}
            >
              {distanceMeters.toFixed(2)} m
            </span>
            <span className="reading-map-legend-distance-label">distancia</span>
          </div>

          {isInsideAllowedRadius != null && (
            <div
              className="reading-map-legend-status-badge"
              style={{
                background: isInsideAllowedRadius ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${isInsideAllowedRadius ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
                color: isInsideAllowedRadius ? '#10b981' : '#ef4444'
              }}
            >
              {isInsideAllowedRadius ? '✓ Dentro del radio' : '✗ Fuera del radio'}
            </div>
          )}

          <div className="reading-map-legend-divider" />

          <div className="reading-map-legend-items">
            <div className="reading-map-legend-item">
              <span
                className="reading-map-legend-dot"
                style={{ background: '#10b981' }}
              />
              <span>Acometida</span>
            </div>
            <div className="reading-map-legend-item">
              <span
                className="reading-map-legend-dot"
                style={{ background: '#3b82f6' }}
              />
              <span>Lectura</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
