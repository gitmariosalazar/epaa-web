import React from 'react';
import type { Connection } from '../../../domain/models/Connection';
import { MdCategory, MdLocationOn, MdPerson } from 'react-icons/md';
import { getConnectionStateChip } from '../../utils/connectionStateChip';
import { ACTIVE_STATES } from '../../../domain/models/ConnectionState';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { t } from 'i18next';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import './ConnectionCard.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { IoMdEye } from 'react-icons/io';
import { TbAlertTriangle } from 'react-icons/tb';

interface ConnectionCardProps {
  connection: Connection;
  isSelected: boolean;
  onSelect: (conn: Connection) => void;
  onViewIncidentsOnTable: (connectionId: string) => void;
  onViewIncidentsOnMap: (connectionId: string) => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  isSelected,
  onSelect,
  onViewIncidentsOnTable,
  onViewIncidentsOnMap
}) => {
  const chip = getConnectionStateChip(connection.connectionStatus);
  const isActive = ACTIVE_STATES.has(connection.connectionStatus);
  // console.log('ConnectionCard render', connection, isSelected);

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
      {Number(connection.incidents) > 0 && (
        <div className="card-body-incidents-wrapper">
          <div className="card-body-incidents">
            <div className="card-info-row">
              <TbAlertTriangle className="card-icon-incident" size={17} />
              <span className="card-text-incidents">
                La acometida tiene {connection.incidents} incidente(s)
                reportados.
              </span>
            </div>
            <div className="card-info-row">
              {Number(connection.incidents) > 0 ? (
                <div className="table-column-center">
                  <Tooltip
                    themeColor="warning"
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
                      size="xs"
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
                      size="xs"
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          <div className="card-incidents-actions">
            <Tooltip
              themeColor="warning"
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
                leftIcon={<IoMdEye size={14} />}
                onClick={() =>
                  onViewIncidentsOnTable(connection.connectionCadastralKey)
                }
              >
                Ver Detalles
              </Button>
            </Tooltip>
            <Tooltip
              themeColor="warning"
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
                onClick={() =>
                  onViewIncidentsOnMap(connection.connectionCadastralKey)
                }
              >
                Ver Ubicación
              </Button>
            </Tooltip>
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="card-info-row">
          <MdPerson className="card-icon" size={14} />
          <span className="card-text-client">
            {connection.clientId || '1000211126'}
          </span>
        </div>
        <div className="card-info-row">
          <MdLocationOn className="card-icon" size={14} />
          <span className="card-text-address">
            {connection.connectionAddress
              ? connection.connectionAddress
              : 'SIN DIRECCIÓN CATASTRAL'}
          </span>
        </div>
      </div>

      {/*LATITUD Y LONGITUD*/}
      <div className="card-footer">
        <div className="card-footer-info">
          <span className="card-label-footer">
            <span className="card-label-footer">LATITUD</span>
            <p className="card-text-address">
              {connection.latitude ? connection.latitude : '0.000000'}
            </p>
          </span>
          <span className="card-label-footer">
            <span className="card-label-footer">LONGITUD</span>
            <p className="card-text-address">
              {connection.longitude ? connection.longitude : '0.000000'}
            </p>
          </span>
        </div>
        <div className="card-footer-icons">
          <div className="footer-icon-btn">
            <MdLocationOn />
          </div>
          {/**   <div className="footer-icon-btn">
            <MdPerson />
          </div>*/}
          <ColorChip
            label={connection.connectionRateName}
            icon={<MdCategory size={14} />}
            variant="soft"
            size="xs"
            borderRadius={5}
          />
        </div>
      </div>
    </div>
  );
};
