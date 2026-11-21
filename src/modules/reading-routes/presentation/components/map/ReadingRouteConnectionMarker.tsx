import React, { memo } from 'react';
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint
} from '@vis.gl/react-google-maps';
import type { RouteConnection } from '../../../domain/models/RouteConnection';
import './ReadingRouteConnectionMarker.css';

export interface ReadingRouteConnectionMarkerProps {
  connection: RouteConnection;
  isSelected?: boolean;
  onClick: (
    connection: RouteConnection,
    coords: { lat: number; lng: number }
  ) => void;
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
  if (!Number.isFinite(numLat) || !Number.isFinite(numLng)) {
    return null;
  }
  if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
    return null;
  }
  if (numLat === 0 && numLng === 0) {
    return null;
  }
  return { lat: numLat, lng: numLng };
};

/**
 * Componente: ReadingRouteConnectionMarker
 *
 * Renderiza el marcador cartográfico para una acometida de la ruta seleccionada.
 * Cumple con SRP (sólo representación de punto en el mapa),
 * ISP (props concisas) y DIP (depende de la entidad RouteConnection).
 */
export const ReadingRouteConnectionMarker: React.FC<
  ReadingRouteConnectionMarkerProps
> = memo(({ connection, isSelected = false, onClick }) => {
  const coords = getValidCoords(connection.latitud, connection.longitud);
  if (!coords) return null;

  return (
    <AdvancedMarker
      position={coords}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      onClick={() => onClick(connection, coords)}
      zIndex={isSelected ? 60 : 15}
    >
      <div
        className={`reading-route-connection-pin ${isSelected ? 'is-selected' : ''}`}
        title={`Secuencia #${connection.ordenSecuencia} • Medidor: ${connection.numeroMedidor || 'S/N'} • ${connection.abonado || 'Consumidor'}`}
        role="button"
        tabIndex={0}
        aria-label={`Acometida número ${connection.ordenSecuencia}`}
      >
        <span className="reading-route-connection-pin-seq">
          {connection.ordenSecuencia}
        </span>
      </div>
    </AdvancedMarker>
  );
});

ReadingRouteConnectionMarker.displayName = 'ReadingRouteConnectionMarker';
