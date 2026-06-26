import { useState, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

/**
 * Structured address from reverse geocoding.
 * All fields are optional — depends on what Nominatim returns for each location.
 */
export interface ReverseGeocodedAddress {
  /** Raw latitude from GPS. */
  latitude: number;
  /** Raw longitude from GPS. */
  longitude: number;
  /** GPS accuracy in meters. */
  accuracy: number;
  /** Timestamp when the position was captured. */
  captureTime: Date;
  /** Main street / road (Calle Principal). */
  streetAddress: string;
  /** Neighborhood / sector (Barrio / Sector). */
  neighborhood: string;
  /** City / canton (Ciudad / Cantón). */
  city: string;
  /** Province / state (Provincia). */
  province: string;
  /** Country name (País). */
  country: string;
  /** ISO country code, e.g. "ec". */
  countryCode: string;
  /** Postal / ZIP code. */
  postalCode: string;
  /** Full display address from Nominatim. */
  fullAddress: string;
}

export interface GeolocationState {
  /** The resolved geocoded address. null until a location is captured. */
  address: ReverseGeocodedAddress | null;
  /** True while the browser is acquiring GPS position. */
  isLocating: boolean;
  /** True while the reverse geocoding API request is in-flight. */
  isGeocoding: boolean;
  /** Human-readable error message, or null when there is none. */
  error: string | null;
  /** Trigger GPS acquisition + reverse geocoding. */
  getLocation: () => void;
  /** Reset state back to the initial empty state. */
  clear: () => void;
}

// ─── Nominatim reverse geocoding (pure, no side effects) ──────────────────────

interface NominatimResponse {
  display_name: string;
  address: {
    road?: string;
    pedestrian?: string;
    path?: string;
    suburb?: string;
    neighbourhood?: string;
    village?: string;
    quarter?: string;
    city?: string;
    town?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
}

async function reverseGeocode(
  lat: number,
  lon: number
): Promise<NominatimResponse> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'es' }
  });
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  return res.json() as Promise<NominatimResponse>;
}

function parseNominatim(
  raw: NominatimResponse,
  lat: number,
  lon: number,
  accuracy: number,
  captureTime: Date
): ReverseGeocodedAddress {
  const a = raw.address;
  return {
    latitude:      lat,
    longitude:     lon,
    accuracy,
    captureTime,
    streetAddress: a.road ?? a.pedestrian ?? a.path ?? '',
    neighborhood:  a.suburb ?? a.neighbourhood ?? a.village ?? a.quarter ?? '',
    city:          a.city ?? a.town ?? a.municipality ?? a.county ?? '',
    province:      a.state ?? '',
    country:       a.country ?? '',
    countryCode:   (a.country_code ?? '').toUpperCase(),
    postalCode:    a.postcode ?? '',
    fullAddress:   raw.display_name,
  };
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

const GEOLOCATION_ERRORS: Record<number, string> = {
  1: 'Permiso de geolocalización denegado.',
  2: 'La ubicación actual no está disponible.',
  3: 'Tiempo de espera agotado al obtener ubicación.',
};

/**
 * useGeolocation
 *
 * Manages GPS acquisition and optional reverse geocoding via OpenStreetMap Nominatim.
 *
 * SRP: manages only geolocation state.
 * DIP: calls the browser Geolocation API and a public REST endpoint — 
 *      no dependency on any specific domain model.
 *
 * @example
 * const { address, isLocating, isGeocoding, error, getLocation, clear } = useGeolocation();
 */
export function useGeolocation(options?: PositionOptions): GeolocationState {
  const [address, setAddress]       = useState<ReverseGeocodedAddress | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por este navegador.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const captureTime = new Date();
        setIsLocating(false);
        setIsGeocoding(true);

        try {
          const raw    = await reverseGeocode(latitude, longitude);
          const parsed = parseNominatim(raw, latitude, longitude, accuracy, captureTime);
          setAddress(parsed);
        } catch {
          // If geocoding fails, still set the raw coordinates
          setAddress({
            latitude,
            longitude,
            accuracy,
            captureTime,
            streetAddress: '',
            neighborhood:  '',
            city:          '',
            province:      '',
            country:       '',
            countryCode:   '',
            postalCode:    '',
            fullAddress:   `${latitude}, ${longitude}`,
          });
          setError('No se pudo obtener la dirección. Las coordenadas se guardaron.');
        } finally {
          setIsGeocoding(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setError(GEOLOCATION_ERRORS[err.code] ?? 'Error desconocido al obtener ubicación.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        ...options,
      }
    );
  }, [options]);

  const clear = useCallback(() => {
    setAddress(null);
    setError(null);
    setIsLocating(false);
    setIsGeocoding(false);
  }, []);

  return { address, isLocating, isGeocoding, error, getLocation, clear };
}
