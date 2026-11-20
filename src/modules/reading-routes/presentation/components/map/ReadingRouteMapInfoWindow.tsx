import React from 'react';
import { InfoWindow } from '@vis.gl/react-google-maps';
import type { RouteCentroidFeature } from '../../../domain/models/ReadingRoute';
import { RouteBadge } from '../common/RouteBadge';
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
  const {
    idRuta,
    codigo,
    codigoRuta,
    nombre,
    nombreRuta,
    sectorId,
    sector,
    acometidas,
    estado,
    nombreUsuario,
    usuario,
    porcentajeAvance,
    lecturasCompletadas,
    lecturasEsperadas,
  } = centroid.properties;

  const codeLabel = codigo || codigoRuta || `R-${idRuta}`;
  const nameLabel = nombre || nombreRuta || 'Ruta de Lectura';
  const sec = sector || sectorId;
  const currentStatus = estado || 'NO_ASIGNADA';
  const assigneeName = nombreUsuario || usuario;

  return (
    <InfoWindow position={position} onCloseClick={onClose}>
      <div className="route-info-window">
        <div className="route-info-header">
          <span className="route-info-code">#{idRuta} · {codeLabel}</span>
          <div className="route-info-badges">
            {sec && <RouteBadge sector={sec} />}
            <RouteBadge status={currentStatus} />
          </div>
        </div>

        <div className="route-info-name">{nameLabel}</div>

        {assigneeName && (
          <div className="route-info-assignee">
            <span className="route-info-assignee-label">Lecturista:</span>
            <span className="route-info-assignee-val">{assigneeName}</span>
          </div>
        )}

        <div className="route-info-stats">
          <div className="route-info-stat-box">
            <span className="route-info-stat-label">Acometidas</span>
            <span className="route-info-stat-val">{acometidas || 0}</span>
          </div>
          <div className="route-info-stat-box">
            <span className="route-info-stat-label">
              {estado && estado !== 'NO_ASIGNADA' ? 'Avance' : 'Sector'}
            </span>
            <span className="route-info-stat-val">
              {estado && estado !== 'NO_ASIGNADA'
                ? `${porcentajeAvance ?? 0}%`
                : `#${sec || 'N/A'}`}
            </span>
          </div>
        </div>

        {estado && estado !== 'NO_ASIGNADA' && (
          <div className="route-info-progress-container">
            <div className="route-info-progress-bar">
              <div
                className="route-info-progress-fill"
                style={{
                  width: `${Math.min(100, Math.max(0, porcentajeAvance ?? 0))}%`,
                }}
              />
            </div>
            <div className="route-info-progress-label">
              <span>{lecturasCompletadas ?? 0} leídas</span>
              <span>{lecturasEsperadas ?? acometidas ?? 0} esp.</span>
            </div>
          </div>
        )}

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
