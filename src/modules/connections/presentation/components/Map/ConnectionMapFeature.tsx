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
  const { filteredConnections, selectedConnection, mapCenter, mapZoom } = state;
  const { hasMore, isLoading } = state;

  const { setSelectedConnection, openEdit, setMapCenter, setMapZoom } = actions;
  const { loadMore } = actions; // Added loadMore from actions

  const fallbackCenter = FALLBACK_CENTER_ANTONIO_ANTE;
  const latestCameraRef = React.useRef<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center: mapCenter || fallbackCenter,
    zoom: mapZoom
  });

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
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <APIProvider apiKey={apiKey} libraries={['marker']}>
      <div className="map-feature-container">
        {/* Decoupled Professional Side Panel */}
        <ConnectionSidePanel
          connections={filteredConnections}
          selectedConnection={selectedConnection}
          onSelect={setSelectedConnection}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={loadMore}
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
            mapId={mapId}
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
