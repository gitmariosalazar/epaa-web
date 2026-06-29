import React, { useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ConnectionMap } from './ConnectionMap.tsx';
import { ConnectionSidePanel } from './ConnectionSidePanel';
import { useConnectionsViewModel } from '../../hooks/useConnectionsViewModel';
import './ConnectionMap.css';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData.ts';

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


  const fallbackCenter = FALLBACK_CENTER_ANTONIO_ANTE;
  const latestCameraRef = React.useRef<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center: mapCenter || fallbackCenter,
    zoom: mapZoom
  });

  // Auto-fetch if empty and map is opened
  useEffect(() => {
    if (filteredConnections.length === 0 && !isLoading) {
      handleFetch();
    }
  }, [filteredConnections.length, isLoading, handleFetch]);

  // Persist final camera position on unmount
  useEffect(() => {
    return () => {
      if (latestCameraRef.current) {
        setMapCenter(latestCameraRef.current.center);
        setMapZoom(latestCameraRef.current.zoom);
      }
    };
  }, [setMapCenter, setMapZoom]);

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
              latestCameraRef.current = { center, zoom };
            }}
          />
        </div>
      </div>
    </APIProvider>
  );
};
