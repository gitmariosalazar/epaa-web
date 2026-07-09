import React, { useEffect, useState } from 'react';
import { Map, useMap, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import '@/modules/readings/presentation/styles/ReadingMap.css';
import { ReadingMapMarker } from './ReadingMapMarker';
import { useTheme } from '@/shared/presentation/context/ThemeContext';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdMyLocation } from 'react-icons/md';

export interface ReadingMapProps {
  locationCapture?: { lat: number; lng: number } | null;
  locationConnection?: { lat: number; lng: number } | null;
  distanceMeters?: number | null;
  isInsideAllowedRadius?: boolean | null;
  distanceLineGeoJSON?: any | null;
  mapId?: string;
  reading?: any;
}

/**
 * Componente que renderiza el mapa para las lecturas.
 * SRP: Solo se encarga de dibujar el mapa, los marcadores y la línea GeoJSON.
 */
export const ReadingMap: React.FC<ReadingMapProps> = ({
  locationCapture,
  locationConnection,
  distanceMeters,
  isInsideAllowedRadius,
  distanceLineGeoJSON,
  mapId = 'reading-map',
  reading
}) => {
  const { theme } = useTheme();
  const map = useMap();
  const [geoJsonAdded, setGeoJsonAdded] = useState(false);
  const [activeMarker, setActiveMarker] = useState<'capture' | 'connection' | null>(null);

  // Center logic
  const defaultCenter = locationCapture || locationConnection || FALLBACK_CENTER_ANTONIO_ANTE;

  useEffect(() => {
    if (!map) return;

    // Draw GeoJSON Line
    if (distanceLineGeoJSON && !geoJsonAdded) {
      try {
        map.data.addGeoJson(distanceLineGeoJSON);
        map.data.setStyle({
          strokeColor: isInsideAllowedRadius ? '#10b981' : '#ef4444',
          strokeWeight: 4,
          strokeOpacity: 0.8
        });
        setGeoJsonAdded(true);
      } catch (error) {
        console.error('Failed to add GeoJSON to map', error);
      }
    }

    // Fit bounds if both points exist
    if (locationCapture && locationConnection) {
      const googleMaps = (window as any).google.maps;
      const bounds = new googleMaps.LatLngBounds();
      bounds.extend(new googleMaps.LatLng(locationCapture.lat, locationCapture.lng));
      bounds.extend(new googleMaps.LatLng(locationConnection.lat, locationConnection.lng));
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    } else if (locationCapture) {
      map.panTo(locationCapture);
      map.setZoom(18);
    } else if (locationConnection) {
      map.panTo(locationConnection);
      map.setZoom(18);
    }
  }, [map, locationCapture, locationConnection, distanceLineGeoJSON, isInsideAllowedRadius, geoJsonAdded]);

  return (
    <div className="reading-map-container">
      <Map
        colorScheme={theme === 'dark' ? 'DARK' : 'LIGHT'}
        defaultCenter={defaultCenter}
        defaultZoom={16}
        mapId={mapId}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {locationConnection && (
          <AdvancedMarker
            position={locationConnection}
            title="Punto de Conexión"
            zIndex={1}
            onClick={() => setActiveMarker('connection')}
          >
            <ReadingMapMarker type="connection" />
          </AdvancedMarker>
        )}

        {locationCapture && (
          <AdvancedMarker
            position={locationCapture}
            title="Punto de Captura (Lectura)"
            zIndex={2}
            onClick={() => setActiveMarker('capture')}
          >
            <ReadingMapMarker type="capture" />
          </AdvancedMarker>
        )}

        {/* InfoWindow for Connection */}
        {activeMarker === 'connection' && locationConnection && (
          <InfoWindow
            position={locationConnection}
            onCloseClick={() => setActiveMarker(null)}
            pixelOffset={[0, -28]}
          >
            <div className="reading-map-info-window">
              <h4 className="reading-map-info-title">Ubicación de Acometida</h4>
              <div className="reading-map-info-body">
                <div className="reading-map-info-row"><strong>Medidor:</strong> {reading?.meterNumber || 'N/A'}</div>
                <div><strong>Dirección:</strong> {reading?.address || 'N/A'}</div>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for Capture */}
        {activeMarker === 'capture' && locationCapture && (
          <InfoWindow
            position={locationCapture}
            onCloseClick={() => setActiveMarker(null)}
            pixelOffset={[0, -28]}
          >
            <div className="reading-map-info-window">
              <h4 className="reading-map-info-title">Punto de Lectura</h4>
              <div className="reading-map-info-body">
                <div className="reading-map-info-row"><strong>Fecha:</strong> {reading?.readingDate ? new Date(reading.readingDate).toLocaleString() : 'N/A'}</div>
                <div><strong>Distancia:</strong> {distanceMeters != null ? `${distanceMeters.toFixed(2)} m` : 'N/A'}</div>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Legend / Info Box */}
      {(distanceMeters != null) && (
        <div className="reading-map-legend-box">
          <div className="reading-map-legend-title">
            Distancia: {distanceMeters.toFixed(2)} m
          </div>
          {isInsideAllowedRadius != null && (
            <ColorChip
              label={isInsideAllowedRadius ? 'Dentro del radio permitido' : 'Fuera del radio permitido'}
              color={isInsideAllowedRadius ? '#10b981' : '#ef4444'}
              variant="soft"
              size="xs"
              icon={isInsideAllowedRadius ? <FaCheckCircle /> : <IoIosCloseCircle />}
              borderRadius={6}
            />
          )}

          <Divider />

          <div className="reading-map-legend-row">
            <span>Información de leyendas</span>
          </div>

          { /** Legend about reading type */}
          <div className="reading-map-legend-row">
            <div className={`reading-map-legend-status ${isInsideAllowedRadius ? 'inside' : 'outside'}`}>
              <ColorChip
                label={'Lugar de Acometida'}
                color={'#10b981'}
                variant="ghost"
                size="xs"
                icon={<FaHome />}
                borderRadius={6}
              />
            </div>
          </div>

          { /** Legend about novelty */}
          <div className="reading-map-legend-row">
            <div className={`reading-map-legend-status ${isInsideAllowedRadius ? 'inside' : 'outside'}`}>
              <ColorChip
                label={'Punto de Lectura'}
                color={'#3b82f6'}
                variant="ghost"
                size="xs"
                icon={<MdMyLocation />}
                borderRadius={6}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
