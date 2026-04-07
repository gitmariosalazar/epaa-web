import React from 'react';
import type { Connection } from '../../../domain/models/Connection';
import { MdLocationOn, MdPerson } from 'react-icons/md';

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
  return (
    <div
      className={`connection-card ${isSelected ? 'selected' : ''} ${connection.connectionStatus ? 'active-card' : 'inactive-card'}`}
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
          className={`card-status-pill ${connection.connectionStatus ? 'active' : 'inactive'}`}
        >
          {connection.connectionStatus ? 'Active' : 'Inactive'}
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
