import React from 'react';
import { MdLocationOn, MdPerson, MdCategory } from 'react-icons/md';
import { IoCloseCircle } from 'react-icons/io5';
import type { Connection } from '../../../domain/models/Connection';
import { TbAlertTriangle } from 'react-icons/tb';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { t } from 'i18next';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { IoMdEye } from 'react-icons/io';
import "./MapInfoWindow.css";

interface MapInfoWindowProps {
  connection: Connection;
  theme: string;
  onClose: () => void;
  onEdit?: (conn: Connection) => void;
  onViewIncidentsOnTable?: (connectionId: string) => void;
  onViewIncidentsOnMap?: (connectionId: string) => void;

}

export const MapInfoWindow: React.FC<MapInfoWindowProps> = ({
  connection,
  theme,
  onClose,
  onEdit,
  onViewIncidentsOnTable,
  onViewIncidentsOnMap
}) => {
  return (
    <div className={`premium-popup ${theme === 'dark' ? 'dark' : ''}`}>
      <div
        className={`premium-popup-header-status ${connection.connectionStatus ? 'status-active' : 'status-inactive'
          }`}
      />

      <button className="popup-close-btn" onClick={onClose}>
        <IoCloseCircle />
      </button>

      <div className="premium-popup-content">
        <div className="premium-pill-container">
          <span className={`premium-pill-tag ${connection.connectionStatus ? 'active' : 'inactive'}`}>
            {connection.connectionStatus ? `● ${connection.connectionStatus}` : '○ INACTIVO'}
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
            <span className="info-label"><MdCategory /> TARIFA</span>
            <span className="info-value">{connection.connectionRateName}</span>
          </div>
        </div>

        {Number(connection.incidents) > 0 && (
          <div className="card-body-incidents-wrapper">
            <div className="card-body-incidents">
              <div className="card-info-row">
                <TbAlertTriangle className="card-icon-incident" size={25} />
                <span className="card-text-incidents">
                  La acometida tiene {connection.incidents} incidente(s) reportados.
                </span>
              </div>
              <div className="card-info-row">
                {Number(connection.incidents) > 0 ? (
                  <div className="table-column-center">
                    <Tooltip themeColor='warning'
                      content={t(
                        'connections.table.incidentsCount',
                        `La acometida tiene ${connection.incidents} incidente(s).`
                      )}
                      position="bottom"
                      followCursor={false}
                    >
                      <ColorChip
                        label={connection.incidents.toString()}
                        color="#ef4444" // Rojo = problema
                        icon={<AlertTriangle size={14} />} // Triángulo de alerta
                        variant="soft"
                        size="sm"
                      />
                    </Tooltip>
                  </div>
                ) : (
                  <div className="table-column-center">
                    <Tooltip
                      content={t(
                        'connections.table.incidentsCount',
                        'La acometida no tiene incidentes.'
                      )}
                      position="bottom"
                      followCursor={false}
                    >
                      <ColorChip
                        label="0"
                        color="#22c55e" // Verde = bueno
                        icon={<CheckCircle size={14} />} // Check = sin problemas
                        variant="soft"
                        size="sm"
                      />
                    </Tooltip>
                  </div>
                )}

              </div>
            </div>
            <div className="card-incidents-actions">
              <Tooltip themeColor='warning'
                content={t(
                  'connections.table.incidentsCount',
                  `Ver detalles de la acometida`
                )}
                position="bottom"
                followCursor={false}
              >
                <Button
                  variant="dashed"
                  size="xs"
                  leftIcon={<IoMdEye seed={20} />}
                  onClick={() => onViewIncidentsOnTable?.(connection.connectionId)}
                >
                  Ver Detalles
                </Button>
              </Tooltip>
              <Tooltip themeColor='warning'
                content={t(
                  'connections.incidents.viewLocation',
                  `Ver ubicación del incidente en el mapa`
                )}
                position="bottom"
                followCursor={false}
              >
                <Button
                  variant="dashed"
                  color="green"
                  size="xs"
                  leftIcon={<MdLocationOn />}
                  onClick={() => onViewIncidentsOnMap?.(connection.connectionId)}
                >
                  Ver Ubicación
                </Button>
              </Tooltip>
            </div>
          </div>
        )}

        <div className="popup-actions-centered">
          <Button
            className="premium-action-btn"
            onClick={() => onEdit && onEdit(connection)}
            leftIcon={<IoMdEye />}
          >
            Ver Detalle de Acometida
          </Button>
        </div>
      </div>
    </div>
  );
};
