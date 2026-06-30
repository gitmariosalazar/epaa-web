import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import {
  Map,
  InfoWindow,
  useMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint
} from '@vis.gl/react-google-maps';
import type { Connection } from '../../../domain/models/Connection';
import { useTheme } from '@/shared/presentation/context/ThemeContext';

import { MapMarker } from './MapMarker';
import { MapInfoWindow } from './MapInfoWindow';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

interface ConnectionMapProps {
  connections: Connection[];
  selectedConnection: Connection | null;
  onSelect: (conn: Connection) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  onEdit?: (conn: Connection) => void;
  onCameraChange?: (center: { lat: number; lng: number }, zoom: number) => void;
  mapId?: string;
}

export const ConnectionMap: React.FC<ConnectionMapProps> = ({
  connections,
  selectedConnection,
  onSelect,
  center,
  zoom = 13,
  onEdit,
  onCameraChange,
  mapId
}) => {
  const BOUNDS_PADDING_DEG = 0.01;

  const map = useMap();
  const navigate = useNavigate();
  const isInternalActionRef = useRef(false); // ← Previene re-render agresivo
  const lastBoundsUpdateRef = useRef(0);

  const handleViewIncidentsOnTable = useCallback(
    (connectionId: string) => {
      navigate(`/incidents?connectionId=${encodeURIComponent(connectionId)}`);
    },
    [navigate]
  );

  const handleViewIncidentsOnMap = useCallback(
    (connectionId: string) => {
      navigate(
        `/incidents/map?connectionId=${encodeURIComponent(connectionId)}`
      );
    },
    [navigate]
  );

  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<Connection | null>(
    null
  );
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  const [visibleBounds, setVisibleBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const { theme } = useTheme();

  // Solo mover el mapa cuando se selecciona desde fuera del popup
  useEffect(() => {
    if (!map || !selectedConnection || isInternalActionRef.current) return;

    if (selectedConnection.latitude && selectedConnection.longitude) {
      map.setCenter({
        lat: Number(selectedConnection.latitude),
        lng: Number(selectedConnection.longitude)
      });
      setInfoWindowShown(true);
      if (map.getZoom() < 17) map.setZoom(17);
    }
  }, [map, selectedConnection]);

  const handleEdit = useCallback(
    (conn: Connection) => {
      isInternalActionRef.current = true;
      onEdit?.(conn);

      // Reset después de la acción
      setTimeout(() => {
        isInternalActionRef.current = false;
      }, 1000);
    },
    [onEdit]
  );

  const handleClose = useCallback(() => {
    setInfoWindowShown(false);
  }, []);

  const firstWithCoords = connections.find((c) => c.latitude && c.longitude);
  const fallbackCenter = FALLBACK_CENTER_ANTONIO_ANTE;

  const finalCenter =
    center?.lat && center?.lng
      ? center
      : firstWithCoords
        ? {
            lat: Number(firstWithCoords.latitude),
            lng: Number(firstWithCoords.longitude)
          }
        : fallbackCenter;

  const connectionsWithCoords = useMemo(
    () => connections.filter((conn) => conn.latitude && conn.longitude),
    [connections]
  );

  const visibleConnections = useMemo(() => {
    if (!visibleBounds) {
      // Keep initial mount light; full set appears once bounds are available.
      return connectionsWithCoords.slice(0, 350);
    }

    return connectionsWithCoords.filter((conn) => {
      const lat = Number(conn.latitude);
      const lng = Number(conn.longitude);
      return (
        lat <= visibleBounds.north + BOUNDS_PADDING_DEG &&
        lat >= visibleBounds.south - BOUNDS_PADDING_DEG &&
        lng <= visibleBounds.east + BOUNDS_PADDING_DEG &&
        lng >= visibleBounds.west - BOUNDS_PADDING_DEG
      );
    });
  }, [connectionsWithCoords, visibleBounds]);

  return (
    <div className="map-view-container">
      <Map
        defaultCenter={finalCenter}
        defaultZoom={zoom}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={true}
        streetViewControl={true}
        fullscreenControl={true}
        onCameraChanged={(ev) => {
          if (ev.detail.zoom !== currentZoom) {
            setCurrentZoom(ev.detail.zoom);
          }

          if (map) {
            const now = Date.now();
            if (now - lastBoundsUpdateRef.current > 120) {
              const bounds = map.getBounds();
              if (bounds) {
                const northEast = bounds.getNorthEast();
                const southWest = bounds.getSouthWest();
                setVisibleBounds({
                  north: northEast.lat(),
                  south: southWest.lat(),
                  east: northEast.lng(),
                  west: southWest.lng()
                });
              }
              lastBoundsUpdateRef.current = now;
            }
          }

          onCameraChange?.(ev.detail.center, ev.detail.zoom);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {visibleConnections.map((conn) => (
          <AdvancedMarker
            key={conn.connectionId}
            position={{
              lat: Number(conn.latitude),
              lng: Number(conn.longitude)
            }}
            anchor={AdvancedMarkerAnchorPoint.CENTER}
            zIndex={
              selectedConnection?.connectionId === conn.connectionId ? 10000 : 1
            }
            onMouseEnter={() => {
              if (infoWindowShown || currentZoom < 17) return;
              setHoveredConnection(conn);
            }}
            onMouseLeave={() => setHoveredConnection(null)}
          >
            <MapMarker
              connection={conn}
              isHovered={hoveredConnection?.connectionId === conn.connectionId}
              isSelected={
                selectedConnection?.connectionId === conn.connectionId
              }
              onClick={() => {
                setHoveredConnection(null);
                onSelect(conn);
                setInfoWindowShown(true);
              }}
            />
          </AdvancedMarker>
        ))}

        {selectedConnection &&
          infoWindowShown &&
          selectedConnection.latitude &&
          selectedConnection.longitude && (
            <InfoWindow
              key={`infowindow-${selectedConnection.connectionId}`} // ← Clave estable
              position={{
                lat: Number(selectedConnection.latitude),
                lng: Number(selectedConnection.longitude)
              }}
              pixelOffset={[0, -25]}
              onCloseClick={handleClose}
            >
              <MapInfoWindow
                connection={selectedConnection}
                theme={theme}
                onClose={handleClose}
                onEdit={handleEdit}
                onViewIncidentsOnTable={handleViewIncidentsOnTable}
                onViewIncidentsOnMap={handleViewIncidentsOnMap}
              />
            </InfoWindow>
          )}
      </Map>
    </div>
  );
};
