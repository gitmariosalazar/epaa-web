/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, AlertCircle } from 'lucide-react';
import { TiWarning } from 'react-icons/ti';
import { FaMapLocationDot } from 'react-icons/fa6';
import { TbMapPin, TbMapPinOff } from 'react-icons/tb';
import {
  FaMapMarkerAlt,
  FaLayerGroup,
  FaKey,
  FaShapes,
  FaMountain,
  FaBullseye,
  FaStickyNote
} from 'react-icons/fa';
import type { Connection } from '@/modules/connections/service-connections/domain/models/Connection';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Alert } from '@/shared/presentation/components/Alert';
import { GeoSection } from '@/shared/presentation/components/GeoLocation';
import { decodeEWKBPoint } from '@/shared/utils/geoUtils';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import '@/modules/incidents/presentation/styles/CreateIncidentPage.css';

// Helper to dynamically load Leaflet from CDN (consistent with CreateIncidentPage)
const loadLeaflet = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const L = (window as any).L;
    if (L) {
      resolve(L);
      return;
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        const loadedL = (window as any).L;
        if (loadedL) {
          resolve(loadedL);
        } else {
          reject(new Error('Leaflet global object not found'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Leaflet script'));
      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        const loadedL = (window as any).L;
        if (loadedL) {
          clearInterval(interval);
          resolve(loadedL);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Timeout waiting for Leaflet to load'));
      }, 10000);
    }
  });
};

// Check if a coordinate value represents a valid numerical coordinate
const isValidCoordinate = (val: unknown): boolean => {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && isFinite(num);
};

// Helper to instantiate a draggable Leaflet marker with default icon
const createLeafletMarker = (
  L: any,
  map: any,
  pos: { lat: number; lng: number },
  onDragEnd: (lat: number, lng: number) => void
) => {
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const marker = L.marker(pos, {
    draggable: true,
    icon: defaultIcon
  }).addTo(map);

  marker.on('dragend', () => {
    const currentPos = marker.getLatLng();
    const lat = Number(currentPos.lat.toFixed(6));
    const lng = Number(currentPos.lng.toFixed(6));
    onDragEnd(lat, lng);
  });

  return marker;
};

interface TechnicalConnectionStepProps {
  formData: Omit<Connection, 'connectionId'>;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: string | number | boolean | Date | object }
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  hideFooterActions?: boolean;
}

export const TechnicalConnectionStep: React.FC<
  TechnicalConnectionStepProps
> = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  hideFooterActions = false
}) => {
  const { t } = useTranslation();

  // Map is visible by default so the user can immediately locate the connection
  const [showMap, setShowMap] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const hasAutoLocatedRef = useRef(false);

  // Coordinates are valid when both latitude and longitude are numbers and not (0,0)
  const hasValidCoords = Boolean(
    isValidCoordinate(formData.latitude) &&
    isValidCoordinate(formData.longitude) &&
    !(Number(formData.latitude) === 0 && Number(formData.longitude) === 0)
  );

  // Preserve initial coordinates (e.g. from existing connection) to allow restoring or conserving
  const [initialLocation] = useState<{ lat: number; lng: number } | null>(
    () => {
      if (
        isValidCoordinate(formData.latitude) &&
        isValidCoordinate(formData.longitude) &&
        !(Number(formData.latitude) === 0 && Number(formData.longitude) === 0)
      ) {
        return {
          lat: Number(formData.latitude),
          lng: Number(formData.longitude)
        };
      }
      if (formData.connectionCoordinates) {
        const decoded = decodeEWKBPoint(formData.connectionCoordinates);
        if (decoded && !(decoded.lat === 0 && decoded.lng === 0)) {
          return decoded;
        }
        if (
          typeof formData.connectionCoordinates === 'string' &&
          formData.connectionCoordinates.includes(',')
        ) {
          const [p1, p2] = formData.connectionCoordinates
            .split(',')
            .map((n) => Number(n.trim()));
          if (!isNaN(p1) && !isNaN(p2) && !(p1 === 0 && p2 === 0)) {
            return { lat: p1, lng: p2 };
          }
        }
      }
      return null;
    }
  );

  // Unified location update handler (Single Responsibility & Atomic updates)
  const handleLocationUpdate = useCallback(
    (
      lat: number,
      lng: number,
      altitude?: number | null,
      accuracy?: number | null
    ) => {
      const updates: Record<string, any> = {
        latitude: lat,
        longitude: lng,
        connectionCoordinates: `${lat}, ${lng}`,
        connectionGeolocationDate: new Date()
      };

      if (altitude !== null && altitude !== undefined) {
        updates.connectionAltitude = Math.round(altitude);
      }
      if (accuracy !== null && accuracy !== undefined) {
        updates.connectionPrecision = Math.round(accuracy);
      }

      handleInputChange(updates as any);
    },
    [handleInputChange]
  );

  // Fallback: If latitude/longitude are not set but connectionCoordinates is present
  useEffect(() => {
    if (!hasValidCoords && formData.connectionCoordinates) {
      const decoded = decodeEWKBPoint(formData.connectionCoordinates);
      if (decoded) {
        handleLocationUpdate(decoded.lat, decoded.lng);
        return;
      }
      if (
        typeof formData.connectionCoordinates === 'string' &&
        formData.connectionCoordinates.includes(',')
      ) {
        const [p1, p2] = formData.connectionCoordinates
          .split(',')
          .map((n) => Number(n.trim()));
        if (!isNaN(p1) && !isNaN(p2) && !(p1 === 0 && p2 === 0)) {
          handleLocationUpdate(p1, p2);
        }
      }
    }
  }, [hasValidCoords, formData.connectionCoordinates, handleLocationUpdate]);

  // Clear location: allows coordinates to be optional and left empty (null, not 0,0)
  const handleClearLocation = useCallback(() => {
    handleInputChange({
      latitude: null,
      longitude: null,
      connectionCoordinates: '',
      connectionAltitude: null,
      connectionPrecision: null
    } as any);

    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      mapRef.current.setView(
        [FALLBACK_CENTER_ANTONIO_ANTE.lat, FALLBACK_CENTER_ANTONIO_ANTE.lng],
        14
      );
    }
    MessageToastCustom(
      'warning',
      'Ubicación eliminada. Las coordenadas se guardarán vacías.',
      'Ubicación Limpiada',
      {
        position: 'top-right'
      }
    );
  }, [handleInputChange]);

  // Handle coordinate input without coercing empty string to 0
  const handleCoordinateInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (value === '' || value === null || value === undefined) {
        handleInputChange({
          name,
          value: null as any
        });
        return;
      }

      const num = Number(value);
      if (!isNaN(num)) {
        handleInputChange({
          name,
          value: num
        });
      }
    },
    [handleInputChange]
  );

  // Capture location from browser GPS (supports silent auto-mode on mount)
  const handleGetLocation = useCallback(
    (isSilent = false) => {
      if (!navigator.geolocation) {
        if (!isSilent) {
          const msg = 'La geolocalización no es soportada por este navegador.';
          setFormError(msg);
          MessageToastCustom('error', msg, 'Geolocalización', {
            position: 'top-right'
          });
        }
        return;
      }

      setIsLocating(true);
      if (!isSilent) {
        setFormError(null);
        MessageToastCustom(
          'info',
          'Obteniendo coordenadas GPS del dispositivo...',
          'Geolocalización',
          {
            position: 'top-right'
          }
        );
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(6));
          const lng = Number(position.coords.longitude.toFixed(6));
          handleLocationUpdate(
            lat,
            lng,
            position.coords.altitude,
            position.coords.accuracy
          );
          setIsLocating(false);
          setShowMap(true);
          if (!isSilent) {
            MessageToastCustom(
              'success',
              `Ubicación capturada con éxito: (${lat}, ${lng})`,
              'GPS Actual',
              {
                position: 'top-right'
              }
            );
          }
        },
        (error) => {
          setIsLocating(false);
          if (!isSilent) {
            let errorMsg = 'Error al obtener la ubicación actual.';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMsg =
                  'Permiso de geolocalización denegado en el navegador.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMsg = 'La ubicación actual no está disponible.';
                break;
              case error.TIMEOUT:
                errorMsg = 'Tiempo de espera agotado al obtener ubicación GPS.';
                break;
            }
            setFormError(errorMsg);
            MessageToastCustom('error', errorMsg, 'Error GPS', {
              position: 'top-right'
            });
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    [handleLocationUpdate]
  );

  // Automatic geolocation on initial mount if coordinates are not set
  useEffect(() => {
    if (hasAutoLocatedRef.current) return;
    hasAutoLocatedRef.current = true;

    if (
      !hasValidCoords &&
      typeof navigator !== 'undefined' &&
      navigator.geolocation
    ) {
      const timer = setTimeout(() => {
        handleGetLocation(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasValidCoords, handleGetLocation]);

  // Initialize and manage Leaflet Map lifecycle
  useEffect(() => {
    if (!showMap) return;

    let isMounted = true;
    let mapInstance: any = null;

    loadLeaflet()
      .then((L) => {
        if (!isMounted) return;

        const container = document.getElementById('technical-connection-map');
        if (!container) return;

        // Center map on existing coordinates or default fallback Antonio Ante
        const center: [number, number] = hasValidCoords
          ? [Number(formData.latitude), Number(formData.longitude)]
          : [
              FALLBACK_CENTER_ANTONIO_ANTE.lat,
              FALLBACK_CENTER_ANTONIO_ANTE.lng
            ];
        const zoom = hasValidCoords ? 16 : 14;

        mapInstance = L.map('technical-connection-map').setView(center, zoom);
        mapRef.current = mapInstance;

        setTimeout(() => {
          if (mapInstance && isMounted) {
            mapInstance.invalidateSize();
          }
        }, 250);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Place initial marker if coordinates already exist
        if (hasValidCoords) {
          const marker = createLeafletMarker(
            L,
            mapInstance,
            { lat: center[0], lng: center[1] },
            handleLocationUpdate
          );
          markerRef.current = marker;
        }

        // On map click: place or move marker and update coordinates
        mapInstance.on('click', (e: any) => {
          const position = e.latlng;
          const lat = Number(position.lat.toFixed(6));
          const lng = Number(position.lng.toFixed(6));

          if (markerRef.current) {
            markerRef.current.setLatLng(position);
          } else {
            const marker = createLeafletMarker(
              L,
              mapInstance,
              position,
              handleLocationUpdate
            );
            markerRef.current = marker;
          }

          handleLocationUpdate(lat, lng);
        });

        // Recalculate dimensions after container renders
        setTimeout(() => {
          if (isMounted && mapInstance) {
            mapInstance.invalidateSize();
            mapInstance.setView(center, zoom);
          }
        }, 400);
      })
      .catch((err) => {
        console.error('Error loading Leaflet map:', err);
      });

    return () => {
      isMounted = false;
      if (mapInstance) {
        mapInstance.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap]);

  // Synchronize marker and pan when coordinates change (GPS, auto-detect, or input)
  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;

    if (hasValidCoords) {
      const lat = Number(formData.latitude);
      const lng = Number(formData.longitude);
      const newLatLng = { lat, lng };

      if (markerRef.current) {
        const currentLatLng = markerRef.current.getLatLng();
        if (
          Math.abs(currentLatLng.lat - lat) > 0.000001 ||
          Math.abs(currentLatLng.lng - lng) > 0.000001
        ) {
          markerRef.current.setLatLng(newLatLng);
          mapRef.current.panTo(newLatLng);
        }
      } else if (L) {
        const marker = createLeafletMarker(
          L,
          mapRef.current,
          newLatLng,
          handleLocationUpdate
        );
        markerRef.current = marker;
        mapRef.current.setView(newLatLng, 16);
      }
    } else {
      // Coordinates were cleared
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }
  }, [
    formData.latitude,
    formData.longitude,
    hasValidCoords,
    handleLocationUpdate
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasValidCoords) {
      MessageToastCustom(
        'success',
        'Detalles técnicos y ubicación validados. Continuando...',
        'Detalles Técnicos',
        {
          position: 'top-right'
        }
      );
    } else {
      // Si envía vacío no debe actualizar las coordenadas: conservar original o null, nunca 0,0
      if (initialLocation && initialLocation.lat && initialLocation.lng) {
        handleInputChange({
          latitude: initialLocation.lat,
          longitude: initialLocation.lng,
          connectionCoordinates: `${initialLocation.lat}, ${initialLocation.lng}`
        } as any);
        MessageToastCustom(
          'info',
          `Conservando la ubicación original de la acometida (${initialLocation.lat}, ${initialLocation.lng}).`,
          'Ubicación Conservada',
          {
            position: 'top-right'
          }
        );
      } else {
        handleInputChange({
          latitude: null,
          longitude: null,
          connectionCoordinates: '',
          connectionAltitude: null,
          connectionPrecision: null
        } as any);
        MessageToastCustom(
          'info',
          'Continuando sin coordenadas geográficas registradas.',
          'Ubicación Opcional',
          {
            position: 'top-right'
          }
        );
      }
    }
    nextStep();
  };

  // Values to display in inputs (shows empty string when 0 or not set)
  const displayLatitude =
    formData.latitude !== undefined &&
    formData.latitude !== null &&
    Number(formData.latitude) !== 0
      ? formData.latitude
      : '';

  const displayLongitude =
    formData.longitude !== undefined &&
    formData.longitude !== null &&
    Number(formData.longitude) !== 0
      ? formData.longitude
      : '';

  return (
    <form
      id="technical-connection-form"
      onSubmit={handleSubmit}
      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
      className="step-container step-animation"
    >
      <h3 className="step-title">
        {t('connections.wizard.technicalDetails.title')}
      </h3>

      {/* Coordenadas principales (Opcionales) */}
      <div className="form-grid" style={{ marginBottom: '-0.25rem' }}>
        <div className="form-group">
          <Input
            label={t(
              'connections.wizard.technicalDetails.latitude',
              'Latitud (opcional)'
            )}
            type="number"
            step="any"
            name="latitude"
            size="small"
            value={displayLatitude}
            onChange={handleCoordinateInputChange}
            placeholder="-0.359008"
            leftIcon={<FaMapMarkerAlt size={14} />}
          />
        </div>
        <div className="form-group">
          <Input
            label={t(
              'connections.wizard.technicalDetails.longitude',
              'Longitud (opcional)'
            )}
            type="number"
            step="any"
            name="longitude"
            size="small"
            value={displayLongitude}
            onChange={handleCoordinateInputChange}
            placeholder="-78.195853"
            leftIcon={<FaMapMarkerAlt size={14} />}
          />
        </div>
      </div>

      {/* Geocodificación inversa y dirección detectada */}
      {hasValidCoords && (
        <div className="gps-address-card">
          <GeoSection
            lat={Number(formData.latitude)}
            lng={Number(formData.longitude)}
          />
        </div>
      )}

      {/* Alerta informativa de ubicación opcional */}
      {!hasValidCoords && (
        <Alert
          type="info"
          dismissible={false}
          className="alert-step-connection"
          title={t(
            'connections.wizard.technicalDetails.optionalLocationTitle',
            'Ubicación opcional'
          )}
          message={t(
            'connections.wizard.technicalDetails.optionalLocationNotice',
            'La ubicación geográfica de la acometida es opcional. Puedes hacer clic en el mapa para ubicarla, usar el GPS o continuar sin registrar coordenadas.'
          )}
          icon={<TiWarning size={26} />}
        />
      )}

      {/* Botones de acción GPS y Mapa */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          marginTop: '0.75rem',
          flexWrap: 'wrap',
          width: '100%'
        }}
      >
        <Button
          type="button"
          variant="dashed"
          size="xs"
          color="primary"
          onClick={() => handleGetLocation(false)}
          isLoading={isLocating}
          leftIcon={<MapPin size={16} />}
          style={{ flex: 1, justifyContent: 'center', minWidth: '180px' }}
        >
          {t(
            'connections.wizard.technicalDetails.currentGps',
            'Ubicación GPS Actual'
          )}
        </Button>

        {initialLocation && (
          <Button
            type="button"
            variant="dashed"
            color="emerald"
            size="xs"
            onClick={() => {
              handleLocationUpdate(initialLocation.lat, initialLocation.lng);
              setShowMap(true);
              MessageToastCustom(
                'info',
                `Ubicación de la acometida restaurada: (${initialLocation.lat}, ${initialLocation.lng})`,
                'Ubicación Acometida',
                {
                  position: 'top-right'
                }
              );
            }}
            leftIcon={<FaMapLocationDot size={16} />}
            style={{ flex: 1, justifyContent: 'center', minWidth: '180px' }}
          >
            {t(
              'connections.wizard.technicalDetails.initialLocation',
              'Ubicación Acometida'
            )}
          </Button>
        )}

        <Button
          type="button"
          variant="dashed"
          color="indigo"
          size="xs"
          onClick={() => setShowMap(!showMap)}
          leftIcon={
            showMap ? <TbMapPinOff size={16} /> : <TbMapPin size={16} />
          }
          style={{ flex: 1, justifyContent: 'center', minWidth: '180px' }}
        >
          {showMap
            ? t('connections.wizard.technicalDetails.hideMap', 'Ocultar Mapa')
            : t('connections.wizard.technicalDetails.showMap', 'Mostrar Mapa')}
        </Button>

        {hasValidCoords && (
          <Button
            type="button"
            variant="dashed"
            color="red"
            size="xs"
            onClick={handleClearLocation}
            leftIcon={<TbMapPinOff size={16} />}
            style={{ flex: 1, justifyContent: 'center', minWidth: '180px' }}
          >
            {t(
              'connections.wizard.technicalDetails.clearLocation',
              'Limpiar Ubicación'
            )}
          </Button>
        )}
      </div>

      {/* Mapa interactivo de Leaflet */}
      {showMap && (
        <div className="gps-map-wrapper">
          <span className="gps-map-instruction">
            📍{' '}
            {hasValidCoords
              ? t(
                  'connections.wizard.technicalDetails.mapInstructionValid',
                  'Arrastra el marcador o haz clic en el mapa para ajustar la ubicación exacta.'
                )
              : t(
                  'connections.wizard.technicalDetails.mapInstructionEmpty',
                  'Haz clic en el mapa para colocar el marcador de la acometida (opcional).'
                )}
          </span>
          <div
            id="technical-connection-map"
            className="incident-map-container"
            style={{ height: '380px', minHeight: '280px', zIndex: 1 }}
          />
        </div>
      )}

      {/* Banner de error si la geolocalización manual falla */}
      {formError && (
        <div
          className="incident-error-banner"
          style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}
        >
          <AlertCircle size={16} />
          <span>{formError}</span>
        </div>
      )}

      {/* Otros campos técnicos de la conexión */}
      <div className="form-grid" style={{ marginTop: '0.75rem' }}>
        <Input
          label={t('connections.wizard.technicalDetails.zoneId')}
          type="number"
          name="zoneId"
          size="small"
          value={formData.zoneId}
          onChange={handleInputChange}
          leftIcon={<FaLayerGroup size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.cadastralKey')}
          name="connectionCadastralKey"
          size="small"
          value={formData.connectionCadastralKey}
          onChange={handleInputChange}
          placeholder="e.g., 150-5500"
          info={t('connections.wizard.technicalDetails.cadastralInfo')}
          leftIcon={<FaKey size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.geometricZone')}
          name="connectionGeometricZone"
          size="small"
          value={formData.connectionGeometricZone}
          onChange={handleInputChange}
          leftIcon={<FaShapes size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.altitude')}
          type="number"
          name="connectionAltitude"
          size="small"
          value={formData.connectionAltitude}
          onChange={handleInputChange}
          leftIcon={<FaMountain size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.precision')}
          type="number"
          name="connectionPrecision"
          size="small"
          value={formData.connectionPrecision}
          onChange={handleInputChange}
          leftIcon={<FaBullseye size={14} />}
        />
        <Input
          label={t('connections.wizard.technicalDetails.reference')}
          name="connectionReference"
          size="small"
          value={formData.connectionReference}
          onChange={handleInputChange}
          leftIcon={<FaStickyNote size={14} />}
        />
      </div>

      {!hideFooterActions && (
        <div className="step-actions sticky-wizard-footer">
          <Button type="button" variant="ghost" onClick={prevStep}>
            {t('common.back')}
          </Button>
          <Button type="submit">{t('common.next')}</Button>
        </div>
      )}
    </form>
  );
};
