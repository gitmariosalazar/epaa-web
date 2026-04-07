import React from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import type { Connection } from '../../../domain/models/Connection';

interface MapTooltipProps {
  connection: Connection;
  theme: string;
}

export const MapTooltip: React.FC<MapTooltipProps> = ({
  connection,
  theme,
}) => {
  return (
    <div className={`mini-tooltip ${theme === 'dark' ? 'dark' : ''} status-${connection.connectionStatus ? 'active' : 'inactive'}`}>
      <div className="tooltip-icon">
        <HiOutlineLocationMarker />
      </div>
      <div className="tooltip-content">
        <span className="tooltip-label">Clave Catastral</span>
        <span className="tooltip-value">{connection.connectionCadastralKey}</span>
      </div>
    </div>
  );
};
