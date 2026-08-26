import React, { useState } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import type { Connection } from '../../../domain/models/Connection';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MapMarker } from './MapMarker';
import { MapInfoWindow } from './MapInfoWindow';

interface ConnectionMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: Connection | null;
  onEdit?: (conn: Connection) => void;
  onViewIncidentsOnTable?: (connectionId: string) => void;
}

export const ConnectionMapModal: React.FC<ConnectionMapModalProps> = ({
  isOpen,
  onClose,
  connection,
  onEdit,
  onViewIncidentsOnTable
}) => {
  const { theme } = useTheme();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);

  if (!connection) return null;

  const lat = Number(connection.latitude);
  const lng = Number(connection.longitude);
  const hasValidCoords = !isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ubicación de Acometida: ${connection.connectionCadastralKey || connection.connectionId}`}
      size="full"
      icon={<FaMapMarkerAlt size={20} />}
    >
      <div style={{ height: '75vh', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        {hasValidCoords ? (
          <APIProvider apiKey={apiKey} libraries={['marker']}>
            <Map
              colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
              defaultCenter={{ lat, lng }}
              defaultZoom={18}
              mapId={mapId}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeControl={true}
              streetViewControl={true}
              fullscreenControl={true}
            >
              <AdvancedMarker 
                position={{ lat, lng }} 
                onClick={() => setInfoWindowOpen(true)}
              >
                <MapMarker
                  connection={connection}
                  isHovered={false}
                  isSelected={infoWindowOpen}
                  onClick={() => setInfoWindowOpen(true)}
                />
              </AdvancedMarker>

              {infoWindowOpen && (
                <InfoWindow
                  position={{ lat, lng }}
                  pixelOffset={[0, -25]}
                  onCloseClick={() => setInfoWindowOpen(false)}
                >
                  <MapInfoWindow
                    connection={connection}
                    theme={theme}
                    onClose={() => setInfoWindowOpen(false)}
                    onEdit={onEdit}
                    onViewIncidentsOnTable={onViewIncidentsOnTable}
                  />
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            No hay coordenadas válidas para esta acometida.
          </div>
        )}
      </div>
    </Modal>
  );
};
