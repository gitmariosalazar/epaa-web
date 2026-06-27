import React, { useEffect, useRef, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { IncidentMap } from './IncidentMap';
import { IncidentMapSidePanel } from './IncidentMapSidePanel';
import type { IncidentDetailRowResponse } from '../../../domain/schemas/dtos/response/view_incident.response';
import './IncidentMap.css';

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
  onViewDetail,
}) => {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const prevSelectedIdRef = useRef<number | null>(null);

  // Sync map center to newly selected incident
  useEffect(() => {
    if (
      selectedIncident &&
      selectedIncident.incidentId !== prevSelectedIdRef.current
    ) {
      prevSelectedIdRef.current = selectedIncident.incidentId;

      if (selectedIncident.latitude && selectedIncident.longitude) {
        setMapCenter({
          lat: Number(selectedIncident.latitude),
          lng: Number(selectedIncident.longitude),
        });

        // Zoom to street level only when too zoomed out
        if (mapZoom < 17) setMapZoom(17);
      }
    } else if (!selectedIncident) {
      prevSelectedIdRef.current = null;
    }
  }, [selectedIncident, mapZoom]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

  return (
    <APIProvider apiKey={apiKey}>
      <div className="incident-map-feature-container" style={{ height: 'calc(100vh - 130px)', minHeight: '600px' }}>
        {/* Side panel */}
        <IncidentMapSidePanel
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelect={(incident) => {
            onSelect(incident);
          }}
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((c) => !c)}
        />

        {/* Map */}
        <div className="incident-map-view-wrapper">
          <IncidentMap
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelect={onSelect}
            center={mapCenter ?? undefined}
            zoom={mapZoom}
            onViewDetail={onViewDetail}
            onCameraChange={(center, zoom) => {
              if (
                center.lat !== mapCenter?.lat ||
                center.lng !== mapCenter?.lng
              ) {
                setMapCenter(center);
              }
              if (zoom !== mapZoom) setMapZoom(zoom);
            }}
          />
        </div>
      </div>
    </APIProvider>
  );
};
