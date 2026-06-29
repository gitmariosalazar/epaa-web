import React, { useEffect, useRef, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { IncidentMap } from './IncidentMap';
import { IncidentMapSidePanel } from './IncidentMapSidePanel';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import './IncidentMap.css';
import { useCenterLocationIncident } from '@/shared/location/presentation';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';

export interface IncidentMapFeatureProps {
  /** All incidents to display */
  incidents: IncidentDetailRowResponse[];
  /** Currently selected incident */
  selectedIncident: IncidentDetailRowResponse | null;
  /** Called when user selects an incident on map or side panel */
  onSelect: (incident: IncidentDetailRowResponse) => void;
  /** Called when user clicks "Ver Detalle" in the InfoWindow popup */
  onViewDetail?: (incident: IncidentDetailRowResponse) => void;
}

/**
 * IncidentMapFeature — Composition root for the incident map view.
 *
 * SRP: only manages the layout and orchestrates sub-components.
 * DIP: depends on the IncidentDetailRowResponse interface, not a concrete class.
 * OCP: new sidebar sections or map controls can be added via props without
 *      modifying this component.
 */

export const IncidentMapFeature: React.FC<IncidentMapFeatureProps> = ({
  incidents,
  selectedIncident,
  onSelect,
  onViewDetail
}) => {
  const { centerLocationIncident, loading, error } = useCenterLocationIncident();

  const [mapCenter, setMapCenter] = useState({
    lat: centerLocationIncident.centerLat,
    lng: centerLocationIncident.centerLng
  });

  const [mapZoom, setMapZoom] = useState(17);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const prevSelectedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!loading && !error) {
      setMapCenter({
        lat: Number(FALLBACK_CENTER_ANTONIO_ANTE.lat),
        lng: Number(FALLBACK_CENTER_ANTONIO_ANTE.lng)
      });
      setMapZoom(17);
    }
  }, [centerLocationIncident, loading, error]);

  useEffect(() => {
    if (selectedIncident && selectedIncident.incidentId !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedIncident.incidentId;

      if (selectedIncident.latitude && selectedIncident.longitude) {
        setMapCenter({
          lat: Number(selectedIncident.latitude),
          lng: Number(selectedIncident.longitude)
        });
        setMapZoom(19);
      }
    } else if (!selectedIncident) {
      prevSelectedIdRef.current = null;
    }
  }, [selectedIncident]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

  return (
    <APIProvider apiKey={apiKey}>
      <div className="incident-map-feature-container">
        <IncidentMapSidePanel
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelect={onSelect}
          collapsed={isSidebarCollapsed}
          onViewDetail={onViewDetail}
          onToggle={() => setIsSidebarCollapsed((c) => !c)}
        />

        <div className="incident-map-view-wrapper">
          <IncidentMap
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelect={onSelect}
            center={mapCenter}
            zoom={mapZoom}
            onViewDetail={onViewDetail}
            onCameraChange={(center, zoom) => {
              // ← Corrección aquí
              setMapCenter({
                lat: Number(center.lat),
                lng: Number(center.lng)
              });
              setMapZoom(zoom);
            }}
          />
        </div>
      </div>
    </APIProvider>
  );
};