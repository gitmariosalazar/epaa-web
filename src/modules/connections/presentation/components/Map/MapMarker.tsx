import React from 'react';
import { MapInstantTooltip } from './MapInstantTooltip';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import type { Connection } from '../../../domain/models/Connection';

interface MapMarkerProps {
  connection: Connection;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  connection,
  isHovered,
  isSelected,
  onClick,
  onMouseOver,
  onMouseOut
}) => {
  return (
    <div
      className={`marker-pulse-container status-${connection.connectionStatus ? 'active' : 'inactive'} ${isHovered ? 'is-hovered' : ''} ${isSelected ? 'is-selected' : ''}`}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      style={{ cursor: 'pointer' }}
    >
      {isHovered && <MapInstantTooltip connection={connection} />}

      <HiOutlineLocationMarker className="marker-static-pin" />
      <div className="marker-dot-core" />
      <div className="marker-heartbeat-pulse" />
    </div>

  );
};
