import React, { useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ConnectionMap } from './ConnectionMap.tsx';
import { ConnectionSidePanel } from './ConnectionSidePanel';
import { useConnectionsViewModel } from '../../hooks/useConnectionsViewModel';
import './ConnectionMap.css';

interface ConnectionMapFeatureProps {
  viewModel: ReturnType<typeof useConnectionsViewModel>;
}

export const ConnectionMapFeature: React.FC<ConnectionMapFeatureProps> = ({
  viewModel
}) => {
  const { state, actions } = viewModel;
  const {
    filteredConnections,
    selectedConnection,
    isLoading,
    mapCenter,
    mapZoom
  } = state;

  const {
    setSelectedConnection,
    openEdit,
    setMapCenter,
    setMapZoom,
    handleFetch
  } = actions;

  // Auto-fetch if empty and map is opened
  useEffect(() => {
    if (filteredConnections.length === 0 && !isLoading) {
      handleFetch();
    }
  }, []);

  const prevSelectedIdRef = React.useRef<number | string | null>(null);

  // Sync map center with selected connection
  useEffect(() => {
    if (selectedConnection && selectedConnection.connectionId !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedConnection.connectionId;

      if (selectedConnection.latitude && selectedConnection.longitude) {
        setMapCenter({ lat: selectedConnection.latitude, lng: selectedConnection.longitude });
        
        // Only zoom in if the map is currently zoomed out too far to see details.
        // Prevents the "zoom reset" issue when clicking a marker closely.
        if (mapZoom < 17) {
          setMapZoom(17);
        }
      }
    } else if (!selectedConnection) {
      prevSelectedIdRef.current = null;
    }
  }, [selectedConnection, setMapCenter, setMapZoom, mapZoom]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="map-feature-container">
        {/* Decoupled Professional Side Panel */}
        <ConnectionSidePanel
          connections={filteredConnections}
          selectedConnection={selectedConnection}
          onSelect={setSelectedConnection}
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Right Map View */}
        <div className="map-view-container">
          <ConnectionMap
            connections={filteredConnections}
            selectedConnection={selectedConnection}
            onSelect={setSelectedConnection}
            center={mapCenter || undefined}
            zoom={mapZoom}
            onEdit={openEdit}
            onCameraChange={(center, zoom) => {
              if (center.lat !== mapCenter?.lat || center.lng !== mapCenter?.lng) {
                setMapCenter(center);
              }
              if (zoom !== mapZoom) {
                setMapZoom(zoom);
              }
            }}
          />
        </div>
      </div>
    </APIProvider>
  );
};
