import React from 'react';
import { useReverseGeocode } from './useReverseGeocode';
import { GeoLocationDisplay } from './GeoLocationDisplay';
import { CircularProgress } from '../CircularProgress/CircularProgress';
import { EmptyState } from '../common/EmptyState';
import { TbMapOff } from 'react-icons/tb';

/**
 * GeoSection
 *
 * Thin shared wrapper: calls useReverseGeocode(lat, lng) and renders
 * GeoLocationDisplay in read-only mode (no capture / clear buttons).
 *
 * Use when you already have coordinates (e.g. from form state or a saved
 * domain object) and want to show the geocoded address card automatically.
 *
 * Extracted as its own component so hooks are never called inside conditionals.
 *
 * @example
 * {latitude && longitude && (
 *   <GeoSection lat={Number(latitude)} lng={Number(longitude)} />
 * )}
 */
export const GeoSection: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const geo = useReverseGeocode(lat, lng);

  const stateContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '220px',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: 'var(--surface-hover, rgba(255, 255, 255, 0.02))',
    borderRadius: 'var(--radius-md, 8px)',
    border: '1px dashed var(--border-color, rgba(255, 255, 255, 0.1))',
    width: '100%',
    boxSizing: 'border-box',
    animation: 'fadeIn 0.4s ease-out'
  };

  if (geo.isLoading) {
    return (
      <div style={stateContainerStyle}>
        <CircularProgress size={50} strokeWidth={4} label="Geocodificando ubicación..." />
      </div>
    );
  }

  if (!geo.address) {
    return (
      <div style={stateContainerStyle}>
        <EmptyState
          icon={TbMapOff}
          variant="warning"
          minHeight="auto"
          message="Dirección no encontrada"
          description="No se pudo obtener la dirección exacta. Asegúrese de que las coordenadas sean válidas o mueva el marcador en el mapa."
        />
      </div>
    );
  }

  return (
    <GeoLocationDisplay
      address={geo.address}
      isGeocoding={false}
      error={geo.error}
    />
  );
};
