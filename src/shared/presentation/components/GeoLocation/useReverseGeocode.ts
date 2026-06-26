import { useState, useEffect } from 'react';
import type { ReverseGeocodedAddress } from './useGeolocation';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ReverseGeocodeState {
  /** Resolved address. null while loading or on error. */
  address: ReverseGeocodedAddress | null;
  /** True while the Nominatim request is in-flight. */
  isLoading: boolean;
  /** Error message, or null when there is none. */
  error: string | null;
}

// ─── Nominatim fetch (shared utility) ─────────────────────────────────────────

interface NominatimAddress {
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
}

interface NominatimResponse {
  display_name: string;
  address: NominatimAddress;
}

async function fetchReverseGeocode(lat: number, lon: number): Promise<NominatimResponse> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es&addressdetails=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  return res.json() as Promise<NominatimResponse>;
}

function parseAddress(
  raw: NominatimResponse,
  lat: number,
  lon: number
): ReverseGeocodedAddress {
  const a = raw.address;
  return {
    latitude:      lat,
    longitude:     lon,
    accuracy:      0,           // unknown for pre-existing coordinates
    captureTime:   new Date(),  // approximated
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

/**
 * useReverseGeocode
 *
 * Accepts existing latitude/longitude values and automatically reverse-geocodes
 * them via OpenStreetMap Nominatim on mount (or whenever lat/lon change).
 *
 * Use this when you already have coordinates saved in a domain object and want
 * to enrich them with a human-readable address — no GPS capture needed.
 *
 * SRP: geocoding only — no GPS capture, no form state.
 * DIP: depends on ReverseGeocodedAddress (shared DTO), not on any domain model.
 *
 * @param lat - latitude number, or null/undefined to skip geocoding.
 * @param lon - longitude number, or null/undefined to skip geocoding.
 *
 * @example
 * // In IncidentDetailModal:
 * const geo = useReverseGeocode(incident.latitude, incident.longitude);
 * <GeoLocationDisplay address={geo.address} isGeocoding={geo.isLoading} />
 */
export function useReverseGeocode(
  lat: number | null | undefined,
  lon: number | null | undefined
): ReverseGeocodeState {
  const [address, setAddress]   = useState<ReverseGeocodedAddress | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (lat == null || lon == null) {
      setAddress(null);
      setError(null);
      setLoading(false);
      return;
    }

    // cancelled flag prevents state updates after cleanup (React Strict Mode safe)
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchReverseGeocode(lat, lon)
      .then((raw) => {
        if (!cancelled) setAddress(parseAddress(raw, lat, lon));
      })
      .catch(() => {
        if (!cancelled) {
          setError('No se pudo obtener la dirección.');
          setAddress({
            latitude: lat, longitude: lon,
            accuracy: 0, captureTime: new Date(),
            streetAddress: '', neighborhood: '', city: '',
            province: '', country: '', countryCode: '',
            postalCode: '', fullAddress: `${lat}, ${lon}`,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lon]);

  return { address, isLoading, error };
}
