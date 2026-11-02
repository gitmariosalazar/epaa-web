import React from 'react';
import { InfoWindow } from '@vis.gl/react-google-maps';
import type { RouteCentroidFeature } from '../../../domain/models/ReadingRoute';
import './ReadingRouteMapInfoWindow.css';

export interface ReadingRouteMapInfoWindowProps {
  centroid: RouteCentroidFeature;
  position: { lat: number; lng: number };
  onClose: () => void;
  onInspectRoute: (idRuta: number) => void;
}

export const ReadingRouteMapInfoWindow: React.FC<ReadingRouteMapInfoWindowProps> = ({
  centroid,
  position,
  onClose,
  onInspectRoute,
}) => {
  const { idRuta, codigo, codigoRuta, nombre, nombreRuta, sectorId, sector, acometidas } =
    centroid.properties;

  const codeLabel = codigo || codigoRuta || `R-${idRuta}`;
  const nameLabel = nombre || nombreRuta || 'Ruta de Lectura';
  const sec = sector || sectorId;

  return (
    <InfoWindow position={position} onCloseClick={onClose}>
      <div className="route-info-window">
        <div className="route-info-header">
          <span className="route-info-code">#{idRuta} · {codeLabel}</span>
          {sec && <span className="route-badge route-badge-active">Sector {sec}</span>}
        </div>
        <div className="route-info-name">{nameLabel}</div>
        <div className="route-info-stats">
          <div className="route-info-stat-box">
            <span className="route-info-stat-label">Acometidas</span>
            <span className="route-info-stat-val">{acometidas || 0}</span>
          </div>
          <div className="route-info-stat-box">
            <span className="route-info-stat-label">Sector</span>
            <span className="route-info-stat-val">#{sec || 'N/A'}</span>
          </div>
        </div>
        <button
          className="route-info-btn"
          onClick={() => onInspectRoute(idRuta)}
        >
          Ver Acometidas / Optimizar
        </button>
      </div>
    </InfoWindow>
  );
};
