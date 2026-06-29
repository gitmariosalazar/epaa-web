import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Map, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { DARK_MAP_STYLE, SILVER_MAP_STYLE } from './IncidentMapStyles';
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
}

// ─────────────────────────────────────────────────────────────────────────────
// CustomOverlay
// Utilidad interna: monta un nodo React en un OverlayView de Google Maps.
// Permite usar HTML+CSS puro para los marcadores (sin limitación de la API de
// AdvancedMarker) y mantiene los z-index correctos.
// ─────────────────────────────────────────────────────────────────────────────
const CustomOverlay = ({
  position,
  children,
  zIndex,
  paneName = 'overlayMouseTarget',
}: {
  position: { lat: number; lng: number };
  children: React.ReactNode;
  zIndex?: number;
  paneName?: 'floatPane' | 'overlayMouseTarget' | 'markerLayer' | 'overlayLayer';
}) => {
  const map = useMap();
  const [container] = useState(() => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    return div;
  });

  const overlay = useMemo(() => {
    const google = (window as any).google;
    if (!google) return null;

    const ov = new google.maps.OverlayView();

    ov.onAdd = () => {
      const panes = ov.getPanes();
      if (panes) panes[paneName].appendChild(container);
    };

    ov.draw = () => {
      const projection = ov.getProjection();
      if (!projection) return;
      const point = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(position.lat, position.lng)
      );
      if (point) {
        container.style.left = `${point.x}px`;
        container.style.top = `${point.y}px`;
        container.style.zIndex = zIndex != null ? String(zIndex) : '1000';
      }
    };

    ov.onRemove = () => {
      if (container.parentNode) container.parentNode.removeChild(container);
    };

    return ov;
  }, [container, position.lat, position.lng, paneName, zIndex]);

  useEffect(() => {
    if (!map || !overlay) return;
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [map, overlay]);

  return createPortal(children, container);
};

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
}) => {
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [hoveredIncident, setHoveredIncident] = useState<IncidentDetailRowResponse | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  const { theme } = useTheme();

  const mapStyles = theme === 'dark' ? DARK_MAP_STYLE : SILVER_MAP_STYLE;

  const map = useMap();

  // Hide hover tooltip when zoomed out (prevents visual clutter)
  useEffect(() => {
    if (currentZoom < 17 && hoveredIncident) setHoveredIncident(null);
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
        ? { lat: Number(firstWithCoords.latitude), lng: Number(firstWithCoords.longitude) }
        : FALLBACK_CENTER;

  const handleMarkerClick = (incident: IncidentDetailRowResponse) => {
    setHoveredIncident(null);
    onSelect(incident);
    setInfoWindowShown(true);
  };

  const handleInfoWindowClose = () => setInfoWindowShown(false);

  return (
    <div className="incident-fullscreen-map-container">
      <Map
        center={finalCenter}
        zoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={true}
        onCameraChanged={(ev) => {
          const newZoom = ev.detail.zoom;
          setCurrentZoom(newZoom);
          onCameraChange?.(ev.detail.center, newZoom);
        }}
        style={{ width: '100%', height: '100%' }}
        styles={mapStyles}
      >
        {/* ── Markers ───────────────────────────────────────────────────── */}
        {incidents.map(
          (incident) =>
            incident.latitude &&
            incident.longitude && (
              <CustomOverlay
                key={incident.incidentId}
                position={{
                  lat: Number(incident.latitude),
                  lng: Number(incident.longitude),
                }}
                zIndex={
                  selectedIncident?.incidentId === incident.incidentId
                    ? 30000
                    : hoveredIncident?.incidentId === incident.incidentId
                      ? 25000
                      : 12000   // ← Aumentado mucho
                }
                paneName="overlayMouseTarget"
              >
                <IncidentMapMarker
                  incident={incident}
                  isHovered={hoveredIncident?.incidentId === incident.incidentId}
                  isSelected={selectedIncident?.incidentId === incident.incidentId}
                  onClick={() => handleMarkerClick(incident)}
                  onMouseOver={() => {
                    setHoveredIncident(incident);
                  }}
                  onMouseOut={() => setHoveredIncident(null)}
                />
              </CustomOverlay>
            )
        )}

        {/* ── InfoWindow (click popup) ───────────────────────────────── */}
        {selectedIncident &&
          infoWindowShown &&
          selectedIncident.latitude &&
          selectedIncident.longitude && (
            <InfoWindow
              position={{
                lat: Number(selectedIncident.latitude),
                lng: Number(selectedIncident.longitude),
              }}
              pixelOffset={[0, -28]}
              onCloseClick={handleInfoWindowClose}
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