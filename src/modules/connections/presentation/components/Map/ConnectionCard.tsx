import React from 'react';
import type { Connection } from '../../../domain/models/Connection';
import { MdLocationOn, MdPerson } from 'react-icons/md';
import { getConnectionStateChip } from '../../utils/connectionStateChip';
import { ACTIVE_STATES } from '../../../domain/models/ConnectionState';

interface ConnectionCardProps {
  connection: Connection;
  isSelected: boolean;
  onSelect: (conn: Connection) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  isSelected,
  onSelect
}) => {
  const chip = getConnectionStateChip(connection.connectionStatus);
  const isActive = ACTIVE_STATES.has(connection.connectionStatus);

  return (
    <div
      className={`connection-card ${isSelected ? 'selected' : ''} ${isActive ? 'active-card' : 'inactive-card'}`}
      onClick={() => onSelect(connection)}
    >
      <div className="card-top">
        <div className="card-codes">
          <span className="card-label">CLAVE CATASTRAL</span>
          <h4 className="card-catastral">
            {connection.connectionCadastralKey}
          </h4>
        </div>
        <div
          className={`card-status-pill ${isActive ? 'active' : 'inactive'}`}
          style={{ color: chip.color, borderColor: chip.color }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {chip.icon}
            {chip.label}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-info-row">
          <MdPerson className="card-icon" />
          <span className="card-text">
            {connection.clientId || '1000211126'}
          </span>
        </div>
        <div className="card-info-row">
          <MdLocationOn className="card-icon" />
          <span className="card-text address-text">
            {connection.connectionAddress || 'AVD. JULIO M. AGUINAGA...'}
          </span>
        </div>
      </div>

      {/*LATITUD Y LONGITUD*/}
      <div className="card-footer">
        <div className="card-footer-info">
          <span className="card-label-footer">
            LATITUD
            <p className="card-text">
              {connection.latitude ? connection.latitude : '0.000000'}
            </p>
          </span>
          <span className="card-label-footer">
            LONGITUD
            <p className="card-text">
              {connection.longitude ? connection.longitude : '0.000000'}
            </p>
          </span>
        </div>
        <div className="card-footer-icons">
          <div className="footer-icon-btn">
            <MdLocationOn />
          </div>
          <div className="footer-icon-btn">
            <MdPerson />
          </div>
        </div>
      </div>
    </div>
  );
};
