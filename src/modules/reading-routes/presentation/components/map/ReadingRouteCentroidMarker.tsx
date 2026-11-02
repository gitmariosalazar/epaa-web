import React from 'react';
import { AdvancedMarker, AdvancedMarkerAnchorPoint } from '@vis.gl/react-google-maps';
import type { RouteCentroidFeature } from '../../../domain/models/ReadingRoute';
import './ReadingRouteCentroidMarker.css';

export interface ReadingRouteCentroidMarkerProps {
  feature: RouteCentroidFeature;
  isSelected?: boolean;
  onClick: (feature: RouteCentroidFeature, coords: { lat: number; lng: number }) => void;
}

export const ReadingRouteCentroidMarker: React.FC<ReadingRouteCentroidMarkerProps> = ({
  feature,
  isSelected = false,
  onClick,
}) => {
  const [lng, lat] = feature.geometry.coordinates;
  const { codigo, codigoRuta, acometidas, 'marker-color': color } = feature.properties;
  const label = codigo || codigoRuta || 'R';

  return (
    <AdvancedMarker
      position={{ lat, lng }}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      onClick={() => onClick(feature, { lat, lng })}
    >
      <div
        className={`route-centroid-marker ${isSelected ? 'is-selected' : ''}`}
        title={`Ruta ${label} (${acometidas} medidores)`}
      >
        <div className="route-centroid-pin" style={{ borderColor: color || 'var(--accent)' }}>
          <span
            className="route-centroid-dot"
            style={{ backgroundColor: color || 'var(--accent)' }}
          />
          <span className="route-centroid-code">{label}</span>
        </div>
      </div>
    </AdvancedMarker>
  );
};
