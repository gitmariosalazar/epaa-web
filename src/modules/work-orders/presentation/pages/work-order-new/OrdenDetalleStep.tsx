/**
 * OrdenDetalleStep — Paso 2 del wizard de creación de OT
 *
 * CLEAN ARCHITECTURE:
 *   - La búsqueda de acometidas ya ocurrió en ClienteStep (Step 1).
 *   - Este paso solo gestiona clasificación, ubicación, GPS y mapa.
 *
 * SOLID:
 *   - SRP  : solo campos de detalle (clasificación + ubicación + descripción).
 *   - OCP  : agregar campos no requiere tocar otros componentes.
 *   - ISP  : props mínimas necesarias.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wrench, MapPin, FileText, AlertTriangle } from 'lucide-react';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';
import { FaMapLocationDot } from 'react-icons/fa6';
import { TbMapPin, TbMapPinOff } from 'react-icons/tb';
import { ORIGINS, WORK_TYPES, PRIORITIES } from './constants';
import type { WorkOrderForm } from './types';


// ── Estilos GPS/mapa (reutiliza los de incidents) ───────────────────────────
import '@/modules/incidents/presentation/styles/CreateIncidentPage.css';
import { GeoSection } from '@/shared/presentation/components/GeoLocation';

// ── Helper: Carga dinámica de Leaflet desde CDN ─────────────────────────────
const loadLeaflet = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const L = (window as any).L;
    if (L) { resolve(L); return; }
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        const loadedL = (window as any).L;
        if (loadedL) resolve(loadedL);
        else reject(new Error('Leaflet global object not found'));
      };
      script.onerror = () => reject(new Error('Failed to load Leaflet script'));
      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        const loadedL = (window as any).L;
        if (loadedL) { clearInterval(interval); resolve(loadedL); }
      }, 50);
      setTimeout(() => { clearInterval(interval); reject(new Error('Timeout')); }, 10000);
    }
  });
};

interface OrdenDetalleStepProps {
  form: WorkOrderForm;
  onFormChange: (fields: Partial<WorkOrderForm>) => void;
  errors?: Record<string, string>;
}

export const OrdenDetalleStep: React.FC<OrdenDetalleStepProps> = ({
  form, onFormChange, errors,
}) => {
  const field = <K extends keyof WorkOrderForm>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onFormChange({ [key]: e.target.value } as Partial<WorkOrderForm>);

  // ── GPS state ─────────────────────────────────────────────────────────
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Si hay coordenadas pre-llenadas del Step 1, activar mapa automáticamente
  const hasPrefilledCoords = useRef(false);
  const [initialLocation, setInitialLocation] = useState<{ lat: string, lng: string } | null>(null);

  useEffect(() => {
    if (form.latitude && form.longitude && !hasPrefilledCoords.current) {
      hasPrefilledCoords.current = true;
      setInitialLocation({ lat: form.latitude, lng: form.longitude });
      // Delay para que el componente haga su primer render
      setTimeout(() => setShowMap(true), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ── GPS: Obtener ubicación actual ─────────────────────────────────────
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setFormError('La geolocalización no es soportada por este navegador.');
      return;
    }
    setIsLocating(true);
    setFormError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onFormChange({ latitude: String(position.coords.latitude), longitude: String(position.coords.longitude) });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        const msgs: Record<number, string> = {
          1: 'Permiso de geolocalización denegado.',
          2: 'La ubicación actual no está disponible.',
          3: 'Tiempo de espera agotado al obtener ubicación.',
        };
        setFormError(msgs[error.code] || 'Error al obtener la ubicación.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Leaflet map — ref callback para garantizar que el div existe ───────
  const initializeMap = useCallback((container: HTMLDivElement | null) => {
    if (!container || mapRef.current) return;
    if (!form.latitude || !form.longitude) return;

    loadLeaflet()
      .then(L => {
        // Verificar que el contenedor sigue montado
        if (!document.body.contains(container)) return;

        const center: [number, number] = [Number(form.latitude), Number(form.longitude)];
        const mapInstance = L.map(container).setView(center, 16);
        mapRef.current = mapInstance;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        const DefaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        const marker = L.marker(center, { draggable: true }).addTo(mapInstance);
        markerRef.current = marker;

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onFormChange({ latitude: String(pos.lat.toFixed(6)), longitude: String(pos.lng.toFixed(6)) });
        });

        mapInstance.on('click', (e: any) => {
          const pos = e.latlng;
          marker.setLatLng(pos);
          onFormChange({ latitude: String(pos.lat.toFixed(6)), longitude: String(pos.lng.toFixed(6)) });
        });

        // Forzar recalcular tamaño y centrado del mapa después de la animación CSS
        setTimeout(() => {
          if (document.body.contains(container) && mapInstance) {
            mapInstance.invalidateSize();
            mapInstance.setView(center, 16);
          }
        }, 400);
      })
      .catch(err => console.error('Error loading Leaflet:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.latitude, form.longitude]);

  // Cleanup al desmontar o al ocultar mapa
  useEffect(() => {
    if (!showMap && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }
  }, [showMap]);

  // Sincronizar marker cuando lat/lng cambian (e.g. por GPS)
  useEffect(() => {
    if (mapRef.current && markerRef.current && form.latitude && form.longitude) {
      const lat = Number(form.latitude), lng = Number(form.longitude);
      const cur = markerRef.current.getLatLng();
      if (cur.lat.toFixed(6) !== lat.toFixed(6) || cur.lng.toFixed(6) !== lng.toFixed(6)) {
        markerRef.current.setLatLng({ lat, lng });
        mapRef.current.panTo({ lat, lng });
      }
    }
  }, [form.latitude, form.longitude]);

  return (
    <div className="solicitud-form-section">

      {/* ── Clasificación ────────────────────────────────────────── */}
      <div className="solicitud-form-section__header">
        <AlertTriangle size={20} />
        <h3>Clasificación</h3>
      </div>

      <div className="wo-create-grid">
        <Select label="Origen *" name="origin" value={form.origin} size="compact" onChange={field('origin')} required>
          {ORIGINS.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </Select>
        <Select label="Tipo de Trabajo *" name="workTypeId" size="compact" value={String(form.workTypeId)}
          onChange={e => onFormChange({ workTypeId: Number(e.target.value) })} error={errors?.workTypeId} required>
          {WORK_TYPES.map(t => (<option key={t.id} value={t.id}>{t.label}</option>))}
        </Select>
        <Select label="Prioridad *" name="priorityId" size="compact" value={String(form.priorityId)}
          onChange={e => onFormChange({ priorityId: Number(e.target.value) })} error={errors?.priorityId} required>
          {PRIORITIES.map(p => (<option key={p.id} value={p.id}>{p.label}</option>))}
        </Select>
      </div>

      {/* ── Ubicación ─────────────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: 'var(--spacing-lg)' }}>
        <MapPin size={20} />
        <h3>Ubicación</h3>
      </div>

      <Input label="Dirección / Lugar del trabajo *" name="location" size="compact" value={form.location}
        onChange={field('location')} placeholder="Ej: Av. de los Shyris y Naciones Unidas"
        error={errors?.location} required />

      <div className="wo-create-grid" style={{ marginTop: '0.75rem' }}>
        <Input label="Latitud" name="latitude" type="text" size="compact" value={form.latitude} placeholder="No capturada" readOnly disabled />
        <Input label="Longitud" name="longitude" type="text" size="compact" value={form.longitude} placeholder="No capturada" readOnly disabled />
      </div>


      <div className="gps-address-card">
        <GeoSection lat={Number(form.latitude)} lng={Number(form.longitude)} />
      </div>


      {/* ── Botones GPS + Mapa ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', width: '100%' }}>
        <Button
          type="button"
          variant="dashed"
          color='primary'
          size="compact"
          onClick={handleGetLocation}
          isLoading={isLocating}
          leftIcon={<MapPin size={16} />}
          style={{ flex: 1, justifyContent: 'center', minWidth: '200px' }}
        >
          Ubicación GPS Actual
        </Button>

        {initialLocation && (
          <Button
            type="button"
            variant="dashed"
            color='emerald'
            size="compact"
            onClick={() => {
              onFormChange({ latitude: initialLocation.lat, longitude: initialLocation.lng });
              setShowMap(true);
            }}
            leftIcon={<FaMapLocationDot size={16} />}
            style={{ flex: 1, justifyContent: 'center', minWidth: '200px' }}
          >
            Ubicación Acometida
          </Button>
        )}

        {form.latitude && form.longitude && (
          <Button
            type="button"
            variant="dashed"
            color='indigo'
            size="compact"
            onClick={() => setShowMap(!showMap)}
            leftIcon={showMap ? <TbMapPinOff size={16} /> : <TbMapPin size={16} />}
            style={{ flex: 1, justifyContent: 'center', minWidth: '200px' }}
          >
            {showMap ? 'Ocultar Mapa' : 'Ajustar en Mapa'}
          </Button>
        )}
      </div>

      {/* ── Mapa Leaflet ──────────────────────────────────────────── */}
      {showMap && (
        <div className="gps-map-wrapper">
          <span className="gps-map-instruction">📍 Arrastra el marcador o haz clic en el mapa para ajustar la ubicación exacta.</span>
          <div ref={initializeMap} className="incident-map-container" style={{ height: '350px', width: '100%' }} />
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────── */}
      {formError && (
        <div className="incident-error-banner" style={{ marginTop: '0.75rem' }}>
          <AlertTriangle size={16} />
          <span>{formError}</span>
        </div>
      )}

      {/* ── Descripción ───────────────────────────────────────────── */}
      <div className="solicitud-form-section__header" style={{ marginTop: 'var(--spacing-lg)' }}>
        <FileText size={20} />
        <h3>Descripción del Problema</h3>
      </div>

      <div className="wo-create-textarea-wrapper">
        <Wrench size={14} className="wo-create-textarea-icon" />
        <textarea
          id="wo-create-description"
          className="wo-create-textarea"
          value={form.description}
          onChange={field('description')}
          placeholder="Describe brevemente el problema o requerimiento técnico..."
          rows={4}
        />
      </div>
    </div>
  );
};
