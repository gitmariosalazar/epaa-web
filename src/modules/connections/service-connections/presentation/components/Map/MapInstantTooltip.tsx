import React from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import type { Connection } from '../../../domain/models/Connection';

interface MapInstantTooltipProps {
  connection: Connection;
}

export const MapInstantTooltip: React.FC<MapInstantTooltipProps> = ({
  connection,
}) => {
  return (
    <div className="map-instant-tooltip">
      <HiOutlineLocationMarker size={14} />
      <span>{connection.connectionCadastralKey}</span>
    </div>
  );
};
