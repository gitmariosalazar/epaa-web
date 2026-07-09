import React from 'react';
import './ReadingLocationModal.css';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { ReadingMap } from './ReadingMap';
import type { TakenReadingConnection } from '../../../domain/models/Reading';
import { Alert } from '@/shared/presentation/components/Alert';
import { TiWarning } from 'react-icons/ti';

interface ReadingLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: TakenReadingConnection | null;
}

/**
 * Modal que presenta el mapa con la ubicación de la lectura.
 * Sigue el principio SRP al encargarse únicamente de la presentación del modal y sus datos relacionados.
 */
export const ReadingLocationModal: React.FC<ReadingLocationModalProps> = ({
  isOpen,
  onClose,
  reading
}) => {
  const { t } = useTranslation();

  if (!reading) return null;

  const existLocations: boolean = !!reading.locationCapture && !!reading.locationConnection;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('readings.map.title', 'Ubicación de la Lectura')}
      description={`${t('readings.columns.meter', 'Medidor')}: ${reading.meterNumber || 'N/A'} | ${t('readings.columns.cadastralKey', 'Clave Catastral')}: ${reading.cadastralKey}`}
      size="lg"
    >
      <div className="reading-location-modal-content">
        <div className="reading-location-modal-info-grid">
          <div>
            <span className="reading-location-modal-info-label">{t('readings.columns.client', 'Cliente')}:</span>
            <br />
            {reading.clientName}
          </div>
          <div>
            <span className="reading-location-modal-info-label">{t('common.address', 'Dirección')}:</span>
            <br />
            {reading.address}
          </div>
          <div>
            <span className="reading-location-modal-info-label">{t('readings.columns.readingDate', 'Fecha')}:</span>
            <br />
            {reading.readingDate ? new Date(reading.readingDate).toLocaleString() : 'N/A'}
          </div>
        </div>

        {
          !existLocations && (
            <Alert
              type='warning'
              dismissible={false}
              title={t('common.warning', 'Advertencia')}
              message={t('readings.map.noLocations', 'No se han registrado ubicaciones para esta lectura')}
              icon={<TiWarning size={30} />}
            />
          )
        }
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['marker']}>
          <ReadingMap
            reading={reading}
            locationCapture={reading.locationCapture}
            locationConnection={reading.locationConnection}
            distanceMeters={reading.distanceMeters}
            isInsideAllowedRadius={reading.isInsideAllowedRadius}
            distanceLineGeoJSON={reading.distanceLineGeoJSON}
          />
        </APIProvider>
      </div>
    </Modal>
  );
};
