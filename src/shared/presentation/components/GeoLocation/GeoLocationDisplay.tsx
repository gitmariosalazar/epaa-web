import React from 'react';
import {
  MapPin, Navigation, Loader2, Satellite,
  Clock, Crosshair, Globe, Hash,
  Building2, Map, Home, AlertTriangle, RefreshCw
} from 'lucide-react';
import type { ReverseGeocodedAddress } from './useGeolocation';
import './GeoLocationDisplay.css';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface GeoLocationDisplayProps {
  /** The geocoded address to display. null = nothing captured yet. */
  address: ReverseGeocodedAddress | null;
  /** True while the browser is acquiring GPS. */
  isLocating?: boolean;
  /** True while the geocoding API is running. */
  isGeocoding?: boolean;
  /** Error message to show (overrides address display). */
  error?: string | null;
  /** Called when the user clicks the GPS capture button. */
  onGetLocation?: () => void;
  /** Called when the user clicks the clear/reset button. */
  onClear?: () => void;
  /** Override the capture button label. */
  captureLabel?: string;
  /**
   * When true, suppresses the bottom address card.
   * Use when a separate <GeoSection> will render the card to avoid duplicates.
   */
  hideAddressCard?: boolean;
  /** Additional CSS class. */
  className?: string;
}

// ─── AddressField sub-component ───────────────────────────────────────────────

interface AddressFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const AddressField: React.FC<AddressFieldProps> = ({ label, value, icon, highlight }) => (
  <div className={`geo-address-field${highlight ? ' geo-address-field--highlight' : ''}`}>
    <span className="geo-address-field__label">
      <span className="geo-address-field__icon">{icon}</span>
      {label}
    </span>
    <span className="geo-address-field__value">{value || '—'}</span>
  </div>
);

// ─── GeoLocationDisplay ────────────────────────────────────────────────────────

/**
 * GeoLocationDisplay
 *
 * Premium display card for GPS coordinates + reverse geocoded address.
 * Adapts to light and dark themes via CSS variables.
 *
 * SRP: renders location data — no fetching, no GPS logic.
 * DIP: depends on ReverseGeocodedAddress (abstract DTO), not on Nominatim.
 * OCP: new address fields can be added without touching the component logic.
 *
 * @example
 * const { address, isLocating, isGeocoding, error, getLocation, clear } = useGeolocation();
 *
 * <GeoLocationDisplay
 *   address={address}
 *   isLocating={isLocating}
 *   isGeocoding={isGeocoding}
 *   error={error}
 *   onGetLocation={getLocation}
 *   onClear={clear}
 * />
 */
