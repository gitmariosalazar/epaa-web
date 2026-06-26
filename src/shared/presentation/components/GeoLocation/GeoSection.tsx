import React from 'react';
import { useReverseGeocode } from './useReverseGeocode';
import { GeoLocationDisplay } from './GeoLocationDisplay';

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
  return (
    <GeoLocationDisplay
      address={geo.address}
      isGeocoding={geo.isLoading}
      error={geo.error}
      // Read-only: no GPS capture button, no clear button
    />
  );
};
