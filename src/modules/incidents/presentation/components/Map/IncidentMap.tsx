import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react';
import {
  Map,
  InfoWindow,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint
} from '@vis.gl/react-google-maps';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { IncidentMapMarker } from './IncidentMapMarker';
import { IncidentMapInfoWindow } from './IncidentMapInfoWindow';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

// ── Props ────────────────────────────────────────────────────────────────────
export interface IncidentMapProps {
  /** Lista de incidentes a renderizar */
  incidents: IncidentDetailRowResponse[];
  /** Incidente actualmente seleccionado (click) */
  selectedIncident: IncidentDetailRowResponse | null;
  /** Callback al seleccionar un marcador */
  onSelect: (incident: IncidentDetailRowResponse) => void;
  /** Centro opcional del mapa */
  center?: { lat: number; lng: number };
  /** Zoom inicial */
  zoom?: number;
  /** Callback al hacer click en "Ver Detalle" del InfoWindow */
  onViewDetail?: (incident: IncidentDetailRowResponse) => void;
  /** Callback al mover la cámara (para sincronizar con estado del ViewModel) */
  onCameraChange?: (center: { lat: number; lng: number }, zoom: number) => void;
  /** Map ID requerido para AdvancedMarker */
  mapId?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// IncidentMap — componente principal
// SRP: solo coordina el mapa, los marcadores y el InfoWindow.
// Toda la lógica de datos viene del padre (ViewModel).
// OCP: extensible mediante props (onCameraChange, onViewDetail, etc.)
// DIP: depende de interfaces (props), no de implementaciones concretas.
// ─────────────────────────────────────────────────────────────────────────────
export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  selectedIncident,
  onSelect,
  center,
  zoom = 13,
  onViewDetail,
  onCameraChange,
  mapId
}) => {
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [hoveredIncident, setHoveredIncident] =
    useState<IncidentDetailRowResponse | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  const { theme } = useTheme();
  const HOVER_TOOLTIP_MIN_ZOOM = 14;
  const lastCameraRef = useRef<{
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);

  const map = useMap();

  // Hide hover tooltip when zoomed out (prevents visual clutter)
  useEffect(() => {
    if (currentZoom < HOVER_TOOLTIP_MIN_ZOOM && hoveredIncident) {
      setHoveredIncident(null);
    }
  }, [currentZoom, hoveredIncident]);

  // Programmatic pan/zoom when selectedIncident changes (SOLID / SRP)
  useEffect(() => {
    if (!map || !selectedIncident) return;
    if (selectedIncident.latitude && selectedIncident.longitude) {
      const targetCenter = {
        lat: Number(selectedIncident.latitude),
        lng: Number(selectedIncident.longitude)
      };
      map.panTo(targetCenter);
      setInfoWindowShown(true);
      if (map.getZoom() < 17) {
        map.setZoom(17);
      }
    }
  }, [map, selectedIncident]);

  // Determine map center: prop → first incident with coords → fallback (Ecuador)
  const firstWithCoords = incidents.find((i) => i.latitude && i.longitude);
  const FALLBACK_CENTER = FALLBACK_CENTER_ANTONIO_ANTE;

  const finalCenter =
    center?.lat && center?.lng
      ? center
      : firstWithCoords
        ? {
            lat: Number(firstWithCoords.latitude),
            lng: Number(firstWithCoords.longitude)
          }
        : FALLBACK_CENTER;

  const incidentsWithCoords = useMemo(
    () =>
      incidents.filter((incident) => incident.latitude && incident.longitude),
    [incidents]
  );

  const handleMarkerClick = useCallback(
    (incident: IncidentDetailRowResponse) => {
      setHoveredIncident(null);
      onSelect(incident);
      setInfoWindowShown(true);
    },
    [onSelect]
  );

  const handleInfoWindowClose = useCallback(
    () => setInfoWindowShown(false),
    []
  );

  return (
    <div className="incident-fullscreen-map-container">
      <Map
        theme={theme}
        defaultCenter={finalCenter}
        defaultZoom={zoom}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={true}
        onCameraChanged={(ev) => {
          const newZoom = ev.detail.zoom;
          if (newZoom !== currentZoom) {
            setCurrentZoom(newZoom);
          }

          if (!onCameraChange) return;
          const lat = Number(ev.detail.center.lat);
          const lng = Number(ev.detail.center.lng);
          const last = lastCameraRef.current;

          // Avoid flooding parent state with tiny camera deltas.
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
        {/* ── Markers ───────────────────────────────────────────────────── */}
        {incidentsWithCoords.map((incident) => (
          <AdvancedMarker
            key={incident.incidentId}
            position={{
              lat: Number(incident.latitude),
              lng: Number(incident.longitude)
            }}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
            onMouseEnter={() => {
              if (currentZoom >= HOVER_TOOLTIP_MIN_ZOOM) {
                setHoveredIncident(incident);
              }
            }}
            onMouseLeave={() => setHoveredIncident(null)}
            zIndex={
              selectedIncident?.incidentId === incident.incidentId
                ? 30000
                : hoveredIncident?.incidentId === incident.incidentId
                  ? 25000
                  : 12000
            }
          >
            <IncidentMapMarker
              incident={incident}
              isHovered={hoveredIncident?.incidentId === incident.incidentId}
              isSelected={selectedIncident?.incidentId === incident.incidentId}
              onClick={() => handleMarkerClick(incident)}
            />
          </AdvancedMarker>
        ))}

        {/* ── InfoWindow (click popup) ───────────────────────────────── */}
        {selectedIncident &&
          infoWindowShown &&
          selectedIncident.latitude &&
          selectedIncident.longitude && (
            <InfoWindow
              position={{
                lat: Number(selectedIncident.latitude),
                lng: Number(selectedIncident.longitude)
              }}
              pixelOffset={[0, -28]}
              onCloseClick={handleInfoWindowClose}
              maxWidth={340}
              disableAutoPan={false}
            >
              <IncidentMapInfoWindow
                incident={selectedIncident}
                theme={theme}
                onClose={handleInfoWindowClose}
                onViewDetail={onViewDetail}
              />
            </InfoWindow>
          )}
      </Map>
    </div>
  );
};