export const GeoLocationDisplay: React.FC<GeoLocationDisplayProps> = ({
  address,
  isLocating = false,
  isGeocoding = false,
  error,
  onGetLocation,
  onClear,
  captureLabel = 'Obtener Ubicación GPS Actual',
  hideAddressCard = false,
  className = '',
}) => {
  const isLoading = isLocating || isGeocoding;
  const loadingLabel = isLocating ? 'Adquiriendo señal GPS...' : 'Geocodificando dirección...';

  return (
    <div className={`geo-display ${className}`}>

      {/* ── Capture button ── */}
      {onGetLocation && !address && (
        <button
          type="button"
          className={`geo-capture-btn${isLoading ? ' geo-capture-btn--loading' : ''}`}
          onClick={onGetLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="geo-spin" />
              <span>{loadingLabel}</span>
            </>
          ) : (
            <>
              <Satellite size={18} />
              <span>{captureLabel}</span>
            </>
          )}
        </button>
      )}

      {/* ── Error banner ── */}
      {error && !isLoading && (
        <div className="geo-error-banner">
          <AlertTriangle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* ── GPS status bar ── */}
      {address && (
        <div className="geo-status-bar">
          <div className="geo-status-bar__item">
            <Crosshair size={12} className="geo-status-bar__icon geo-status-bar__icon--precision" />
            <span className="geo-status-bar__label">Precisión:</span>
            <span className="geo-status-bar__value geo-status-bar__value--precision">
              ± {address.accuracy.toFixed(1)} m
            </span>
          </div>
          <div className="geo-status-bar__divider" />
          <div className="geo-status-bar__item">
            <Clock size={12} className="geo-status-bar__icon" />
            <span className="geo-status-bar__label">Captura:</span>
            <span className="geo-status-bar__value">
              {address.captureTime.toLocaleTimeString('es-EC', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
              })}
            </span>
          </div>
          <div className="geo-status-bar__divider" />
          <div className="geo-status-bar__item">
            <Navigation size={12} className="geo-status-bar__icon geo-status-bar__icon--lat" />
            <span className="geo-status-bar__label">Latitud:</span>
            <span className="geo-status-bar__value geo-status-bar__value--coord">
              {address.latitude.toFixed(7)}
            </span>
          </div>
          <div className="geo-status-bar__divider" />
          <div className="geo-status-bar__item">
            <Navigation size={12} className="geo-status-bar__icon geo-status-bar__icon--lng" style={{ transform: 'rotate(90deg)' }} />
            <span className="geo-status-bar__label">Longitud:</span>
            <span className="geo-status-bar__value geo-status-bar__value--coord">
              {address.longitude.toFixed(7)}
            </span>
          </div>

          {(onGetLocation || onClear) && (
            <div className="geo-status-bar__actions">
              {onGetLocation && (
                <button
                  type="button"
                  className="geo-status-bar__action-btn"
                  onClick={onGetLocation}
                  disabled={isLoading}
                  title="Volver a capturar"
                >
                  <RefreshCw size={12} className={isLoading ? 'geo-spin' : ''} />
                </button>
              )}
              {onClear && (
                <button
                  type="button"
                  className="geo-status-bar__action-btn geo-status-bar__action-btn--clear"
                  onClick={onClear}
                  title="Borrar ubicación"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Geocoded address card (hidden when hideAddressCard=true) ── */}
      {!hideAddressCard && isGeocoding && !address && (
        <div className="geo-card geo-card--geocoding">
          <Loader2 size={20} className="geo-spin" style={{ color: 'var(--accent)' }} />
          <span>Obteniendo dirección geocodificada...</span>
        </div>
      )}

      {!hideAddressCard && address && !isGeocoding && (
        <div className="geo-card">
          {/* Card header */}
          <div className="geo-card__header">
            <div className="geo-card__header-icon">
              <MapPin size={16} />
            </div>
            <span className="geo-card__header-title">
              Dirección de Ubicación Actual
              {address.fullAddress && (
                <span className="geo-card__header-badge">Geocodificada</span>
              )}
            </span>
          </div>

          {/* Address grid */}
          <div className="geo-card__grid">
            <AddressField
              label="Calle Principal"
              value={address.streetAddress}
              icon={<Home size={11} />}
            />
            <AddressField
              label="Barrio / Sector"
              value={address.neighborhood}
              icon={<Building2 size={11} />}
            />
            <AddressField
              label="Ciudad / Cantón"
              value={address.city}
              icon={<Map size={11} />}
            />
            <AddressField
              label="Provincia"
              value={address.province}
              icon={<Map size={11} />}
            />
            <AddressField
              label="País"
              value={address.countryCode
                ? `${address.country} (${address.countryCode})`
                : address.country}
              icon={<Globe size={11} />}
            />
            <AddressField
              label="Cód. Postal"
              value={address.postalCode}
              icon={<Hash size={11} />}
            />
          </div>

          {/* Full address */}
          {address.fullAddress && (
            <div className="geo-card__full-address">
              <span className="geo-card__full-address-label">Dirección Completa</span>
              <p className="geo-card__full-address-text">{address.fullAddress}</p>
            </div>
          )}

          {/* Google Maps link */}
          <a
            className="geo-card__maps-link"
            href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation size={12} />
            Ver en Google Maps
          </a>
        </div>
      )}
    </div>
  );
};
