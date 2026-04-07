import React from 'react';
import { MdLocationOn, MdPerson, MdCategory } from 'react-icons/md';
import { IoCloseCircle } from 'react-icons/io5';
import type { Connection } from '../../../domain/models/Connection';

interface MapInfoWindowProps {
  connection: Connection;
  theme: string;
  onClose: () => void;
  onEdit?: (conn: Connection) => void;
}

export const MapInfoWindow: React.FC<MapInfoWindowProps> = ({
  connection,
  theme,
  onClose,
  onEdit,
}) => {
  return (
    <div className={`premium-popup ${theme === 'dark' ? 'dark' : ''}`}>
      <div
        className={`premium-popup-header-status ${
          connection.connectionStatus ? 'status-active' : 'status-inactive'
        }`}
      />
      
      <button className="popup-close-btn" onClick={onClose}>
        <IoCloseCircle />
      </button>

      <div className="premium-popup-content">
        <div className="premium-pill-container">
          <span className={`premium-pill-tag ${connection.connectionStatus ? 'active' : 'inactive'}`}>
            {connection.connectionStatus ? '● PREMIUM FEATURE' : '○ INACTIVO'}
          </span>
        </div>

        <div className="popup-main-title">
          <h3>{connection.connectionCadastralKey}</h3>
        </div>

        <p className="popup-subtitle">
          <MdLocationOn /> {connection.connectionAddress || 'Quito, Ecuador'}
        </p>

        <div className="popup-info-grid">
          <div className="popup-info-item">
            <span className="info-label"><MdPerson /> CLIENTE</span>
            <span className="info-value">{connection.clientId}</span>
          </div>
          <div className="popup-info-item">
            <span className="info-label"><MdCategory /> CATEGORÍA</span>
            <span className="info-value">{connection.connectionRateName}</span>
          </div>
        </div>

        <div className="popup-actions-centered">
          <button
            className="premium-action-btn"
            onClick={() => onEdit && onEdit(connection)}
          >
            Ver Detalles →
          </button>
        </div>
      </div>
    </div>
  );
};
