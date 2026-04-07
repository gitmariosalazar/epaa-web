import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Map, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import type { Connection } from '../../../domain/models/Connection';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { DARK_MAP_STYLE, SILVER_MAP_STYLE } from './MapStyles';

// Decoupled Sub-Components
import { MapMarker } from './MapMarker';
import { MapInfoWindow } from './MapInfoWindow';

interface ConnectionMapProps {
  connections: Connection[];
  selectedConnection: Connection | null;
  onSelect: (conn: Connection) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  onEdit?: (conn: Connection) => void;
  onCameraChange?: (center: { lat: number; lng: number }, zoom: number) => void;
}

// --- Custom Overlay Helper for Pulsing Markers ---
const CustomOverlay = ({
  position,
  children,
  zIndex,
  paneName = 'overlayMouseTarget'
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
      if (panes) {
        panes[paneName].appendChild(container);
      }
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
        container.style.zIndex = zIndex ? String(zIndex) : '1';
      }
    };
    ov.onRemove = () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
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

export const ConnectionMap: React.FC<ConnectionMapProps> = ({
  connections,
  selectedConnection,
  onSelect,
  center,
  zoom = 13,
  onEdit,
  onCameraChange
}) => {
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<Connection | null>(
    null
  );
  // Track current zoom level for interaction thresholds
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  const { theme } = useTheme();

  const mapStyles = theme === 'dark' ? DARK_MAP_STYLE : SILVER_MAP_STYLE;

  // Clear hover if user zooms out below threshold
  useEffect(() => {
    if (currentZoom < 17 && hoveredConnection) {
      setHoveredConnection(null);
    }
  }, [currentZoom, hoveredConnection]);

  const firstWithCoords = connections.find((c) => c.latitude && c.longitude);
  const fallbackCenter = { lat: 0.33, lng: -78.17 };

  const finalCenter =
    center && center.lat && center.lng
      ? center
      : firstWithCoords
        ? {
            lat: Number(firstWithCoords.latitude),
            lng: Number(firstWithCoords.longitude)
          }
        : fallbackCenter;

  return (
    <div className="map-view-container">
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
          if (onCameraChange) {
            onCameraChange(ev.detail.center, newZoom);
          }
        }}
        style={{ width: '100%', height: '100%' }}
        styles={mapStyles}
      >
        {connections.map(
          (conn) =>
            conn.latitude &&
            conn.longitude && (
              <CustomOverlay
                key={conn.connectionId}
                position={{
                  lat: Number(conn.latitude),
                  lng: Number(conn.longitude)
                }}
                zIndex={
                  selectedConnection?.connectionId === conn.connectionId 
                    ? 10000 
                    : (hoveredConnection?.connectionId === conn.connectionId ? 9900 : 1)
                }
                paneName="overlayMouseTarget"
              >
                <MapMarker
                  connection={conn}
                  isHovered={hoveredConnection?.connectionId === conn.connectionId}
                  isSelected={selectedConnection?.connectionId === conn.connectionId}
                  onClick={() => {
                    setHoveredConnection(null);
                    onSelect(conn);
                    setInfoWindowShown(true);
                  }}
                  onMouseOver={() => {
                    // REQUIRE zoom level street-level (17+) for details to prevent flickering in clusters
                    if (infoWindowShown || currentZoom < 17) return;
                    setHoveredConnection(conn);
                  }}
                  onMouseOut={() => setHoveredConnection(null)}
                />
              </CustomOverlay>
            )
        )}



        {selectedConnection &&
          infoWindowShown &&
          selectedConnection.latitude &&
          selectedConnection.longitude && (
            <InfoWindow
              position={{
                lat: Number(selectedConnection.latitude),
                lng: Number(selectedConnection.longitude)
              }}
              pixelOffset={[0, -25]}
              onCloseClick={() => setInfoWindowShown(false)}
            >
              <MapInfoWindow
                connection={selectedConnection}
                theme={theme}
                onClose={() => setInfoWindowShown(false)}
                onEdit={onEdit}
              />
            </InfoWindow>
          )}

        {/* Instant tooltips are now handled inside MapMarker for zero-lag performance */}
      </Map>
    </div>
  );
};
